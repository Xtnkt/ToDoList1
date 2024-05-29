import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "components/AddItemForm";
import {EditableSpan} from "components/EditableSpan";
import {Task} from "features/TodolistList/TodoList/Task/Task";
import {AppDispatch} from "store/store";
import {tasksThunks} from "features/TodolistList/tasks-reducer";
import {ResponseTasksType, TaskStatuses} from "api/todolist-api";
import {FilterButtonType} from "features/TodolistList/todolists-reducer";
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import DeleteIcon from "@mui/icons-material/Delete";
import {RequestStatusType} from "app/app-reducer";

export type TodolistProps = {
    todoListId: string
    title: string,
    filter: FilterButtonType,
    tasks: ResponseTasksType[],
    entityStatus: RequestStatusType,

    addTask: (todoListId: string, newTitle: string) => void,
    removeTask: (taskId: string, todoListId: string) => void,
    changeTaskStatus: (todoListId: string, taskId: string, status: TaskStatuses) => void,
    changeTuskTitle: (taskId: string, title: string, todoListId: string) => void,
    removeTodoList: (todoListId: string) => void
    changeTodoListFilter: (filterValue: FilterButtonType, todoListId: string) => void,
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export const Todolist = React.memo((props: TodolistProps) => {

    const dispatch = AppDispatch()

    useEffect(() => {
        dispatch(tasksThunks.getTasks(props.todoListId))
    }, [])

    const tsarChangeFilter = useCallback((filterValue: FilterButtonType) =>
        () => props.changeTodoListFilter(filterValue, props.todoListId), [props.changeTodoListFilter, props.todoListId])

    let tasks = props.tasks
    if (props.filter === 'Active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === 'Completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const addTaskHandler = useCallback((title: string) => {
        props.addTask(props.todoListId, title)
    }, [props.addTask, props.todoListId]);

    const removeTodoListHandler = useCallback(() => {
        props.removeTodoList(props.todoListId)
    }, [props.removeTodoList, props.todoListId]);

    const changeTodoListTitle = useCallback((title: string) => {
        props.changeTodoListTitle(title, props.todoListId)
    }, [props.changeTodoListTitle, props.todoListId]);

    const mapTasks = tasks.map((t) => {
        return (
            <Task key={t.id}
                  task={t}
                  todoId={props.todoListId}
                  entityStatus={props.entityStatus}
                  removeTask={props.removeTask}
                  changeTuskTitle={props.changeTuskTitle}
                  changeTaskStatus={props.changeTaskStatus}/>
        )
    })

    return (
        <div>
            <h3 style={{marginTop: '0px'}}>
                <EditableSpan disabled={props.entityStatus === 'loading'} title={props.title}
                              changeTitle={changeTodoListTitle}/>
                <IconButton disabled={props.entityStatus === 'loading'} aria-label="delete" color="default"
                            onClick={removeTodoListHandler} size={'small'}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler} disabled={props.entityStatus === 'loading'}/>
            <List>
                {mapTasks}
            </List>
            <ButtonGroup
                fullWidth
                disableElevation
                variant={'contained'}
                size={'small'}
            >
                <ButtonWithMemo
                    onClick={tsarChangeFilter('All')}
                    color={props.filter === 'All' ? "secondary" : 'primary'}
                    title={'All'}
                />
                <ButtonWithMemo
                    onClick={tsarChangeFilter('Active')}
                    color={props.filter === 'Active' ? "secondary" : 'primary'}
                    title={'Active'}
                />
                <ButtonWithMemo
                    onClick={tsarChangeFilter('Completed')}
                    color={props.filter === 'Completed' ? "secondary" : 'primary'}
                    title={'Completed'}
                />
            </ButtonGroup>
        </div>
    )
})

type ButtonWithMemoPropsType = {
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    onClick: () => void,
    title: string
}
const ButtonWithMemo = React.memo((props: ButtonWithMemoPropsType) => {
    return (
        <Button
            size={'small'}
            fullWidth
            disableElevation
            variant={'contained'}
            color={props.color}
            style={{marginRight: '5px'}}
            // className={props.filter === 'Active' ? styles.activeFilter : ''}
            onClick={props.onClick}
        >{props.title}</Button>
    )
})

