// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


// Event Listeners

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Function: Add a To-Do
function addToDo(event) {
    event.preventDefault();
    if (toDoInput.value === '') {
        alert("You must write something!");
        return;
    }

    const taskId = new Date().getTime(); // Unique ID for each task

    // Create ToDo item
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo');
    toDoDiv.dataset.id = taskId; // Store task ID in data attribute

    const newToDo = document.createElement('li');
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    // Save to local storage
    savelocal({ id: taskId, task: toDoInput.value });

    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn');
    toDoDiv.appendChild(checked);

    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn');
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
    toDoInput.value = '';
}



function deletecheck(event){

    // console.log(event.target);
    const item = event.target;

    // delete
    if(item.classList[0] === 'delete-btn')
    {
        // item.parentElement.remove();
        // animation
        item.parentElement.classList.add("fall");

        //removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }

    // check
    if(item.classList[0] === 'check-btn')
    {
        item.parentElement.classList.toggle("completed");
    }


}


// Function: Save to Local Storage
function savelocal(todoObj) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push(todoObj);
    localStorage.setItem('todos', JSON.stringify(todos));
}




// Function: Get Todos from Local Storage
function getTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(({ id, task }) => {
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add('todo');
        toDoDiv.dataset.id = id;

        const newToDo = document.createElement('li');
        newToDo.innerText = task;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);

        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn');
        toDoDiv.appendChild(checked);

        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn');
        toDoDiv.appendChild(deleted);

        toDoList.appendChild(toDoDiv);
    });
}



// Function: Remove from Local Storage
function removeLocalTodos(todo) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoId = parseInt(todo.dataset.id, 10);
    todos = todos.filter(item => item.id !== todoId);
    localStorage.setItem('todos', JSON.stringify(todos));
}


// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
              button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}