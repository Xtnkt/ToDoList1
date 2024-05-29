import {todolistsActions, TodolistDomainType, todolistsReducer} from "features/TodolistList/todolists-reducer";
import {tasksReducer} from "features/TodolistList/tasks-reducer";
import {ResponseTasksType} from "api/todolist-api";

test('ids should be equals', () => {
    const startTasksState: {
        [todoListId: string]: ResponseTasksType[]
    } = {}
    const startTodolistsState: Array<TodolistDomainType> = []

    const newTodo = {
        id: 'string',
        title: 'string',
        addedDate: 'string',
        order: 0,
    }
    const action = todolistsActions.addTodoList({todolist: newTodo})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolist.id)
    expect(idFromTodolists).toBe(action.payload.todolist.id)
})