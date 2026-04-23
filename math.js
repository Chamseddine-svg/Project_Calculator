/**
 * Math utilities – pure functions, no side effects.
 * Exposed globally as window.MathUtils.
 */
window.MathUtils = (() => {
  function add(a, b) {
    return a + b;
  }

  function subtract(a, b) {
    return a - b;
  }

  function multiply(a, b) {
    return a * b;
  }

  function divide(a, b) {
    if (b === 0) {
      throw new Error('Nice try, but you can’t divide by zero. 🤓');
    }
    return a / b;
  }

  /**
   * Calls the appropriate arithmetic function.
   * @param {string} operator - '+', '-', '*', '/'
   * @param {number} a - first operand
   * @param {number} b - second operand
   * @returns {number} result
   */
  function operate(operator, a, b) {
    switch (operator) {
      case '+':
        return add(a, b);
      case '-':
        return subtract(a, b);
      case '*':
        return multiply(a, b);
      case '/':
        return divide(a, b);
      default:
        // fallback: return second operand (shouldn't happen)
        return b;
    }
  }

  /**
   * Rounds a number to avoid floating-point overflow on the display.
   */
  function roundResult(value) {
    return Math.round(value * 1e10) / 1e10;
  }

  return { add, subtract, multiply, divide, operate, roundResult };
})();