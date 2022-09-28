const {
  Parser,
  Chrono,
  ParsedResult,
  options,
} = require('chrono-node');

const ukDateParserWithYear = new Parser();
const ukDateParserWithoutYear = new Parser();
const ukChrono = new Chrono(options.casualOption());

Object.assign(ukDateParserWithYear, {
  pattern() {
    return /(\d{1,2})(?:\/|-)(\d{1,2})(?:\/|-)(\d{2,4})/;
  },
  extract(text, ref, match) {
    const [
      ,
      day,
      month,
      year,
    ] = match;
    const { index } = match;
    return new ParsedResult({
      ref,
      text,
      index,
      start: { day, month, year },
    });
  },
});

Object.assign(ukDateParserWithoutYear, {
  pattern() {
    return /(\d{1,2})(?:\/|-)(\d{1,2})/;
  },
  extract(text, ref, match) {
    const [
      ,
      day,
      month,
    ] = match;
    const { index } = match;
    const year = new Date().toISOString().slice(0, 4);
    return new ParsedResult({
      ref,
      text,
      index,
      start: { day, month, year },
    });
  },
});

ukChrono.parsers.unshift(ukDateParserWithoutYear);
ukChrono.parsers.unshift(ukDateParserWithYear);

module.exports = {
  parseDateUK(...args) {
    return ukChrono.parseDate.call(ukChrono, ...args);
  },
};
