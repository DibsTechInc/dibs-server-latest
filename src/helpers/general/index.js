const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function allLowerCase(str) {
    return str.toLowerCase();
}
export function validatePhone(phone) {
    const numbertotest = phone.replace(/\D/g, '');
    let validphone = true;
    try {
        const rawNumber = phoneUtil.parseAndKeepRawInput(numbertotest, 'US');
        validphone = phoneUtil.isValidNumber(rawNumber);
    } catch (err) {
        return false;
    }
    if (!validphone) {
        return false;
    }
    return true;
}
