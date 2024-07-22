import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { history, fetchWrapper } from '_helpers';

// create slice

const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, reducers, extraReducers });

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user')),
        u_name:localStorage.getItem('Username'),
        Display_name:localStorage.getItem('user.DisplayName'),
        Email:JSON.parse(localStorage.getItem('user.EmailAddress')),
        Roleid:JSON.parse(localStorage.getItem('user.RoleID')),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.user = null;
        localStorage.removeItem('user');
        history.navigate('/login');
    }
}

function createExtraActions() {
    const baseUrl = `https://indiamfg.engg.lenovo.com/KPI/KPI_API/api`;

    return {
        login: login()
    };

    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async ({ userID, password }) => await fetchWrapper.post(`${baseUrl}/Login/Authenticate`, { userID, password })
        );
    }
}

function createExtraReducers() {
    return {
        ...login()
    };

    function login() {
        var { pending, fulfilled, rejected } = extraActions.login;
        return {
            [pending]: (state) => {
                state.error = null;
            },
            [fulfilled]: (state, action) => {
                const user = action.payload;

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('UserName', JSON.stringify(user.Username));
                localStorage.setItem('Displayname', JSON.stringify(user.DisplayName));
                localStorage.setItem('JWTToken', JSON.stringify(user.JWTToken));
                state.user = user;

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.navigate(from);
            },
            [rejected]: (state, action) => {
                state.error = action.error;
            }
        };
    }
}
