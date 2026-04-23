# Scientific Calculator (2026)

A modern, full‑featured scientific calculator built with **vanilla JavaScript**, HTML, and CSS. It uses an immediate‑execution model (like physical Casio/TI calculators) and provides a rich set of scientific functions, memory operations, history, and keyboard support.

**Live features:**
- Basic arithmetic: `+`, `−`, `×`, `÷`
- Power operator: `^`
- Scientific functions: `sin`, `cos`, `tan`, `log`, `ln`, `√`, `x²`, `10ˣ`, factorial (`!`)
- Constants: `π`, `e`
- Angle mode toggle (DEG/RAD)
- Memory operations: `MC`, `MR`, `M+`, `M−`
- Clear (`AC`) and Clear Entry (`CE`)
- Backspace (`⌫`)
- Decimal point (disabled when already present)
- History panel (click to reuse results)
- Full keyboard support (see shortcuts below)
- QA‑testing API (`window.calculatorAPI`)
- Responsive design, touch‑friendly

## Keyboard Shortcuts
| Key            | Action               |
|----------------|----------------------|
| `0`‑`9`        | Digit                |
| `.`            | Decimal              |
| `+` `-` `*` `/` `^` | Operator       |
| `Enter` / `=`  | Equals               |
| `Backspace`    | Backspace            |
| `Escape` / `c` | All Clear (AC)       |
| `s`            | sin                  |
| `t`            | tan                  |
| `o`            | cos                  |
| `l`            | log                  |
| `n`            | ln                   |
| `q`            | √                    |
| `!`            | factorial            |
| `p`            | π                    |
| `e`            | e                    |
| `a`            | Toggle angle mode    |
| `m`            | Memory add (M+)      |
| `r`            | Memory recall (MR)   |
| `d`            | Memory clear (MC)    |

## Limitations & Known Issues
Immediate execution model – the calculator evaluates one operation at a time. It does not support algebraic precedence (3 + 5 × 2 will be computed as (3 + 5) × 2 if you press operators in sequence).

No parentheses – complex nested expressions cannot be entered. This is a design decision to keep the state machine simple and reliable.

History not persisted – refreshing the page clears all history and memory.

Display rounding – numbers are rounded to 10 decimal places to avoid overflow; very large or very small numbers may lose precision.

Division by zero – shows a snarky error message and resets the current operation.

## Future Improvement Areas
Algebraic expression parser (Shunting‑yard algorithm) to support order of operations, parentheses, and true scientific input.

Persistent storage (localStorage) for history and memory.

Dedicated unit tests (Jest or similar) for math and state machine.

Additional functions: hyperbolic trig, inverse trig, logarithmic base change, modulo, etc.

Themes – light/dark mode or customisable skins.

Graphing – integrate a canvas‑based function plotter.

Accessibility – improved ARIA labels and screen‑reader support.

## Project Structure
calculator/
├── index.html         # UI layout
├── style.css          # Styling
├── math.js            # Pure arithmetic & scientific functions
├── calculator.js      # State machine & logic
├── main.js            # Event wiring, keyboard, QA API
└── README.md          # This file