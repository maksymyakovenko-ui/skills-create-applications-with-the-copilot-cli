const readline = require("node:readline");

function validateNumber(number) {
  if (!Number.isFinite(number)) {
    throw new Error("Please enter valid numbers.");
  }
}

// Returns the remainder of dividend divided by divisor.
function modulo(dividend, divisor) {
  validateNumber(dividend);
  validateNumber(divisor);
  if (divisor === 0) {
    throw new Error("Cannot calculate modulo by zero.");
  }
  return dividend % divisor;
}

// Returns base raised to exponent.
function power(base, exponent) {
  validateNumber(base);
  validateNumber(exponent);
  const result = base ** exponent;
  if (!Number.isFinite(result)) {
    throw new Error("The power result is outside the supported numeric range.");
  }
  return result;
}

// Returns the square root of a non-negative number.
function squareRoot(number) {
  validateNumber(number);
  if (number < 0) {
    throw new Error("Cannot calculate the square root of a negative number.");
  }
  return Math.sqrt(number);
}

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (^), and square root (sqrt).
function calculate(firstNumber, operation, secondNumber) {
  validateNumber(firstNumber);

  if (operation === "sqrt") {
    return squareRoot(firstNumber);
  }

  validateNumber(secondNumber);
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
    case "%":
      return modulo(firstNumber, secondNumber);
    case "^":
      return power(firstNumber, secondNumber);
    default:
      throw new Error("Choose one of the supported operations: +, -, *, /, %, ^, sqrt.");
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
    const operation = (await ask("Operation (+, -, *, /, %, ^, sqrt): ")).trim();
    const secondNumber =
      operation === "sqrt" ? undefined : parseNumber(await ask("Second number: "));
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

module.exports = { calculate, modulo, power, squareRoot };
