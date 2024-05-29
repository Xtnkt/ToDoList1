import {authAPI, ResultCode} from "api/todolist-api";
import {FormDataType} from "features/login/Login";
import {appActions} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "store/store";

type InitialStateType = {
    isLoggedIn: boolean,
    isInitialised: boolean,
    nickname: null | string
}

const initialState: InitialStateType = {
    isLoggedIn: false,
    isInitialised: false,
    nickname: null
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        },
        setIsInitialised: (state, action: PayloadAction<{ isInitialised: boolean }>) => {
            state.isInitialised = action.payload.isInitialised
        },
        setNickname: (state, action: PayloadAction<{ nickname: string | null }>) => {
            state.nickname = action.payload.nickname
        }
    }
})
export const authReducer = slice.reducer
export const authActions = slice.actions

// thunks
export const loginTC = (data: FormDataType): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const result = await authAPI.login(data)
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
        } else {
            handleServerAppError(dispatch, result)
        }
    } catch (error: any) {
        handleServerNetworkError(dispatch, error)
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const logOutTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const result = await authAPI.logOut()
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: false}))
            dispatch(authActions.setNickname({nickname: null}))
        } else {
            handleServerAppError(dispatch, result)
        }
    } catch (error: any) {
        handleServerNetworkError(dispatch, error)
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
export const meTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setLoadingStatus({status: 'loading'}))
    try {
        const result = await authAPI.me()
        if (result.resultCode === ResultCode.SUCCEEDED) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
            dispatch(authActions.setIsInitialised({isInitialised: true}))
            dispatch(authActions.setNickname({nickname: result.data.login}))
        } else {
            dispatch(authActions.setIsInitialised({isInitialised: true}))
            handleServerAppError(dispatch, result)
        }
    } catch (error: any) {
        handleServerNetworkError(dispatch, error)
    } finally {
        dispatch(appActions.setLoadingStatus({status: 'succeeded'}))
    }
}
//
//type ActionsType = ReturnType<typeof authActions.setIsLoggedIn>
//     | ReturnType<typeof authActions.setIsInitialised>
//     | ReturnType<typeof authActions.setNickname>
//     | AppActionsType

// const _authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         case 'login/SET-IS-INITIALISED':
//             return {...state, isInitialised: action.value}
//         case 'login/SET-IS-NICKNAME':
//             return {...state, nickname: action.nickname}
//         default:
//             return state
//     }
// }
// // actions
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)
// export const setIsInitialisedAC = (value: boolean) =>
//     ({type: 'login/SET-IS-INITIALISED', value} as const)
// export const setNicknameAC = (nickname: string | null) =>
//     ({type: 'login/SET-IS-NICKNAME', nickname} as const)
