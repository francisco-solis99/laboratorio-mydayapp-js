import "./css/base.css";

import {
  getTasks,
  addTask,
  getNextTaskId,
  editTask,
  deleteTask,
  getTasksByState,
} from "./js/tasks";
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
  - Si se hace doble clic en el  <label> se activa el modo edición. ✅
  - Si se hace la acción :hover en una tarea se debería mostrar el botón para eliminar (.destroy). ✅

  4 Editando una tarea
  - Cuando el modo edición está activado, se deberían ocultar los otros elementos y se mostrará un input que - contiene el título de la tarea pendiente, que debe estar enfocado (.focus()). ✅
  - La edición debe guardarse cuando se presione la tecla Enter y salir del modo edición. ✅
  - Asegúrate de usar métodos como .trim() limpiar espacios al inicio o al final. ✅
  - Si se presiona la tecla Escape durante la edición, se debe salir del modo edición y descartar cualquier cambio. ✅

  5 Contador
  - En el footer se debería mostrar el número de tareas en estado pending. ✅
  - Asegúrese de que el número esté envuelto por una etiqueta <strong>. ✅
  - También asegúrese de pluralizar la palabra item correctamente, por ejemplo: 0 items, 1 item, 2 items. ✅

  6 Botón de limpiar
  - Debería existir un botón para eliminar todas las tareas que están con estado de completed. ✅

  7 Persistencia
  - Cuando se recargue la aplicación se debe obtener las tareas, para esto tu aplicación debería guardar las tareas en LocalStorage. ✅
  - El key que se debe usar para el LocalStorage debe ser mydayapp-js, esto es importante ya que las pruebas e2e van a verificar el LocalStorage con esta la key mydayapp-js. ✅
  - NO es necesario persistir estados de la interfaz como por ejemplo guardar el modo de edición. Solo se debe guardar las tareas. ✅

  8 Filtros y rutas
  Deben existir tres filtros que funcione desde la URL y funcionan como links en el footer:

  -#/all: Muestra todas las tareas tanto las que están en estado de completed y pending. ✅
  -#/pending: Muestra todas las tareas en estado pending.  ✅
  -#/completed: Muestra todas las tareas en estado completed. ✅
*/

const initUiApp = ({ filterStatus = null } = {}) => {
  const tasks = getTasks({ statusComplete: filterStatus });
  const mainEl = document.querySelector(".main");
  const footerEl = document.querySelector(".footer");
  if (!tasks?.length && filterStatus === null) {
    mainEl.style.display = "none";
    footerEl.style.display = "none";
    return;
  }
  mainEl.style.display = "block";
  footerEl.style.display = "block";
  // udpate footer
  const itemsLeftElement = document.querySelector(".todo-count");
  const clearDoneBtn = document.querySelector(".clear-completed");

  const numTasksToDone = tasks.filter((task) => !task.completed).length;
  itemsLeftElement.innerHTML = `<strong>${numTasksToDone}</strong> ${
    numTasksToDone === 1 ? "item" : "items"
  } left`;
  if (numTasksToDone === tasks.length) {
    clearDoneBtn.style.visibility = "hidden";
  } else {
    clearDoneBtn.style.visibility = "visible";
  }

  renderTasks({ tasks: tasks, containerSelector: ".todo-list" });
};

const initInitialEvents = () => {
  const principalInput = document.querySelector(".new-todo");
  const clearDoneBtn = document.querySelector(".clear-completed");

  principalInput.addEventListener("keydown", (e) => {
    if (e.code !== "Enter") return;
    handleKeyDownCreateTask(e.target.value);
    e.target.value = "";
  });

  clearDoneBtn.addEventListener("click", handleClickCleanTasksDone);

  window.addEventListener("hashchange", initTasksToApp);
};

// functions for events

const initTasksToApp = () => {
  const hashChanged = window.location.hash === "" ? "#/" : window.location.hash;
  const filterTasksObjCallBacks = {
    "#/": () => initUiApp(),
    "#/pending": () => initUiApp({ filterStatus: false }),
    "#/completed": () => initUiApp({ filterStatus: true }),
  };

  const filtersTags = document.querySelectorAll(".filters a");

  filtersTags.forEach((filter) => {
    const hashFilter = new URL(filter.href).hash;
    if (hashFilter === hashChanged) {
      filter.classList.add("selected");
      return;
    }
    filter.classList.remove("selected");
  });

  const callbackFilter = filterTasksObjCallBacks[hashChanged];
  callbackFilter();
};

const handleKeyDownCreateTask = (taskTitle) => {
  const taskTitleCleaned = taskTitle.trim();
  if (taskTitleCleaned === "") return;
  const nexTaskId = getNextTaskId();
  const newTask = {
    id: nexTaskId,
    title: taskTitleCleaned,
    completed: false,
  };
  addTask(newTask);
  initUiApp();
};

const handleClickCleanTasksDone = () => {
  const doneTasks = getTasksByState({ completedState: true });

  doneTasks.forEach((task) => {
    deleteTask(task.id);
  });
  initUiApp();
};

const handleChangeCheckTask = (task, currentCheck) => {
  const editedTask = {
    ...task,
    completed: currentCheck,
  };
  editTask(task.id, editedTask);
  initUiApp();
};

const handleChangeEdit = (editTitle, task) => {
  const titleTask = editTitle.trim();
  if (titleTask === "") return;
  const editedTask = {
    ...task,
    title: titleTask,
  };
  editTask(task.id, editedTask);
  initUiApp();
};

const handleClickDelete = (idTask) => {
  deleteTask(idTask);
  initUiApp();
};

// UI(render and craete) functions
const createTaskElement = (task) => {
  const taskItem = document.createElement("li");
  taskItem.id = `task-${task.id}`;
  if (task.completed) {
    taskItem.classList.add("completed");
  }

  const innerWrapper = document.createElement("div");
  innerWrapper.classList.add("view");
  const checkBoxTask = document.createElement("input");
  checkBoxTask.type = "checkbox";
  checkBoxTask.checked = task.completed;
  checkBoxTask.classList.add("toggle");

  const labelTask = document.createElement("label");
  labelTask.textContent = task.title;
  const deleteTaskBtn = document.createElement("button");
  deleteTaskBtn.classList.add("destroy");
  const inputTask = document.createElement("input");
  inputTask.classList.add("edit");
  inputTask.value = task.title;

  // Add the events
  checkBoxTask.addEventListener("change", (e) =>
    handleChangeCheckTask(task, e.target.checked)
  );
  labelTask.addEventListener("dblclick", () => {
    taskItem.classList.add("editing");
    inputTask.focus();
  });
  inputTask.addEventListener("keydown", (e) => {
    if (e.code !== "Enter" && e.code !== "Escape") return;

    if (e.code === "Escape") {
      taskItem.classList.remove("editing");
      return;
    }
    handleChangeEdit(e.target.value, task);
  });

  deleteTaskBtn.addEventListener("click", () => handleClickDelete(task.id));

  // render
  innerWrapper.append(checkBoxTask, labelTask, deleteTaskBtn);
  taskItem.append(innerWrapper, inputTask);
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
  // const currentHash = window.location.hash;
  initTasksToApp();
  initInitialEvents();
}

mainUi();
