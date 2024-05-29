import React, {useState} from 'react';
import 'app/App.module.css';
import {Todolist} from "features/TodolistList/TodoList/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "components/AddItemForm";
import Typography from "@mui/material/Typography";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material//Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Menu from "@mui/icons-material/Menu";
import {FilterButtonType} from "features/TodolistList/todolists-reducer";
import {ResponseTasksType, TaskStatuses} from "api/todolist-api";
import {RequestStatusType} from "app/app-reducer";

export type TodoListType = {
    id: string,
    title: string,
    filter: FilterButtonType,
    entityStatus:RequestStatusType
}

export type TasksStateType = {
    [todoListId: string]: ResponseTasksType[],
}

function _App() {
    //BLL
    const todoListId_1 = v1()
    const todoListId_2 = v1()
    const [todoLists, setTodoLists] = useState<TodoListType[]>([
        {id: todoListId_1, title: "What to learn", filter: 'All', entityStatus:'idle'},
        {id: todoListId_2, title: "What to buy", filter: 'All',entityStatus:'idle'},
    ])
    const [tasks, setTasks] = useState<TasksStateType>({
        [todoListId_1]: [
            {
                id: v1(), title: "HTML&CSS", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
            {
                id: v1(), title: "JS", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
            {
                id: v1(), title: "ReactJS", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
            {
                id: v1(), title: "Redux", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
        ],
        [todoListId_2]: [
            {
                id: v1(), title: "Water", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
            {
                id: v1(), title: "Beer", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
            {
                id: v1(), title: "Paper", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
            {
                id: v1(), title: "Milk", description: '',
                status: 0, priority: 0, startDate: '', deadline: '',
                todoListId: '', order: 0, addedDate: ''
            },
        ],
    })
    //BLL

    //Tasks
    //Delete:
    const removeTask = (taskId: string, todoListId: string) => {
        // const copyTasks = {...tasks}
        // copyTasks[todoListId] = copyTasks[todoListId].filter((t) => t.id !== taskId)
        // setTasks(copyTasks)
        setTasks({...tasks, [todoListId]: tasks[todoListId].filter((t) => t.id !== taskId)})
    }
    //Create:
    const addTask = (newTitle: string, todoListId: string) => {
        const newTask: ResponseTasksType = {
            id: v1(),
            title: newTitle,
            description: '',
            status: 0, priority: 0, startDate: '', deadline: '',
            todoListId: '', order: 0, addedDate: ''
        }
        setTasks({
            ...tasks,
            [todoListId]: [newTask, ...tasks[todoListId]]
        })
    }
    //Update:
    const changeIsDone = (newId: any, newIsDone: any, todoListId: any) => {
        setTasks({
            ...tasks,
            [todoListId]: tasks[todoListId].map(t => t.id === newId
                ? {...t, isDone: newIsDone} : t)
        })
    }
    const changeTuskTitle = (taskId: string, title: string, todoListId: string) => {
        setTasks({
            ...tasks,
            [todoListId]: tasks[todoListId].map(t => t.id === taskId
                ? {...t, title: title}
                : t)
        })
    }

    //TodoLists
    //Delete:
    const removeTodoList = (todoListId: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListId))
        delete tasks[todoListId]
        setTasks({...tasks})
    }
    //Create:
    const addTodoList = (title: string) => {
        const newTodoListId: string = v1();
        const newTodoList: TodoListType = {
            id: newTodoListId,
            title: title,
            filter: 'All',
            entityStatus:"idle"

        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoListId]: []})
    }
    //Update:
    const changeTodoListFilter = (filter: FilterButtonType, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, filter: filter} : tl))
    }
    const changeTodoListTitle = (title: string, todoListId: string) => {
        setTodoLists(todoLists.map(tl => tl.id === todoListId ? {...tl, title: title} : tl))
    }


    //Update:
    const getFilteredTasks = (value: FilterButtonType, t: Array<ResponseTasksType>) => {
        let tasksForToDoList = t;
        if (value === 'Active') {
            tasksForToDoList = t.filter(t => t.status === TaskStatuses.New);
        }
        if (value === 'Completed') {
            tasksForToDoList = t.filter(t => t.status === TaskStatuses.Completed);
        }
        return tasksForToDoList
    }

    const todoListComponents = todoLists.map(tl => {
        const filteredTasks = getFilteredTasks(tl.filter, tasks[tl.id])
        return (
            <Grid item key={tl.id}>
                <Paper
                    elevation={8}
                    style={{width: '290px', padding: '20px'}}>
                    <Todolist
                        todoListId={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={filteredTasks}
                        entityStatus={tl.entityStatus}

                        addTask={addTask}
                        removeTask={removeTask}
                        changeTaskStatus={changeIsDone}
                        changeTuskTitle={changeTuskTitle}
                        removeTodoList={removeTodoList}
                        changeTodoListFilter={changeTodoListFilter}
                        changeTodoListTitle={changeTodoListTitle}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: 'space-between'}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        TodoLists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container style={{padding: '20px 0'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5}>
                    {todoListComponents}
                </Grid>
            </Container>
        </div>
    );
}

export default _App;
