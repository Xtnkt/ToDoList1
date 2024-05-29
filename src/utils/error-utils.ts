import {Dispatch} from "redux";
import {ResponseType} from "api/todolist-api";
import {appActions} from "app/app-reducer";

export const handleServerNetworkError = (dispatch: Dispatch, error: { message: string }) => {
    dispatch(appActions.setError({error: error.message ? error.message : 'Some error'}))
    dispatch(appActions.setLoadingStatus({status: 'failed'}))
}
export const handleServerAppError = <T>(dispatch: Dispatch, data: ResponseType<T>) => {
    if (data.messages.length) {
        dispatch(appActions.setError({error: data.messages[0]}))
    } else {
        dispatch(appActions.setError({error: 'Some error'}))
    }
    dispatch(appActions.setLoadingStatus({status: 'failed'}))
}