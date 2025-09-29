# Development Guide

## Setting Up the Development Environment

1. Clone the repository:

   ```bash
   git clone https://github.com/cabrera-evil/wompi-hash-validator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd wompi-hash-validator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables (optional):
   - Create a `.env` file in the root directory.
   - Add your development configuration, such as:
     ```env
     WOMPI_SECRET=your_development_secret
     ```

## Building the Project

To build the project, run:

```bash
pnpm build
```

This will generate the output in the `dist` directory.

## Testing

Run the following command to execute the tests:

```bash
npm test
```

To check test coverage:

```bash
pnpm coverage
```

## Linting and Formatting

To ensure code quality and consistency, lint your code using:

```bash
pnpm lint
```

Format your code with:

```bash
pnpm format
```

## Submitting Changes

Ensure the following before submitting a pull request:

- All tests pass.
- Code is properly linted and formatted.
- Commit messages follow the [conventional commit](https://www.conventionalcommits.org/) style.
