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
// import { userService } from './s-service';

let root = document.createElement('div');
document.querySelector('body').appendChild(root);

const App = observer(() =>
  <div> {
    authService.loading ? <div>Loading</div> :
      !authService.authToken ? <Login /> :
        <div>
          <br />
          <button onClick={e => { e.preventDefault(); authService.logout() } }>Logout</button>
          <Users />
        </div>
  } </div>
);

ReactDOM.render(<div className="container"><App /></div>, root);
