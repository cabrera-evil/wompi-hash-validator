# Wompi Hash Validator

[![Release Version](https://img.shields.io/github/v/release/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/releases)
[![Last Commit](https://img.shields.io/github/last-commit/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/commits/main)
[![Issues](https://img.shields.io/github/issues/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/pulls)
[![Forks](https://img.shields.io/github/forks/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/network/members)
[![Stars](https://img.shields.io/github/stars/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/stargazers)
[![License](https://img.shields.io/github/license/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator/blob/main/LICENSE)
[![Top Language](https://img.shields.io/github/languages/top/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator)
[![Code Size](https://img.shields.io/github/languages/code-size/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator)
[![Repository Size](https://img.shields.io/github/repo-size/cabrera-evil/wompi-hash-validator)](https://github.com/cabrera-evil/wompi-hash-validator)
[![NPM Version](https://img.shields.io/npm/v/wompi-hash-validator)](https://www.npmjs.com/package/wompi-hash-validator)
[![NPM Downloads](https://img.shields.io/npm/dt/wompi-hash-validator)](https://www.npmjs.com/package/wompi-hash-validator)

The **Wompi Hash Validator** library helps you validate the integrity of Wompi redirect URLs by verifying their HMAC-SHA256 hash. This ensures that the data has not been tampered with during transit.

## Table of Contents

- [Wompi Hash Validator](#wompi-hash-validator)
  - [Table of Contents](#table-of-contents)
  - [Installing](#installing)
  - [Usage](#usage)
    - [Basic Validation](#basic-validation)
    - [Environment Variables](#environment-variables)
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

## License

This repository is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the scripts as long as you include the original license text.
