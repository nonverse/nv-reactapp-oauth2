import {createSlice} from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modal',
    initialState: {},
    reducers: {
        renderModal: (state, action) => {
            state.value = action.payload
        },

        closeModal: (state) => {
            state.value = {}
        },
    }
})

export const { renderModal, closeModal } = modalSlice.actions
export default modalSlice.reducer