'use strict';


const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();


myRouter.get(`/`, async (req, res) => {
  const items = await api.getOffers();
  res.render(`my-tickets`, {items});
});

myRouter.get(`/comments`, async (req, res) => {
  const items = await api.getOffers();
  res.render(`comments`, {items: items.slice(0, 3)});
});
module.exports = myRouter;
