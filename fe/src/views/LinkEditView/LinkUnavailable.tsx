import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Alert, AlertTitle, Button, Container, Grid} from '@mui/material';
import AppFrame from 'src/components/AppFrame';
import FrameSpacer from 'src/components/FrameSpacer';

const LinkUnavailable = (): JSX.Element => {
  const navigate = useNavigate();

  const onBackClick = () => navigate('/');

  return (
    <AppFrame>
      <Container id='LinkDetailEditView' maxWidth='md'>
        <FrameSpacer/>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Alert severity='error'>
              <AlertTitle>Could not find this link</AlertTitle>
            </Alert>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center'>
            <Button color='secondary' onClick={onBackClick}>Back to links</Button>
          </Grid>
        </Grid>
      </Container>
    </AppFrame>
  );
};

export default LinkUnavailable;
