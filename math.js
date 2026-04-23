/**
 * Math utilities – pure functions.
 * Exposed globally as window.MathUtils.
 */
window.MathUtils = (() => {
  function add(a, b) { return a + b; }
  function subtract(a, b) { return a - b; }
  function multiply(a, b) { return a * b; }
  function divide(a, b) {
    if (b === 0) throw new Error('Nice try, but you can’t divide by zero. 🤓');
    return a / b;
  }
  function power(a, b) {
    return Math.pow(a, b);
  }

  function operate(operator, a, b) {
    switch (operator) {
      case '+': return add(a, b);
      case '-': return subtract(a, b);
      case '*': return multiply(a, b);
      case '/': return divide(a, b);
      case '^': return power(a, b);
      default: return b;
    }
  }

  function roundResult(value) {
    return Math.round(value * 1e10) / 1e10;
  }

  // Scientific unary functions
  function toRadians(deg) { return deg * Math.PI / 180; }
  function toDegrees(rad) { return rad * 180 / Math.PI; }

  function sin(val, angleMode) {
    const input = angleMode === 'deg' ? toRadians(val) : val;
    return Math.sin(input);
  }
  function cos(val, angleMode) {
    const input = angleMode === 'deg' ? toRadians(val) : val;
    return Math.cos(input);
  }
  function tan(val, angleMode) {
    const input = angleMode === 'deg' ? toRadians(val) : val;
    return Math.tan(input);
  }
  function log10(val) {
    if (val <= 0) throw new Error('Log of non-positive number');
    return Math.log10(val);
  }
  function ln(val) {
    if (val <= 0) throw new Error('Ln of non-positive number');
    return Math.log(val);
  }
  function sqrt(val) {
    if (val < 0) throw new Error('Square root of negative number');
    return Math.sqrt(val);
  }
  function square(val) { return val * val; }
  function tenPower(val) { return Math.pow(10, val); }
  function factorial(val) {
    if (!Number.isInteger(val) || val < 0) throw new Error('Factorial only for non-negative integers');
    let res = 1;
    for (let i = 2; i <= val; i++) res *= i;
    return res;
  }

  return { add, subtract, multiply, divide, power, operate, roundResult,
           sin, cos, tan, log10, ln, sqrt, square, tenPower, factorial,
           toRadians, toDegrees };
})();