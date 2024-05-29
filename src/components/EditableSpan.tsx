import React, {ChangeEvent, memo, useState} from 'react';
import TextField from "@mui/material/TextField";

type EditableSpanPropsType = {
    title: string,
    changeTitle: (newTitle: string) => void
    disabled?: boolean
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState(props.title);
    const onEditMode = () => {
        setTitle(props.title)
        setIsEditMode(true)

    }
    const offEditMode = () => {
        setIsEditMode(false)
        props.changeTitle(title)
    }
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {

            setTitle(event.currentTarget.value)


    }
    return (
        isEditMode && !props.disabled
            ?
            <TextField
                value={isEditMode?title:'dqwq'}
                autoFocus
                onBlur={offEditMode}
                onChange={onChangeHandler}/>

            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
});

