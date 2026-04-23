(function () {
  function bindButtons() {
    // Digits
    for (let i = 0; i <= 9; i++) {
      const btn = document.querySelector(`[data-testid="digit-${i}"]`);
      if (btn) btn.addEventListener('click', () => window.Calculator.inputDigit(String(i)));
    }

    // Decimal
    const dec = document.querySelector('[data-testid="decimal"]');
    if (dec) dec.addEventListener('click', () => window.Calculator.inputDecimal());

    // Operators
    const ops = {
      'operator-plus': '+',
      'operator-minus': '-',
      'operator-multiply': '*',
      'operator-divide': '/',
      'operator-power': '^',
    };
    Object.entries(ops).forEach(([id, op]) => {
      const btn = document.querySelector(`[data-testid="${id}"]`);
      if (btn) btn.addEventListener('click', () => window.Calculator.handleOperator(op));
    });

    // Equals
    const eq = document.querySelector('[data-testid="equals"]');
    if (eq) eq.addEventListener('click', () => window.Calculator.handleEquals());

    // Clear (AC)
    const ac = document.querySelector('[data-testid="clear"]');
    if (ac) ac.addEventListener('click', () => window.Calculator.clear());

    // Clear Entry (CE)
    const ce = document.querySelector('[data-testid="clear-entry"]');
    if (ce) ce.addEventListener('click', () => window.Calculator.clearEntry());

    // Backspace
    const bs = document.querySelector('[data-testid="backspace"]');
    if (bs) bs.addEventListener('click', () => window.Calculator.backspace());

    // Scientific functions
    const funcMap = {
      'func-sin': 'sin',
      'func-cos': 'cos',
      'func-tan': 'tan',
      'func-log': 'log',
      'func-ln': 'ln',
      'func-sqrt': 'sqrt',
      'func-square': 'square',
      'func-tenpower': 'tenPower',
      'func-factorial': 'factorial',
    };
    Object.entries(funcMap).forEach(([id, name]) => {
      const btn = document.querySelector(`[data-testid="${id}"]`);
      if (btn) btn.addEventListener('click', () => window.Calculator.inputFunction(name));
    });

    // Constants
    const constMap = {
      'const-pi': Math.PI,
      'const-e': Math.E,
    };
    Object.entries(constMap).forEach(([id, value]) => {
      const btn = document.querySelector(`[data-testid="${id}"]`);
      if (btn) btn.addEventListener('click', () => window.Calculator.inputConstant(value));
    });

    // Angle toggle
    const angleBtn = document.querySelector('[data-testid="toggle-angle"]');
    if (angleBtn) angleBtn.addEventListener('click', () => window.Calculator.toggleAngleMode());

    // Memory
    const memMC = document.querySelector('[data-testid="mem-mc"]');
    if (memMC) memMC.addEventListener('click', () => window.Calculator.memoryClear());
    const memMR = document.querySelector('[data-testid="mem-mr"]');
    if (memMR) memMR.addEventListener('click', () => window.Calculator.memoryRecall());
    const memMPlus = document.querySelector('[data-testid="mem-m+"]');
    if (memMPlus) memMPlus.addEventListener('click', () => window.Calculator.memoryAdd());
    const memMMinus = document.querySelector('[data-testid="mem-m-"]');
    if (memMMinus) memMMinus.addEventListener('click', () => window.Calculator.memorySubtract());

    // History toggle
    const histBtn = document.querySelector('[data-testid="history-toggle"]');
    const histPanel = document.getElementById('history-panel');
    if (histBtn && histPanel) {
      histBtn.addEventListener('click', () => {
        histPanel.classList.toggle('visible');
      });
    }
  }

  function bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      const prevent = [
        '0','1','2','3','4','5','6','7','8','9','.',
        '+','-','*','/','^','Enter','=','Backspace','Escape',
        'c','C', '(', ')',
        's','S','t','T','o','O','l','L','n','N','q','Q','!','p','P','e','E',
        'a','A','m','M','r','R','d','D'
      ];
      if (prevent.includes(key)) e.preventDefault();

      if (key >= '0' && key <= '9') {
        window.Calculator.inputDigit(key);
      } else if (key === '.') {
        window.Calculator.inputDecimal();
      } else if (key === '+') {
        window.Calculator.handleOperator('+');
      } else if (key === '-') {
        window.Calculator.handleOperator('-');
      } else if (key === '*') {
        window.Calculator.handleOperator('*');
      } else if (key === '/') {
        window.Calculator.handleOperator('/');
      } else if (key === '^') {
        window.Calculator.handleOperator('^');
      } else if (key === 'Enter' || key === '=') {
        window.Calculator.handleEquals();
      } else if (key === 'Backspace') {
        window.Calculator.backspace();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        window.Calculator.clear();
      }
      // Scientific keys
      else if (key === 's' || key === 'S') window.Calculator.inputFunction('sin');
      else if (key === 't' || key === 'T') window.Calculator.inputFunction('tan');
      else if (key === 'o' || key === 'O') window.Calculator.inputFunction('cos');
      else if (key === 'l' || key === 'L') window.Calculator.inputFunction('log');
      else if (key === 'n' || key === 'N') window.Calculator.inputFunction('ln');
      else if (key === 'q' || key === 'Q') window.Calculator.inputFunction('sqrt');
      else if (key === '!') window.Calculator.inputFunction('factorial');
      else if (key === 'p' || key === 'P') window.Calculator.inputConstant(Math.PI);
      else if (key === 'e' || key === 'E') window.Calculator.inputConstant(Math.E);
      else if (key === 'a' || key === 'A') window.Calculator.toggleAngleMode();
      // Memory shortcuts (optional)
      else if (key === 'm' || key === 'M') window.Calculator.memoryAdd();
      else if (key === 'r' || key === 'R') window.Calculator.memoryRecall();
      else if (key === 'd' || key === 'D') window.Calculator.memoryClear();
    });
  }

  function exposeAPI() {
    window.calculatorAPI = {
      getState: () => window.Calculator.getState(),
      pressDigit: (d) => window.Calculator.inputDigit(String(d)),
      pressOperator: (op) => window.Calculator.handleOperator(op),
      pressEquals: () => window.Calculator.handleEquals(),
      pressClear: () => window.Calculator.clear(),
      pressClearEntry: () => window.Calculator.clearEntry(),
      pressBackspace: () => window.Calculator.backspace(),
      pressFunction: (name) => window.Calculator.inputFunction(name),
      pressConstant: (c) => window.Calculator.inputConstant(c),
      toggleAngleMode: () => window.Calculator.toggleAngleMode(),
      memoryClear: () => window.Calculator.memoryClear(),
      memoryRecall: () => window.Calculator.memoryRecall(),
      memoryAdd: () => window.Calculator.memoryAdd(),
      memorySubtract: () => window.Calculator.memorySubtract(),
      getDisplay: () => window.Calculator.getState().display,
      reset: () => window.Calculator.reset(),
    };
  }

  function init() {
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