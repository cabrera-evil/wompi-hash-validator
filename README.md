# Wompi Hash Validator

The **Wompi Hash Validator** library helps you validate the integrity of Wompi redirect URLs by verifying their HMAC-SHA256 hash. This ensures that the data has not been tampered with during transit.

## Table of Contents

- [Wompi Hash Validator](#wompi-hash-validator)
  - [Table of Contents](#table-of-contents)
  - [Installing](#installing)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
    - [Basic Validation](#basic-validation)
    - [Environment Variables](#environment-variables)
  - [Examples](#examples)
  - [Contributing](#contributing)
  - [License](#license)

## Installing

Using npm:

```bash
npm install wompi-hash-validator
```

Using yarn:

```bash
yarn add wompi-hash-validator
```

Using pnpm:

```bash
pnpm add wompi-hash-validator
```

## Prerequisites

- Node.js version >= 14.0.0
- A valid Wompi API secret key
- (Optional) A `.env` file for environment variables setup

## Usage

### Basic Validation

You can use the library to validate Wompi URLs and their parameters as follows:

```typescript
import { validateHash } from 'wompi-hash-validator';

const url =
  'https://example.com/checkout?identificadorEnlaceComercio=ExampleCommerce&idTransaccion=123e4567-e89b-12d3-a456-426614174000&idEnlace=789456&monto=50.00&hash=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2';
const secretKey = 'your_api_secret_here';
const isValid = validateHash(url, secretKey);

console.log(`URL validation result: ${isValid ? 'Valid' : 'Invalid'}`);
```

### Environment Variables

To improve security and keep sensitive data out of your codebase, you can use environment variables to store your API secret key. Use the `dotenv` package to load the secret key from a `.env` file:

```env
WOMPI_SECRET_KEY=your_api_secret_here
```

Then, modify your script to use the environment variable:

```typescript
import { validateHash } from 'wompi-hash-validator';
import * as dotenv from 'dotenv';

dotenv.config();

const url =
  'https://example.com/checkout?identificadorEnlaceComercio=ExampleCommerce&idTransaccion=123e4567-e89b-12d3-a456-426614174000&idEnlace=789456&monto=50.00&hash=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2';
const secretKey = process.env.WOMPI_SECRET_KEY;
const isValid = validateHash(url, secretKey);

console.log(`URL validation result: ${isValid ? 'Valid' : 'Invalid'}`);
```

## Examples

Here are a few advanced examples of how you can use this library:

#### Example 1: Handling Dynamic URLs

```typescript
import { validateHash } from 'wompi-hash-validator';

const generateUrl = (id: string, amount: string): string => {
  return `https://example.com/checkout?id=${id}&amount=${amount}&hash=generatedHashHere`;
};

const url = generateUrl('123e4567-e89b-12d3-a456-426614174000', '50.00');
const secretKey = 'your_api_secret_here';
const isValid = validateHash(url, secretKey);

console.log(`Dynamic URL validation: ${isValid ? 'Valid' : 'Invalid'}`);
```

#### Example 2: Validating Multiple URLs

```typescript
import { validateHash } from 'wompi-hash-validator';

const urls = [
  'https://example.com/checkout?id=1&amount=100&hash=hash1',
  'https://example.com/checkout?id=2&amount=200&hash=hash2',
];

const secretKey = 'your_api_secret_here';

urls.forEach((url) => {
  const isValid = validateHash(url, secretKey);
  console.log(`Validation result for URL: ${url} - ${isValid ? 'Valid' : 'Invalid'}`);
});
```

## Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details.

## License

This repository is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the scripts as long as you include the original license text.
