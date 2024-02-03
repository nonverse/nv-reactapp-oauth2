import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        name_first: '',
        name_last: '',
        email: '',
        phone: '',
        dob: ''
    },
    reducers: {
        updateUser: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
