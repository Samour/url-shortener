import React from 'react';
import {useSelector} from 'react-redux';
import {Card, CardContent} from '@mui/material';
import {AppState} from 'src/store/model';
import {Add} from '@mui/icons-material';
import './add-link-card.css';

interface State {
  hideElement: boolean;
}

const selector = (state: AppState): State => ({
  hideElement: !state.appConfigs!.features.addLink,
});

const AddLinkCard = (): JSX.Element | null => {
  const {hideElement} = useSelector(selector);

  if (hideElement) {
    return null;
  }

  const onClick = () => console.log('Clicked!');

  return (
    <Card>
      <CardContent className='add-link-card-content' onClick={onClick}>
        <Add/>
        <span className='card-text'>Create Link</span>
      </CardContent>
    </Card>
  );
};

export default AddLinkCard;
