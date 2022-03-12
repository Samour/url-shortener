import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Grid, MenuItem, Select, Stack} from '@mui/material';
import authenticated from 'src/components/authenticated';
import AppFrame from 'src/components/AppFrame';
import {useFetchLinks} from 'src/services/linkManagement';
import {AppState} from 'src/store/model';
import {LinkFilterStatus} from 'src/store/model/LinkDetails';
import {setLinkFilterStatusMutation} from 'src/store/mutations/linkDetails/SetLinkFilterStatusMutation';
import LinkItem from './LinkItem';
import './index.css';
import AddLinkCard from './AddLinkCard';

interface State {
  filterStatus: LinkFilterStatus;
  linkIds: string[];
}

const selector = (state: AppState): State => ({
  filterStatus: state.linkDetails.filterStatus,
  linkIds: state.linkDetails.links.map(({id}) => id),
});

const LinkDefinitionListView = (): JSX.Element => {
  const dispatch = useDispatch();
  const fetchLinks = useFetchLinks();
  const {
    filterStatus,
    linkIds,
  } = useSelector(selector);

  useEffect(() => {
    fetchLinks(filterStatus);
  }, [filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFilterChange = (e: any) => dispatch(setLinkFilterStatusMutation(e.target.value));

  // TODO should add a loader here when waiting on links api
  return (
    <AppFrame>
      <Container id='LinkDetailsListView' maxWidth='md'>
        <Stack spacing={1}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <h2>My Links</h2>
            </Grid>
            <Grid item xs={12} sm={6} display='flex' justifyContent='flex-end'>
              <Select value={filterStatus} onChange={onFilterChange}>
                <MenuItem value={LinkFilterStatus.ACTIVE}>Show Active</MenuItem>
                <MenuItem value={LinkFilterStatus.INACTIVE}>Show Inactive</MenuItem>
                <MenuItem value={LinkFilterStatus.ALL}>Show All</MenuItem>
              </Select>
            </Grid>
          </Grid>
          {linkIds.map((id) => <LinkItem key={id} linkId={id}/>)}
          <AddLinkCard/>
        </Stack>
      </Container>
    </AppFrame>
  );
};

export default authenticated()(LinkDefinitionListView);
