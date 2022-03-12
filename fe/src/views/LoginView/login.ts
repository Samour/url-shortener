import {useState} from 'react';
import {useLogIn} from 'src/services/userAuthService';
import {UserLoginError} from 'src/errors/UserLoginError';

export const useLoginForm = () => {
  const logIn = useLogIn();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const submit = async () => {
    if (username.length === 0) {
      setUsernameError('Enter username');
    } else {
      setUsernameError(null);
    }
    if (password.length === 0) {
      setPasswordError('Enter password');
    } else {
      setPasswordError(null);
    }
    if (username.length === 0 || password.length === 0) {
      return;
    }

    setSubmitInProgress(true);
    try {
      await logIn(username, password);
    } catch (e) {
      setSubmitInProgress(false);
      if (e instanceof UserLoginError) {
        setPasswordError('Username or password incorrect');
      } else {
        console.error('Error during login attempt', e);
        setPasswordError('There was an error during login attempt');
      }
    }
  };

  return {
    username,
    setUsername,
    usernameError,
    password,
    setPassword,
    passwordError,
    submitInProgress,
    submit: () => submit().catch(console.error),
  };
};
