import { observer } from 'mobx-react';
import * as React from 'react';
import { userService } from './user-service';

export const Users = observer(() => {
    const EditableField = observer(({object, property, type}: any) => {
        if (!type) type = 'text';

        let edit = userService.isEditing(object, property);

        return !edit ?
            <td>{type == 'password' ? '(hidden)' : object[property]}<br />
                <a href="" onClick={e => { e.preventDefault(); userService.editField(object, property) } }>Edit</a>
            </td> :
            <td className="edited-field">
                <input disabled={edit.saving} className="edited-field__input" defaultValue={edit.editedValue} onChange={e => { e.preventDefault(); edit.editedValue = e.target.value } } />
                <a disabled={edit.saving} href="" onClick={e => { e.preventDefault(); userService.saveEdit(edit) } } className="edited-field__save">Save</a>
                <a disabled={edit.saving} href="" onClick={e => { e.preventDefault(); userService.revertEdit(edit) } } className="edited-field__revert">Revert</a>
            </td>;
    });

    return !userService.users && <div>Loading</div> ||
        <div>
            <br />
            <br />
            <h3>Manage Users</h3>
            <table className="u-full-width">
                <thead>
                    <tr>
                        <th>Name (en)</th>
                        <th>Name (ar)</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {userService.users.map(user =>
                        <tr key={user.id}>
                            <EditableField object={user} property={"name_en"} />
                            <EditableField object={user} property={"name_ar"} />
                            <EditableField object={user} property={"email"} />
                            <EditableField object={user} property={"phone"} />
                            <EditableField object={user} property={"password"} type="password" />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
});