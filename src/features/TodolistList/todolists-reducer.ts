import {ResponseTodoListType, ResultCode, todolistAPI} from "api/todolist-api";
import {appActions, RequestStatusType} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios from "axios";
import {AppThunk} from "store/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authActions} from "features/auth/auth.reducer";


export type FilterButtonType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = ResponseTodoListType & {
    filter: FilterButtonType,
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        removeTodoList: (state, action: PayloadAction<{ id: string }>) => {
            // state.filter(tl => tl.id !== action.payload.id) можно,но immerJs рекомендует как "ниже"
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodoList: (state, action: PayloadAction<{ todolist: ResponseTodoListType }>) => {
            const newTodoList: TodolistDomainType = {...action.payload.todolist, filter: 'All', entityStatus: "idle"}
            state.unshift(newTodoList)
        },
        changeTodoListTitle: (state, action: PayloadAction<{ newTodolistTitle: string, id: string }>) => {
            const todo = state.find(todo => todo.id === action.payload.id)
            if (todo) {
                todo.title = action.payload.newTodolistTitle
            }
        },
        changeTodoListFilter: (state, action: PayloadAction<{ newFilter: FilterButtonType, id: string }>) => {
            const todo = state.find(todo => todo.id === action.payload.id)
            if (todo) {
                todo.filter = action.payload.newFilter
            }
        },
        changeTodoListEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const todo = state.find(todo => todo.id === action.payload.id)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },
        setTodoLists: (state, action: PayloadAction<{ todos: ResponseTodoListType[] }>) => {
            return action.payload.todos.map(todo => ({...todo, filter: 'All', entityStatus: "idle"}))
        },
    },
    extraReducers: builder => {
        builder
            .addCase(authActions.setIsLoggedIn, (state, action) => {
                    if (!action.payload.isLoggedIn) {
                        return state = []
                    }
                }
            )
    }
})
export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions

export const getTodoTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const result = await todolistAPI.getTodoLists()
        dispatch(todolistsActions.setTodoLists({todos: result}))
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
        }
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const createTodolistTC = (title: string): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const result = await todolistAPI.createTodoList(title)
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(todolistsActions.addTodoList({todolist: result.data.item}))
        } else {
            handleServerAppError(dispatch, result)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
        }
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const deleteTodolistTC = (todolistId: string): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodoListEntityStatus({id: todolistId, entityStatus: 'loading'}))

    try {
        const result = await todolistAPI.deleteTodoList(todolistId)
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(todolistsActions.removeTodoList({id: todolistId}))
        } else {
            handleServerAppError(dispatch, result)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todolistId, entityStatus: 'failed'}))
        }
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    dispatch(todolistsActions.changeTodoListEntityStatus({id: todolistId, entityStatus: 'loading'}))
    try {
        const result = await todolistAPI.updateTodolistTitle(todolistId, title)
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(todolistsActions.changeTodoListTitle({newTodolistTitle: title, id: todolistId}))
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todolistId, entityStatus: 'idle'}))
        } else {
            handleServerAppError(dispatch, result)
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todolistId, entityStatus: 'failed'}))
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(dispatch, error)
            dispatch(todolistsActions.changeTodoListEntityStatus({id: todolistId, entityStatus: 'failed'}))
        }
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}

//

// export type RemoveTodoListAT = {
//     type: 'REMOVE-TODOLIST',
//     todoListId: string
// }
// export type AddTodoListAT = {
//     type: 'ADD-TODOLIST',
//     todolist: ResponseTodoListType
// }
// type ChangeTodoListFilterAT = {
//     type: 'CHANGE-TODOLIST-FILTER',
//     filter: FilterButtonType,
//     todoListId: string,
// }
// type ChangeTodoListTitleAT = {
//     type: 'CHANGE-TODOLIST-TITLE',
//     title: string,
//     todoListId: string
// }
// export type SeTodoListsAT = ReturnType<typeof SeTodoListsAC>
// export type SeEntityStatusAT = ReturnType<typeof SeEntityStatusAC>
//
// type ActionType = RemoveTodoListAT
//     | AddTodoListAT
//     | ChangeTodoListFilterAT
//     | ChangeTodoListTitleAT
//     | SeTodoListsAT
//     | SeEntityStatusAT
//
// export const RemoveTodoListAC = (id: string): RemoveTodoListAT =>
//     ({type: "REMOVE-TODOLIST", todoListId: id})
// export const ChangeTodoListFilterAC = (newFilter: FilterButtonType, id: string): ChangeTodoListFilterAT =>
//     ({type: "CHANGE-TODOLIST-FILTER", filter: newFilter, todoListId: id})
// export const AddTodoListAC = (todolist: ResponseTodoListType): AddTodoListAT =>
//     ({type: "ADD-TODOLIST", todolist})
// export const ChangeTodoListTitleAC = (newTodolistTitle: string, newTodolistId: string): ChangeTodoListTitleAT =>
//     ({type: "CHANGE-TODOLIST-TITLE", title: newTodolistTitle, todoListId: newTodolistId})
// export const SeTodoListsAC = (todos: ResponseTodoListType[]) => {
//     return {type: 'SET-TODOS', todos} as const
// }
// export const SeEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType) => {
//     return {type: 'SET-ENTITY-STATUS', todoListId, entityStatus} as const

// const _todolistsReducer = (todolists = initialState, action: ActionType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case "REMOVE-TODOLIST":
//             return todolists.filter(tl => tl.id !== action.todoListId)
//         case "ADD-TODOLIST" :
//             return [{...action.todolist, filter: 'All', entityStatus: "idle"}, ...todolists]
//         case "CHANGE-TODOLIST-FILTER":
//             return todolists.map(tl => tl.id === action.todoListId ? {...tl, filter: action.filter} : tl)
//         case "CHANGE-TODOLIST-TITLE":
//             return todolists.map(tl => tl.id === action.todoListId ? {...tl, title: action.title} : tl)
//         case "SET-TODOS":
//             return action.todos.map(el => ({...el, filter: 'All', entityStatus: "idle"}))
//         case "SET-ENTITY-STATUS":
//             return todolists.map(tl => tl.id === action.todoListId ? {...tl, entityStatus: action.entityStatus} : tl)
//         default:
//             return todolists
//     }
// }
