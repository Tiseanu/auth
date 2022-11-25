import React, { useState } from 'react';

const AuthContext = React.createContext({ // the blueprint
    token: '',
    isLoggedin: false,
    login: (token) => { },
    logout: () => { }
});

export const AuthContextProvider = (props) => { // my component
    const [token, setToken] = useState(null);
    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
    };
    const logoutHandler = () => {
        setToken(null);
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