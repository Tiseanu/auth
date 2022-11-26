import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer; // in case the user loggedOut manually

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

const getStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expDate');

    const remainingTime = tokenExpiredIn(storedExpirationDate);
    if (remainingTime <= 60000) { // 1minute
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        return null;
    }

    return {storedToken, remainingTime};
}

export const AuthContextProvider = (props) => { // my component
    const tokenData = getStoredToken();
    let initialToken;
    if (tokenData) { // if is truthy - will not return a false value like null
        initialToken = tokenData.storedToken;
    }

    const [token, setToken] = useState(initialToken);
    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);
    
    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expDate', expirationTime);
        logoutTimer = setTimeout(logoutHandler, tokenExpiredIn(expirationTime));
    };

    useEffect(() => {
        if (tokenData) {
            console.log(tokenData); // on each redered of app this should get smaller
            logoutTimer = setTimeout(logoutHandler, tokenExpiredIn(tokenData.remainingTime));
        }
    }, [tokenData, logoutHandler]);

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