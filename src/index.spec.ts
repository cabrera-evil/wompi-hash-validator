import { createHmac } from 'crypto';
import { validateHash } from '.';

const secretKey = 'test_secret_key';

const buildSignedUrl = (
	params: Record<string, string>,
	key: string
): string => {
	const orderedKeys = [
		'identificadorEnlaceComercio',
		'idTransaccion',
		'idEnlace',
		'monto',
	];
	const baseString = orderedKeys.map((k) => params[k] || '').join('');
	const hash = createHmac('sha256', key).update(baseString).digest('hex');
	const query = new URLSearchParams({ ...params, hash });
	return `https://example.com/payment?${query.toString()}`;
};

describe('validateHash', () => {
	describe('Valid hash scenarios', () => {
		it('should return true for a valid hash', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const url = buildSignedUrl(params, secretKey);
			expect(validateHash(url, secretKey)).toBe(true);
		});

		it('should validate with empty parameter values', () => {
			const params = {
				identificadorEnlaceComercio: '',
				idTransaccion: '',
				idEnlace: '',
				monto: '',
			};
			const url = buildSignedUrl(params, secretKey);
			expect(validateHash(url, secretKey)).toBe(true);
		});

		it('should validate with special characters in parameters', () => {
			const params = {
				identificadorEnlaceComercio: 'abc-123_xyz',
				idTransaccion: 'txn@456#789',
				idEnlace: 'enl$999',
				monto: '10000.50',
			};
			const url = buildSignedUrl(params, secretKey);
			expect(validateHash(url, secretKey)).toBe(true);
		});

		it('should validate with large monto value', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '999999999',
			};
			const url = buildSignedUrl(params, secretKey);
			expect(validateHash(url, secretKey)).toBe(true);
		});
	});

	describe('Invalid hash scenarios', () => {
		it('should return false for an invalid hash', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
				hash: 'invalidhash',
			};
			const query = new URLSearchParams(params).toString();
			const url = `https://example.com/payment?${query}`;
			expect(validateHash(url, secretKey)).toBe(false);
		});

		it('should return false when hash is missing', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const query = new URLSearchParams(params).toString();
			const url = `https://example.com/payment?${query}`;
			expect(validateHash(url, secretKey)).toBe(false);
		});

		it('should return false when using wrong secret key', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const url = buildSignedUrl(params, secretKey);
			expect(validateHash(url, 'wrong_secret_key')).toBe(false);
		});

		it('should return false when parameters are modified', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const url = buildSignedUrl(params, secretKey);
			// Modify monto in the URL
			const modifiedUrl = url.replace('monto=10000', 'monto=20000');
			expect(validateHash(modifiedUrl, secretKey)).toBe(false);
		});

		it('should return false for tampered hash', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const url = buildSignedUrl(params, secretKey);
			// Tamper with one character in the hash
			const tamperedUrl = url.replace(/hash=([a-f0-9]{2})/, 'hash=ff');
			expect(validateHash(tamperedUrl, secretKey)).toBe(false);
		});
	});

	describe('Edge cases', () => {
		it('should handle URLs with extra parameters', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const url = buildSignedUrl(params, secretKey);
			const urlWithExtra = url + '&extraParam=value&another=test';
			expect(validateHash(urlWithExtra, secretKey)).toBe(true);
		});

		it('should handle URLs with different domains', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const orderedKeys = [
				'identificadorEnlaceComercio',
				'idTransaccion',
				'idEnlace',
				'monto',
			];
			const baseString = orderedKeys.map((k) => params[k] || '').join('');
			const hash = createHmac('sha256', secretKey)
				.update(baseString)
				.digest('hex');
			const query = new URLSearchParams({ ...params, hash });
			const url = `https://wompi.co/callback?${query.toString()}`;
			expect(validateHash(url, secretKey)).toBe(true);
		});

		it('should handle case-sensitive hash', () => {
			const params = {
				identificadorEnlaceComercio: 'abc123',
				idTransaccion: 'txn456',
				idEnlace: 'enl789',
				monto: '10000',
			};
			const url = buildSignedUrl(params, secretKey);
			// Change hash to uppercase
			const uppercaseUrl = url.replace(
				/hash=([a-f0-9]+)/,
				(match, p1) => `hash=${p1.toUpperCase()}`
			);
			expect(validateHash(uppercaseUrl, secretKey)).toBe(false);
		});
	});

	describe('Error handling', () => {
		it('should throw error for invalid URL format', () => {
			expect(() => {
				validateHash('not-a-valid-url', secretKey);
			}).toThrow();
		});

		it('should throw error for malformed URL', () => {
			expect(() => {
				validateHash('htp://invalid', secretKey);
			}).toThrow();
		});
	});
});
