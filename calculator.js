/**
 * Calculator state machine – pure data + logic.
 * Exposed globally as window.Calculator.
 */
window.Calculator = (() => {
  const initialState = {
    display: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    error: null,
  };

  let state = { ...initialState };

  /**
   * Renders the display and disables/enables the decimal button.
   * Called after every state change.
   */
  function render() {
    const displayEl = document.querySelector('[data-testid="display"]');
    if (displayEl) {
      displayEl.textContent = state.error ? state.error : state.display;
    }

    const decimalBtn = document.querySelector('[data-testid="decimal"]');
    if (decimalBtn) {
      decimalBtn.disabled = state.display.includes('.');
    }
  }

  function inputDigit(digit) {
    // Clear error state on any new input
    if (state.error) {
      state.error = null;
      state.display = '0';
      state.waitingForSecondOperand = false;
      state.firstOperand = null;
      state.operator = null;
    }

    // If we should start a new number (after operator or after equals)
    if (state.waitingForSecondOperand) {
      state.display = digit;
      state.waitingForSecondOperand = false;
    } else {
      // If display is exactly '0', replace it (prevent leading zeros)
      state.display = state.display === '0' ? digit : state.display + digit;
    }

    render();
  }

  function inputDecimal() {
    // Don't add a second decimal point
    if (state.display.includes('.')) return;

    if (state.error) {
      // Reset from error to '0.'
      state.error = null;
      state.display = '0.';
      state.waitingForSecondOperand = false;
      state.firstOperand = null;
      state.operator = null;
    } else if (state.waitingForSecondOperand) {
      // Starting a new number after operator
      state.display = '0.';
      state.waitingForSecondOperand = false;
    } else {
      state.display += '.';
    }

    render();
  }

  function handleOperator(nextOperator) {
    // If there's an error, ignore operator
    if (state.error) return;

    const currentDisplay = state.display;

    // If we already have a first operand and an operator, and we are NOT waiting for a new number,
    // it means the user just typed a second number and pressed an operator → evaluate existing pair.
    if (state.operator && !state.waitingForSecondOperand) {
      const secondOperand = parseFloat(currentDisplay);
      try {
        const result = window.MathUtils.operate(state.operator, state.firstOperand, secondOperand);
        const rounded = window.MathUtils.roundResult(result);
        state.display = String(rounded);
        state.firstOperand = rounded;
      } catch (e) {
        state.error = e.message;
        state.display = e.message;
        state.firstOperand = null;
        state.operator = null;
        state.waitingForSecondOperand = false;
        render();
        return;
      }
    } else {
      // First operator press (or after clear): store the current display as firstOperand
      if (state.firstOperand === null && state.operator === null) {
        state.firstOperand = parseFloat(currentDisplay);
      } else if (state.waitingForSecondOperand) {
        // User pressed operator repeatedly, just replace the operator (no evaluation)
        // Already handled by setting operator below.
      }
    }

    // Update operator and prepare for second operand
    state.operator = nextOperator;
    state.waitingForSecondOperand = true;
    render();
  }

  function handleEquals() {
    // Ignore if error, no operator, or waiting for a second number (nothing to evaluate)
    if (state.error || !state.operator || state.waitingForSecondOperand) return;

    const currentDisplay = state.display;
    const secondOperand = parseFloat(currentDisplay);

    try {
      const result = window.MathUtils.operate(state.operator, state.firstOperand, secondOperand);
      const rounded = window.MathUtils.roundResult(result);
      state.display = String(rounded);
      // Reset for a fresh calculation, but keep the result shown.
      state.firstOperand = null;
      state.operator = null;
      state.waitingForSecondOperand = false;
    } catch (e) {
      state.error = e.message;
      state.display = e.message;
      state.firstOperand = null;
      state.operator = null;
      state.waitingForSecondOperand = false;
    }

    render();
  }

  function clear() {
    Object.assign(state, initialState);
    render();
  }

  function backspace() {
    // If there's an error, clear everything
    if (state.error) {
      clear();
      return;
    }

    // If waiting for second operand, backspace should change nothing (display is still the first operand)
    if (state.waitingForSecondOperand) return;

    // Remove last character
    state.display = state.display.slice(0, -1);
    if (state.display === '') {
      state.display = '0';
    }

    render();
  }

  // Expose public API
  return {
    getState: () => ({ ...state }),
    render,
    inputDigit,
    inputDecimal,
    handleOperator,
    handleEquals,
    clear,
    backspace,
    reset: () => {
      Object.assign(state, initialState);
      render();
    },
  };
})();