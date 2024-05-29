import {AppRootStateType} from "store/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
export const selectIsInitialised = (state: AppRootStateType) => state.auth.isInitialised
export const selectNickname = (state: AppRootStateType) => state.auth.nickname