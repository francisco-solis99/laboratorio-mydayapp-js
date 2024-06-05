import { getTasksFromLocalStorage, saveTasksForLocalStorage } from "./utils";

const { item } = getTasksFromLocalStorage({ itemName: "mydayapp-js" });

const tasks = item ?? [];

const getTasks = () => tasks;

const addTask = (task) => {
  tasks.push(task);
  saveTasksForLocalStorage({ tasks, itemName: "mydayapp-js" });
};

const deleteTask = (idTask) => {
  const taskIndex = tasks.findIndex((task) => task.id === idTask);
  tasks.splice(taskIndex, 1);
  saveTasksForLocalStorage({ tasks, itemName: "mydayapp-js" });
};

const editTask = (idTask, taskEdited) => {
  const taskIndex = tasks.findIndex((task) => task.id === idTask);
  tasks[taskIndex] = taskEdited;
  saveTasksForLocalStorage({ tasks, itemName: "mydayapp-js" });
};

const getNextTaskId = () => {
  const numId = (tasks.at(-1)?.id ?? 0) + 1;
  const nextIdTask = `task-${numId}`;
  return nextIdTask;
};

export { getTasks, addTask, deleteTask, editTask, getNextTaskId };