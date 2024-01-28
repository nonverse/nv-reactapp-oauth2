import axios from "axios";
import api from "@/scripts/api.js";
import store from "@/state/store.js";

class auth {

    async authorizationToken(actionId) {
        return await axios.post('/api/authorization-token/check', {
            action_id: actionId
        })
            .catch(e => {
                if (e.response.status === 401) {
                    return window.location = `${import.meta.env.VITE_AUTH_SERVER}authorize?host=${window.location.host}&resource=${window.location.pathname}&state=${JSON.stringify(store.getState().application)}&action_id=${actionId}`
                }
            })
    }

    async get(url) {
        return await axios.post('/api/forward-request', {
            method: 'GET',
            target: 'auth',
            url: url
        })
            .catch(e => {
                api.requestAuthorization(e)
            })
    }

    async post(url, data) {
        return await axios.post('/api/forward-request', {
            method: 'POST',
            target: 'auth',
            url: url,
            data: {...data}
        })
            .catch(e => {
                api.requestAuthorization(e)
            })
    }

}

export default new auth()
