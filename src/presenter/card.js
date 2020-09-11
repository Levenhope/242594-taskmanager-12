import CardView from "../view/card.js";
import EditCardView from "../view/edit-card.js";
import {render, replace, remove} from "../utils/render.js";
import {CARD_MODE, USER_ACTION, UPDATE_TYPE} from "../const.js";

export default class CardPresenter {
  constructor(cardsListContainer, changeData, changeMode) {
    this._cardsListContainer = cardsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._editCardComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
  }

  init(card) {
    this._card = card;

    const prevCardComponent = this._cardComponent;
    const prevEditCardComponent = this._editCardComponent;

    this._cardComponent = new CardView(this._card);
    this._editCardComponent = new EditCardView(this._card);
    this._mode = CARD_MODE.DEFAULT;

    this._cardComponent.setEditClickHandler(this._handleEditClick);
    this._editCardComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setArchiveClickHandler(this._handleArchiveClick);

    if (prevCardComponent === null || prevEditCardComponent === null) {
      render(this._cardsListContainer, this._cardComponent);
      return;
    }

    if (this._mode === CARD_MODE.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === CARD_MODE.EDIT) {
      replace(this._editCardComponent, prevEditCardComponent);
    }

    remove(prevCardComponent);
    remove(prevEditCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._editCardComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editCardComponent.reset(this._card);
      this._replaceFormToCard();
    }
  }

  _replaceFormToCard() {
    replace(this._cardComponent, this._editCardComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = CARD_MODE.DEFAULT;
  }

  _replaceCardToForm() {
    replace(this._editCardComponent, this._cardComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = CARD_MODE.EDIT;
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit(card) {
    this._changeData(
      USER_ACTION.UPDATE_TASK,
      UPDATE_TYPE.MINOR,
      card
    );
    this._replaceFormToCard();
  }

  _handleFavoriteClick() {
    this._changeData(
      USER_ACTION.UPDATE_TASK,
      UPDATE_TYPE.MINOR,
      Object.assign({}, this._card, {isFavorite: !this._card.isFavorite})
    );
  }

  _handleArchiveClick() {
    this._changeData(
      USER_ACTION.UPDATE_TASK,
      UPDATE_TYPE.MINOR,
      Object.assign({}, this._card, {isArchive: !this._card.isArchive})
    );
  }

  resetView() {
    if (this._mode !== CARD_MODE.DEFAULT) {
      this._replaceFormToCard();
    }
  }
}
