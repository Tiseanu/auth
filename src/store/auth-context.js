import React, { useState } from 'react';

const AuthContext = React.createContext({ // the blueprint
    token: '',
    isLoggedin: false,
    login: (token) => { },
    logout: () => { }
});

export const AuthContextProvider = (props) => { // my component
    const [token, setToken] = useState(localStorage.getItem('token'));
    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
    };
    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
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