import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Container, Grid, MenuItem, Select, TextField} from '@mui/material';
import {LinkStatus} from 'src/dto/LinksResponse';
import AppFrame from 'src/components/AppFrame';
import authenticated from 'src/components/authenticated';
import {LinkDetail, LinkInViewDataStatus} from 'src/store/model/LinkDetails';
import {AppState} from 'src/store/model';
import {useFetchLinkById} from 'src/services/linkManagement';
import AppLoadingView from 'src/views/AppLoadingView';
import {bringLinkIntoViewMutation} from 'src/store/mutations/linkDetails/BringLinkIntoViewMutation';
import {linkInViewDataStatusMutation} from 'src/store/mutations/linkDetails/LinkInViewDataStatusMutation';
import LinkUnavailable from './LinkUnavailable';
import {useLinkEditForm} from './linkEditForm';
import './index.css';

interface State {
  linkInViewId: string | null;
  linkInViewDataStatus: LinkInViewDataStatus;
  link: LinkDetail | undefined;
  shortBaseUrl: string;
}

const selector = (linkId: string) => (state: AppState): State => ({
  linkInViewId: state.linkDetails.linkInViewId,
  linkInViewDataStatus: state.linkDetails.linkInViewDataStatus,
  link: state.linkDetails.links.find(({id}) => id === linkId),
  shortBaseUrl: state.appConfigs!.shortUrlConfig.shortUrlBase,
});

const LinkEditView = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchLinkById = useFetchLinkById();
  const {linkId} = useParams() as { linkId: string };
  const {
    linkInViewId,
    linkInViewDataStatus,
    link,
    shortBaseUrl,
  } = useSelector(selector(linkId!));
  const {
    label,
    labelError,
    setLabel,
    status,
    setStatus,
    allowSubmit,
    submitInProgress,
    submit,
  } = useLinkEditForm();

  useEffect(() => {
    if (linkInViewId !== linkId) {
      dispatch(bringLinkIntoViewMutation(linkId));
      if (!link) {
        dispatch(linkInViewDataStatusMutation(LinkInViewDataStatus.PENDING));
        fetchLinkById(linkId);
      }
    } else if (link) {
      setLabel(link.label);
      setStatus(link.status);
    }
  }, [linkInViewId, linkId, link]); // eslint-disable-line react-hooks/exhaustive-deps

  // on unmount
  useEffect(() => () => {
    dispatch(bringLinkIntoViewMutation(null))
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (linkInViewDataStatus === LinkInViewDataStatus.UNAVAILABLE) {
    return <LinkUnavailable/>;
  } else if (linkInViewDataStatus !== LinkInViewDataStatus.AVAILABLE) {
    return (
      <AppFrame>
        <AppLoadingView/>
      </AppFrame>
    );
  }

  const onLabelChange = (e: any) => setLabel(e.target.value);
  const onStatusChange = (e: any) => setStatus(e.target.value);
  const onCancelClick = () => navigate('/');
  const onUpdateClick = () => submit();

  return (
    <AppFrame>
      <Container maxWidth='sm'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>{link!.label}</h2>
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
              value={link!.linkTarget}
              disabled={true}/>
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
          <Grid item xs={12}>
            <TextField
              label='Short URL'
              variant='standard'
              fullWidth
              value={`${shortBaseUrl}/${link!.pathName}`}
              disabled={true}/>
          </Grid>
          <Grid item xs={6}>
            <Button color='secondary' disabled={submitInProgress} onClick={onCancelClick}>Cancel</Button>
          </Grid>
          <Grid item xs={6} display='flex' justifyContent='flex-end'>
            <Button disabled={!allowSubmit || submitInProgress} onClick={onUpdateClick}>Update</Button>
          </Grid>
        </Grid>
      </Container>
    </AppFrame>
  );
};

export default authenticated()(LinkEditView);
