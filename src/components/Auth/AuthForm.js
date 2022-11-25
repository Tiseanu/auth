import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [messageRegister, setMessageRegister] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const emailInput = useRef();
  const passInput = useRef();

  const authCtx = useContext(AuthContext);// get access to the context and it's properties

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitFct = (e) => {
    e.preventDefault();
    const enteredEmail = emailInput.current.value;
    const enteredPass = passInput.current.value;

    // maybe some validation

    setIsLoading(true);
    let urlAPI;
    let apiMessage;
    if (isLogin) { // login
      urlAPI = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAAKXSX-8HViGef8b_tGY75oNNW2pVaLgE";
    } else { // register
      urlAPI = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAAKXSX-8HViGef8b_tGY75oNNW2pVaLgE";
    }

      fetch(urlAPI, {
          method: 'POST',
          body: JSON.stringify({ email: enteredEmail, password: enteredPass, returnSecureToken: true }),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(resp => {
          setIsLoading(false);
          if (resp.ok) {
            return resp.json().then(data => {
              console.log(1, data);
              authCtx.login(data.idToken);
              setMessageRegister('You are now loggedin!');
            });
          } else { // errors
            return resp.json().then(data => {
              console.log(2, data);
              if (data && data.error && data.error.message) {
                apiMessage = data.error.message;
              }
              setMessageRegister(apiMessage);
            });
          }
        });

  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <i className={classes.message}>{messageRegister}</i>
      <form onSubmit={submitFct}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInput} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passInput} required />
        </div>
        {!isLoading &&
          <div className={classes.actions}>
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
            <button type='button' className={classes.toggle} onClick={switchAuthModeHandler}>
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          </div>
        }
        {isLoading && <p className={classes.loading}>Loading...</p>}
      </form>
    </section>
  );
};

export default AuthForm;
