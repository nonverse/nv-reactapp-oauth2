import axios from "axios";

class api {

    async initialise() {
        const query = new URLSearchParams(window.location.search)
        return await axios.post('/initialize', {
            code: query.get('code')
        })
    }

    async get(url) {
        return await axios.post('/api/forward-request', {
            method: 'GET',
            target: 'api',
            url: url
        })
            .catch(e => {
                this.requestAuthorization(e)
            })
    }

    async post(url, data, withToken) {
        return await axios.post('/api/forward-request', {
            method: 'POST',
            target: 'api',
            url: url,
            data: {
                ...data,
                ...(withToken && {requires_authorization: true})
            }
        })
            .catch(e => {
                this.requestAuthorization(e)
            })
    }

    requestAuthorization(e) {
        if (e.response.status === 401) {
            window.location = e.response.data.data.auth_url
        } else {
            throw e
        }
    }

}

export default new api()
