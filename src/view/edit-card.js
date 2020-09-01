import {humanizeTaskDueDate, isTaskRepeating} from "../utils/task.js";
import SmartView from "./smart.js";
import {BLANK_CARD, COLORS} from "../const.js";

export default class EditCardView extends SmartView {
  constructor(card = BLANK_CARD) {
    super();
    this._data = EditCardView.parseCardToData(card);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);
    this._descriptionInputHandler = this._descriptionInputHandler.bind(this);
    this._repeatingChangeHandler = this._repeatingChangeHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    const {color, description, dueDate, repeatingDays, isDueDate, isRepeating} = this._data;
    const isSubmitDisabled = isRepeating && !isTaskRepeating(repeatingDays);

    return (
      `<article class="card card--edit card--${color} ${isRepeating ? `card--repeat` : ``}">
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
                  date: <span class="card__date-status">${isDueDate ? `YES` : `NO`}</span>
                </button>
                
                <fieldset class="card__date-deadline" ${isDueDate ? `` : `style="display: none"`}>
                  <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder=""
                    name="date"
                    value="${dueDate !== null ? humanizeTaskDueDate(dueDate) : ``}"
                  />
                  </label>
                  </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeating ? `YES` : `NO`}</span>
                </button>
                
                <fieldset class="card__repeat-days" ${isRepeating ? `` : `style="display: none"`}>
                  <div class="card__repeat-days-inner">
                    ${Object.entries(repeatingDays).map(([day, repeat]) => `
                      <input
                        class="visually-hidden card__repeat-day-input"
                        type="checkbox"
                        id="repeat-${day}"
                        name="repeat"
                        value="${day}"
                        ${repeat ? `checked` : ``}
                      />
                      <label class="card__repeat-day" for="repeat-${day}">${day}</label>
                    `).join(``)}
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${COLORS.map((colorItem) => `
                  <input
                    type="radio"
                    id="color-${colorItem}"
                    class="card__color-input card__color-input--${colorItem} visually-hidden"
                    name="color"
                    value="${colorItem}"
                    ${color === colorItem ? `checked` : ``}
                  />
                  <label for="color-${colorItem}" class="card__color card__color--${colorItem}">${colorItem}</label>
                `).join(``)}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSubmitDisabled ? `disabled` : ``}>save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>`
    );
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditCardView.parseDataToCard(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          isDueDate: card.dueDate !== null,
          isRepeating: isTaskRepeating(card.repeatingDays)
        }
    );
  }

  static parseDataToCard(data) {
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeatingDays = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }

  _dueDateToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
      isRepeating: !this._data.isDueDate && false
    });
  }

  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
      isDueDate: !this._data.isRepeating && false
    });
  }

  _descriptionInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value
    }, true);
  }

  _repeatingChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      repeating: Object.assign(
          {},
          this._data.repeating,
          {[evt.target.value]: evt.target.checked}
      )
    });
  }

  _colorChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      color: evt.target.value
    });
  }

  _setInnerHandlers() {
    this.getElement()
        .querySelector(`.card__date-deadline-toggle`)
        .addEventListener(`click`, this._dueDateToggleHandler);
    this.getElement()
        .querySelector(`.card__repeat-toggle`)
        .addEventListener(`click`, this._repeatingToggleHandler);
    this.getElement()
        .querySelector(`.card__text`)
        .addEventListener(`input`, this._descriptionInputHandler);
    if (this._data.isRepeating) {
      this.getElement()
          .querySelector(`.card__repeat-days-inner`)
          .addEventListener(`change`, this._repeatingChangeHandler);
    }
    this.getElement()
        .querySelector(`.card__colors-wrap`)
        .addEventListener(`change`, this._colorChangeHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  reset(card) {
    this.updateData(
        EditCardView.parseCardToData(card)
    );
  }
}
