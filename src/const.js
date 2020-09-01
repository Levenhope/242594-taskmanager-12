export const CARD_MODS = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const COLORS = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

export const DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

export const MAX_DAYS_GAP = 7;


export const BLANK_CARD = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};
