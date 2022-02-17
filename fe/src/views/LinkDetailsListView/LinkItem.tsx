import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Card, CardContent, Grid, Icon, IconButton, Tooltip} from '@mui/material';
import {InsertLink} from '@mui/icons-material';
import {LinkDetail} from 'src/store/model/LinkDetails';
import {AppState} from 'src/store/model';

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

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid xs={4}>
            {linkDetail.label}
          </Grid>
          <Grid xs={4}>
            {linkDetail.linkTarget}
          </Grid>
          <Grid xs={3} display='flex' justifyContent='flex-end'>
            <Tooltip title={linkTooltop}>
              <IconButton onClick={onLinkClick}>
                <InsertLink/>
              </IconButton>
            </Tooltip>
            {/*<IconButton>*/}
            {/*  <Edit/>*/}
            {/*</IconButton>*/}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LinkItem;
