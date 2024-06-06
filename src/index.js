import "./css/base.css";

import { getTasks, addTask, getNextTaskId, editTask } from "./js/tasks";
/*
  1. Ocultar las secciones main y footer
Cuando no hay tareas, los elementos con ID #main y #footer deberían estar ocultos. ✅

  2 . Crear una nueva tarea.
  - Se debe crear una nueva tarea se debe usar el input principal de la aplicación.
  - Este input debe enfocarse cuando se cargue la página, preferiblemente utilizando el atributo autofocus en el input. ✅
  - Al presionar la tecla Enter la tarea se crea con el estado pending y se agrega a la lista de tareas y el input debería quedar en limpio. ✅
  - Asegúrate de usar métodos como .trim() para limpiar espacios al inicio o al final y verifica que la tarea no sea un string vacío. ✅

  3 Una tarea debería tener 3 posibles interacciones:
  - Cuando se haga clic en el checkbox las tareas es marcada como completed, de igual manera si se vuele a hacer clic sobre en el checkbox vuelve a su estado de pending. ✅
  - Si se hace doble clic en el  <label> se activa el modo edición.
  - Si se hace la acción :hover en una tarea se debería mostrar el botón para eliminar (.destroy). ✅
*/

const initUiApp = () => {
  const tasks = getTasks();
  const mainEl = document.querySelector(".main");
  const footerEl = document.querySelector(".footer");
  if (!tasks?.length) {
    mainEl.style.display = "none";
    footerEl.style.display = "none";
    return;
  }
  mainEl.style.display = "block";
  footerEl.style.display = "block";
  // udpate footer
  const itemsLeftElement = document.querySelector(".todo-count");
  itemsLeftElement.textContent = `${tasks.length} ${
    tasks.length === 1 ? "item" : "items"
  } left`;
  renderTasks({ tasks: tasks, containerSelector: ".todo-list" });
};

const initInitialEvents = () => {
  const principalInput = document.querySelector(".new-todo");
  principalInput.addEventListener("keydown", (e) => {
    if (e.code !== "Enter") return;
    const taskTitle = e.target.value.trim();
    if (taskTitle === "") return;
    const nexTaskId = getNextTaskId();
    const newTask = {
      id: nexTaskId,
      title: taskTitle,
      completed: false,
    };
    addTask(newTask);
    initUiApp();
    e.target.value = "";
  });
};

// functions for events

const handleChangeCheckTask = (task, currentCheck) => {
  const editedTask = {
    ...task,
    completed: currentCheck,
  };
  editTask(task.id, editedTask);
  initUiApp();
};

// UI(render and craete) functions
const createTaskElement = (task) => {
  const taskItem = document.createElement("li");
  taskItem.id = task.id;
  if (task.completed) {
    taskItem.classList.add("completed");
  }

  const innerWrapper = document.createElement("div");
  innerWrapper.classList.add("view");
  const checkBoxTask = document.createElement("input");
  checkBoxTask.type = "checkbox";
  checkBoxTask.checked = task.completed;
  checkBoxTask.classList.add("toggle");
  checkBoxTask.addEventListener("change", (e) =>
    handleChangeCheckTask(task, e.target.checked)
  );

  const labelTask = document.createElement("label");
  labelTask.textContent = task.title;
  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.classList.add("destroy");
  const inputTask = document.createElement("input");
  inputTask.classList.add("edit");
  inputTask.value = task.title;

  // Add the events

  innerWrapper.append(checkBoxTask, labelTask, deleteTaskBtn, inputTask);
  taskItem.append(innerWrapper);
  return taskItem;
};

const renderTasks = ({ tasks, containerSelector }) => {
  // create fragment and then add the fragment
  const tasksFragment = document.createDocumentFragment();
  tasks.forEach((task) => {
    const taskEl = createTaskElement(task);
    tasksFragment.appendChild(taskEl);
  });
  const container = document.querySelector(containerSelector);
  container.replaceChildren(tasksFragment);
};

function mainUi() {
  initUiApp();
  initInitialEvents();
}

mainUi();
