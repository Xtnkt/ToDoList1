import {v1} from "uuid";
import {
    FilterButtonType,
    TodolistDomainType,
    todolistsActions,
    todolistsReducer
} from "features/TodolistList/todolists-reducer";


let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = []

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "All", addedDate: '', order: 0, entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "All", addedDate: '', order: 0, entityStatus: "idle"}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState,
        todolistsActions.removeTodoList({id: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});
test('correct todolist should be added', () => {

    const newTodo = {
        id: 'string',
        title: 'string',
        addedDate: 'string',
        order: 0
    }

    const endState = todolistsReducer(startState,
        todolistsActions.addTodoList({todolist: newTodo}))

    expect(endState.length).toBe(3);
});
test('correct filter of todolist should be changed', () => {

    let newFilter: FilterButtonType = "Completed";

    const endState = todolistsReducer(startState,
        todolistsActions.changeTodoListFilter({newFilter, id: todolistId2}));

    expect(endState[0].filter).toBe("All");
    expect(endState[1].filter).toBe(newFilter);
});
test('correct todolist should change its name', () => {

    let newTodolistTitle = "New TodolistList";

    const endState = todolistsReducer(startState,
        todolistsActions.changeTodoListTitle({newTodolistTitle, id: todolistId2}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});




