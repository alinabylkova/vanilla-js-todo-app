import '../style/todo.css';

let todoList = [];

const createTodoItemId = (array) => {
  const highestId = array.reduce(
    (accumulator, currentValue) => (currentValue.id > accumulator ? currentValue.id : accumulator),
    0,
  );
  return Number.parseInt(highestId, 0) + 1;
};

const persistToLocalStore = () => {
  localStorage.setItem('todoList', JSON.stringify(todoList));
};

const addNewTodoItemToStore = (newTodoItem) => {
  todoList.push(newTodoItem);
  persistToLocalStore();
};

const removeTodoItemFromStore = (id) => {
  const itemToRemove = todoList.find((todoItem) => todoItem.id === id);
  if (itemToRemove === undefined) return;
  const position = todoList.indexOf(itemToRemove);
  todoList.splice(position, 1);
  persistToLocalStore();
};

const validateInputFields = (title, description) => {
  if (title === '') {
    document.getElementById('title').className = 'input-group__input input-group__input--invalid';
    return false;
  }

  if (description === '') {
    document.getElementById('description').className = 'input-group__input input-group__input--invalid';
    return false;
  }
  document.getElementById('title').className = 'input-group__input';
  document.getElementById('description').className = 'input-group__input';
  return true;
};

const readInputAndGenerateTodoItem = () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const isInputValid = validateInputFields(title, description);
  if (!isInputValid) return null;

  const id = createTodoItemId(todoList);
  const done = false;
  return {
    id,
    title,
    description,
    done,
  };
};

const makeInputBoxesEmpty = () => {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
};

const createNewTodoItemHtml = (inputValues) => {
  const todoItemHtml = document.createElement('DIV');
  const todoTitle = document.createElement('H3');
  const todoDescription = document.createElement('P');
  const removeButton = document.createElement('BUTTON');

  todoTitle.innerHTML = `${inputValues.title}`;
  todoDescription.innerHTML = `${inputValues.description}`;
  removeButton.innerHTML = 'Remove <i class="del-btn fas fa-trash"></i>';

  todoItemHtml.appendChild(todoTitle);
  todoItemHtml.appendChild(todoDescription);
  todoItemHtml.appendChild(removeButton);

  if (inputValues.done) {
    todoItemHtml.className = 'item__container item__container--done';
  } else {
    todoItemHtml.className = 'item__container item__container--pending';
  }
  todoItemHtml.id = inputValues.id;
  todoTitle.className = 'item__title';
  todoDescription.className = 'item__description';
  removeButton.className = 'item__remove-button';

  return { todoItemHtml, removeButton };
};

const removeTodoItemFromPage = (id) => {
  document.getElementById(id).remove();
};

const changeDoneStateOnClick = (item) => {
  const itemInHtml = item;
  const itemInArray = todoList.find((todoItem) => todoItem.id === parseInt(itemInHtml.id, 0));

  if (itemInArray === undefined) return;

  itemInHtml.addEventListener('click', () => {
    if (itemInArray.done) {
      itemInHtml.className = 'item__container item__container--pending';
      itemInArray.done = false;
    } else {
      itemInHtml.className = 'item__container item__container--done';
      itemInArray.done = true;
    }
    persistToLocalStore();
  });
};

const removeTodoItemOnBtnClick = (btn) => {
  const removeBtn = btn;
  removeBtn.addEventListener('click', () => {
    const itemId = removeBtn.parentNode.id;
    removeTodoItemFromStore(parseInt(itemId, 0));
    removeTodoItemFromPage(itemId);
  });
};

const addTodoItemToPage = (item) => {
  const { todoItemHtml, removeButton } = createNewTodoItemHtml(item);
  document.getElementsByClassName('items')[0].appendChild(todoItemHtml);

  changeDoneStateOnClick(todoItemHtml);
  removeTodoItemOnBtnClick(removeButton);
};

const addTodoItemsFromStateToPage = () => {
  todoList = JSON.parse(localStorage.getItem('todoList'));
  if (todoList === null) {
    todoList = [];
  }
  todoList.forEach((todoItem) => addTodoItemToPage(todoItem));
};

document.getElementById('add-button').addEventListener('click', (event) => {
  event.preventDefault();
  const newTodoItem = readInputAndGenerateTodoItem();
  if (newTodoItem !== null) {
    addNewTodoItemToStore(newTodoItem);
    addTodoItemToPage(newTodoItem);
    makeInputBoxesEmpty();
  }
});

addTodoItemsFromStateToPage();
