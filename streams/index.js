//!/usr/bin/env node

const fs = require("fs"); // Built-in Node module for file operations
const path = require("path"); // Helps resolve file paths
const csv = require("csv-parser"); // Parses CSV into JavaScript objects
const { Transform } = require("stream"); // Base class for creating transform streams
const { pipeline } = require("stream/promises"); // Promisified stream pipeline helper
const Ajv = require("ajv"); // JSON Schema validator
const yargs = require("yargs/yargs"); // CLI argument parser
const { hideBin } = require("yargs/helpers"); // Helper to hide internal args (e.g., node, script.js)

// Parse CLI arguments using yargs
const argv = yargs(hideBin(process.argv))
  .option("input", {
    alias: "i",
    describe: "Path to input CSV file",
    type: "string",
    demandOption: true, // Required argument
  })
  .option("output", {
    alias: "o",
    describe: "Path to output file",
    type: "string",
    demandOption: true,
  })
  .option("json", {
    alias: "j",
    describe: "Output in JSON format instead of CSV",
    type: "boolean",
    default: false,
  })
  .help() // Adds --help flag
  .alias("help", "h").argv;

// Load and compile JSON Schema
const schema = require("./schema.json");
const ajv = new Ajv();
const validate = ajv.compile(schema);

// Resolve input and output paths
const inputPath = path.resolve(argv.input);
const outputPath = path.resolve(argv.output);
const OUTPUT_AS_JSON = argv.json;

// Create output stream and write CSV header or JSON array start
const outputStream = fs.createWriteStream(outputPath);
if (!OUTPUT_AS_JSON) {
  outputStream.write("name,email\n");
} else {
  outputStream.write("[\n");
}

// Track counts for progress and skipped rows
let rowCount = 0;
let skippedCount = 0;
let firstJsonRow = true;

// Transform stream to clean and validate each row
const cleanAndValidate = new Transform({
  writableObjectMode: true, // Accepts objects (parsed CSV rows)
  readableObjectMode: false, // Emits strings (CSV lines or JSON entries)

  transform(row, encoding, callback) {
    rowCount++;

    // Clean the row: trim and normalize
    const cleanedRow = {
      name: row.name.trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      email: row.email.trim().toLowerCase(),
    };

    // Validate against schema
    if (!validate(cleanedRow)) {
      skippedCount++;
      console.warn(`Skipping invalid row at line ${rowCount}:`, cleanedRow);
      return callback(); // Skip invalid row
    }

    // Format for output
    let output;
    if (OUTPUT_AS_JSON) {
      const jsonLine = JSON.stringify(cleanedRow, null, 2);
      output = (firstJsonRow ? "  " : ",\n  ") + jsonLine;
      firstJsonRow = false;
    } else {
      output = `${cleanedRow.name},${cleanedRow.email}\n`;
    }

    this.push(output); // Send downstream
    callback();
  },

  final(callback) {
    // Finish JSON array
    if (OUTPUT_AS_JSON) {
      this.push("\n]\n");
    }
    callback();
  },
});

// Execute pipeline
async function run() {
  try {
    await pipeline(
      fs.createReadStream(inputPath), // Read CSV file
      csv(), // Parse into rows
      cleanAndValidate, // Clean + validate
      outputStream, // Write to output
    );

    // Final report
    console.log("\n✅ Stream processing complete.");
    console.log(`➡️  Total rows processed: ${rowCount}`);
    console.log(`❌ Rows skipped due to validation: ${skippedCount}`);
    console.log(`✅ Output written to: ${outputPath}\n`);
  } catch (err) {
    console.error("❌ Pipeline failed:", err);
  }
}

run();
