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
import Loader from "./Loader.jsx";

function Index() {

    /**
     * Should the application be rendered if API initialisation fails?
     * This should be set to false if the application relies on data from
     * the API to be displayed unconditionally on load
     * @type {boolean}
     */
    const renderWithoutApiSuccess = true

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

    /**
     * Get query parameters from URL
     * @type {URLSearchParams}
     */
    const query = new URLSearchParams(window.location.search)

    /**
     * Get settings from cookie
     * @type {string|string}
     */
    const settingsCookie = cookies.get('settings')

    /**
     * Get settings from application state
     * @type {string}
     */
    const settings = useSelector(state => state.application.settings.value)

    /**
     * Get user from application state
     * @type {string}
     */
    const user = useSelector(state => state.user.value)

    /**
     * @type {DispatchType}
     */
    const dispatch = useDispatch()

    useEffect(() => {
        /**
         * Log the application into the Nonverse API
         * The Nonverse authentication & authorization server will automatically
         * log a user in upon application authorization
         */
        api.initialise()
            .then(async response => {
                setApiStatus({...apiStatus, called: true})
                if (response.data.success) {
                    /**
                     * Get user settings
                     */
                    await api.get('user/settings')
                        .then(response => {
                            dispatch(updateSettings(response.data.data))
                        })
                    /**
                     * Get user store (data)
                     */
                    await api.get('user/store')
                        .then(response => {
                            dispatch(updateUser(response.data.data))
                        })
                    /**
                     * Check if authorization token is present in the url.
                     * If so, pass it onto the backend for secure storage
                     */
                    if (query.get('authorization_token')) {
                        await axios.post('/api/authorization-token', query)
                    }
                    /**
                     * Check for application state in the url.
                     * If so, restore the application to the desired state
                     */
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
                        /**
                         * By default, the application will ignore authentication errors unless
                         * referred by the Nonverse authentication & authorization server, in which case
                         * the user will be redirected to the auth server to complete the authentication
                         * and/or authorization process. Unless renderWithoutApiSuccess is false, in which
                         * case the user will always be redirected to the auth server if there are
                         * any authentication errors
                         */
                        if (renderWithoutApiSuccess) {
                            if (document.referrer === import.meta.env.VITE_AUTH_SERVER) {
                                window.location = e.response.data.data.auth_url
                            }
                        } else {
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
            {(apiStatus.success || renderWithoutApiSuccess) ?
                <>
                    <Logo/>
                    <BrowserRouter>
                        <div className="container">
                            {/*
                            Comment out the below line if you do not wish for the user popup to be displayed
                            when a user is logged on.
                            It is expected that the popup is not removed if there is no clear indicator of the current
                            user on the landing page of the application
                            */}
                            {user ? <UserPopup/> : ''}

                            {/*
                            In the scenario that the user popup is removed, the below component should be
                            replaced with <UserIconStatic/> to account for the animation delay(s)
                            */}
                            <UserIcon apiStatus={apiStatus}/>

                            {/*
                            Only components that should be rendered application wide should be placed here
                            All other components should be placed inside the router following proper
                            routing structure
                            */}

                            <div className="content-wrapper">
                                <ModalPortal/>
                                <NotificationPortal/>
                                <Router/>
                            </div>
                        </div>
                    </BrowserRouter>
                    {/*This signature MUST be present on all production Nonverse applications*/}
                    <span id="signature">Micky & Rex Co<span className="splash">.</span></span>
                </>
                : <Loader/>
            }
        </div>
    );
}

export default Index;

/**
 * DO NOT EDIT
 */
if (document.getElementById('root')) {
    ReactDOM.render(
        <Provider store={store}>
            <Index/>
        </Provider>
        , document.getElementById('root')
    );
}
