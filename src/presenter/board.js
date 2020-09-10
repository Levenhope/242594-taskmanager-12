import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import CardsListView from "../view/cards-list.js";
import EmptyListView from "../view/empty-list.js";
import {updateItem} from "../utils/common.js";
import LoadButtonView from "../view/load-button.js";
import CardPresenter from "../presenter/card.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SORT_TYPE} from "../const.js";

const CARDS_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer, cardsModel) {
    this._boardContainer = boardContainer;
    this._cardsModel = cardsModel;

    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._cardsListComponent = new CardsListView();
    this._emptyListComponent = new EmptyListView();
    this._loadButtonComponent = new LoadButtonView();
    this._cardPresenter = {};
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._cardsListComponent);

    this._renderBoard();
  }

  _getTasks() {
    switch (this._currentSortType) {
      case SORT_TYPE.DATE_UP:
        return this._cardsModel.getCards().slice().sort(sortTaskUp);
      case SORT_TYPE.DATE_DOWN:
        return this._cardsModel.getCards().slice().sort(sortTaskDown);
    }

    return this._cardsModel.getCards();
  }

  _renderCard(card) {
    const cardPresenter = new CardPresenter(this._cardsListComponent, this._handleCardChange, this._handleModeChange);
    cardPresenter.init(card);
    this._cardPresenter[card.id] = cardPresenter;
  }

  _renderCards(cards) {
    cards.forEach((card) => this._renderCard(card));
  }

  _renderEmptyList() {
    render(this._boardComponent, this._emptyListComponent);
  }

  _renderLoadMoreButton() {
    const cardsCount = this._getTasks().length;

    render(this._boardComponent, this._loadButtonComponent);

    this._loadButtonComponent.setClickHandler(() => {
      const newRenderedCardsCount = Math.min(cardsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
      const cards = this._getTasks().slice(this._renderedCardsCount, newRenderedCardsCount);

      this._renderCards(cards);
      this._renderedCardsCount = newRenderedCardsCount;

      if (this._renderedCardsCount >= cardsCount) {
        remove(this._loadButtonComponent);
      }
    });
  }

  _renderBoard() {
    const cardsCount = this._getTasks().length;
    const cards = this._getTasks().slice(0, Math.min(cardsCount, CARDS_COUNT_PER_STEP));

    if (this._getTasks().every((card) => card.isArchive)) {
      this._renderEmptyList();
    } else {
      this._renderSort();
      this._renderCards(cards);

      if (cardsCount > CARDS_COUNT_PER_STEP) {
        this._renderLoadMoreButton();
      }
    }
  }

  _clearBoard() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
  }

  _handleCardChange(updatedCard) {
    this._cardPresenter[updatedCard.id].init(updatedCard);
  }

  _handleModeChange() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.afterBegin);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }
}
