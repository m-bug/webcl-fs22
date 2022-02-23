// convert
const convert = value => {
    return value.toUpperCase();
};

// validate
const validate = (inputType, input) => {
    let isValid = [true, 'OK']
    const typeLength = []
    typeLength['text'] = [3, 20]
    typeLength['mail'] = [5, 25]

    if (input.length < typeLength[inputType][0]) {
        isValid = [false, 'Es sind mindestens ' + typeLength[inputType][0] + ' Zeichen für Typ "' + inputType + '" nötig.']
    } else if (input.length >= typeLength[inputType][1]) {
        isValid = [false, 'Es sind maximal ' + typeLength[inputType][1] + ' Zeichen für Typ "' + inputType + '" möglich.']
    }

    return isValid;
};
