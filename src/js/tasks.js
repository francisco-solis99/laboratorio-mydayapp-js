import { getTasksFromLocalStorage, saveTasksForLocalStorage } from "./utils";

const { item } = getTasksFromLocalStorage({ itemName: "mydayapp-js" });

const tasks = item ?? [];

const getTasks = ({ statusComplete = null } = {}) => {
  if (statusComplete === null) return [...tasks];
  const tasksFiltered = [...tasks].filter((task) => {
    return task.completed === statusComplete;
  });

  return tasksFiltered;
};

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

export const getTasksByState = ({ completedState = null }) => {
  if (completedState === null) return [...tasks];

  return tasks.filter((task) => task.completed === completedState);
};

const getNextTaskId = () => {
  const numId = (tasks.at(-1)?.id ?? 0) + 1;
  return numId;
};

export { getTasks, addTask, deleteTask, editTask, getNextTaskId };
