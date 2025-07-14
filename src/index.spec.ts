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
});
