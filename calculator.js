/**
 * Calculator state machine.
 * Exposed globally as window.Calculator.
 */
window.Calculator = (() => {
  const initialState = {
    display: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    error: null,
    memory: 0,
    history: [],
    angleMode: 'rad',  // 'rad' or 'deg'
  };

  let state = { ...initialState };

  function render() {
    const displayEl = document.querySelector('[data-testid="display"]');
    if (displayEl) {
      displayEl.textContent = state.error ? state.error : state.display;
    }

    // Decimal button disable logic
    const decimalBtn = document.querySelector('[data-testid="decimal"]');
    if (decimalBtn) {
      decimalBtn.disabled = state.display.includes('.');
    }

    // Memory indicator
    const memIndicator = document.querySelector('[data-testid="memory-indicator"]');
    if (memIndicator) {
      memIndicator.style.visibility = state.memory !== 0 ? 'visible' : 'hidden';
    }

    // Angle mode indicator
    const angleIndicator = document.querySelector('[data-testid="angle-mode"]');
    if (angleIndicator) {
      angleIndicator.textContent = state.angleMode.toUpperCase();
    }

    // History panel (quick update if visible)
    updateHistoryPanel();
  }

  function updateHistoryPanel() {
    const panel = document.getElementById('history-panel');
    if (!panel) return;
    panel.innerHTML = '';
    state.history.slice().reverse().forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'history-entry';
      div.textContent = `${entry.expr} = ${window.MathUtils.roundResult(entry.result)}`;
      div.addEventListener('click', () => {
        // Set display to this result
        state.display = String(window.MathUtils.roundResult(entry.result));
        state.error = null;
        state.firstOperand = null;
        state.operator = null;
        state.waitingForSecondOperand = false;
        render();
      });
      panel.appendChild(div);
    });
  }

  function inputDigit(digit) {
    if (state.error) {
      state.error = null;
      state.display = '0';
      state.waitingForSecondOperand = false;
      state.firstOperand = null;
      state.operator = null;
    }
    if (state.waitingForSecondOperand) {
      state.display = digit;
      state.waitingForSecondOperand = false;
    } else {
      state.display = state.display === '0' ? digit : state.display + digit;
    }
    render();
  }

  function inputDecimal() {
    if (state.display.includes('.')) return;
    if (state.error) {
      state.error = null;
      state.display = '0.';
      state.waitingForSecondOperand = false;
      state.firstOperand = null;
      state.operator = null;
    } else if (state.waitingForSecondOperand) {
      state.display = '0.';
      state.waitingForSecondOperand = false;
    } else {
      state.display += '.';
    }
    render();
  }

  function handleOperator(nextOperator) {
    if (state.error) return;
    const currentDisplay = state.display;

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
      if (state.firstOperand === null && state.operator === null) {
        state.firstOperand = parseFloat(currentDisplay);
      }
    }

    state.operator = nextOperator;
    state.waitingForSecondOperand = true;
    render();
  }

  function handleEquals() {
    if (state.error || !state.operator || state.waitingForSecondOperand) return;

    const currentDisplay = state.display;
    const secondOperand = parseFloat(currentDisplay);
    const first = state.firstOperand;
    const op = state.operator;

    try {
      const result = window.MathUtils.operate(op, first, secondOperand);
      const rounded = window.MathUtils.roundResult(result);
      // Push to history
      state.history.push({
        expr: `${first} ${op} ${secondOperand}`,
        result: rounded
      });
      state.display = String(rounded);
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

  function clearEntry() {
    if (state.error) {
      clear();
      return;
    }
    // If there is a pending operator, clear only current entry
    if (state.operator !== null) {
      state.display = '0';
      state.waitingForSecondOperand = true;
      state.error = null;
    } else {
      // No operator ‑ clear everything like AC
      Object.assign(state, initialState);
    }
    render();
  }

  function backspace() {
    if (state.error) {
      clear();
      return;
    }
    if (state.waitingForSecondOperand) return;
    state.display = state.display.slice(0, -1);
    if (state.display === '') state.display = '0';
    render();
  }

  // --- Scientific functions ---
  function inputFunction(funcName) {
    if (state.error) {
      state.error = null;
      state.display = '0';
      state.waitingForSecondOperand = false;
      state.firstOperand = null;
      state.operator = null;
    }

    const val = parseFloat(state.display);
    let result;
    try {
      switch (funcName) {
        case 'sin': result = window.MathUtils.sin(val, state.angleMode); break;
        case 'cos': result = window.MathUtils.cos(val, state.angleMode); break;
        case 'tan': result = window.MathUtils.tan(val, state.angleMode); break;
        case 'log': result = window.MathUtils.log10(val); break;
        case 'ln':  result = window.MathUtils.ln(val); break;
        case 'sqrt': result = window.MathUtils.sqrt(val); break;
        case 'square': result = window.MathUtils.square(val); break;
        case 'tenPower': result = window.MathUtils.tenPower(val); break;
        case 'factorial': result = window.MathUtils.factorial(val); break;
        default: return;
      }
      const rounded = window.MathUtils.roundResult(result);
      state.display = String(rounded);
      // If there was a pending operator, we've just modified the second operand,
      // so keep waitingForSecondOperand as is (it's false because user was entering digits).
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

  function inputConstant(value) {
    if (state.error) {
      state.error = null;
      state.display = String(value);
      state.waitingForSecondOperand = false;
      state.firstOperand = null;
      state.operator = null;
    } else if (state.waitingForSecondOperand) {
      state.display = String(value);
      state.waitingForSecondOperand = false;
    } else {
      state.display = String(value);
    }
    render();
  }

  function toggleAngleMode() {
    state.angleMode = state.angleMode === 'deg' ? 'rad' : 'deg';
    render();
  }

  // Memory functions
  function memoryClear() {
    state.memory = 0;
    render();
  }
  function memoryRecall() {
    state.display = String(window.MathUtils.roundResult(state.memory));
    if (state.operator !== null) {
      state.waitingForSecondOperand = false;
    }
    render();
  }
  function memoryAdd() {
    const current = parseFloat(state.display) || 0;
    state.memory += current;
    render();
  }
  function memorySubtract() {
    const current = parseFloat(state.display) || 0;
    state.memory -= current;
    render();
  }

  // Expose public API
  return {
    getState: () => ({ ...state }),
    render,
    inputDigit, inputDecimal, handleOperator, handleEquals,
    clear, clearEntry, backspace,
    inputFunction, inputConstant,
    toggleAngleMode,
    memoryClear, memoryRecall, memoryAdd, memorySubtract,
    reset: () => { Object.assign(state, initialState); render(); },
  };
})();