import {humanizeTaskDueDate, isTaskRepeating} from "../utils.js";

export const createEditCardTemplate = (card) => {
  const {color, description, dueDate, repeatingDays} = card;

  const date = dueDate !== null
    ? humanizeTaskDueDate(dueDate)
    : ``;

  const isDateExist = dueDate !== null
    ? `YES`
    : `NO`;

  const isRepeatingDaysExist = isTaskRepeating(repeatingDays)
    ? `YES`
    : `NO`;

  return (
    `<article class="card card--edit card--${color}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateExist}</span>
                </button>
                
                <fieldset class="card__date-deadline" ${dueDate !== null ? `` : `style="display: none"`}>
                  <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder=""
                    name="date"
                    value="${date}"
                  />
                  </label>
                  </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingDaysExist}</span>
                </button>
                
                <fieldset class="card__repeat-days" ${isTaskRepeating(repeatingDays) ? `` : `style="display: none"`}>
                  <div class="card__repeat-days-inner">
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-mo-4"
                      name="repeat"
                      value="mo"
                      ${repeatingDays.mo ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-mo-4">mo</label>
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-tu-4"
                      name="repeat"
                      value="tu"
                      ${repeatingDays.tu ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-tu-4">tu</label>
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-we-4"
                      name="repeat"
                      value="we"
                      ${repeatingDays.we ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-we-4">we</label>
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-th-4"
                      name="repeat"
                      value="th"
                      ${repeatingDays.th ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-th-4">th</label>
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-fr-4"
                      name="repeat"
                      value="fr"
                      ${repeatingDays.fr ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-fr-4">fr</label>
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-sa-4"
                      name="repeat"
                      value="sa"
                      ${repeatingDays.sa ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-sa-4">sa</label>
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-su-4"
                      name="repeat"
                      value="su"
                      ${ repeatingDays.su ? `checked`: ``}
                    />
                    <label class="card__repeat-day" for="repeat-su-4">su</label>
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-4"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                  ${color === `black` ? `checked` : ``}
                />
                <label for="color-black-4" class="card__color card__color--black">black</label>
                <input
                  type="radio"
                  id="color-yellow-4"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                  ${color === `yellow` ? `checked` : ``}
                />
                <label for="color-yellow-4" class="card__color card__color--yellow">yellow</label>
                <input
                  type="radio"
                  id="color-blue-4"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                  ${color === `blue` ? `checked` : ``}
                />
                <label for="color-blue-4" class="card__color card__color--blue">blue</label>
                <input
                  type="radio"
                  id="color-green-4"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                  ${color === `green` ? `checked` : ``}
                />
                <label for="color-green-4" class="card__color card__color--green">green</label>
                <input
                  type="radio"
                  id="color-pink-4"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                  ${color === `pink` ? `checked` : ``}
                />
                <label for="color-pink-4" class="card__color card__color--pink">pink</label>
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};
