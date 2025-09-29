import { execSync } from 'child_process';
import { createHmac } from 'crypto';

describe('Wompi CLI', () => {
	const CLI_PATH = './dist/cli.js';
	const TEST_SECRET = 'test-secret-key-123';

	const generateValidHash = (params: Record<string, string>): string => {
		const expected = [
			'identificadorEnlaceComercio',
			'idTransaccion',
			'idEnlace',
			'monto',
		]
			.map((key) => params[key] ?? '')
			.join('');

		return createHmac('sha256', TEST_SECRET).update(expected).digest('hex');
	};

	const buildUrl = (params: Record<string, string>): string => {
		const urlParams = new URLSearchParams(params);
		return `https://example.com/callback?${urlParams.toString()}`;
	};

	const runCLI = (
		args: string[]
	): { stdout: string; stderr: string; exitCode: number } => {
		try {
			const stdout = execSync(`node ${CLI_PATH} ${args.join(' ')}`, {
				encoding: 'utf8',
				env: { ...process.env, FORCE_COLOR: '0' },
			});
			return { stdout, stderr: '', exitCode: 0 };
		} catch (error: any) {
			return {
				stdout: error.stdout || '',
				stderr: error.stderr || '',
				exitCode: error.status || 1,
			};
		}
	};

	beforeAll(() => {
		try {
			execSync('npm run build', { stdio: 'ignore' });
		} catch (error) {
			console.warn('Build command failed, assuming dist already exists');
		}
	});

	describe('Valid hash scenarios', () => {
		it('should validate a correct hash with --secret flag', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
			};
			const hash = generateValidHash(params);
			const url = buildUrl({ ...params, hash });

			const result = runCLI([`"${url}"`, '--secret', TEST_SECRET]);

			expect(result.exitCode).toBe(0);
			expect(result.stdout).toContain('Hash is valid');
		});

		it('should validate using WOMPI_SECRET environment variable', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
			};
			const hash = generateValidHash(params);
			const url = buildUrl({ ...params, hash });

			try {
				const result = execSync(`node ${CLI_PATH} "${url}"`, {
					encoding: 'utf8',
					env: { ...process.env, WOMPI_SECRET: TEST_SECRET, FORCE_COLOR: '0' },
				});

				expect(result).toContain('Hash is valid');
			} catch (error: any) {
				fail(`Expected success but got error: ${error.message}`);
			}
		});

		it('should validate using custom environment variable name', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
			};
			const hash = generateValidHash(params);
			const url = buildUrl({ ...params, hash });

			try {
				const result = execSync(
					`node ${CLI_PATH} "${url}" --env CUSTOM_SECRET`,
					{
						encoding: 'utf8',
						env: {
							...process.env,
							CUSTOM_SECRET: TEST_SECRET,
							FORCE_COLOR: '0',
						},
					}
				);

				expect(result).toContain('Hash is valid');
			} catch (error: any) {
				fail(`Expected success but got error: ${error.message}`);
			}
		});

		it('should show success message with verification text', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
			};
			const hash = generateValidHash(params);
			const url = buildUrl({ ...params, hash });

			const result = runCLI([`"${url}"`, '--secret', TEST_SECRET]);

			expect(result.stdout).toContain('verified successfully');
		});
	});

	describe('Invalid hash scenarios', () => {
		it('should reject an incorrect hash', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
				hash: 'invalid_hash_12345',
			};
			const url = buildUrl(params);

			const result = runCLI([`"${url}"`, '--secret', TEST_SECRET]);

			expect(result.exitCode).toBe(1);
			expect(result.stdout).toContain('Hash is invalid');
		});

		it('should reject when hash parameter is missing', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
			};
			const url = buildUrl(params);

			const result = runCLI([`"${url}"`, '--secret', TEST_SECRET]);

			expect(result.exitCode).toBe(1);
			expect(result.stdout).toContain('Hash is invalid');
		});

		it('should show warning message for invalid hash', () => {
			const params = {
				identificadorEnlaceComercio: 'TEST123',
				idTransaccion: 'TXN456',
				idEnlace: 'LINK789',
				monto: '10000',
				hash: 'wrong',
			};
			const url = buildUrl(params);

			const result = runCLI([`"${url}"`, '--secret', TEST_SECRET]);

			expect(result.stdout).toContain('does not match');
		});
	});

	describe('Error handling', () => {
		it('should error when secret is not provided', () => {
			const url = 'https://example.com/callback?hash=abc';

			const result = runCLI([`"${url}"`]);

			expect(result.exitCode).toBe(1);
			expect(result.stderr).toContain('Secret key is required');
		});

		it('should error with invalid URL format', () => {
			const result = runCLI(['"not-a-valid-url"', '--secret', TEST_SECRET]);

			expect(result.exitCode).toBe(1);
			expect(result.stderr).toContain('Error');
		});

		it('should provide helpful tip for invalid URL', () => {
			const result = runCLI(['"invalid-url"', '--secret', TEST_SECRET]);

			expect(result.exitCode).toBe(1);
			expect(result.stdout).toContain('Tip:');
			expect(result.stdout).toContain('properly formatted');
		});

		it('should mention environment variable name in error', () => {
			const url = 'https://example.com/callback?hash=abc';

			const result = runCLI([`"${url}"`]);

			expect(result.stderr).toContain('WOMPI_SECRET');
		});

		it('should mention custom env variable when specified', () => {
			const url = 'https://example.com/callback?hash=abc';

			const result = runCLI([`"${url}"`, '--env', 'MY_SECRET']);

			expect(result.stderr).toContain('MY_SECRET');
		});
	});

	describe('CLI metadata', () => {
		it('should display version', () => {
			const result = execSync(`node ${CLI_PATH} --version`, {
				encoding: 'utf8',
			});

			expect(result).toMatch(/\d+\.\d+\.\d+/);
		});

		it('should display help', () => {
			const result = execSync(`node ${CLI_PATH} --help`, {
				encoding: 'utf8',
			});

			expect(result).toContain('Validate Wompi HMAC hash');
			expect(result).toContain('--secret');
			expect(result).toContain('--env');
		});

		it('should show usage in help', () => {
			const result = execSync(`node ${CLI_PATH} --help`, {
				encoding: 'utf8',
			});

			expect(result).toContain('Usage:');
			expect(result).toContain('<url>');
		});
	});
});
