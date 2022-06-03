import { configureStore } from "@reduxjs/toolkit";
import { userLoginReducer, userRegisterReducer } from "./reducers/UserReducers";


const userInfoFromLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

const initialState = {
    userLogin: {
        userInfo: userInfoFromLocalStorage,
    }
}

const store = configureStore({
    reducer: {
        userLogin: userLoginReducer,
        userRegister: userRegisterReducer,
    },
    preloadedState: initialState,
})

export default store;