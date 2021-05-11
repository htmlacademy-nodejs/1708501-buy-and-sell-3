"use strict";

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const {CategoryService} = require(`../data-service`);
const {HttpCode} = require(`../constants`);

const mockData = [
  {
    id: `adnS9W`,
    title: `Куплю породистого кота.`,
    picture: `item15.jpg`,
    description: `Это настоящая находка для коллекционера! При покупке с меня бесплатная доставка в черте города. Кажется, что это хрупкая вещь. Две страницы заляпаны свежим кофе.`,
    type: `offer`,
    sum: 35626,
    category: [`Животные`, `Посуда`],
    comments: [
      {
        id: `oy2U_8`,
        text: `Совсем немного... Продаю в связи с переездом. Отрываю от сердца. А сколько игр в комплекте?`,
      },
    ],
  },
  {
    id: `viqLJZ`,
    title: `Продам советскую посуду. Почти не разбита.`,
    picture: `item05.jpg`,
    description: `Продаю с болью в сердце... Если найдёте дешевле — сброшу цену. Кому нужен этот новый телефон, если тут такое... Бонусом отдам все аксессуары.`,
    type: `sale`,
    sum: 57962,
    category: [`Игры`, `Посуда`, `Разное`],
    comments: [
      {id: `umDQkP`, text: `С чем связана продажа? Почему так дешёво?`},
    ],
  },
];

const app = express();
app.use(express.json());
category(app, new CategoryService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () =>
    expect(response.body.length).toBe(4));

  test(`Category names are "Посуда", "Игры", "Животные", "Разное"`, () =>
    expect(response.body).toEqual(
        expect.arrayContaining([`Посуда`, `Игры`, `Животные`, `Разное`])
    ));
});
