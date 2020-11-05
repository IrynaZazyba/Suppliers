export default class RequestService {

    async postResource(url, body) {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        const res = await fetch(url, requestOptions);
        if (!res.ok) {
            throw Error(`Couldn't fetch ${url} status: ${res.status}`);
        }
        return await res.json();
    };

    async putResource(url, body) {

        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };

        const res = await fetch(url, requestOptions);
        if (!res.ok) {
            throw Error(`Couldn't fetch ${url} status: ${res.status}`);
        }
        return await res.json();
    };

}
