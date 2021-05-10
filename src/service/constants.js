'use strict';

const path = require(`path`);

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;

const MOCKS_FILE_NAME = path.join(__dirname, `../../`, `mocks.json`);
const FILE_SENTENCES_PATH = path.join(__dirname, `../../`, `data`, `sentences.txt`);
const FILE_TITLES_PATH = path.join(__dirname, `../../`, `data`, `titles.txt`);
const FILE_CATEGORIES_PATH = path.join(__dirname, `../../`, `data`, `categories.txt`);
const FILE_COMMENTS_PATH = path.join(__dirname, `../../`, `data`, `comments.txt`);

const MAX_ID_LENGTH = 6;

const ExitCode = {
  success: 0,
  uncaughtFatalException: 1,
  invalidArgument: 9,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT,
  API_PREFIX,
  MOCKS_FILE_NAME,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  MAX_ID_LENGTH,
  ExitCode,
  HttpCode,
  Env
};
