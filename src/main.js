"use strict";

import {createMainMenuTemplate} from "./view/main-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createCardsListTemplate} from "./view/cards-list.js";
import {createEmptyListTemplate} from "./view/empty-list.js";
import {createSortTemplate} from "./view/sort.js";
import {createEditCardTemplate} from "./view/edit-card.js";
import {createCardTemplate} from "./view/card.js";
import {createLoadButtonTemplate} from "./view/load-button.js";
import {generateCard} from "./mock/card.js";
import {getRandomInteger} from "./utils.js";

const CARDS_NUMBER = getRandomInteger(0, 20);

const cards = new Array(CARDS_NUMBER).fill().map(generateCard);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createMainMenuTemplate(), `beforeend`);
render(siteHeaderElement, createFilterTemplate(), `afterend`);

render(siteMainElement, createBoardTemplate(), `beforeend`);

const siteBoardElement = siteMainElement.querySelector(`.board`);

if (CARDS_NUMBER > 0) {
  render(siteBoardElement, createCardsListTemplate(), `afterbegin`);
  render(siteBoardElement, createSortTemplate(), `afterbegin`);

  const siteTaskListElement = siteBoardElement.querySelector(`.board__tasks`);
  render(siteTaskListElement, createEditCardTemplate(cards[0]), `beforeend`);

  for (let i = 0; i < CARDS_NUMBER; i++) {
    render(siteTaskListElement, createCardTemplate(cards[i]), `beforeend`);
  }

  render(siteBoardElement, createLoadButtonTemplate(), `beforeend`);
} else {
  render(siteBoardElement, createEmptyListTemplate(), `beforeend`);
}
