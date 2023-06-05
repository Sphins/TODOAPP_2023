localStorage.tasks =
  localStorage.tasks === undefined
    ? JSON.stringify([])
    : JSON.stringify(JSON.parse(localStorage.tasks));

const taskList = document.querySelector(".todo-list");

const tasks = JSON.parse(localStorage.tasks);

tasks.forEach((task) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `<div class="view"><input class="toggle" type="checkbox" ${
    task.completed ? "checked" : ""
  }
    "><label>
    ${task.content}
    </label><button class="destroy"></button>`;
  newLi.dataset.id = task.id;
  task.completed ? newLi.classList.add("completed") : "";
  taskList.appendChild(newLi);
});
