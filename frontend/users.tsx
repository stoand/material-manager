import { observer } from 'mobx-react';
import * as React from 'react';
import { userService } from './user-service';

const editOnChange = (object, property) => event => {
    event.preventDefault();
    object[property] = event.target.value;
}

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
                <span className="edited-field__error">{edit.error}</span>
            </td>;
    });

    let newUser = userService.newUser;

    return !userService.users && <div>Loading</div> ||
        <div>
            <br />
            <br />
            <h3>Manage Users</h3>

            <form onSubmit={e => {e.preventDefault(); userService.createNew() }}>
                <div className="row">
                    <div className="four columns">
                        <label htmlFor="new-user-email">Email</label>
                        <input onChange={editOnChange(newUser, 'email')} className="u-full-width" type="email" id="new-user-email" />
                    </div>
                    <div className="four columns">
                        <label htmlFor="new-user-name-en">Name (en)</label>
                        <input onChange={editOnChange(newUser, 'name_en')} className="u-full-width" type="text" id="new-user-name-en" />
                    </div>
                    <div className="four columns">
                        <label htmlFor="new-user-name-ar">Name (ar)</label>
                        <input onChange={editOnChange(newUser, 'name_ar')} className="u-full-width" type="text" id="new-user-name-ar" />
                    </div>
                </div>
                <div className="row">
                    <div className="four columns">
                        <label htmlFor="new-user-phone">Phone Number</label>
                        <input onChange={editOnChange(newUser, 'phone')} className="u-full-width" type="text" id="new-user-phone" />
                    </div>
                    <div className="three columns">
                        <label htmlFor="exampleRecipientInput">Account Type</label>
                        <select onChange={editOnChange(newUser, 'type')} className="u-full-width" id="exampleRecipientInput">
                            <option value="4">Client</option>
                            <option value="2">Material Entry</option>
                            <option value="1">Admin</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    A random password will be sent to the user's email address.
                    <br/>
                    <div className="form-error">{userService.newUserError}</div>
                </div>
                <input disabled={userService.savingNewUser} className="button-primary" type="submit" value="Create new User" />
            </form>


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
                            <td>
                                <a href="" disabled={!user.email}>Send new<br/>{!user.email && "(Email Missing)"}</a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
});