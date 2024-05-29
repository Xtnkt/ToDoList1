import {todolistsActions} from "features/TodolistList/todolists-reducer";
import {ResponseTasksType, ResultCode, TaskStatuses, todolistAPI, UpdateTaskType} from "api/todolist-api";
import {appActions} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios from "axios";
import {TasksStateType} from "features/TodolistList/TodolistsList";
import {AppRootStateType, AppThunk} from "store/store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "features/auth/auth.reducer";

const getTasks = createAsyncThunk('tasks/getTasks', async (todoId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const result = await todolistAPI.getTasks(todoId)
        return {tasks: result.items, todolistId: todoId}
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
        }
        return rejectWithValue(error)
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
})


const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        addTask: (state, action: PayloadAction<{ task: ResponseTasksType }>) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
        },
        changeTaskStatus: (state, action: PayloadAction<{
            todolistId: string,
            taskId: string,
            status: TaskStatuses
        }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], status: action.payload.status}
            }
        },
        changeTaskTitle: (state, action: PayloadAction<{ taskId: string, title: string, todolistId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], title: action.payload.title}
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(todolistsActions.addTodoList, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodoList, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodoLists, (state, action) => {
                action.payload.todos.forEach((tl) => {
                    state[tl.id] = []
                })
            })
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                if (!action.payload.isLoggedIn) {
                    return state = {}
                }
            })
    }
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {getTasks}


export const removeTaskTC = (todoId: string, taskId: string): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'loading'}))
    try {
        const result = await todolistAPI.deleteTask(todoId, taskId)
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(tasksActions.removeTask({todolistId: todoId, taskId: taskId}))
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'idle'}))
        } else {
            handleServerAppError(dispatch, result)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'failed'}))
        }
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const addTasksTC = (todoId: string, title: string): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'loading'}))
    try {
        const result = await todolistAPI.createTask(todoId, title)
        if (result.data.resultCode === ResultCode.SUCCEEDED) {
            const item = result.data.data.item
            dispatch(tasksActions.addTask({task: item}))
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'idle'}))
        } else {
            handleServerAppError(dispatch, result.data)
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'idle'}))
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'failed'}))
        }
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const updateTaskTC = (todoId: string, taskId: string, status: TaskStatuses): AppThunk =>
    async (dispatch, getState: () => AppRootStateType) => {

        const tasks = getState().tasks
        const task = tasks[todoId].find((t) => t.id === taskId)

        if (task) {
            const model: UpdateTaskType = {
                title: task.title,
                deadline: task.deadline,
                startDate: task.startDate,
                description: task.description,
                priority: task.priority,
                status,
                completed: false
            }

            dispatch(appActions.setLoadingStatus({status: 'loading'}))
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'loading'}))

            try {
                const result = await todolistAPI.updateTask(todoId, taskId, model)
                if (result.resultCode === ResultCode.SUCCEEDED) {
                    dispatch(tasksActions.changeTaskStatus({todolistId: todoId, taskId, status}))
                    dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'idle'}))
                } else {
                    handleServerAppError(dispatch, result)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    handleServerNetworkError(dispatch, error)
                    dispatch(todolistsActions.changeTodoListEntityStatus({id: todoId, entityStatus: 'failed'}))
                }
            } finally {
                dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
            }
        }
    }
//
// type RemoveTaskAT = ReturnType<typeof removeTaskAC>
// type AddTaskAT = ReturnType<typeof addTaskAC>
// type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
// type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>
// type SetTasksAT = ReturnType<typeof setTasksAC>
//
// type ActionsType = RemoveTaskAT
//     | AddTaskAT
//     | ChangeTaskStatusAT
//     | ChangeTaskTitleAT
//     | SetTasksAT
//
// export const removeTaskAC = (todolistId: string, taskId: string) =>
//     ({type: "REMOVE-TASK", todolistId, taskId}) as const
// export const addTaskAC = (task: ResponseTasksType) =>
//     ({type: "ADD-TASK", task}) as const
// export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) =>
//     ({type: "CHANGE-TASK-STATUS", taskId, status, todolistId}) as const
// export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) =>
//     ({type: "CHANGE-TASK-TITLE", taskId, title, todolistId}) as const
// export const setTasksAC = (tasks: ResponseTasksType[], todolistId: string) =>
//     ({type: 'SET-TASKS', tasks, todolistId}) as const
//
// export const tasksReducer = (state = initialState, action: any): TasksStateType => {
//     switch (action.type) {
//         case "REMOVE-TASK": {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].filter((task) => task.id !== action.taskId)
//             }
//         }
//         case "ADD-TASK" : {
//             return {
//                 ...state,
//                 [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
//             }
//         }
//         case "CHANGE-TASK-STATUS": {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
//                     ? {...task, status: action.status} : task)
//             }
//         }
//         case "CHANGE-TASK-TITLE": {
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId
//                     ? {...task, title: action.title} : task)
//             }
//         }
//         case "REMOVE-TODOLIST": {
//             let copyState = {...state}
//             delete copyState[action.todoListId]
//             return copyState
//         }
//         case "SET-TODOS":
//             const copyState = {...state}
//             action.todos.forEach((tl: any) => {
//                 copyState[tl.id] = []
//             })
//             return copyState
//         case "SET-TASKS": {
//             return {
//                 ...state,
//                 [action.todolistId]: action.tasks.map((el: any) => ({...el, isDone: false}))
//             }
//         }
//         default:
//             return state
//     }
// }
// export const getTasksTC = (todoId: string): AppThunk => async (dispatch) => {
//     dispatch(appActions.setLoadingStatus({status: 'loading'}))
//     try {
//         const result = await todolistAPI.getTasks(todoId)
//         dispatch(tasksActions.setTasks({tasks: result.items, todolistId: todoId}))
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             handleServerNetworkError(dispatch, error)
//         }
//     } finally {
//         dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
//     }
// }