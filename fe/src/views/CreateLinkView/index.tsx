import React from 'react';
import authenticated from 'src/components/authenticated';
import AppFrame from 'src/components/AppFrame';

const CreateLinkView = (): JSX.Element => {
  return (
    <AppFrame>
      <h1>CreateLinkView</h1>
    </AppFrame>
  );
};

export default authenticated()(CreateLinkView);
