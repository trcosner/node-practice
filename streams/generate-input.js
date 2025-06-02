const fs = require("fs");
const path = require("path");

const output = fs.createWriteStream(path.resolve(__dirname, "input.csv"));

const ROW_COUNT = 100000; // Adjust to 1_000_000+ for heavy load

const names = [
  "john smith",
  "jane doe",
  "emily watson",
  "leonardo da vinci",
  "bob",
  "sarah connor",
  "",
  "x Æ a-12",
];
const emails = [
  "john@example.com",
  "JANE@EMAIL.com",
  "notanemail",
  "",
  "test@domain.org",
  "someone@somewhere",
  "    ",
  "bob@bob.com",
];

function getRandomEntry(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Write header
output.write("name,email\n");

for (let i = 0; i < ROW_COUNT; i++) {
  const name = getRandomEntry(names);
  const email = getRandomEntry(emails);

  // Add random whitespace noise
  const noisyName = Math.random() > 0.3 ? ` ${name}  ` : name;
  const noisyEmail = Math.random() > 0.3 ? `  ${email}` : email;

  output.write(`${noisyName},${noisyEmail}\n`);
}

output.end(() => {
  console.log(`✅ Generated ${ROW_COUNT} rows in input.csv`);
});
