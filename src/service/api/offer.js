"use strict";

const {Router} = require(`express`);

const {HttpCode} = require(`../constants`);

const offerValidator = require(`../middlewares/offerValidator`);
const offerExist = require(`../middlewares/offerExist`);
const commentValidator = require(`../middlewares/commentValidator`);


module.exports = (app, offerService, commentService) => {
  const route = new Router();

  app.use(`/offers`, route);

  // GET /api/offers - возвращает список объявлений
  route.get(`/`, (req, res) => {
    const offers = offerService.findAll();

    if (!offers || offers.length === 0) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found any offers.`);
    }

    return res.status(HttpCode.OK).json(offers);
  });

  // GET /api/offers/:offerId — возвращает полную информацию определённого объявления
  route.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}.`);
    }

    return res.status(HttpCode.OK)
        .json(offer);
  });


  // POST /api/offers — создаёт новое объявление
  route.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(offer);
  });


  // PUT /api/offers/:offerId - редактирует определённое объявление
  route.put(`/:offerId`, offerExist(offerService), offerValidator, (req, res) => {
    const {offerId} = req.params;
    const updatedOffer = offerService.update(offerId, req.body);
    return res.status(HttpCode.OK).json(updatedOffer);
  });


  // DELETE /api/offers/:offerId - удаляет определённое объявление
  route.delete(`/:offerId`, offerExist(offerService), (req, res) => {
    const {offerId} = req.params;
    const deletedOffer = offerService.drop(offerId);

    if (!deletedOffer) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(deletedOffer);
  });

  // GET /api/offers/:offerId/comments — возвращает список комментариев определённого объявления
  route.get(`/:offerId/comments`, offerExist(offerService), (req, res) => {
    const {offerId} = req.params;
    const {offer} = res.locals;
    const comments = commentService.findAll(offer);

    if (!comments) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comments with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(comments);
  });

  // POST /api/offers/:offerId/comments — создаёт новый комментарий
  route.post(`/:offerId/comments`, offerExist(offerService), commentValidator, (req, res) => {
    const {offer} = res.locals;
    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  // DELETE /api/offers/:offerId/comments/:commentId — удаляет из определённой публикации комментарий с идентификатором
  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), (req, res) => {
    const {offer} = res.locals;
    const {commentId} = req.params;
    const deleted = commentService.drop(offer, commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment`);
    }

    return res.status(HttpCode.OK).json(deleted);
  });
};
