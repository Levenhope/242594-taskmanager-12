"use strict";

import MainMenuView from "./view/main-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import CardsListView from "./view/cards-list.js";
import EmptyListView from "./view/empty-list.js";
import SortView from "./view/sort.js";
import EditCardView from "./view/edit-card.js";
import CardView from "./view/card.js";
import LoadButtonView from "./view/load-button.js";
import {generateCard} from "./mock/card.js";
import {generateFilter} from "./mock/filter.js";
import {renderElement, RenderPosition} from "./utils.js";

const CARDS_NUMBER = 17;
const CARDS_COUNT_PER_STEP = 8;

const cards = new Array(CARDS_NUMBER).fill().map(generateCard);
const filters = generateFilter(cards);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderCard = (siteTaskListElement, card) => {
  const cardComponent = new CardView(card);
  const editCardComponent = new EditCardView(card);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceCardToForm = () => {
    siteTaskListElement.replaceChild(editCardComponent.getElement(), cardComponent.getElement());
  };

  const replaceFormToCard = () => {
    siteTaskListElement.replaceChild(cardComponent.getElement(), editCardComponent.getElement());
  };

  cardComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  editCardComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  renderElement(siteTaskListElement, cardComponent.getElement());
};

renderElement(siteHeaderElement, new MainMenuView().getElement());
renderElement(siteMainElement, new FilterView(filters).getElement());

renderElement(siteMainElement, new BoardView().getElement());

const siteBoardElement = siteMainElement.querySelector(`.board`);

if (cards.every((card) => card.isArchive)) {
  renderElement(siteBoardElement, new EmptyListView().getElement());
} else {
  renderElement(siteBoardElement, new CardsListView().getElement(), RenderPosition.afterBegin);
  renderElement(siteBoardElement, new SortView().getElement(), RenderPosition.afterBegin);

  const siteTaskListElement = siteBoardElement.querySelector(`.board__tasks`);

  for (let i = 1; i < Math.min(cards.length, CARDS_COUNT_PER_STEP); i++) {
    renderCard(siteTaskListElement, cards[i]);
  }
  if (cards.length > CARDS_COUNT_PER_STEP) {
    let renderedCardsCount = CARDS_COUNT_PER_STEP;

    renderElement(siteBoardElement, new LoadButtonView().getElement());

    const loadButton = siteBoardElement.querySelector(`.load-more`);

    loadButton.addEventListener(`click`, (e) => {
      e.preventDefault();
      cards
        .slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP)
        .forEach((card) => renderElement(siteTaskListElement, new CardView(card).getElement()));

      renderedCardsCount += CARDS_COUNT_PER_STEP;

      if (renderedCardsCount >= cards.length) {
        loadButton.remove();
      }
    });
  }
}
