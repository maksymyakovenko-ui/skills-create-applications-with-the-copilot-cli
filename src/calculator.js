const readline = require("node:readline");

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(firstNumber, operation, secondNumber) {
  if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
    throw new Error("Please enter valid numbers.");
  }

  switch (operation) {
    case "+":
      return firstNumber + secondNumber;
    case "-":
      return firstNumber - secondNumber;
    case "*":
      return firstNumber * secondNumber;
    case "/":
      if (secondNumber === 0) {
        throw new Error("Cannot divide by zero.");
      }
      return firstNumber / secondNumber;
    default:
      throw new Error("Choose one of the supported operations: +, -, *, /.");
  }
}

function parseNumber(input) {
  const value = input.trim();
  if (value === "") {
    throw new Error("Please enter a number.");
  }

  const number = Number(value);
  if (!Number.isFinite(number)) {
    throw new Error("Please enter a valid number.");
  }

  return number;
}

async function main() {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const inputLines = prompt[Symbol.asyncIterator]();

  async function ask(question) {
    process.stdout.write(question);
    const { value, done } = await inputLines.next();
    if (done) {
      throw new Error("Input ended before all values were provided.");
    }
    return value;
  }

  try {
    const firstNumber = parseNumber(await ask("First number: "));
    const operation = (await ask("Operation (+, -, *, /): ")).trim();
    const secondNumber = parseNumber(await ask("Second number: "));
    console.log(`Result: ${calculate(firstNumber, operation, secondNumber)}`);
  } finally {
    prompt.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { calculate };
