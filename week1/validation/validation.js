// step 1: create two functions to convert and validate
// step 2: apply these functions
// step 3: show isValid
// step 4: generic implementation with a Validator and a Converter, holding a list of validations and a list of converter and elements where to apply

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
        isValid = [false, 'min length must be ' + typeLength[inputType][0] + ' for type ' + inputType]
        return isValid;
    }

    if (input.length >= typeLength[inputType][1]) {
        isValid = [false, 'max length is ' + typeLength[inputType][1] + ' for type ' + inputType]
    }
    return isValid
};
