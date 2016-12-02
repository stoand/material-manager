import { action, observable, computed, autorun, extendObservable } from 'mobx';
import { authService } from './auth-service';
import { req } from './api';

class UserService {
    @observable users = [];
    @observable editing = [];
    @observable newUser = {
        name_en: '',
        name_ar: '',
        phone: '',
        email: '',
        type: 4,
    };
    @observable newUserError = '';
    @observable savingNewUser = false;

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
            edit.saving = false;
            if (data.error == 'email_not_unique') {
                edit.error = 'Email not Unique'
            } else {
                if (!data.success) {
                    edit.user[edit.field] = previousValue;
                } else {
                    this.editing.remove(edit);
                }
            }
        });
    }

    @action revertEdit(edit) {
        this.editing.remove(edit);
    }

    @action editField(user, field) {
        this.editing.push({ user, field, editedValue: user[field], saving: false, error: '' });
    }

    @action createNew() {
        if (Object.keys(this.newUser).filter(field => this.newUser[field] != 'phone' && this.newUser[field] == '').length > 0) {
            this.newUserError = 'No fields may be empty';
        } else {
            this.newUserError = '';
            this.savingNewUser = true;
            req('/api/admin/user/create', { user: this.newUser }).then(data => {
                this.savingNewUser = false;
                if (data.error) {
                    this.newUserError = data.error === 'email_not_unique' ? 'Email not Unique' : 'Unknown Error';
                } else {
                    this.loadUsers();
                }
            });
        }
    }
}

export const userService = new UserService();