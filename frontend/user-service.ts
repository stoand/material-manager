import { action, observable, computed, autorun } from 'mobx';
import { authService } from './auth-service';
import {req} from './api';

class UserService {
    @observable users = null;

    @observable email = '';
    @observable password = '';
    @observable authError = false;

    constructor() {
        autorun(() => {
            if (authService.authToken) {
                this.loadUsers();
            }
        });
    }

    @action loadUsers() {
        req('/api/admin/user/list').then(data => this.users = data.users);
    }
}

export const userService = new UserService();