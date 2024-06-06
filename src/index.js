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
  - Si se hace doble clic en el  <label> se activa el modo edición. ✅
  - Si se hace la acción :hover en una tarea se debería mostrar el botón para eliminar (.destroy). ✅

  4 Editando una tarea
  - Cuando el modo edición está activado, se deberían ocultar los otros elementos y se mostrará un input que - contiene el título de la tarea pendiente, que debe estar enfocado (.focus()). ✅
  - La edición debe guardarse cuando se presione la tecla Enter y salir del modo edición. ✅
  - Asegúrate de usar métodos como .trim() limpiar espacios al inicio o al final. ✅
  - Si se presiona la tecla Escape durante la edición, se debe salir del modo edición y descartar cualquier cambio. ✅

  5 Contador
  - En el footer se debería mostrar el número de tareas en estado pending. ✅
  - Asegúrese de que el número esté envuelto por una etiqueta <strong>.
  - También asegúrese de pluralizar la palabra item correctamente, por ejemplo: 0 items, 1 item, 2 items. ✅
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
  const numTasksDone = tasks.filter((task) => !task.completed).length;
  itemsLeftElement.textContent = `${numTasksDone} ${
    numTasksDone === 1 ? "item" : "items"
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
  initUiApp();
  initInitialEvents();
}

mainUi();
