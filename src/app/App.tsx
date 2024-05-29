import React, {useEffect} from 'react';
import s from 'app/App.module.css';
import {AppDispatch, useAppSelector} from "store/store";
import Typography from "@mui/material/Typography";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Menu from "@mui/icons-material/Menu";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorSnackbar} from "components/ErrorSnackbar";
import {TodoListsList} from "features/TodolistList/TodolistsList";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/login/Login";
import {Error404} from "components/ErrorPage/Error404";
import {logOutTC, meTC} from "features/auth/auth.reducer";
import {RequestStatusType} from "app/app-reducer";
import {CircularProgress} from "@mui/material";
import {selectIsInitialised, selectIsLoggedIn, selectNickname} from "features/auth/auth.selectors";

function App() {
    const dispatch = AppDispatch()
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialised = useAppSelector<boolean>(selectIsInitialised)
    const isLoggedIn = useAppSelector<boolean>(selectIsLoggedIn)
    const nickname = useAppSelector<string | null>(selectNickname)

    const logOutHandler = () => {
        dispatch(logOutTC())
    }

    useEffect(() => {
        dispatch(meTC())
    }, [])

    if (!isInitialised) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
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
                    <div>
                        {isLoggedIn &&
                            <Button color="inherit" variant={"outlined"}>{nickname}</Button>
                        }
                        {isLoggedIn &&
                            <Button color="inherit" variant={"outlined"} onClick={logOutHandler}>Log out</Button>
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <div className={s.linerProgress}>
                {status === 'loading' && <LinearProgress color="secondary"/>}
            </div>
            <Container fixed>
                <Routes>
                    <Route path={'/ToDoList'} element={<TodoListsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<Error404/>}/>
                    <Route path='*' element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
