import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Grid} from '@mui/material';
import authenticated, {AuthRequired} from 'src/components/authenticates';
import FrameSpacer from 'src/components/FrameSpacer';
import LoginForm from './LoginForm';

const LoginView = (): JSX.Element => {
  const navigate = useNavigate();

  const onRegisterClick = () => navigate('/register');

  return (
    <Container id='LoginView' fixed maxWidth='xs'>
      <FrameSpacer/>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <LoginForm/>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent='center'>
            <Grid item xs={6}>
              <hr/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Button onClick={onRegisterClick}>Register</Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default authenticated({
  auth: AuthRequired.UNAUTHENTICATED,
  navigateOnFailure: '/',
})(LoginView);
