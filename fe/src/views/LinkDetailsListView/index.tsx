import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Container, Stack} from '@mui/material';
import authenticated from 'src/components/authenticates';
import AppFrame from 'src/components/AppFrame';
import {useLinkManagementService} from 'src/services/linkManagementService';
import {AppState} from 'src/store/model';
import LinkItem from './LinkItem';

interface State {
  linkIds: string[];
}

const selector = (state: AppState): State => ({
  linkIds: state.linkDetails.links.map(({id}) => id),
});

const LinkDefinitionListView = (): JSX.Element => {
  const linkManagementService = useLinkManagementService();
  const {linkIds} = useSelector(selector);

  useEffect(() => {
    linkManagementService.fetchLinks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppFrame>
      <Container maxWidth='md'>
        <Stack spacing={1}>
          <h2>My Links</h2>
          {linkIds.map((id) => <LinkItem key={id} linkId={id}/>)}
        </Stack>
      </Container>
    </AppFrame>
  );
};

export default authenticated()(LinkDefinitionListView);
