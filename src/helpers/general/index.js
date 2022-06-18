const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;

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
export function formatPhone(phone) {
    let labelphone;
    try {
        const number = phoneUtil.parseAndKeepRawInput(phone, 'US');
        labelphone = phoneUtil.format(number, PNF.NATIONAL);
    } catch (err) {
        labelphone = 'N/A';
    }
    return labelphone;
}
