import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Grid, TextField} from '@mui/material';
import authenticated, {AuthRequired} from 'src/components/authenticated';
import FrameSpacer from 'src/components/FrameSpacer';
import {useRegisterForm} from './registerForm';

const RegisterView = (): JSX.Element => {
  const navigate = useNavigate();
  const {
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
    submit,
  } = useRegisterForm();

  const onUsernameChange = (e: any) => setUsername(e.target.value);
  const onPasswordChange = (e: any) => setPassword(e.target.value);
  const onConfirmPasswordChange = (e: any) => setConfirmPassword(e.target.value);
  const onSubmit = (e: any) => {
    console.log('Submit handler called');
    e.preventDefault();
    submit();
  };
  const onReturnClick = () => navigate('/login');

  return (
    <Container id='RegisterView' fixed maxWidth='xs'>
      <FrameSpacer/>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container justifyContent='center'>
              <Grid item xs={12} md={8}>
                <TextField
                  label='Username'
                  variant='standard'
                  fullWidth
                  value={username}
                  disabled={submitInProgress}
                  error={!!usernameError}
                  helperText={usernameError}
                  onChange={onUsernameChange}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent='center'>
              <Grid item xs={12} md={8}>
                <TextField
                  label='Password'
                  type='password'
                  variant='standard'
                  fullWidth
                  value={password}
                  disabled={submitInProgress}
                  error={!!passwordError}
                  helperText={passwordError}
                  onChange={onPasswordChange}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent='center'>
              <Grid item xs={12} md={8}>
                <TextField
                  label='Confirm Password'
                  type='password'
                  variant='standard'
                  fullWidth
                  value={confirmPassword}
                  disabled={submitInProgress}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                  onChange={onConfirmPasswordChange}/>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} justifyContent='center' display='flex'>
            <Button type='submit' disabled={submitInProgress} onClick={submit}>Register Account</Button>
          </Grid>
          <Grid item xs={12} justifyContent='center' display='flex'>
            <Button color='secondary' onClick={onReturnClick}>Back to login</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default authenticated({
  auth: AuthRequired.UNAUTHENTICATED,
  navigateOnFailure: '/',
})(RegisterView);
