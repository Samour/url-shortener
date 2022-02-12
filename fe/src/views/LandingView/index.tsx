import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const LandingView = (): JSX.Element => {
  const navigate = useNavigate();
  // Only login page is currently implemented
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => navigate('/login'), []);

  return (
    <div>
      <h1>User is authenticated!</h1>
    </div>
  );
};

export default LandingView;
