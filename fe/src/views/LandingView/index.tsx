import React from 'react';
import authenticated from 'src/components/authenticates';

const LandingView = (): JSX.Element => {
  return (
    <div>
      <h1>User is authenticated!</h1>
    </div>
  );
};

export default authenticated()(LandingView);
