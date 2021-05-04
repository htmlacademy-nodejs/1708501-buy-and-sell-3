"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  /*
  GET /api/search?query= — возвращает результаты поиска.
  Поиск объявлений выполняется по наименованию.
  Объявление соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.
 */
  route.get(`/`, (req, res) => {
    const {query} = req.query;
    const offers = service.findAll(query);

    const httpStatus = offers.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;
    res.status(httpStatus)
      .json(offers);
  });
};
