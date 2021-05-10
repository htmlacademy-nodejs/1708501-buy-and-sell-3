"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../constants`);


module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  /*
  GET /api/search?query= — возвращает результаты поиска.
  Поиск объявлений выполняется по наименованию.
  Объявление соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.
 */
  route.get(`/`, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const offers = service.findAll(query);
    const httpStatus = offers.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;
    return res.status(httpStatus)
      .json(offers);
  });
};
