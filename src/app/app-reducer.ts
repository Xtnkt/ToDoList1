import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type AppInitialStateType = typeof initialState

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoadingStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        }
    }
})
export const appReducer = slice.reducer
export const appActions = slice.actions


//
// export type AppActionsType = SetLoadingStatusAT | SetErrorAT

// type InitialStateType = typeof initialState

// export type SetLoadingStatusAT = ReturnType<typeof setLoadingStatusAC>
// export type SetErrorAT = ReturnType<typeof setErrorAC>
//
// export const setLoadingStatusAC = (status: RequestStatusType) =>
//     ({type: 'APP/SET-STATUS', status} as const)
// export const setErrorAC = (error: null | string) =>
//     ({type: 'APP/SET-ERROR', error} as const)

//
// export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         default:
//             return state
//     }
// }

