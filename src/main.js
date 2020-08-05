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
import {generateFilter} from "./mock/filter.js";

const CARDS_NUMBER = getRandomInteger(0, 20);
const CARDS_COUNT_PER_STEP = 8;

const cards = new Array(CARDS_NUMBER).fill().map(generateCard);
const filters = generateFilter(cards);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createMainMenuTemplate(), `beforeend`);
render(siteHeaderElement, createFilterTemplate(filters), `afterend`);

render(siteMainElement, createBoardTemplate(), `beforeend`);

const siteBoardElement = siteMainElement.querySelector(`.board`);

if (CARDS_NUMBER > 0) {
  render(siteBoardElement, createCardsListTemplate(), `afterbegin`);
  render(siteBoardElement, createSortTemplate(), `afterbegin`);

  const siteTaskListElement = siteBoardElement.querySelector(`.board__tasks`);
  render(siteTaskListElement, createEditCardTemplate(cards[0]), `beforeend`);

  for (let i = 1; i < Math.min(cards.length, CARDS_COUNT_PER_STEP); i++) {
    render(siteTaskListElement, createCardTemplate(cards[i]), `beforeend`);
  }
  if (cards.length > CARDS_COUNT_PER_STEP) {
    let renderedCardsCount = CARDS_COUNT_PER_STEP;

    render(siteBoardElement, createLoadButtonTemplate(), `beforeend`);

    const loadButton = siteBoardElement.querySelector(`.load-more`);

    loadButton.addEventListener(`click`, (e) => {
      e.preventDefault();
      cards
        .slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP)
        .forEach((card) => render(siteTaskListElement, createCardTemplate(card), `beforeend`));

      renderedCardsCount += CARDS_COUNT_PER_STEP;

      if (renderedCardsCount >= cards.length) {
        loadButton.remove();
      }
    });
  }
} else {
  render(siteBoardElement, createEmptyListTemplate(), `beforeend`);
}
