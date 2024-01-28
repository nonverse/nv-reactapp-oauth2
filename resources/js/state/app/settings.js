import {createSlice} from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {},
    reducers: {
        updateSettings: (state, action) => {
            state.value = action.payload
        },
    }
})

export const {updateSettings} = settingsSlice.actions

export default settingsSlice.reducer
