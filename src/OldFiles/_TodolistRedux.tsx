import React, {FC} from 'react';
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from "@mui/icons-material/Delete";
import {CheckBox} from "components/CheckBox";
import {EditableSpan} from "components/EditableSpan";
import {AddItemForm} from "components/AddItemForm";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "store/store";
import {tasksActions} from "features/TodolistList/tasks-reducer";
import {
    FilterButtonType,
    todolistsActions,
    TodolistDomainType
} from "features/TodolistList/todolists-reducer";
import {ResponseTasksType, TaskStatuses} from "api/todolist-api";

export type TodolistReduxPropsType = {
    todoList: TodolistDomainType
}

export const _TodolistRedux: FC<TodolistReduxPropsType> = ({todoList}) => {

    const {id, title, filter} = todoList

    let tasks = useSelector<AppRootStateType, ResponseTasksType[]>((state) => state.tasks[id])
    const dispatch = useDispatch()

    const tsarChangeFilter = (filterValue: FilterButtonType) =>
        () => dispatch(todolistsActions.changeTodoListFilter({newFilter:filterValue, id:id}))

    if (filter === 'Active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (filter === 'Completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const addTaskHandler = (title: any) => {
        let action = tasksActions.addTask(title)
        dispatch(action)
    }
    const removeTaskHandler = (tId: string) => {
        let action = tasksActions.removeTask({taskId:tId, todolistId:id})
        dispatch(action)
    }
    const changeIsDoneHandler = (status:any) => {
        let action = tasksActions.changeTaskStatus({todolistId:'dwq', taskId:'dwq', status})
        dispatch(action)
    }
    const removeTodoListHandler = () => {
        let action = todolistsActions.removeTodoList({id})
        dispatch(action)
    }
    const changeTodoListTitle = (title: string) => {
        let action = todolistsActions.changeTodoListTitle({newTodolistTitle:title, id})
        dispatch(action)
    }

    const mapTasks = tasks.map((t) => {

        const changeTuskTitle = (title: string) => {
            let action = tasksActions.changeTaskTitle({taskId:t.id, title, todolistId:id})
            dispatch(action)
        }
        return (
            <ListItem key={t.id}
                      style={{padding: '0px'}}>
                <IconButton aria-label="delete" color="default" onClick={() => removeTaskHandler(t.id)} size={'small'}>
                    <DeleteIcon/>
                </IconButton>
                <CheckBox checked={false}
                          callBack={(status) => changeIsDoneHandler(status)}
                />
                <EditableSpan title={t.title} changeTitle={changeTuskTitle}/>
            </ListItem>
        )
    })

    return (
        <div>
            <h3 style={{marginTop: '0px'}}>
                <EditableSpan title={title} changeTitle={changeTodoListTitle}/>
                <IconButton aria-label="delete" color="default" onClick={removeTodoListHandler} size={'small'}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskHandler}/>
            <List>
                {mapTasks}
            </List>
            <ButtonGroup
                fullWidth
                disableElevation
                variant={'contained'}
                size={'small'}
            >
                <Button
                    color={filter === 'All' ? "secondary" : 'primary'}
                    style={{marginRight: '5px'}}
                    // className={props.filter === 'All' ? styles.activeFilter : ''}
                    onClick={tsarChangeFilter('All')}
                >All</Button>
                <Button
                    color={filter === 'Active' ? "secondary" : 'primary'}
                    style={{marginRight: '5px'}}
                    // className={props.filter === 'Active' ? styles.activeFilter : ''}
                    onClick={tsarChangeFilter('Active')}
                >Active</Button>
                <Button
                    color={filter === 'Completed' ? "secondary" : 'primary'}
                    // className={props.filter === 'Completed' ? styles.activeFilter : ''}
                    onClick={tsarChangeFilter('Completed')}
                >Completed</Button>
            </ButtonGroup>
        </div>
    )
};
