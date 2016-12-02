import { observer } from 'mobx-react';
import * as React from 'react';
import { userService } from './user-service';

export const Users = observer(() =>
    !userService.users && <div>Loading</div> ||
    <div>
        <br/>
        <br/>
        <h3>Manage Users</h3>
        <table className="u-full-width">
            <thead>
                <tr>
                    <th></th>
                    <th>Name (en)</th>
                    <th>Name (ar)</th>
                    <th>Email</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
                {userService.users.map(user =>
                    <tr>
                        <td><a href="">Edit</a></td>
                        <td>{user.name_en}</td>
                        <td>{user.name_ar}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);