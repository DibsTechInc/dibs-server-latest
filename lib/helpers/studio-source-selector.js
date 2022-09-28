module.exports = function studioSourceSelector(studioSource = '') {
  let source;
  switch (studioSource.substr(0, 1)) {
    case 'z':
      source = 'zf';
      break;
    case 'p':
      source = 'pt';
      break;
    case 'b':
      source = 'brnd';
      break;
    default:
      source = 'mb';
  }

  const studioid = source === 'mb' ? studioSource : studioSource.substr(1);

  return { studioid, source };
};
