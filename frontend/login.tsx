import { observer } from 'mobx-react';
import * as React from 'react';
import { authService } from './auth-service';

export const Login = observer(() =>
    <section className="header">
        <br />
        <br />
        <h1>Material Manager</h1>

        <form onSubmit={e => { e.preventDefault(); authService.login() } }>
            <div className="row">
                <div className="four columns">
                    <label htmlFor="loginEmail">Your email</label>
                    <input className="u-full-width" type="email" id="loginEmail" onChange={e => { e.preventDefault(); authService.email = e.target.value } }></input>
                </div>
                <div className="four columns">
                    <label htmlFor="loginPassword">Your password</label>
                    <input className="u-full-width" type="password" id="loginPassword" onChange={e => { e.preventDefault(); authService.password = e.target.value } }></input>
                </div>
                <div className="two columns">
                    <label>&nbsp;</label>
                    <input className="button-primary" type="submit" value="Submit" />
                </div>
            </div>
        </form>

        {authService.authError ? <div>Invalid Credentials</div> : <div></div>}
    </section>
);