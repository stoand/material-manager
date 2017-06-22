import { authService } from './auth-service';

export const req = (url, reqData = {}) => {
    return fetch('./proxy.php', {
        method: 'POST',
        headers: new Headers({ 'X-Proxy-URL': url, 'Content-Type': 'application/json', 'Auth-Token': localStorage.getItem('authToken') }),
        body: JSON.stringify(reqData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                if (data.error == 'unauthorized') authService.authToken = undefined;
                return data;
            } else {
                return data;
            }
        });
}