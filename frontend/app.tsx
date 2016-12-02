import './app.less';
import { observer } from 'mobx-react';
import { observable, computed, autorun } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'es6-promise/auto';
import 'whatwg-fetch';
import { Login } from './login';
import { Users } from './users';
import { authService } from './auth-service';

let root = document.createElement('div');
document.querySelector('body').appendChild(root);

const App = observer(() =>
  <div> authtoken: {authService.authToken} <button onClick={e => {e.preventDefault(); authService.logout()}}>Logout</button> {
    authService.loading ? <div>Loading</div> :
      authService.authToken ? <Users /> : <Login />
  } </div>
);

ReactDOM.render(<div className="container"><App /></div>, root);

// class ObservableTodoStore {
//   @observable todos = [];
//   @observable pendingRequests = 0;

//   constructor() {
//     autorun(() => console.log(this.report));
//   }

//   @computed get completedTodosCount() {
//     return this.todos.filter(
//       todo => todo.completed === true
//     ).length;
//   }

//   @computed get report() {
//     if (this.todos.length === 0)
//       return "<none>";
//     return `Next todo: "${this.todos[0].task}". ` +
//       `Progress: ${this.completedTodosCount}/${this.todos.length}`;
//   }

//   addTodo(task) {
//     this.todos.push({
//       task: task,
//       completed: false,
//       assignee: null
//     });
//   }
// }

// const observableTodoStore = new ObservableTodoStore();

// @observer
// class TodoList extends React.Component {
//   render() {
//     const store = this.props.store;
//     return (
//       <div>
//         {store.report}
//         <ul>
//           {store.todos.map(
//             (todo, idx) => <TodoView todo={todo} key={idx} />
//           )}
//         </ul>
//         {store.pendingRequests > 0 ? <marquee>Loading...</marquee> : null}
//         <button onClick={this.onNewTodo}>New Todo</button>
//         <small> (double-click a todo to edit)</small>
//       </div>
//     );
//   }

//   onNewTodo = () => {
//     this.props.store.addTodo(prompt('Enter a new todo:', 'coffee plz'));
//   }
// }

// @observer
// class TodoView extends React.Component {
//   render() {
//     const todo = this.props.todo;
//     return (
//       <li onDoubleClick={this.onRename}>
//         <input
//           type='checkbox'
//           checked={todo.completed}
//           onChange={this.onToggleCompleted}
//           />
//         {todo.task}
//         {todo.assignee
//           ? <small>{todo.assignee.name}</small>
//           : null
//         }
//       </li>
//     );
//   }

//   onToggleCompleted = () => {
//     const todo = this.props.todo;
//     todo.completed = !todo.completed;
//   }

//   onRename = () => {
//     const todo = this.props.todo;
//     todo.task = prompt('Task name', todo.task) || todo.task;
//   }
// }
