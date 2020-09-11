import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import CardsListView from "../view/cards-list.js";
import EmptyListView from "../view/empty-list.js";
import LoadButtonView from "../view/load-button.js";
import CardPresenter from "../presenter/card.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import {SORT_TYPE, UPDATE_TYPE, USER_ACTION} from "../const.js";

const CARDS_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer, cardsModel) {
    this._boardContainer = boardContainer;
    this._cardsModel = cardsModel;

    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = null;
    this._cardsListComponent = new CardsListView();
    this._emptyListComponent = new EmptyListView();
    this._loadButtonComponent = null;
    this._cardPresenter = {};
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._cardsModel.addObserver(this._handleModelEvent);
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
    const cardPresenter = new CardPresenter(this._cardsListComponent, this._handleViewAction, this._handleModeChange);
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

    if (this._loadButtonComponent !== null) {
      this._loadButtonComponent = null;
    }

    this._loadButtonComponent = new LoadButtonView();

    this._loadButtonComponent.setClickHandler(() => {
      const newRenderedCardsCount = Math.min(cardsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
      const cards = this._getTasks().slice(this._renderedCardsCount, newRenderedCardsCount);

      this._renderCards(cards);
      this._renderedCardsCount = newRenderedCardsCount;

      if (this._renderedCardsCount >= cardsCount) {
        remove(this._loadButtonComponent);
      }
    });
    render(this._boardComponent, this._loadButtonComponent);
  }

  _renderBoard() {
    const cards = this._getTasks();
    const cardsCount = cards.length;

    if (cardsCount === 0) {
      this._renderEmptyList();
    } else {
      this._renderSort();

      this._renderCards(cards.slice(0, Math.min(cardsCount, this._renderedCardsCount)));

      if (cardsCount > this._renderedCardsCount) {
        this._renderLoadMoreButton();
      }
    }
  }

  _clearBoard() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
  }

  _clearStage({resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const cardsCount = this._getTasks().length;

    Object
      .values(this._cardPresenter)
      .forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};

    remove(this._sortComponent);
    remove(this._emptyListComponent);
    remove(this._loadButtonComponent);

    if (resetRenderedCardsCount) {
      this._renderedTaskCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(cardsCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case USER_ACTION.UPDATE_CARD:
        this._cardsModel.updateCard(updateType, update);
        break;
      case USER_ACTION.ADD_CARD:
        this._cardsModel.addCard(updateType, update);
        break;
      case USER_ACTION.DELETE_CARD:
        this._cardsModel.deleteCard(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._cardPresenter[data.id].init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this._clearStage();
        this._renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        this._clearStage({resetRenderedCardsCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _handleModeChange() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    render(this._boardComponent, this._sortComponent, RenderPosition.afterBegin);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, RenderPosition.afterBegin);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearStage({resetRenderedCardsCount: true});
    this._renderBoard();
  }
}
