import React, {useEffect, useState} from 'react'
import {todolistAPI} from "api/todolist-api";

export default {
    title: 'API'
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodoLists()
            .then((res) => {
                setState(res)
            })
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке

    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title = 'React & Redux'
        todolistAPI.createTodoList(title)
            .then((res) => {
                setState(res)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "40ab0918-a5f8-49d8-9685-401875c4c486"
        todolistAPI.deleteTodoList(todolistId)
            .then((res) => {
                setState(res)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "02fc9896-f5a7-4f19-bf1f-b61b2d350b37"
        const title = 'New title'
        todolistAPI.updateTodolistTitle(todolistId, title)
            .then((res) => {
                setState(res)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "40ab0918-a5f8-49d8-9685-401875c4c486"
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                setState(res)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "7d77ad27-f514-4070-8cb5-84d256878b5e"
        const taskTitle = 'New task2 title'
        todolistAPI.createTask(todolistId, taskTitle)
            .then((res) => {
                setState(res)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "7d77ad27-f514-4070-8cb5-84d256878b5e"
        const taskId = "4b18be00-2990-4c1e-b7f6-636ddc042f47"
        todolistAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "9893b1a9-d2aa-443e-a5df-8541f4bca764"
        const taskId = "a7222675-2e8f-442d-bea8-e8cba0251238"
        todolistAPI.updateTask(todolistId, taskId, {
                title: '4 name',
                description: 'Desc',
                completed: false,
                status: 1,
                priority: 1,
                startDate: "2024-01-08T18:09:23.133",
                deadline: "2025-01-08T18:09:23.133",
            }
        )
            .then((res) => {
                setState(res)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}



