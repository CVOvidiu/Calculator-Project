const outputElem = document.querySelector('.calc__output');
let output = '0';

function commaFormat(number) {
    let intNumber = Math.trunc(Number(number));
    //TODO: decimal part
    
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

    return format;
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

    console.log(e.target, pressed, output);
});