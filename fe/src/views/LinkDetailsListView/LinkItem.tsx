import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent, Grid, IconButton, Tooltip} from '@mui/material';
import {Edit, InsertLink} from '@mui/icons-material';
import {LinkDetail} from 'src/store/model/LinkDetails';
import {AppState} from 'src/store/model';

const ENABLE_DETAIL_NAV = false;

interface Props {
  linkId: string;
}

interface State {
  linkDetail: LinkDetail;
  shortUrlBase: string;
}

const selector = (linkId: string) => (state: AppState): State => ({
  linkDetail: state.linkDetails.links.find(({id}) => id === linkId)!,
  shortUrlBase: state.appConfigs!.shortUrlConfig.shortUrlBase,
});

const LinkItem = ({linkId}: Props): JSX.Element => {
  const navigate = useNavigate();
  const {
    linkDetail,
    shortUrlBase,
  } = useSelector(selector(linkId));

  const [linkTooltop, setLinkTooltip] = useState('Copy short URL');

  const onLinkClick = () => {
    navigator.clipboard.writeText(`${shortUrlBase}/${linkDetail.pathName}`);
    setLinkTooltip('Copied!');
    setTimeout(() => setLinkTooltip('Copy short URL'), 3000);
  };
  const onEditClick = () => navigate(`/links/${linkId}/edit`);

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={4}>
            {linkDetail.label}
          </Grid>
          <Grid item xs={4}>
            {linkDetail.linkTarget}
          </Grid>
          <Grid item xs={3} display='flex' justifyContent='flex-end'>
            <Tooltip title={linkTooltop}>
              <IconButton onClick={onLinkClick}>
                <InsertLink/>
              </IconButton>
            </Tooltip>
            {ENABLE_DETAIL_NAV && <IconButton onClick={onEditClick}>
              <Edit/>
            </IconButton>}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LinkItem;
