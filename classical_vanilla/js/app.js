// Je remplis artificiellement le localStorage.tasks
// localStorage.tasks = JSON.stringify([
//     {id: 1, content: "Tâche 1", completed: true},
//     {id: 2, content: "Tâche 2", completed: false}
// ]);


// {id:xxx, content: 'xx', completed:xxx}
function getTaskDomElement (task) {
    const li = document.createElement("li");
    // J'ajoute le data-id avec l'ide de la task
    li.dataset.id = task.id;
    if (task.completed) {
        li.classList.add('completed');
    } 
    li.innerHTML = `
        <div class="view">
            <input class="toggle" type="checkbox" ${ task.completed ? 'checked': '' } />
            <label>${ task.content }</label>
            <button class="destroy"></button>
        </div>`;
    return li;
}

function updateClearCompletedButtonVisibility() {
  const clearCompletedButton = document.querySelector('.clear-completed');
  
  if (tasks.some(task => task.completed)) {
    clearCompletedButton.classList.remove('hidden');
  } else {
    clearCompletedButton.classList.add('hidden');
  }
}

function updateItemCount() {
  const count = document.querySelectorAll('.todo-list li:not(.completed)').length;
  const countElement = document.querySelector('.todo-count span');
  countElement.textContent = count;
}

function applyFilter(filterType) {
  const todoItems = document.querySelectorAll('.todo-list li');

  todoItems.forEach(item => {
    const isCompleted = item.classList.contains('completed');
    const isHidden = item.classList.contains('hidden');

    switch (filterType) {
      case 'all':
        item.classList.remove('hidden');
        break;
      case 'active':
        if (isCompleted && !isHidden) {
          item.classList.add('hidden');
        } else if (!isCompleted && isHidden) {
          item.classList.remove('hidden');
        }
        break;
      case 'completed':
        if (isCompleted && isHidden) {
          item.classList.remove('hidden');
        } else if (!isCompleted && !isHidden) {
          item.classList.add('hidden');
        }
        break;
    }
  });
}


// function updateFilterLinks(filter) {
//   const filterLinks = document.querySelectorAll('.filters .filter');

//   filterLinks.forEach(link => {
//     if (link.dataset.filter === filter) {
//       link.classList.add('selected');
//     } else {
//       link.classList.remove('selected');
//     }
//   });
// }

// 1. Initialiser le localstorage
// tasks -> []
    if (localStorage.tasks === undefined) {
        localStorage.tasks = JSON.stringify([]);
    }

// 2. Afficher les tasks dans le DOM
const ul = document.querySelector(".todo-list");
const tasks = JSON.parse(localStorage.tasks);
tasks.forEach(task => {
  ul.appendChild(getTaskDomElement(task));
});

// AJOUT D'UNE TÂCHE ------------------------------------------
// Keyup, enter et que le champ n'est pas vide
// Créer un li et l'ajouter dans le UL
// Il va falloir mettre à jour le tableau tasks et le localStorage
document.querySelector(".new-todo").addEventListener("keyup",function (e){
    if(e.key === "Enter" && this.value != ''){
        // 1. Créer un objet littéral
        const newTask = {
            id: new Date().valueOf(),
            content: this.value,
            completed: false,
        };

        // 2. Ajouter un li dans le ul (insertBefore)
        const li = getTaskDomElement(newTask);
        
        // 3. Ajouter la tâche dans tasks (push)
        tasks.unshift(newTask);

        // 4. Ecraser le localStorage.tasks avec les tasks
        //localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.tasks = JSON.stringify(tasks);

        // 5. Vider le champs
        this.value = '';
        // 6. Ajouter la tâche au DOM en tenant compte du filtre actif

        const activeFilter = document.querySelector('.filters .selected').dataset.filter;

        if (activeFilter === 'completed') {
          li.classList.add('hidden')
        } 
        ul.insertBefore(li ,ul.firstChild)

        // 7. visibilité bouton clear completed
        updateClearCompletedButtonVisibility();
        updateItemCount();
    }
});
    
// TERMINER UNE TÂCHE ------------------------------------------
// Quand on change le checkbox
// 1. On ajoute ou on supprime la classe 'completed' sur le li correspondant (toggle)
// 2. On Modifie la task dans le tasks (true/false)
// 3. on écrase le localStorage.tasks

// Capture par sélection
// document.querySelectorAll(".toggle").forEach(trigger => {
//     trigger.addEventListener('change', function() {
//         this.closest('li').classList.toggle("completed");
//     })
// });

// Capture par délégation
document.querySelector('.todo-list').addEventListener('click', function(e){
  if (e.target.matches('.toggle')) {
      e.target.closest('li').classList.toggle("completed");
      // On récupère l'id dans le li
      const id = e.target.closest('li').dataset.id;

      // On récupère dans le tableau tasks la task qui correspond à l'id
      const task = tasks.find(task => task.id == id);
      task.completed = !task.completed;

      // J'écrase le localStorage.tasks
      localStorage.tasks = JSON.stringify(tasks);
  } 
  else if (e.target.matches('.destroy')){
    const id = e.target.closest('li').dataset.id;
    const taskIndex = tasks.findIndex(task => task.id == id);

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      localStorage.tasks = JSON.stringify(tasks);
    }

    e.target.closest('li').remove();
  }

  updateClearCompletedButtonVisibility();
  updateItemCount();
});


document.querySelector('.filters').addEventListener('click', function(e) {
  if (e.target.matches('.filter')) {
    const filterType = e.target.getAttribute('data-filter');

    // Supprimer la classe 'selected' de tous les liens de filtre
    const filterLinks = document.querySelectorAll('.filter');
    filterLinks.forEach(link => link.classList.remove('selected'));

    // Ajouter la classe 'selected' au lien actuellement sélectionné
    e.target.classList.add('selected');

    // Appliquer le filtre
    applyFilter(filterType);
  }
});

document.querySelector('.clear-completed').addEventListener('click',function(e){
  const completedTasks = tasks.filter(task => task.completed);

  completedTasks.forEach(completedTask => {
    const taskIndex = tasks.findIndex(task => task.id === completedTask.id);
    tasks.splice(taskIndex, 1);
  });

  localStorage.tasks = JSON.stringify(tasks);

  const completedItems = document.querySelectorAll('.todo-list li.completed');

  completedItems.forEach(item => item.remove());

  updateClearCompletedButtonVisibility();
  
  updateItemCount();

})
function editTask(taskElement) {
  const label = taskElement.querySelector('label');
  taskElement.classList.add('editing');

  const input = document.createElement('input');
  input.className = 'edit';
  input.value = label.textContent;
  taskElement.appendChild(input);
  input.focus();

  input.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      const newContent = input.value;
      if (newContent !== '') {
        const id = taskElement.dataset.id;
        const task = tasks.find(task => task.id == id);
        task.content = newContent;
        localStorage.tasks = JSON.stringify(tasks);
        label.textContent = newContent;
      }
      exitEditingMode(taskElement);
    } else if (e.key === 'Escape') {
      exitEditingMode(taskElement);
    }
  });
}

function exitEditingMode(taskElement) {
  const input = taskElement.querySelector('.edit');
  taskElement.classList.remove('editing');
  if (input) {
    taskElement.removeChild(input);
  }
}

// Lors du double-clic sur une tâche, activer le mode édition
document.querySelector('.todo-list').addEventListener('dblclick', function(e) {
  if (e.target.matches('label')) {
    const taskElement = e.target.closest('li');
    editTask(taskElement);
  }
});


updateClearCompletedButtonVisibility();
updateItemCount();
