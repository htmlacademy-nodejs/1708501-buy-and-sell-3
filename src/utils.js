'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);


module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`); // Promise<string>
    return content.split(`\n`).filter((str) => !(!str || str.length === 0));
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};
