"use strict";

import {createMainMenuTemplate} from "./view/main-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createEditCardTemplate} from "./view/edit-card.js";
import {createCardTemplate} from "./view/card.js";
import {createLoadButtonTemplate} from "./view/load-button.js";

const CARDS_NUMBER = 3;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createMainMenuTemplate(), `beforeend`);
render(siteHeaderElement, createFilterTemplate(), `afterend`);

render(siteMainElement, createBoardTemplate(), `beforeend`);

const siteBoardElement = siteMainElement.querySelector(`.board`);
const siteTaskListElement = siteBoardElement.querySelector(`.board__tasks`);

render(siteBoardElement, createSortTemplate(), `afterbegin`);

render(siteTaskListElement, createEditCardTemplate(), `beforeend`);

for (let i = 0; i < CARDS_NUMBER; i++) {
  render(siteTaskListElement, createCardTemplate(), `beforeend`);
}

render(siteBoardElement, createLoadButtonTemplate(), `beforeend`);
