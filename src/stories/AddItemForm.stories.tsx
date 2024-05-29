import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {AddItemForm} from "components/AddItemForm";
import {action} from "@storybook/addon-actions";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import AddBoxRounded from "@mui/icons-material/AddBoxRounded";
import styles from "features/TodolistList/TodoList/TodoList.module.css";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'TODOLISTS/AddItemForm',
  component: AddItemForm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    addItem: {
      description:'Button clicked inside form'
    }
  },
} as ComponentMeta<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AddItemFormStory.args = {
  addItem:action('Button clicked')
};

const TemplateWithError:ComponentStory<typeof AddItemForm>=(args)=>{

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
      args.addItem(trimmedTitle)
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
        />
        <IconButton color={"primary"} size={'medium'} onClick={() => addItemHandler()}>
          <AddBoxRounded/>
        </IconButton>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
  );
};
export const AddItemFormWithErrorStory = TemplateWithError.bind({})


