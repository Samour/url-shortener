import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {AppState} from 'src/store/model';
import {RegisterConfig} from 'src/store/model/AppConfigs';
import {UserCreatedResult, useRegisterUser} from 'src/services/registerUserService';
import {UserRegistrationError} from 'src/errors/UserRegistrationError';
import {useLogIn} from 'src/services/userAuthService';

const selector = (state: AppState): RegisterConfig => state.appConfigs!.registerConfig;

export const useRegisterForm = () => {
  const registerUser = useRegisterUser();
  const logIn = useLogIn();
  const {minPasswordLength} = useSelector(selector);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const validateUsername = (): boolean => {
    if (username.length === 0) {
      setUsernameError('You must select a username');
      return false;
    } else {
      setUsernameError(null);
      return true;
    }
  };

  const validatePasswords = (): boolean => {
    let passwordHasError = false;
    let confirmPasswordHasError = false;

    if (password.length === 0) {
      setPasswordError('You must select a password');
      passwordHasError = true;
    } else if (password.length < minPasswordLength) {
      setPasswordError(`Password is too short. Must have at least ${minPasswordLength} characters.`);
      passwordHasError = true;
    }
    if (confirmPassword.length === 0) {
      setConfirmPasswordError('Enter password to confirm');
      confirmPasswordHasError = true;
    } else if (!passwordHasError && confirmPassword !== password) {
      setConfirmPasswordError('Passwords entered do not match');
      confirmPasswordHasError = true;
    }

    if (!passwordHasError) {
      setPasswordError(null);
    }
    if (!confirmPasswordHasError) {
      setConfirmPasswordError(null);
    }
    return !passwordHasError && !confirmPasswordHasError;
  };

  const submit = async () => {
    const usernameIsValid = validateUsername();
    const passwordsAreValid = validatePasswords();
    if (!usernameIsValid || !passwordsAreValid) {
      return;
    }

    setSubmitInProgress(true);
    let userCreated: UserCreatedResult | null = null;
    try {
      userCreated = await registerUser({username, password});
    } catch (e) {
      setSubmitInProgress(false);
      if (e instanceof UserRegistrationError) {
        setUsernameError('Username is already in use');
        return;
      } else {
        throw e;
      }
    }

    try {
      await logIn(userCreated.username, password);
    } catch (e) {
      console.error('Error occurred while trying to log in. Redirecting user to login page to recover.', e);
      navigate('/login');
    }
  };

  return {
    username,
    setUsername,
    usernameError,
    password,
    setPassword,
    passwordError,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordError,
    submitInProgress,
    submit: () => submit().catch(console.error),
  };
};
