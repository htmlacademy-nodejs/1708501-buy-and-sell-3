"use strict";

const chalk = require(`chalk`);
const express = require(`express`);

const apiRoutes = require(`../api`);

const {HttpCode, DEFAULT_PORT, API_PREFIX} = require(`../constants`);

const app = express();
app.use(express.json());

app.use(API_PREFIX, apiRoutes);

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`), err);
      }
      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  },
};
