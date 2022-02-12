import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const LandingView = (): JSX.Element | null => {
  const navigate = useNavigate();
  // Only login page is currently implemented
  useEffect(() => navigate('/login'), []);

  return null;
};

export default LandingView;
