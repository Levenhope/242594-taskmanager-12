import CardView from "../view/card.js";
import EditCardView from "../view/edit-card.js";
import {render, replace, remove} from "../utils/render.js";

export default class CardPresenter {
    constructor(cardsListContainer, changeData) {
        this._cardsListContainer = cardsListContainer;
        this._changeData = changeData;

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

        this._cardComponent.setEditClickHandler(this._handleEditClick);
        this._editCardComponent.setFormSubmitHandler(this._handleFormSubmit);
        this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
        this._cardComponent.setArchiveClickHandler(this._handleArchiveClick);

        if (prevCardComponent === null || prevEditCardComponent === null) {
            render(this._cardsListContainer, this._cardComponent);
            return;
        }

        if (this._cardsListContainer.getElement().contains(prevCardComponent.getElement())) {
            replace(this._cardComponent, prevCardComponent);
        }

        if (this._cardsListContainer.getElement().contains(prevEditCardComponent.getElement())) {
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
            this._replaceFormToCard();
        }
    }

    _replaceFormToCard(){
        replace(this._cardComponent, this._editCardComponent);
        document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }

    _replaceCardToForm(){
        replace(this._editCardComponent, this._cardComponent);
        document.addEventListener(`keydown`, this._escKeyDownHandler);
    }

    _handleEditClick() {
        this._replaceCardToForm();
    }

    _handleFormSubmit(card) {
        this._changeData(card);
        this._replaceFormToCard();
    }

    _handleFavoriteClick() {
        this._changeData(
            Object.assign(
                {},
                this._card,
                {
                    isFavorite: !this._card.isFavorite
                }
            )
        );
    }

    _handleArchiveClick() {
        this._changeData(
            Object.assign(
                {},
                this._card,
                {
                    isArchive: !this._card.isArchive
                }
            )
        );
    }
}