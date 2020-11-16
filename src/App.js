import React from 'react';
import './App.css';

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      memory: '',
      counter: 0,
      operator: '',
      lastOperator: '',
      display: '',
      answer: ''
    }
    this.inputHandle = this.inputHandle.bind(this);
    this.decimalHandle = this.decimalHandle.bind(this);
    this.operatorHandle = this.operatorHandle.bind(this);
    this.sqrtHandle = this.sqrtHandle.bind(this);
    this.percentHandle = this.percentHandle.bind(this);
    this.equalsHandle = this.equalsHandle.bind(this);
    this.clearHandle = this.clearHandle.bind(this);
  }

  inputHandle(event) {
    let value = event.target.textContent;
    let input;
    let counter;
    let display;
    this.setState(state => {
      if (state.display.includes('=') || state.display.includes('sqrt')) { // inputing after '=' or 'sqrt' is pressed
        if (value === '00')
          value = '0';
        return {
          input: value,
          memory: '',
          counter: 1,
          operator: '',
          display: value,
          answer: ''
        }
      }
      if (value === '0' || value === '00') { // input is 0 or 00
        if (state.input.length === 1 && state.input[0] === '0') { // first num is 0
          input = '';
          counter = 0;
          display = '';
        } else if (state.input.length === 0) {
          console.log('zero input in action');
          input = '0';
          counter = 1;
          display = '0';
          // ** 09/10 ** //
        } else if (state.display.length === 3 && state.display[1] === '-') {
          console.log('minus case');
          input = '**0';
          counter = 1;
          display = '0';
          // ** //
        } else { // second zeros, like 10, 100
          console.log('number');
          input = value;
          counter = 1;
          display = value;
        }
        return {
          input: state.input + input,
          counter: state.counter + counter,
          operator: '',
          display: state.display + display,
          answer: ''
        }
      } else { // input is any other number
        let regex = /[+-/*//]/;
        let display = '';
        if (state.input.length === 1 && state.input[0] === '0') {
          if (state.memory.length > 0 && state.memory[state.memory.length - 1].match(regex)) {
            display = state.display.slice(0, state.display.length - 2);
            // return {
            //   input: value,
            //   counter: 1,
            //   operator: '',
            //   display: display + value,
            //   answer: ''
            // }
          }
          return {
            input: value,
            counter: 1,
            operator: '',
            display: (display.length > 0) ? (display + ' ' + value) : value,
            answer: ''
          }
        } else {
          return {
            input: state.input + value,
            counter: state.counter + 1,
            operator: '',
            display: state.display + value,
            answer: ''
          }
        }
      }
    });
  }

  decimalHandle() {
    this.setState(state => {
      if (state.input.length === 0) { // first input is '.'
        return {
          input: state.input + '0.',
          display: state.display + '0.',
          counter: 2
        }
      }
      if (state.input.length === 1 && state.counter === 0) { // first input is 0 or 00
        return {
          input: state.input + '.',
          display: state.display + '0.',
          counter: 2
        }
      }
      if (state.input.includes('.') && state.display.includes('.')) {
        return;
      } else {
        return {
          input: state.input + '.',
          display: state.display + '.',
          counter: 1 // all decimal counters - 05/10
        }
      }
    });
  }

  operatorHandle(event) {
    let operator = event.target.textContent;
    let designOperator = event.target.textContent;
    if (operator === '×')
      operator = '*';
    if (operator === '÷')
      operator = '/';
    if (operator === '^')
      operator = '**';
    this.setState(state => {
      // if several operators are being input at first input
      if (state.display.length === 0 && operator !== '-') {
        return;
      }
      // if several operators are being input after the first input that is '-'
      if (state.display.length === 3 && state.display[1] === '-') {
        return;
      }
      if (state.display.includes('=') || state.display.includes('sqrt')) {
        return {
          memory: state.memory + state.input + operator,
          input: '',
          operator: designOperator,
          display: state.answer + ' ' + designOperator + ' ',
          counter: 0,
          lastOperator: operator
        }
      } else {
        return {
          memory: state.memory + state.input + operator,
          input: '',
          operator: designOperator,
          display: state.display + ' ' + designOperator + ' ',
          counter: 0,
          lastOperator: operator
        }
      }
    });
  }

  sqrtHandle() {
    this.setState(state => {
      if (state.input.length > 0 || state.answer.length > 0) {
        let num = (state.input.length > 0) ? state.input : state.answer;
        let answer = Math.sqrt(num);
        return {
          answer: answer.toString(),
          input: '',
          display: 'sqrt(' + num + ')',
          memory: answer
        }
      } else {
        return;
      }
    });
  }

  percentHandle() {
    this.setState(state => {
      if (state.input.length > 0 || state.answer.length > 0) {
        let num = (state.input.length > 0) ? state.input : state.answer;
        let answer = num / 100;
        return {
          answer: answer.toString(),
          input: '',
          display: answer.toString(), // ??
          memory: answer
        }
      } else {
        return;
      }
    });
  }

  equalsHandle() {
    this.setState(state => {
      if (state.memory.length > 0 && state.input.length > 0) { // values were entered
        let regex = /[+-/*//]/;
        if (state.memory[0].match(regex) && state.memory.length === 1) { // if only the operator is pressed
          return;
        }
        let str = state.memory + state.input;
        let res = '';
        // filter for multiple operator inputs like +-*/ etc
        for (let i = 0; i < str.length; i++) {
          if (str[i].match(regex) && str[i + 1] === '-' && !str[i + 2].match(regex)) { // minus case
            res += str[i] + str[i + 1] + str[i + 2];
            i += 2;
          } else if (str[i].match(regex) && str[i + 1] === '*' && !str[i + 2].match(regex) && state.lastOperator === '**') { // power case
            res += str[i] + str[i + 1] + str[i + 2];
            i += 2;
          } else if (str[i].match(regex) && str[i + 1].match(regex)) {
            continue;
          } else {
            res += str[i];
          }
        }
        let answer = eval(res).toString();
        return {
          input: '',
          memory: answer, // for inputs after the '=' is pressed
          operator: '',
          // display: answer, - test version
          display: state.display + ' = ' + answer, // home version
          answer: answer,
          counter: 0
        }
      }
    });
  }

  clearHandle() {
    console.clear();
    this.setState({
      input: '',
      memory: '',
      counter: 0,
      operator: '',
      lastOperator: '',
      display: '',
      answer: ''
    });
  }

  render() {
    let answer = this.state.answer;
    let input = this.state.input;
    let operator = this.state.operator;
    let display = this.state.display;
    // console.log('counter', this.state.counter);
    return (
      <div className="container">
        <div className="display" id="display">{display.length > 0 ? display : 0}</div>
        <div className="input">{input.length > 0 ? input : operator.length > 0 ? operator : answer.length > 0 ? answer : 0}</div>
        <div className="cols-3">
          <div className="left"></div>
          <div className="pads">
            <div className="row-1">
              <div className="btn" onClick={this.clearHandle} id="clear" title="clear">C</div>
              <div className="btn" onClick={this.operatorHandle} id="power" title="power">^</div>
              <div className="btn" onClick={this.percentHandle} id="percent" title="percent">%</div>
              <div className="btn" onClick={this.sqrtHandle} id="sqrt" title="square root">√</div>
            </div>
            <div className="row-2">
              <div className="btn" onClick={this.inputHandle} id="seven">7</div>
              <div className="btn" onClick={this.inputHandle} id="eight">8</div>
              <div className="btn" onClick={this.inputHandle} id="nine">9</div>
              <div className="btn" onClick={this.operatorHandle} id="divide" title="divide">÷</div>
            </div>
            <div className="row-3">
              <div className="btn" onClick={this.inputHandle} id="four">4</div>
              <div className="btn" onClick={this.inputHandle} id="five">5</div>
              <div className="btn" onClick={this.inputHandle} id="six">6</div>
              <div className="btn" onClick={this.operatorHandle} id="multiply" title="multiply">×</div>
            </div>
            <div className="row-4">
              <div className="btn" onClick={this.inputHandle} id="one">1</div>
              <div className="btn" onClick={this.inputHandle} id="two">2</div>
              <div className="btn" onClick={this.inputHandle} id="three">3</div>
              <div className="btn" onClick={this.operatorHandle} id="subtract" title="subtract">-</div>
            </div>
            <div className="row-5">
              <div className="btn" onClick={this.inputHandle} id="zero">0</div>
              <div className="btn" onClick={this.inputHandle} id="00">00</div>
              <div className="btn" onClick={this.decimalHandle} id="decimal">.</div>
              <div className="btn" onClick={this.operatorHandle} id="add" title="add">+</div>
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div className="equals" onClick={this.equalsHandle} id="equals" title="equals">=</div>
      </div>
    );
  }
}

export default Calculator;
