"use strict";

import MainMenuView from "./view/main-menu.js";
import FilterView from "./view/filter.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";
import {render} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";

const CARDS_NUMBER = 17;

const cards = new Array(CARDS_NUMBER).fill().map(generateCard);
const filters = generateFilter(cards);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement);

render(siteHeaderElement, new MainMenuView());
render(siteMainElement, new FilterView(filters));

boardPresenter.init(cards);
