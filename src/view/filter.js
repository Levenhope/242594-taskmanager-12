import AbstractView from "./abstract.js";

const createFilterItemTemplate = (filter, isChecked) => {
  const {title, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
      ${count === 0 ? `disabled` : ``}
    />
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__count">${count}</span>
    </label>`
  );
};

export default class FilterView extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return (
      `<section class="main__filter filter container">
        ${this._filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join(``)}
      </section>`
    );
  }
}
