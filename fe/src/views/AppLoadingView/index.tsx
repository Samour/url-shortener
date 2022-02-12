import React from 'react';
import {CircularProgress, Grid} from '@mui/material';
import './index.css';

const AppLoadingView = (): JSX.Element => {
  return (
    <Grid id='AppLoadingView' container>
      <Grid item xs={12} display='flex' justifyContent='center'>
        <CircularProgress size={40}/>
      </Grid>
    </Grid>
  );
};

export default AppLoadingView;
