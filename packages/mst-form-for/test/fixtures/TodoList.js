import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Field } from '../../src';

import { Todo } from './Todo';

@observer
export class TodoList extends React.Component {
  @observable newTodoTitle = '';

  handleChange = e => {
    this.newTodoTitle = e.target.value;
  };

  handleNewTodoClick = () => {
    this.props.onChange(null, this.props.value);
  };

  render() {
    const { todoStore } = this.props;

    return (
      <div>
        <input value={this.newTodoTitle} onChange={this.handleChange} />
        <button onClick={this.handleNewTodoClick}>Add</button>
        <div>{todoStore.todos.map((todo, index) => <Field key={index} name={index} />)}</div>
        Tasks left: {todoStore.unfinishedTodoCount}
      </div>
    );
  }
}
