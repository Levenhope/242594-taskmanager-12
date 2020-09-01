import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import CardsListView from "../view/cards-list.js";
import EmptyListView from "../view/empty-list.js";
import {updateItem} from "../utils/common.js";
import LoadButtonView from "../view/load-button.js";
import CardPresenter from "../presenter/card.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const CARDS_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._cardsListComponent = new CardsListView();
    this._emptyListComponent = new EmptyListView();
    this._loadButtonComponent = new LoadButtonView();
    this._cardPresenter = {};

    this._handleCardChange = this._handleCardChange.bind(this);
  }
  init(boardCards) {
    this._boardCards = boardCards.slice();
    this._sourcedBoardCards = boardCards.slice();

    render(this._boardContainer, this._boardComponent);
    render(this._boardComponent, this._cardsListComponent);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.afterBegin);
  }

  _renderCard(card) {
    const cardPresenter = new CardPresenter(this._cardsListComponent, this._handleCardChange);
    cardPresenter.init(card);
    this._cardPresenter[card.id] = cardPresenter;
  }

  _renderCards(from, to) {
    this._boardCards.slice(from, to).forEach((boardCard) => this._renderCard(boardCard));
  }

  _renderEmptyList() {
    render(this._boardComponent, this._emptyListComponent);
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadButtonComponent);

    this._loadButtonComponent.setClickHandler(() => {
      this._renderCards(this._renderedCardsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
      this._renderedCardsCount += CARDS_COUNT_PER_STEP;

      if (this._renderedCardsCount >= this._boardCards.length) {
        remove(this._loadButtonComponent);
      }
    });
  }

  _renderBoard() {
    if (this._boardCards.every((card) => card.isArchive)) {
      this._renderEmptyList();
    } else {
      this._renderSort();
      this._renderCards(0, Math.min(this._boardCards.length, CARDS_COUNT_PER_STEP));

      if (this._boardCards.length > CARDS_COUNT_PER_STEP) {
        this._renderLoadMoreButton();
      }
    }
  }

  _clearBoard() {
    Object.values(this._cardPresenter).forEach((presenter) => presenter.destroy());
    this._cardPresenter = {};
  }

  _handleCardChange(updatedCard) {
    this._boardCards = updateItem(this._boardCards, updatedCard);
    this._sourcedBoardCards = updateItem(this._sourcedBoardCards, updatedCard);
    this._cardPresenter[updatedCard.id].init(updatedCard);
  }
}
