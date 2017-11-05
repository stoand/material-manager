import { action, observable, computed, autorun } from 'mobx';

class AuthService {
    @observable user = null;
    @observable loading = false;

    @observable email = '';
    @observable password = '';
    @observable authError = false;
    @observable authToken = localStorage.getItem('authToken');

    constructor() {
    }

    @action login() {
        this.authError = false;

        fetch(PROXY ? './proxy.php' : '/api/login', {
            method: 'POST',
            headers: new Headers({ 'X-Proxy-URL': '/api/login', 'Content-Type': 'application/json' }),
            body: JSON.stringify({ email: this.email, password: this.password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.authError = true;
                } else {
                    localStorage.setItem('authToken', data.token);
                    this.user = data.user;
                    this.authToken = data.token;
                }
            });
    }

    @action logout() {
        this.authToken = undefined;
        localStorage.removeItem('authToken');
    }
}

export const authService = new AuthService();