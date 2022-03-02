import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoginView from './views/LoginView';
import LinkDetailsListView from './views/LinkDetailsListView';
import RegisterView from './views/RegisterView';
import AppLoadingView from './views/AppLoadingView';
import LinkEditView from './views/LinkEditView';
import {AppState} from './store/model';
import {AuthStatus} from './store/model/AuthenticatedUser';
import {useUserAuthService} from './services/userAuthService';
import './App.css';

const ENABLE_DETAIL_NAV = false;

interface State {
  enableRouting: boolean;
}

const selector = (state: AppState): State => ({
  enableRouting: state.authenticatedUser.authStatus !== AuthStatus.INDETERMINATE,
});

function App() {
  const {enableRouting} = useSelector(selector);
  const userAuthService = useUserAuthService();

  useEffect(() => {
    userAuthService.initialiseUserState().catch(console.log);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (enableRouting) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LinkDetailsListView/>}/>
          {ENABLE_DETAIL_NAV && <Route path='/links/:linkId/edit' element={<LinkEditView/>}/>}
          <Route path='/login' element={<LoginView/>}/>
          <Route path='/register' element={<RegisterView/>}/>
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <AppLoadingView/>;
  }
}

export default App;
