'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const items = await api.getOffers();
  res.render(`main`, {items});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search-result`, {
      results
    });
  } catch (error) {
    res.render(`search-result`, {
      results: []
    });
  }
});

module.exports = mainRouter;
