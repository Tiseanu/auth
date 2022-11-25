import { useState, useRef, useContext } from 'react';

import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const [apiMessage, setApiMessage] = useState('');
  const passInput = useRef();
  const authCtx = useContext(AuthContext);

  const changePass = (e) => {
    e.preventDefault();

    let urlAPI = "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAAKXSX-8HViGef8b_tGY75oNNW2pVaLgE";
    fetch(urlAPI, {
      method: 'POST',
        body: JSON.stringify({ idToken: authCtx.token, password: passInput.current.value, returnSecureToken: true }),
        headers: {
          'Content-Type': 'application/json'
        }
    }).then(resp => {
      if (resp.ok) {
        return resp.json().then(data => {
          console.log(1, data);
          setApiMessage('Password was reseted');
        });
      } else {
        return resp.json().then(data => {
          console.log(2, data);
          setApiMessage(apiMessage);
          if (data && data.error && data.error.message) {
            setApiMessage(data.error.message);
          }
        });
      }
    });
  }

  return (
    <form onSubmit={changePass} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <i className={classes.message}>{apiMessage}</i>
        <input type='password' id='new-password' minLength="7" ref={passInput} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
