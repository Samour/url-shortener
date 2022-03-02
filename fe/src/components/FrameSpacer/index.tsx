import React from 'react';
import {Box} from '@mui/material';
import './index.css';

const FrameSpacer = (): JSX.Element => {
  return (
    <Box sx={{display: {xs: 'none', sm: 'block'}}}>
      <div className='frame-spacer'/>
    </Box>
  );
};

export default FrameSpacer;
