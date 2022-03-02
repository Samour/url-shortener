import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Container, Grid} from '@mui/material';
import AppFrame from 'src/components/AppFrame';
import authenticated from 'src/components/authenticates';
import {LinkDetail, LinkInViewDataStatus} from 'src/store/model/LinkDetails';
import {AppState} from 'src/store/model';
import {useLinkManagementService} from 'src/services/linkManagementService';
import AppLoadingView from 'src/views/AppLoadingView';
import {bringLinkIntoViewMutation} from 'src/store/mutations/linkDetails/BringLinkIntoViewMutation';
import {linkInViewDataStatusMutation} from 'src/store/mutations/linkDetails/LinkInViewDataStatusMutation';
import LinkUnavailable from './LinkUnavailable';
import './index.css';

interface State {
  linkInViewId: string | null;
  linkInViewDataStatus: LinkInViewDataStatus;
  link: LinkDetail | undefined;
}

const selector = (linkId: string) => (state: AppState): State => ({
  linkInViewId: state.linkDetails.linkInViewId,
  linkInViewDataStatus: state.linkDetails.linkInViewDataStatus,
  link: state.linkDetails.links.find(({id}) => id === linkId),
});

const LinkEditView = (): JSX.Element => {
  const dispatch = useDispatch();
  const linkManagementService = useLinkManagementService();
  const {linkId} = useParams() as { linkId: string };
  const {
    linkInViewId,
    linkInViewDataStatus,
    link,
  } = useSelector(selector(linkId!));

  useEffect(() => {
    if (linkInViewId !== linkId) {
      dispatch(bringLinkIntoViewMutation(linkId));
      if (!link) {
        dispatch(linkInViewDataStatusMutation(LinkInViewDataStatus.PENDING));
        linkManagementService.fetchLinkById(linkId);
      }
    }
  }, [linkInViewId, linkId, link]); // eslint-disable-line react-hooks/exhaustive-deps

  if (linkInViewDataStatus === LinkInViewDataStatus.UNAVAILABLE) {
    return <LinkUnavailable/>;
  } else if (linkInViewDataStatus !== LinkInViewDataStatus.AVAILABLE) {
    return (
      <AppFrame>
        <AppLoadingView/>
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <Container maxWidth='md'>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>{link?.label}</h2>
          </Grid>
          <Grid item xs={12}>
            Form
          </Grid>
        </Grid>
      </Container>
    </AppFrame>
  );
};

export default authenticated()(LinkEditView);
