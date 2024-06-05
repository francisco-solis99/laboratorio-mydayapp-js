// Functions to get data or modified
export const sayHello = (text) => {
  return text;
};

// get the tasks from lcoal storage
export const getTasksFromLocalStorage = ({ itemName }) => {
  const item = window.localStorage.getItem(itemName);
  if (!item) return { item: [] };

  const itemJson = JSON.parse(item);
  return { item: itemJson };
};

// Add a new task
export const saveTasksForLocalStorage = ({ tasks, itemName }) => {
  const tasksString = JSON.stringify(tasks);
  window.localStorage.setItem(itemName, tasksString);
};
