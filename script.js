const outputElem = document.querySelector('.calc__output');
const historyElem = document.querySelector('.calc__history')
let output = '0';
let reminder = 0;

function commaFormat(number) {
    // Split the number into integer part and decimal part
    let [intNumber, decNumber] = number.split('.');
    intNumber = Number(intNumber);
    // We take the last three digits from 'intNumber'
    let format = String(intNumber).slice(-3);
    intNumber = Math.trunc(intNumber / 1000);

    // What remains of 'intNumber' but still can be formated
    while(intNumber > 999) {
        format = `${String(intNumber).slice(-3)},${format}`;
        intNumber = Math.trunc(intNumber / 1000);
    }

    // What remains of 'intNumber'
    if(intNumber) format = `${String(intNumber).slice(-3)},${format}`;

    if(decNumber === '')
        return `${format}.`;
    else if(decNumber === undefined)
        return format;
    else 
        return `${format}.${decNumber}`; 
}

document.querySelector('.calc__btns').addEventListener('click', e => {
    if(e.target.classList.contains('calc__btns')) return;
    
    const pressed = e.target.innerHTML;

    // Number button
    if(e.target.classList.contains('btn--num')) {
        if(output === '0') output = pressed;
        else output += `${pressed}`;

        outputElem.innerHTML = commaFormat(output);
    }

    // Delete button
    if(e.target.innerHTML === 'del') {
        if(output.length === 1) output = '0';
        else output = output.slice(0, output.length - 1);

        outputElem.innerHTML = commaFormat(output);
    }

    // Dot button
    if(e.target.innerHTML === '.') {
        output += '.';
        outputElem.innerHTML = commaFormat(output);
    }

    // +
    if(e.target.innerHTML === '+') {
        reminder = Number(output);
        output += ' +';
        historyElem.innerHTML = output;
        output = '0';
    }

    // =
    if(e.target.innerHTML === '=') {
        historyElem.innerHTML += ` ${output}`;
        output = String(eval(historyElem.innerHTML));
        outputElem.innerHTML = commaFormat(String(eval(historyElem.innerHTML)));
    }

    console.log(e.target, pressed, output);
});