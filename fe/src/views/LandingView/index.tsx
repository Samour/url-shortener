import React from 'react';
import authenticated from 'src/components/authenticates';
import AppFrame from 'src/components/AppFrame';

const LandingView = (): JSX.Element => {
  return (
    <AppFrame>
      <h1>User is authenticated!</h1>
    </AppFrame>
  );
};

export default authenticated()(LandingView);
