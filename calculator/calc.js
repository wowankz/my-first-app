const calc = {
    _actions: ["C", "back", "="],
    _operations: ["+", "-", "*", "/"],
    _keyboard: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "+/-", "0", "."],
    _currentInput: null,
    _historyInput: null,
    _result: null,
    _history: [],
    _operand: null,
    _prevOperand: null,
    _lastAction: null,

    init() {
        this._render("actions", this._actions);
        this._render("operators", this._operations);
        this._render("keyboard", this._keyboard);
        this._addEvent();
        this._currentInput = document.querySelector(`output[name = "current"]`);
        this._historyInput = document.querySelector(`input[name = "history"]`);
        this._result = 0;
        this._operand = '';
        this._prevOperand = '';
        this._lastAction = '';
        this._renderInput();

    },

    _render(container, items) {
        let str = '';
        let cont = document.querySelector(`#${container}`);
        items.forEach(item => {
            str += `<button name="${container}" data-value="${item}"><span>${item}</span></button>`;
        });
        cont.innerHTML = str;
    },

    _renderInput() {
        this._currentInput.value = this._operand.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') || this._result.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
        this._historyInput.value = this._history.join('').replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
    },

    _addEvent() {
        let calc = document.querySelector("#calc");
        calc.addEventListener("click", this._handlerEvent.bind(this), true);
    },

    _handlerEvent(event) {
        switch (event.target.name || event.target.parentNode.name) {
            case "actions":
            case "operators":
                this._action(event.target.dataset.value || event.target.parentNode.dataset.value);
                break;

            case "keyboard":
                this._input(event.target.dataset.value || event.target.parentNode.dataset.value);
                break;

            default:
                console.log("unknown action");
        }
    },

    _action(action) {
        if (action === "C") {
            this._result = 0;
            this._history = [];
            this._operand = '';
            this._prevOperand = '';
            this._lastAction = '';
            this._renderInput();
            return;
        }

        if (action === "back") {
            this._operand = this._operand.slice(0, -1);
            this._renderInput();
            return;
        }
        if (this._lastAction === "=" || this._prevOperand !== '' && this._operand !== '') {
            switch (this._lastAction) {
                case "+":
                    this._sum(this._prevOperand, this._operand);
                    this._lastAction = action;
                    this._history.push(this._operand, action)
                    this._operand = '';
                    break;

                case "-":
                    this._sub(this._prevOperand, this._operand);
                    this._lastAction = action;
                    this._history.push(this._operand, action)
                    this._operand = '';
                    break;

                case "*":
                    this._multiply(this._prevOperand, this._operand);
                    this._lastAction = action;
                    this._history.push(this._operand, action)
                    this._operand = '';
                    break;

                case "/":
                    this._divide(this._prevOperand, this._operand) ? this._history.push(this._operand, action) : action = "/";
                    this._lastAction = action;
                    this._operand = '';
                    break;

                case "=":
                    this._lastAction = action;
                    this._history = [this._result];
                    this._history.push(action)
                    break;
            }

        } else if (this._operand) {
            this._prevOperand = this._operand;
            this._result = this._operand;
            this._lastAction = action;
            this._history.push(this._operand, action);
            this._operand = '';
        } else {
            this._lastAction = action;
            if (this._history.length > 0) {
                this._history.pop();
                this._history.push(action)
            }

        }

        this._renderInput();
    },

    _input(inp) {
        if (this._lastAction === "=") return;
        this._operand = inp === '+/-' ?
            this._operand.includes('-') ? this._operand.slice(1) : '-' + this._operand : this._operand.length < 15 ? this._operand += inp : this._operand;

        this._renderInput()
    },

    _sum(num1, num2) {
        let res = (+num1) + (+num2);
        this._result = res;
        this._prevOperand = res;
    },

    _sub(num1, num2) {
        let res = (+num1) - (+num2);
        this._result = res;
        this._prevOperand = res;
    },

    _multiply(num1, num2) {
        let res = (+num1) * (+num2);
        this._result = res;
        this._prevOperand = res;
    },

    _divide(num1, num2) {
        if (+num2 === 0) {
            document.querySelector("#messages").style.display = 'flex';
            setTimeout(() => { document.querySelector("#messages").style.display = 'none' }, 1500)
            return false;
        }
        let res = (+num1) / (+num2);
        this._result = res;
        this._prevOperand = res;
        return true;
    }

}

calc.init()