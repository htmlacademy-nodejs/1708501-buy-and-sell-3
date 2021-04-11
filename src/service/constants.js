'use strict';

const path = require(`path`);

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const MOCKS_FILE_NAME = path.join(__dirname, `../../`, `mocks.json`);

const ExitCode = {
  success: 0,
  uncaughtFatalException: 1,
  invalidArgument: 9,
};

const DEFAULT_PORT = 3000;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT,
  MOCKS_FILE_NAME,
  ExitCode,
  HttpCode
};
