const validEnumPreferences = ["business","entertainment","general","health","science","sports","technology"];

function validatePreferences(array) {

    if (!Array.isArray(array)) {
        return false;
    }

    for (const str of array) {
        if(typeof str !== 'string' || !validEnumPreferences.includes(str)) {
            return false;
        }
    }
    return true;
}

module.exports= {validatePreferences};