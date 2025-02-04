const fs = require('fs');
const path = require('path');

const prefixNumRegex = /^\d+/;

const getPrefixNum = (file = '') => {
  const prefixNumMatch = file.match(prefixNumRegex);

  return (prefixNumMatch && prefixNumMatch[0]) || '';
};

const isPrefixed = (file = '', separator = '') => {
  const prefixNum = getPrefixNum(file);

  if (!prefixNum) {
    return false;
  }

  const prefixNumLength = prefixNum.length;
  const unprefixedFile = file.slice(prefixNumLength);

  return unprefixedFile.startsWith(separator);
};

const getFiles = (files = [], extension = '') => {
  return files
    .filter((entry) => {
      if (!entry || !entry.isFile()) {
        return false;
      }

      return !extension || entry.name.endsWith(extension);
    })
    .map((entry) => entry.name);
};

const renameFile = (dir, file, separator, number, options = {}) => {
  const { forceShuffle, dryRun, debug, cleanName } = options;

  const existingPrefix = isPrefixed(file, separator)
    ? getPrefixNum(file) + separator
    : '';

  let fileName = forceShuffle
    ? file
    : file.slice(existingPrefix.length);
  
  if(cleanName){
    const extenstionIndex = fileName.lastIndexOf(".")
    if(extenstionIndex != -1){
      fileName = fileName.substring(extenstionIndex)
    }
  }

  if (existingPrefix && debug) {
    console.log(file, '- stripped to:', fileName);
  }

  const origPath = path.join(dir, file);
  const newPath = path.join(dir, `${number}${separator}${fileName}`)

  if (debug || dryRun) {
    console.log('Renaming', origPath, 'to', newPath);
  }

  if (dryRun) {
    return;
  }

  return fs.renameSync(origPath, newPath);
};

module.exports = { getPrefixNum, isPrefixed, getFiles, renameFile };
