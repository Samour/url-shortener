import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, Grid, TextField} from '@mui/material';
import authenticated, {AuthRequired} from 'src/components/authenticates';
import {useRegisterForm} from './registerForm';
import './index.css';

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
  const onReturnClick = () => navigate('/login');

  return (
    <Container id='RegisterView' fixed maxWidth='xs'>
      <Box sx={{display: {xs: 'none', sm: 'block'}}}>
        <div className='spacer'/>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container justifyContent='center'>
            <Grid item xs={12} md={8}>
              <TextField
                label='Username'
                variant='standard'
                fullWidth
                value={username}
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
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                onChange={onConfirmPasswordChange}/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} justifyContent='center' display='flex'>
          <Button disabled={submitInProgress} onClick={submit}>Register Account</Button>
        </Grid>
        <Grid item xs={12} justifyContent='center' display='flex'>
          <Button color='secondary' onClick={onReturnClick}>Back to login</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default authenticated({
  auth: AuthRequired.UNAUTHENTICATED,
  navigateOnFailure: '/',
})(RegisterView);
