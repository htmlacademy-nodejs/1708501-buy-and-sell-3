'use strict';


const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const offersRouter = new Router();

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

module.exports = offersRouter;
