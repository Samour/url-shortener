import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, Grid} from '@mui/material';
import LoginForm from './LoginForm';

const LoginView = (): JSX.Element => {
  const navigate = useNavigate();

  const onRegisterClick = () => navigate('/register');

  return (
    <Container id='LoginView' fixed maxWidth='xs'>
      <Box sx={{display: {xs: 'none', sm: 'block'}}}>
        <div className='spacer'/>
      </Box>
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

export default LoginView;
