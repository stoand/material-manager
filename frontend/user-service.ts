import { action, observable, computed, autorun, extendObservable } from 'mobx';
import { authService } from './auth-service';
import { req } from './api';

class UserService {
    @observable users = [];
    @observable editing = [];

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

    isEditing(user, field) {
        return this.editing.find(edit => edit.user == user && edit.field == field);
    }

    @action loadUsers() {
        req('/api/admin/user/list').then(data => this.users = data.users);
    }

    @action saveEdit(edit) {
        let previousValue = edit.user[edit.field];
        edit.user[edit.field] = edit.editedValue;
        edit.saving = true;

        req('/api/admin/user/update', { user: edit.user }).then(data => {
            if (!data.success) {
                edit.user[edit.field] = previousValue;
            }
            this.editing.remove(edit);
        });
    }

    @action revertEdit(edit) {
        this.editing.remove(edit);
    }

    @action editField(user, field) {
        this.editing.push({ user, field, editedValue: user[field], saving: false });
        console.log(this.editing);

    }
}

export const userService = new UserService();