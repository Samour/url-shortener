import React from 'react';
import {Button, Grid, TextField} from '@mui/material';
import {useLoginForm} from './login';

const LoginForm = (): JSX.Element => {
  const {
    username,
    setUsername,
    usernameError,
    password,
    setPassword,
    passwordError,
    submitInProgress,
    submit,
  } = useLoginForm();

  const onUsernameChange = (e: any) => setUsername(e.target.value);
  const onPasswordChange = (e: any) => setPassword(e.target.value);
  const onSubmit = (e: any) => {
    e.preventDefault();
    submit();
  };

  return (
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
        <Grid item xs={12} justifyContent='center' display='flex'>
          <Button type='submit' disabled={submitInProgress} onClick={submit}>Log In</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;
