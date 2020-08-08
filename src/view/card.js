import {humanizeTaskDueDate, isTaskExpired, isTaskRepeating} from "../utils.js";

export const createCardTemplate = (card) => {
  const {color, description, dueDate, repeatingDays, isFavorite, isArchive} = card;

  return (
    `<article class="card card--${color}
              ${isTaskExpired(dueDate) ? `card--deadline` : ``}
              ${isTaskRepeating(repeatingDays) ? `card--repeat` : ``}
     ">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${isArchive ? `card__btn--disabled` : ``}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${isFavorite ? `card__btn--disabled` : ``}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${dueDate !== null ? humanizeTaskDueDate(dueDate) : ``}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};
