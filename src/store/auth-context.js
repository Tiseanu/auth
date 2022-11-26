import React, { useState } from 'react';

const AuthContext = React.createContext({ // the blueprint
    token: '',
    isLoggedin: false,
    login: (token) => { },
    logout: () => { }
});

const tokenExpiredIn = (expTime) => {
    const currentTime = new Date().getTime();
    const conv2Date = new Date(expTime).getTime();
    return conv2Date - currentTime; // in miliseconds
};

export const AuthContextProvider = (props) => { // my component
    const [token, setToken] = useState(localStorage.getItem('token'));
    const userIsLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
    };
    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        setTimeout(logoutHandler, tokenExpiredIn(expirationTime));
    };

    const contextValue = {
        token,
        isLoggedin: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;