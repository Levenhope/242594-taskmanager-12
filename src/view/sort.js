import AbstractView from "./abstract.js";
import {SORT_TYPE} from "../const.js";

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return (
      `<div class="board__filter-list">
        <a href="#" class="board__filter" ${this._currentSortType === SORT_TYPE.DEFAULT ? `board__filter--active` : ``} data-sort-type="${SORT_TYPE.DEFAULT}">SORT BY DEFAULT</a>
        <a href="#" class="board__filter" ${this._currentSortType === SORT_TYPE.DATE_UP ? `board__filter--active` : ``} data-sort-type="${SORT_TYPE.DATE_UP}">SORT BY DATE up</a>
        <a href="#" class="board__filter" ${this._currentSortType === SORT_TYPE.DATE_DOWN ? `board__filter--active` : ``} data-sort-type="${SORT_TYPE.DATE_DOWN}">SORT BY DATE down</a>
      </div>`
    );
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
