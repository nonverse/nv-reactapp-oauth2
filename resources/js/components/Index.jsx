import ReactDOM from 'react-dom';
import {useEffect, useState} from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {updateUser} from "../state/user";
import store from "../state/store.js";
import axios from "axios";
import {renderModal} from "../state/app/modal.js";
import cookies from "../scripts/helpers/cookies.js";
import {updateSettings} from "../state/app/settings.js";
import Logo from "../elements/Logo.jsx";
import {BrowserRouter} from "react-router-dom";
import UserIcon from "./User/UserIcon.jsx";
import ModalPortal from "./ModalPortal.jsx";
import Router from "./Router.jsx";
import NotificationPortal from "./NotificationPortal.jsx";
import UserPopup from "./User/UserPopup.jsx";
import api from "../scripts/api.js";

function Index() {

    /**
     * Status of the initial API call
     * This is used to render some components in order and provide
     * a better user experience
     */
    const [apiStatus, setApiStatus] = useState({
        called: false,
        success: false,
        code: 0
    })

    const dispatch = useDispatch()
    const query = new URLSearchParams(window.location.search)
    const settings = useSelector(state => state.application.settings.value)
    const user = useSelector(state => state.user.value)
    const settingsCookie = cookies.get('settings')

    useEffect(() => {
        api.initialise()
            .then(async response => {
                setApiStatus({...apiStatus, called: true})
                if (response.data.success) {
                    await api.get('user/settings')
                        .then(response => {
                            dispatch(updateSettings(response.data.data))
                        })
                    await api.get('user/store')
                        .then(response => {
                            dispatch(updateUser(response.data.data))
                        })
                    if (query.get('authorization_token')) {
                        await axios.post('/api/authorization-token', query)
                    }
                    if (query.get('state')) {
                        const state = JSON.parse(query.get('state'))
                        dispatch(renderModal(state.modal.value))
                    }
                    setApiStatus({...apiStatus, success: true, code: response.status})
                }
            })
            .catch(e => {
                setApiStatus({...apiStatus, code: e.response.status})
                switch (e.response.status) {
                    case 401:
                        if (document.referrer === import.meta.env.VITE_AUTH_SERVER) {
                            window.location = e.response.data.data.auth_url
                        }
                        break
                    default:
                        break
                }
            })
    }, [dispatch])

    return (
        <div
            className={`app ${(settings && settings.theme) ? settings.theme : `${settingsCookie ? JSON.parse(settingsCookie).theme : 'system'}`}`}
        >
            <Logo/>
            <BrowserRouter>
                <div className="container">
                    {user ? <UserPopup/> : ''}
                    <UserIcon apiStatus={apiStatus}/>
                    <div className="content-wrapper">
                        <ModalPortal/>
                        <NotificationPortal/>
                        <Router/>
                    </div>
                </div>
            </BrowserRouter>
            <span id="signature">Micky & Rex Co<span className="splash">.</span></span>
        </div>
    );
}

export default Index;

if (document.getElementById('root')) {
    ReactDOM.render(
        <Provider store={store}>
            <Index/>
        </Provider>
        , document.getElementById('root')
    );
}
