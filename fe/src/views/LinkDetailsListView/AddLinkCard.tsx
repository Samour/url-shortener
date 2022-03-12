import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent} from '@mui/material';
import {Add} from '@mui/icons-material';
import './add-link-card.css';

const AddLinkCard = (): JSX.Element | null => {
  const navigate = useNavigate();

  const onClick = () => navigate('/links/create');

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
