const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");
const { calculate, modulo, power, squareRoot } = require("../calculator");

const calculatorPath = path.join(__dirname, "..", "calculator.js");

test("calculates the examples shown in the basic operations image", () => {
  assert.equal(calculate(2, "+", 3), 5);
  assert.equal(calculate(10, "-", 4), 6);
  assert.equal(calculate(45, "*", 2), 90);
  assert.equal(calculate(20, "/", 5), 4);
});

test("calculates the examples shown in the extended operations image", () => {
  assert.equal(calculate(5, "%", 2), 1);
  assert.equal(calculate(2, "^", 3), 8);
  assert.equal(calculate(16, "sqrt"), 4);
});

test("adds positive, negative, decimal, and zero values", () => {
  assert.equal(calculate(1, "+", 2), 3);
  assert.equal(calculate(-4, "+", 1.5), -2.5);
  assert.equal(calculate(0, "+", 0), 0);
});

test("subtracts positive, negative, decimal, and zero values", () => {
  assert.equal(calculate(10, "-", 3), 7);
  assert.equal(calculate(-4, "-", -1.5), -2.5);
  assert.equal(calculate(5, "-", 5), 0);
});

test("multiplies positive, negative, decimal, and zero values", () => {
  assert.equal(calculate(6, "*", 7), 42);
  assert.equal(calculate(-4, "*", 1.5), -6);
  assert.equal(calculate(12, "*", 0), 0);
});

test("divides positive, negative, and decimal values", () => {
  assert.equal(calculate(20, "/", 5), 4);
  assert.equal(calculate(-9, "/", 3), -3);
  assert.equal(calculate(1, "/", 4), 0.25);
});

test("calculates modulo for positive and negative values", () => {
  assert.equal(modulo(10, 3), 1);
  assert.equal(modulo(-10, 3), -1);
  assert.equal(calculate(10, "%", 3), 1);
  assert.throws(() => modulo(10, 0), /modulo by zero/);
  assert.throws(() => calculate(10, "%", 0), /modulo by zero/);
});

test("raises bases to positive, zero, negative, and fractional exponents", () => {
  assert.equal(power(2, 3), 8);
  assert.equal(power(5, 0), 1);
  assert.equal(power(2, -2), 0.25);
  assert.equal(power(9, 0.5), 3);
  assert.equal(calculate(2, "^", 3), 8);
  assert.throws(() => power(0, -1), /numeric range/);
  assert.throws(() => calculate(0, "^", -1), /numeric range/);
  assert.throws(() => power(10, 1000), /numeric range/);
  assert.throws(() => power(-2, 0.5), /numeric range/);
});

test("calculates square roots and rejects negative values", () => {
  assert.equal(squareRoot(0), 0);
  assert.equal(squareRoot(9), 3);
  assert.equal(squareRoot(2), Math.sqrt(2));
  assert.equal(calculate(9, "sqrt"), 3);
  assert.throws(() => squareRoot(-1), /negative number/);
  assert.throws(() => calculate(-1, "sqrt"), /negative number/);
});

test("rejects division by positive and negative zero", () => {
  assert.throws(() => calculate(1, "/", 0), /Cannot divide by zero/);
  assert.throws(() => calculate(1, "/", -0), /Cannot divide by zero/);
});

test("rejects unsupported operations", () => {
  assert.throws(() => calculate(1, "?", 2), /supported operations/);
  assert.throws(() => calculate(1, "", 2), /supported operations/);
});

test("rejects non-finite operands", () => {
  for (const invalidNumber of [NaN, Infinity, -Infinity]) {
    assert.throws(() => calculate(invalidNumber, "+", 1), /valid numbers/);
    assert.throws(() => calculate(1, "+", invalidNumber), /valid numbers/);
  }
});

test("CLI prints the result for valid input", () => {
  const result = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "7\n*\n8\n",
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Result: 56/);
  assert.equal(result.stderr, "");
});

test("CLI supports modulo, exponentiation, and square root", () => {
  const moduloResult = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "10\n%\n3\n",
  });
  assert.equal(moduloResult.status, 0);
  assert.match(moduloResult.stdout, /Result: 1/);

  const powerResult = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "2\n^\n3\n",
  });
  assert.equal(powerResult.status, 0);
  assert.match(powerResult.stdout, /Result: 8/);

  const squareRootResult = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "9\nsqrt\n",
  });
  assert.equal(squareRootResult.status, 0);
  assert.match(squareRootResult.stdout, /Result: 3/);
});

test("CLI reports an error for square roots of negative numbers", () => {
  const result = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "-9\nsqrt\n",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /square root of a negative number/);
});

test("CLI reports division by zero and exits unsuccessfully", () => {
  const result = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "4\n/\n0\n",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot divide by zero/);
});

test("CLI rejects invalid numbers and incomplete input", () => {
  const invalidNumber = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "not a number\n+\n2\n",
  });
  assert.equal(invalidNumber.status, 1);
  assert.match(invalidNumber.stderr, /valid number/);

  const incompleteInput = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
    input: "2\n+\n",
  });
  assert.equal(incompleteInput.status, 1);
  assert.match(incompleteInput.stderr, /Input ended/);
});
