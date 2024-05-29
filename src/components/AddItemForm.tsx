import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import styles from "features/TodolistList/TodoList/TodoList.module.css";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddBoxRounded from "@mui/icons-material/AddBoxRounded";


type AddItemFormPropsType = {
    addItem: (title: string) => void,
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<null | string>(null)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        error && setError(null)
        setTitle(event.currentTarget.value)
    }
    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        error && setError(null)
        if (event.key === 'Enter') {
            addItemHandler()
        }
    }
    const addItemHandler = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle !== '') {
            props.addItem(trimmedTitle)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    return (
        <div>
            <TextField variant="outlined"
                       size={'small'}
                       label={'New task'}
                       value={title}
                       onKeyDown={onKeyPressHandler}
                       onChange={onChangeHandler}
                       error={!!error}
                       disabled={props.disabled}
            />
            <IconButton color={"primary"} size={'medium'} onClick={addItemHandler} disabled={props.disabled}>
                <AddBoxRounded/>
            </IconButton>
            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
});

