import { createHmac } from 'crypto';

/**
 * Verifies the HMAC hash of a Wompi URL using the provided secret key.
 * @param url - The full URL containing query parameters and the hash.
 * @param secretKey - Your Wompi API secret key.
 * @returns Whether the hash is valid.
 */
export const validateHash = (url: string, secretKey: string): boolean => {
	const params = new URL(url).searchParams;
	const expected = [
		'identificadorEnlaceComercio',
		'idTransaccion',
		'idEnlace',
		'monto',
	]
		.map((key) => params.get(key) ?? '')
		.join('');

	const actualHash = params.get('hash');
	if (!actualHash) return false;

	const computedHash = createHmac('sha256', secretKey)
		.update(expected)
		.digest('hex');
	return computedHash === actualHash;
};
