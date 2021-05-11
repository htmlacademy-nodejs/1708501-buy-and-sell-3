"use strict";

const express = require(`express`);
const request = require(`supertest`);

const offer = require(`./offer`);
const OfferService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    id: `ZpSDNG`,
    title: `Куплю Xbox Series X.`,
    picture: `item02.jpg`,
    description: `Кому нужен этот новый телефон, если тут такое... Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю. Это настоящая находка для коллекционера!`,
    type: `sale`,
    sum: 17636,
    category: [`Разное`, `Техника`, `Животные`, `Книги`, `Игры`],
    comments: [
      {id: `s5yeQB`, text: `Совсем немного...`},
      {id: `s5ye45`, text: `Совсем...`},
    ],
  },
  {
    id: `QsiqjS`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item04.jpg`,
    description: `Мой дед не мог её сломать. Таких предложений больше нет! Пользовались бережно и только по большим праздникам. При покупке с меня бесплатная доставка в черте города.`,
    type: `sale`,
    sum: 22175,
    category: [`Техника`, `Посуда`, `Игры`, `Автомобили`, `Журналы`, `Книги`],
    comments: [
      {
        id: `7-tael`,
        text: `С чем связана продажа? Почему так дешёво? А где блок питания? Неплохо, но дорого.`,
      },
    ],
  },
  {
    id: `bT6fHd`,
    title: `Куплю Xbox Series S.`,
    picture: `item06.jpg`,
    description: `Пользовались бережно и только по большим праздникам. Две страницы заляпаны свежим кофе. Продаю с болью в сердце... Товар в отличном состоянии.`,
    type: `sale`,
    sum: 39622,
    category: [`Разное`],
    comments: [
      {
        id: `JEeTWX`,
        text: `А сколько игр в комплекте? С чем связана продажа? Почему так дешёво?`,
      },
    ],
  },
];

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const cloneData = JSON.parse(JSON.stringify(mockData));
  offer(app, new OfferService(cloneData), new CommentService());

  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 3 offers`, () =>
    expect(response.body.length).toBe(3));
  test(`First offer's id equals "ZpSDNG"`, () =>
    expect(response.body[0].id).toBe(`ZpSDNG`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/ZpSDNG`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Куплю Xbox Series X."`, () =>
    expect(response.body.title).toBe(`Куплю Xbox Series X.`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offers count is changed`, async () =>
    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/ZpSDNG`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () =>
    expect(response.body).toEqual(expect.objectContaining(newOffer)));
  test(`Offer is really changed`, async () =>
    await request(app)
      .get(`/offers/ZpSDNG`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`)));
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const app = createAPI();
  const validOffer = {
    title: `Куплю Xbox Series X.`,
    picture: `item02.jpg`,
    description: `Кому нужен этот новый телефон, если тут такое... Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю. Это настоящая находка для коллекционера!`,
    type: `sale`,
    sum: 17636,
    category: [`Разное`],
  };

  await request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const app = createAPI();

  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`,
  };

  await request(app)
    .put(`/offers/ZpSDNG`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/bT6fHd`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`bT6fHd`));
  test(`Offers count is 2 now`, async () => {
    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = createAPI();
  await request(app).delete(`/offers/NOEXST`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/ZpSDNG/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () =>
    expect(response.body.length).toBe(2));
  test(`First comment id is "s5yeQB"`, () =>
    expect(response.body[0].id).toBe(`s5yeQB`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидный коммент`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers/ZpSDNG/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () =>
    expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, async () =>
    await request(app)
      .get(`/offers/ZpSDNG/comments`)
      .expect((res) => expect(res.body.length).toBe(3)));
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = createAPI();
  await request(app)
    .post(`/offers/NOEXST/comments`)
    .send({
      text: `Текст комментария`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {};

  const app = createAPI();
  await request(app)
    .post(`/offers/ZpSDNG/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/ZpSDNG/comments/s5ye45`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted comment`, () =>
    expect(response.body.id).toBe(`s5ye45`));

  test(`Comments count decreased by 1`, async () =>
    await request(app)
      .get(`/offers/ZpSDNG/comments`)
      .expect((res) => expect(res.body.length).toBe(1)));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = createAPI();
  await request(app)
    .delete(`/offers/ZpSDNG/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = createAPI();
  await request(app)
    .delete(`/offers/NOEXST/comments/s5ye45`)
    .expect(HttpCode.NOT_FOUND);
});
