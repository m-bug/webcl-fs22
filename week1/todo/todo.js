// requires ../observable/observable.js
// requires ./fortuneService.js
// requires ../dataflow/dataflow.js

const TodoController = () => {

    const Todo = () => {                                // facade
        const textAttr = Observable("text");// we current don't expose it as we don't use it elsewhere
        // variante 1
        textAttr.onChange(t => {
            console.log('onChanged');
            const isValid = validate('text', t);
            const msg = document.getElementById('validation');
            if (isValid) {
                console.log('isValid');
                textAttr.setValue(t);
                msg.classList.add("display-none");
                msg.innerHTML = '';
            } else {
                console.log('isInvalid');
                msg.classList.remove("display-none");
                msg.innerHTML = isValid[1];
            }
        })

        const doneAttr = Observable(false);
        return {
            getDone:       doneAttr.getValue,
            setDone:       doneAttr.setValue,
            onDoneChanged: doneAttr.onChange,
            setText:       textAttr.setValue,
            getText:       textAttr.getValue,
            onTextChanged: textAttr.onChange,
        }
    };

    const todoModel = ObservableList([]); // observable array of Todos, this state is private
    const scheduler = Scheduler();

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    const addFortuneTodo = () => {

        const newTodo = Todo();

        todoModel.add(newTodo);
        newTodo.setText('...');

        scheduler.add( ok =>
           fortuneService( text => {        // schedule the fortune service and proceed when done
                   newTodo.setText(text);
                   ok();
               }
           )
        );
    };

    return {
        numberOfTodos:      todoModel.count,
        numberOfopenTasks:  () => todoModel.countIf( todo => ! todo.getDone() ),
        addTodo:            addTodo,
        addFortuneTodo:     addFortuneTodo,
        removeTodo:         todoModel.del,
        onTodoAdd:          todoModel.onAdd,
        onTodoRemove:       todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="42">
                <input type="checkbox">            
            `;
            return template.children;
        }
        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick    = _ => todoController.removeTodo(todo);

        todoController.onTodoRemove( (removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        } );

        // variante 2
        todo.onTextChanged(() => {
            console.log('onTextChanged');
            const isValid = validate('text', todo.getText());
            const msg = document.getElementById('validation');
            if(isValid){
                console.log('isValid');
                inputElement.value = todo.getText();
                msg.classList.add("display-none");
                msg.innerHTML = '';
            } else {
                console.log('isInvalid');
                msg.classList.remove("display-none");
                msg.innerHTML = isValid[1];
            }
        });

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfopenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};


