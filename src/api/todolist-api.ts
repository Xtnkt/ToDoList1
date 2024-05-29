import axios, {AxiosResponse} from "axios";
import {FormDataType} from "features/login/Login";

export type ResponseType<T = {}> = {
    data: T,
    fieldsErrors: string[],
    messages: string[],
    resultCode: number,
}
type GetTasksResponse = {
    items: ResponseTasksType[],
    totalCount: number,
    error: string
}

export type ResponseTodoListType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
export type ResponseTasksType = {
    description: string,
    title: string,
    status: TaskStatuses,
    priority: TaskPriorities,
    startDate: string,
    deadline: string,
    id: string,
    todoListId: string,
    order: number
    addedDate: string,
}
export type UpdateTaskType = {
    title: string,
    description: string,
    completed: boolean,
    status: TaskStatuses,
    priority: TaskPriorities,
    startDate: string,
    deadline: string,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum ResultCode {
    SUCCEEDED = 0,
    FAILED = 1,
    CAPTCHA = 10
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        // Не забываем заменить API-KEY на собственный
        'API-KEY': 'b9d6c3d4-1941-4789-a650-d62e367a3af4',
    },
})

export const authAPI = {
    login(data: FormDataType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
            .then((res) => res.data)
    },
    me(){
        return instance.get<ResponseType<{ email:string,id: number,login:string }>>('auth/me')
            .then((res) => res.data)
    },
    logOut(){
        return instance.delete<ResponseType>('auth/login')
            .then((res) => res.data)
    }
}

export const todolistAPI = {
    getTodoLists() {
        return instance.get<ResponseTodoListType[]>('todo-lists')
            .then((res) => res.data)
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<{ item: ResponseTodoListType }>>('todo-lists', {title})
            .then((res) => res.data)
    },
    deleteTodoList(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
            .then((res) => res.data)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
            .then((res) => res.data)
    },

    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
            .then((res) => res.data)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: ResponseTasksType }>>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
            .then((res) => res.data)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
        return instance.put<ResponseType<ResponseTasksType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
            .then((res) => res.data)
    }
}

