import {humanizeTaskDueDate, isTaskExpired, isTaskRepeating} from "../utils.js";

export const createCardTemplate = (card) => {
  const {color, description, dueDate, repeatingDays, isFavorite, isArchive} = card;

  const date = dueDate !== null
    ? humanizeTaskDueDate(dueDate)
    : ``;

  const deadlineClassName = isTaskExpired(dueDate)
    ? `card--deadline`
    : ``;

  const repeatClassName = isTaskRepeating(repeatingDays)
    ? `card--repeat`
    : ``;

  const archiveButtonState = isArchive
    ? `card__btn--disabled`
    : ``;

  const favoriteButtonState = isFavorite
    ? `card__btn--disabled`
    : ``;

  return (
    `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${archiveButtonState}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${favoriteButtonState}"
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
                    <span class="card__date">${date}</span>
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
