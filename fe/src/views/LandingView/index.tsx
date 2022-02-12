import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const LandingView = (): JSX.Element | null => {
  const navigate = useNavigate();
  // Only login page is currently implemented
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => navigate('/login'), []);

  return null;
};

export default LandingView;
