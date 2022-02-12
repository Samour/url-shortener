import React from 'react';
import {Button, Grid, TextField} from '@mui/material';
import './index.css';

const LoginForm = (): JSX.Element => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container justifyContent='center'>
          <Grid item xs={12} md={8}>
            <TextField label='Username' variant='standard' fullWidth/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent='center'>
          <Grid item xs={12} md={8}>
            <TextField label='Password' type='password' variant='standard' fullWidth/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} justifyContent='center' display='flex'>
        <Button>Log In</Button>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
