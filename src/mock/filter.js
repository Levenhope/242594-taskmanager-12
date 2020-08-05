import {isTaskExpired, isTaskRepeating, isTaskExpiringToday} from "../utils.js";

const taskToFilterMap = {
  all: (cards) => cards.filter((card) => !card.isArchive).length,
  overdue: (cards) => cards
    .filter((card) => !card.isArchive)
    .filter((card) => isTaskExpired(card.dueDate)).length,
  today: (cards) => cards
    .filter((card) => !card.isArchive)
    .filter((card) => isTaskExpiringToday(card.dueDate)).length,
  favorites: (cards) => cards
    .filter((card) => !card.isArchive)
    .filter((card) => card.isFavorite).length,
  repeating: (cards) => cards
    .filter((card) => !card.isArchive)
    .filter((card) => isTaskRepeating(card.repeatingDays)).length,
  archive: (cards) => cards.filter((card) => card.isArchive).length,
};

export const generateFilter = (cards) => {
  return Object.entries(taskToFilterMap).map(([filterTitle, countTasks]) => {
    return {
      title: filterTitle,
      count: countTasks(cards),
    };
  });
};
