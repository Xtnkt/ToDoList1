import React, {memo, useCallback} from 'react';
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import styles from "features/TodolistList/TodoList/TodoList.module.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {CheckBox} from "components/CheckBox";
import {EditableSpan} from "components/EditableSpan";
import {ResponseTasksType, TaskStatuses} from "api/todolist-api";
import {RequestStatusType} from "app/app-reducer";

export type TaskPropsType = {
    task: ResponseTasksType,
    todoId: string,
    entityStatus: RequestStatusType,
    removeTask: (taskId: string, todoListId: string) => void,
    changeTuskTitle: (taskId: string, title: string, todoListId: string) => void,
    changeTaskStatus: (todoListId: string, taskId: string, status: TaskStatuses) => void,
}

export const Task = memo(({
                              task,
                              todoId,
                              removeTask,
                              changeTuskTitle,
                              changeTaskStatus,
                              entityStatus
                          }: TaskPropsType) => {

    const removeTaskHandler = useCallback(() => {
        removeTask(task.id, todoId)
    }, [task.id, todoId]);
    const changeTuskTitleHandler = useCallback((newTitle: string) => {
        changeTuskTitle(task.id, newTitle, todoId)
    }, [task.id, todoId]);

    const changeTaskStatusHandler = useCallback((status: TaskStatuses) => {
        changeTaskStatus(todoId, task.id, status)
    }, [task.id, todoId]);

    return (
        <ListItem key={task.id}
                  className={task.status === TaskStatuses.Completed ? styles.isDone : ''}
                  style={{padding: '0px'}}>
            <IconButton disabled={entityStatus === 'loading'} aria-label="delete" color="default"
                        onClick={removeTaskHandler} size={'small'}>
                <DeleteIcon/>
            </IconButton>
            <CheckBox checked={task.status === TaskStatuses.Completed}
                      callBack={(status) => changeTaskStatusHandler(status)}
                      disabled={entityStatus === 'loading'}
            />
            <EditableSpan title={task.title} changeTitle={changeTuskTitleHandler}/>
        </ListItem>
    )
});

export default Task;