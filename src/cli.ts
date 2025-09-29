#!/usr/bin/env node
import { validateHash } from '@/index';
import chalk from 'chalk';
import { program } from 'commander';

interface Options {
	secret?: string;
	env: string;
}

program
	.name(process.env.npm_package_name ?? 'wompi-hash-validator')
	.description(
		process.env.npm_package_description ?? 'Validate Wompi HMAC hash from URLs'
	)
	.version(process.env.npm_package_version ?? '1.0.0')
	.argument('<url>', 'Full Wompi URL with query parameters and hash')
	.option('-s, --secret <key>', 'Wompi API secret key')
	.option(
		'-e, --env <var>',
		'Environment variable name containing the secret key',
		'WOMPI_SECRET'
	)
	.action((url: string, options: Options) => {
		const secretKey = options.secret ?? process.env[options.env];
		if (!secretKey) {
			console.error(
				chalk.red.bold('✗ Error: ') +
					chalk.red('Secret key is required. Provide it via ') +
					chalk.yellow('--secret') +
					chalk.red(' or set the ') +
					chalk.yellow(options.env) +
					chalk.red(' environment variable.')
			);
			process.exit(1);
		}
		try {
			const isValid = validateHash(url, secretKey);
			if (isValid) {
				console.log(chalk.green.bold('✓ Hash is valid'));
				console.log(
					chalk.dim('The Wompi URL signature has been verified successfully.')
				);
				process.exit(0);
			} else {
				console.log(chalk.red.bold('✗ Hash is invalid'));
				console.log(
					chalk.yellow('Warning: The hash does not match the expected value.')
				);
				process.exit(1);
			}
		} catch (error) {
			console.error(
				chalk.red.bold('✗ Error: ') +
					chalk.red(error instanceof Error ? error.message : 'Unknown error')
			);
			if (error instanceof Error && error.message.includes('Invalid URL')) {
				console.log(
					chalk.dim(
						'\nTip: Make sure the URL is properly formatted and includes the protocol (https://)'
					)
				);
			}
			process.exit(1);
		}
	});

program.parse();
