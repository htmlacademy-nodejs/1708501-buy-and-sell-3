"use strict";

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const {SearchService} = require(`../data-service`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    id: `fkdM0g`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item13.jpg`,
    description: `Не пытайтесь торговаться. Цену вещам я знаю. Кажется, что это хрупкая вещь. Даю недельную гарантию. Если товар не понравится — верну всё до последней копейки.`,
    type: `sale`,
    sum: 66509,
    category: [`Посуда`],
    comments: [
      {
        id: `2X91Le`,
        text: `Совсем немного... А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`,
      },
    ],
  },
  {
    id: `kw7Ssk`,
    title: `Продам отличную подборку фильмов на VHS.`,
    picture: `item14.jpg`,
    description: `Кажется, что это хрупкая вещь. Кому нужен этот новый телефон, если тут такое... Не пытайтесь торговаться. Цену вещам я знаю. Если найдёте дешевле — сброшу цену.`,
    type: `offer`,
    sum: 1942,
    category: [`Игры`, `Разное`],
    comments: [
      {id: `tne81h`, text: `А сколько игр в комплекте? Неплохо, но дорого.`},
      {
        id: `DNNv1w`,
        text: `Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Вы что?! В магазине дешевле.`,
      },
    ],
  },
];

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам отличную подборку фильмов на VHS.`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`2 offers found`, () => expect(response.body.length).toBe(2));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`fkdM0g`));
});

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      })
      .expect(HttpCode.NOT_FOUND)
);

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST)
);
