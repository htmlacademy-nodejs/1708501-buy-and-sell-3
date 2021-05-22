'use strict';


const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {Router} = require(`express`);

const api = require(`../api`).getAPI();
const offersRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.post(`/add`,
    upload.single(`avatar`), // применяем middleware
    async (req, res) => {

      // в `body` содержатся текстовые данные формы
      // в `file` — данные о сохранённом файле
      const {body, file} = req;
      const offerData = {
        picture: file.filename,
        sum: body.price,
        type: body.action,
        description: body.comment,
        title: body[`ticket-name`],
        category: Array.isArray(body.category) ? body.category : [body.category],
      };

      try {
        await api.post(`/offers`, offerData);
        res.redirect(`/my`);
      } catch (e) {
        res.redirect(`back`);
      }
    }
);

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const item = await api.getOfferId(id);
  res.render(`offers/ticket`, {item});
});

module.exports = offersRouter;
