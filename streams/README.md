# CSV Cleaner CLI

A command-line tool built with Node.js that reads, cleans, and validates CSV data using streaming. It is designed to handle large datasets efficiently, making it useful for data cleaning, transformation, and light ETL workflows.

---

## Features

- Cleans and formats CSV fields (e.g., trims whitespace, capitalizes names, lowercases emails)
- Validates each row against a JSON Schema
- Skips and logs invalid rows
- Outputs either a cleaned CSV or a structured JSON file
- Uses Node.js streams to support large files with minimal memory usage
- Command-line configurable using flags

---

## Requirements

- Node.js version 14 or higher
- `input.csv` with at least `name` and `email` columns
- A `schema.json` file defining row validation rules

---

## Installation

1. Clone or download this project
2. Run `npm install` to install dependencies (csv-parser, ajv, yargs)
3. Run `npm run generate` to create a large sample `input.csv` if needed

---

## Usage

Run the CLI with the following options:

- `--input` or `-i`: Path to the input CSV file (required)
- `--output` or `-o`: Path to the output file (required)
- `--json` or `-j`: Optional flag to output as JSON instead of CSV

For help, use `--help`

---

## Input Format

The input CSV must include a header row with at least the following columns:

- name
- email

Each data row must match this structure.

---

## Output

The tool will create a cleaned version of the file at the location specified by the output path. You can choose between CSV (default) or JSON using the `--json` flag.

- CSV output includes a header row and one cleaned row per valid input row
- JSON output is a valid array of objects

---

## Schema Validation

Row structure is validated using the `schema.json` file in the root directory. By default, it requires:

- A non-empty `name` string
- A valid `email` pattern

Invalid rows are skipped and logged to the console.

---

## Scripts

- `npm run generate`: Creates a large test input file (`input.csv`)
- `npm start`: Runs the cleaner using default `index.js`
- `npm run lint`: Lints the codebase using ESLint

---

## License

MIT – use, modify, and distribute freely.
