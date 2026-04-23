/**
 * Main initialisation – ties DOM to Calculator, adds keyboard support,
 * and exposes the testing API.
 */
(function () {
  function bindButtons() {
    // Digits
    for (let i = 0; i <= 9; i++) {
      const btn = document.querySelector(`[data-testid="digit-${i}"]`);
      if (btn) {
        btn.addEventListener('click', () => window.Calculator.inputDigit(String(i)));
      }
    }

    // Decimal
    const decimalBtn = document.querySelector('[data-testid="decimal"]');
    if (decimalBtn) {
      decimalBtn.addEventListener('click', () => window.Calculator.inputDecimal());
    }

    // Operators
    const operators = {
      'operator-plus': '+',
      'operator-minus': '-',
      'operator-multiply': '*',
      'operator-divide': '/',
    };
    for (const [testid, op] of Object.entries(operators)) {
      const btn = document.querySelector(`[data-testid="${testid}"]`);
      if (btn) {
        btn.addEventListener('click', () => window.Calculator.handleOperator(op));
      }
    }

    // Equals
    const equalsBtn = document.querySelector('[data-testid="equals"]');
    if (equalsBtn) {
      equalsBtn.addEventListener('click', () => window.Calculator.handleEquals());
    }

    // Clear
    const clearBtn = document.querySelector('[data-testid="clear"]');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => window.Calculator.clear());
    }

    // Backspace
    const backspaceBtn = document.querySelector('[data-testid="backspace"]');
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', () => window.Calculator.backspace());
    }
  }

  function bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;

      // Prevent default for calculator keys
      if (
        (key >= '0' && key <= '9') ||
        key === '.' ||
        key === '+' || key === '-' || key === '*' || key === '/' ||
        key === 'Enter' || key === '=' || key === 'Backspace' || key === 'Escape' || key === 'c' || key === 'C'
      ) {
        e.preventDefault();
      }

      // Digits
      if (key >= '0' && key <= '9') {
        window.Calculator.inputDigit(key);
      }
      // Decimal
      else if (key === '.') {
        window.Calculator.inputDecimal();
      }
      // Operators
      else if (key === '+') {
        window.Calculator.handleOperator('+');
      } else if (key === '-') {
        window.Calculator.handleOperator('-');
      } else if (key === '*') {
        window.Calculator.handleOperator('*');
      } else if (key === '/') {
        window.Calculator.handleOperator('/');
      }
      // Equals
      else if (key === 'Enter' || key === '=') {
        window.Calculator.handleEquals();
      }
      // Backspace
      else if (key === 'Backspace') {
        window.Calculator.backspace();
      }
      // Clear (Escape or 'c')
      else if (key === 'Escape' || key === 'c' || key === 'C') {
        window.Calculator.clear();
      }
    });
  }

  function exposeAPI() {
    window.calculatorAPI = {
      getState: () => window.Calculator.getState(),
      pressDigit: (d) => window.Calculator.inputDigit(String(d)),
      pressOperator: (op) => window.Calculator.handleOperator(op),
      pressEquals: () => window.Calculator.handleEquals(),
      pressClear: () => window.Calculator.clear(),
      pressBackspace: () => window.Calculator.backspace(),
      getDisplay: () => window.Calculator.getState().display,
      reset: () => window.Calculator.reset(),
    };
  }

  function init() {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        bindButtons();
        bindKeyboard();
        exposeAPI();
        window.Calculator.render();
      });
    } else {
      bindButtons();
      bindKeyboard();
      exposeAPI();
      window.Calculator.render();
    }
  }

  init();
})();