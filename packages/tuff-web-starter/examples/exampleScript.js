const app = $('#app');

app.css('width', '100%');
app.css('height', '100%');
app.css('box-sizing', 'border-box');
app.css('padding', '10px');
app.css('display', 'flex');
app.css('justify-content', 'center');
app.css('align-items', 'center');
app.css('background', '#faebd7');

const container = $('<div></div>');

container.attr('id', 'wrapper');
container.css('box-sizing', 'border-box');
container.css('background', 'white');
container.css('padding', '20px');
container.css('border-radius', '8px');
container.css('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');
container.css('width', '100%');
container.css('max-width', '500px');

app.append(container);

const form = $('<form></form>');

form.attr('id', 'form');
form.css('width', '100%');
form.css('display', 'flex');

container.append(form);

const input = $('<input />');

input.attr('type', 'text');
input.attr('placeholder', 'Add a new task...');
input.attr('id', 'new-task-input');

input.css('flex', '1 1 auto');
input.css('min-width', '0px');
input.css('padding', '10px');
input.css('border', '1px solid #dddddd');
input.css('border-radius', '4px');
input.css('margin-right', '10px');

form.append(input);

const addButton = $('<button></button>');
addButton.attr('type', 'submit');
addButton.attr('id', 'add-task');
addButton.text('Add Task');

addButton.css('flex', '0 0 auto');
addButton.css('padding', '10px');
addButton.css('background-color', '#5cb85c');
addButton.css('color', 'white');
addButton.css('border', 'none');
addButton.css('border-radius', '4px');
addButton.css('cursor', 'pointer');

form.append(addButton);

const taskList = $('<ul></ul>');
taskList.attr('id', 'task-list');

container.append(taskList);

addButton.on('click', function (e) {
  e.preventDefault();

  if (input.val()) {
    const listItem = $('<li></li>');
    listItem.text(input.val());
    listItem.css('padding', '10px');
    listItem.css('border-bottom', '1px solid #dddddd');
    listItem.css('cursor', 'pointer');

    taskList.prepend(listItem);
    input.val('');
  }
});

taskList.on('click', 'li', function (e) {
  $(e.target).remove();
});
