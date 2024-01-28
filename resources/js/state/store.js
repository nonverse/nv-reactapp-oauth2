import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./user.js";
import modalReducer from "./app/modal.js"
import settingsReducer from "./app/settings.js"
import notificationReducer from "./app/notification.js"

export default configureStore({
    reducer: {
        user: userReducer,
        application: combineReducers({
            modal: modalReducer,
            settings: settingsReducer,
            notification: notificationReducer,
        })
    },
})
