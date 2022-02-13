import React from 'react';
import {AppBar, Box, Button, Toolbar} from '@mui/material';
import {useUserAuthService} from 'src/services/userAuthService';

interface Props {
  children?: React.ReactNode;
}

const AppFrame = ({children}: Props): JSX.Element => {
  const userAuthService = useUserAuthService();

  const onLogout = () => userAuthService.logOut().catch(console.error)

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
