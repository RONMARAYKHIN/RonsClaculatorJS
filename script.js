const calculator = document.querySelector('.cal');
const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');
const operators = document.querySelectorAll('.operator');
const calObject = {
    firstValue: null,
    operator: null,
    previous: null,
    modifiedValue: null
}


//support for the keyboard
document.addEventListener('keydown', function(event){
    let key;
    if (event.key === 'Enter'){
        key = document.querySelector('.equals');
    } else if(event.key === '/'){
        key = document.querySelector('button[data-key="÷"]')
    } else if(event.key === 'Escape' || event.key === 'A'){
        key = document.querySelector('.clear');
    } else {
        key = document.querySelector(`button[data-key='${event.key}']`);
    }
    key.click();
});

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;


//opreate function - the main function 
function operate(operator, num1, num2) {
    const firstNum = parseFloat(num1);
    const secondNum = parseFloat(num2);
    switch(operator){
        case 'add':
            return add(firstNum, secondNum);
        case 'subtract':
            return subtract(firstNum, secondNum);
        case 'multiply':
            return multiply(firstNum,secondNum);
        case 'divide':
            return divide(firstNum,secondNum);
    }
}

const getType = button => {
    const action = button.dataset.action;
    if(!action){return 'number';}
    if(
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) {return 'operator';}
    return action;
}

const reset = object => {
    Object.keys(object).forEach(function(key, index) {
        calObject[key] = '';
    });
}


const updateCalObject = (button, calObject, displayedNum) => {
    const buttonType = getType(button);
    const previous= calObject.previous;
    const modifiedValue = calObject.modifiedValue;

    if(buttonType === 'number'){
        if(previous === 'calculate'){
            reset(calObject);
        }
    }  

    if(buttonType === 'operator') {
        calObject.operator = button.dataset.action;
        calObject.firstValue = display.textContent;
    } 

    if(buttonType === 'decimal'){
        if(previous === 'calculate'){
            reset(calObject);
        }
    } 

    if(buttonType === 'clear' && button.textContent === 'AC'){
        reset(calObject);
    } 

    if(buttonType === 'calculate'){
        let firstValue = calObject.firstValue;
        if(firstValue){
            if(previous === 'calculate'){
            calObject.modifiedValue = modifiedValue; 
            } else {
                calObject.modifiedValue = displayedNum;
            }
        }
    }
} 

// there i cunclude the infinty when divide by zero
const dis = (button, displayedNum, calObject) => {
    const buttonContent = button.textContent;
    const buttonType = getType(button);
    const previous = calObject.previous;
    let firstValue = calObject.firstValue;
    const operator = calObject.operator;
    let secondValue = displayedNum;
    
    if(buttonType === 'number'){
        if(buttonContent === '0' && operator === 'divide'){
            alert('infinity!');
            reset(calObject);
        }
        return (displayedNum === '0' || previous === 'operator' || previous === 'calculate')
            ? buttonContent
            : displayedNum + buttonContent
        
    }

    if(buttonType === 'decimal'){
        if(!displayedNum.includes('.') && previous !== 'operator' && previous !== 'calculate') {
            return displayedNum + '.';
        } 
        if(previous === 'operator' || previous=== 'calculate'){
            return '0.';
        }
        return displayedNum;
    }

    if(buttonType === 'operator'){
        return (firstValue && operator && previous !== 'operator' && previous !== 'calculate')
            ? operate(operator, firstValue, secondValue)
            : displayedNum
    }

    if(buttonType === 'clear'){
        return '0';
    }

    if(buttonType === 'backspace' && (previous === 'number' || previous === 'backspace')){
        while(displayedNum.toString().length > 1) {
            return displayedNum.slice(0, -1);
        }
        return '0';
    }

    if(buttonType === 'calculate'){        
        if(firstValue){
            if(previous === 'calculate'){
                firstValue = displayedNum;
                secondValue = calObject.modifiedValue;
                return operate(operator, firstValue, secondValue);
            }
            return operate(operator, firstValue, displayedNum);
        }
        return displayedNum;
    }
}

const updateVisualState = (button, calculator) => {
    const buttonType = getType(button);
    Array.from(button.parentNode.children).forEach(
        button => button.classList.remove('is_clicked'));

    if(buttonType === 'operator') {
        button.classList.add('is_clicked');
    } 
    if(buttonType === 'clear' && button.textContent !== 'C'){
            button.textContent = 'C';
    }
    if(buttonType !== 'clear'){
        const clearButton = calculator.querySelector('.clear');
        clearButton.textContent = 'C';
    }
}

const roundResult = (resultString) => {
    return (resultString.toString().length > 15)
    ? (parseFloat(resultString.toString().substring(0, 15)))
    : resultString
}

buttons.addEventListener('click', event => {
    if(event.target.matches('button')){
        const button = event.target;
        const displayedNum = display.textContent;
        const buttonType = getType(button);
        const resultString = dis(button, displayedNum, calObject);
        
        display.textContent = roundResult(resultString);
        updateCalObject(button, calObject, displayedNum);
        updateVisualState(button, calculator);
        calObject.previous = buttonType;
        
        console.log(calObject);
    }
})
