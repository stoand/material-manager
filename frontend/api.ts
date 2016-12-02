import { authService } from './auth-service';

export const req = (url, reqData = {}) => {
    return fetch(url, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', 'Auth-Token': localStorage.getItem('authToken') }),
        body: JSON.stringify(reqData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                if (data.error == 'unauthorized') authService.authToken = undefined;
            } else {
                return data;
            }
        });
}