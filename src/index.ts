import * as crypto from 'crypto';
import { WompiUrlParams } from './types';

/**
 * Validate the hash of a URL using the given API secret key.
 * @param url The URL to validate.
 * @param secretKey The secret key to use for validation.
 * @returns `true` if the hash is valid, otherwise `false`.
 */
export const validateHash = (url: string, secretKey: string): boolean => {
  const params = new URL(url).searchParams;
  // Order of parameters as per Wompi documentation
  const paramOrder: (keyof WompiUrlParams)[] = [
    'identificadorEnlaceComercio',
    'idTransaccion',
    'idEnlace',
    'monto',
  ];
  // Concatenate parameters in the correct order
  const concatenatedParams = paramOrder
    .map((key) => params.get(key) || '')
    .join('');
  // Generate HMAC hash and compare
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(concatenatedParams)
    .digest('hex');
  return computedHash === params.get('hash');
};
