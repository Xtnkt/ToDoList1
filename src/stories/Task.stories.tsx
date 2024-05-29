import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import Task from "features/TodolistList/TodoList/Task/Task";
import {ReduxStoreProviderDecorator} from "store/ReduxStoreProviderDecorator";
import {TaskStatuses} from "api/todolist-api";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'TODOLISTS/Task',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        task: {
            id: 'dq', title: 'dqw', description: '',
            status: TaskStatuses.Completed, priority: 0, startDate: '', deadline: '',
            todoListId: '', order: 0, addedDate: ''
        },
        todolistID: 'dqw'
    },
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {
        id: 'dq', title: 'dqw', description: '',
        status: TaskStatuses.New, priority: 0, startDate: '', deadline: '',
        todoListId: '', order: 0, addedDate: ''
    },
};


