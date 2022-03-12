import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Grid, MenuItem, Select, TextField} from '@mui/material';
import authenticated from 'src/components/authenticated';
import AppFrame from 'src/components/AppFrame';
import {LinkStatus} from 'src/dto/LinksResponse';
import {useCreateLinkForm} from './createLinkForm';

const CreateLinkView = (): JSX.Element => {
  const navigate = useNavigate();
  const {
    label,
    setLabel,
    labelError,
    linkTarget,
    setLinkTarget,
    linkTargetError,
    status,
    setStatus,
    submitInProgress,
    submit,
  } = useCreateLinkForm();

  const onLabelChange = (e: any) => setLabel(e.target.value);
  const onLinkTargetChange = (e: any) => setLinkTarget(e.target.value);
  const onStatusChange = (e: any) => setStatus(e.target.value);
  const onCancelClick = () => navigate('/');
  const onCreateClick = () => submit();

  return (
    <AppFrame>
      <Container maxWidth='sm'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>Create Link</h2>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Label'
              variant='standard'
              fullWidth
              value={label}
              disabled={submitInProgress}
              error={!!labelError}
              helperText={labelError}
              onChange={onLabelChange}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Target location'
              variant='standard'
              fullWidth
              value={linkTarget}
              disabled={submitInProgress}
              error={!!linkTargetError}
              helperText={linkTargetError}
              onChange={onLinkTargetChange}/>
          </Grid>
          <Grid item xs={4} display='flex' alignItems='center'>
            Status:
          </Grid>
          <Grid item xs={8}>
            <Select value={status} disabled={submitInProgress} onChange={onStatusChange}>
              <MenuItem value={LinkStatus.ACTIVE}>Active</MenuItem>
              <MenuItem value={LinkStatus.INACTIVE}>Inactive</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Button color='secondary' disabled={submitInProgress} onClick={onCancelClick}>Cancel</Button>
          </Grid>
          <Grid item xs={6} display='flex' justifyContent='flex-end'>
            <Button disabled={submitInProgress} onClick={onCreateClick}>Create</Button>
          </Grid>
        </Grid>
      </Container>
    </AppFrame>
  );
};

export default authenticated()(CreateLinkView);
