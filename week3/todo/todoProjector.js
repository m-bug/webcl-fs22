
export { todoItemProjector, todoChartProjector }

const todoTextProjector = todo => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 42;

    inputElement.oninput = _ => todo.setText(inputElement.value);

    todo.onTextChanged(_ => inputElement.value = todo.getText());

    todo.onTextValidChanged(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    todo.onTextEditableChanged(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    return inputElement;
};

const todoDoneProjector = todo => {

    const checkboxElement = document.createElement("INPUT");
    checkboxElement.type = "checkbox";

    checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);

    todo.onDoneChanged(
        done => done
        ? checkboxElement.setAttribute("checked", true)
        : checkboxElement.removeAttribute("checked")
    );

    return checkboxElement;
};

const todoItemProjector = (todoController, rootElement, todo) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => todoController.removeTodo(todo);

    const inputElement      = todoTextProjector(todo);
    const checkboxElement   = todoDoneProjector(todo);

    todoController.onTodoRemove( (removedTodo, removeMe) => {
        if (removedTodo !== todo) return;
        rootElement.removeChild(deleteButton);
        rootElement.removeChild(inputElement);
        rootElement.removeChild(checkboxElement);
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    rootElement.appendChild(inputElement);
    rootElement.appendChild(checkboxElement);
};

// chart view
const todoChartProjector = (todoController, rootElement, n, open) => {
    // for n todos, create a div for each
    const allTasksBar           = document.getElementById("allTasksBar");
    const openTasksBar          = document.getElementById("openTasksBar");
    const doneTasksBar          = document.getElementById("doneTasksBar");

    // cleanup
    allTasksBar.replaceChildren();
    openTasksBar.replaceChildren();
    doneTasksBar.replaceChildren();

    // add stats label
    const allTasksBarLabel      = document.createElement("Div");
    const openTasksBarLabel     = document.createElement("Div");
    const doneTasksBarLabel     = document.createElement("Div");

    allTasksBar.appendChild(allTasksBarLabel);
    openTasksBar.appendChild(openTasksBarLabel)
    doneTasksBar.appendChild(doneTasksBarLabel);

    // add bars for each stat
    // all tasks
    for (let i = 0; i < n; i++) {

        const div = document.createElement("Div");
        div.setAttribute("class", "bar-filled bar-all-filled");
        allTasksBar.appendChild(div);
    }

    // open
    for (let i = 0; i < open; i++) {
        const div = document.createElement("Div");
        div.setAttribute("class", "bar-filled bar-open-filled");
        openTasksBar.appendChild(div);
    }

    // done
    for (let i = 0; i < (n - open); i++) {
        const div = document.createElement("Div");
        div.setAttribute("class", "bar-filled bar-done-filled");
        doneTasksBar.appendChild(div);
    }

    allTasksBarLabel.innerText      = n         + " Tasks";
    openTasksBarLabel.innerText     = open      + " open";
    doneTasksBarLabel.innerText     = n - open  + " done";

};
