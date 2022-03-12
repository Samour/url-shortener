import React from 'react';
import {AppBar, Box, Button, Toolbar} from '@mui/material';
import {useLogOut} from 'src/services/userAuthService';

interface Props {
  children?: React.ReactNode;
}

const AppFrame = ({children}: Props): JSX.Element => {
  const logOut = useLogOut();

  const onLogout = () => logOut().catch(console.error)

  return (
    <div>
      <AppBar position='static'>
        <Toolbar>
          <Box display='flex' flex={1} justifyContent='flex-end'>
            <Button color='inherit' onClick={onLogout}>Log out</Button>
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default AppFrame;
