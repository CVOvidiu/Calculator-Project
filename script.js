const outputElem = document.querySelector('.calc__output');
let output = '0';

document.querySelector('.calc__btns').addEventListener('click', e => {
    const pressed = e.target.innerHTML;

    // Number button
    if(e.target.classList.contains('btn')) {
        if(output === '0')
            output = pressed;
        else {
            //TODO: Comma format
            output += `${pressed}`;
        }

        outputElem.innerHTML = output;
    }

    // Delete button
    if(e.target.classList.contains('btn--fct')) {
        if(output.length > 1) output = output.slice(-output.length+1);
        else if(output != '0') output = '0';

        outputElem.innerHTML = output;
    }

    console.log(e.target, pressed, output);
});