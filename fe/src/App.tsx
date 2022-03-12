import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoginView from './views/LoginView';
import LinkDetailsListView from './views/LinkDetailsListView';
import RegisterView from './views/RegisterView';
import AppLoadingView from './views/AppLoadingView';
import LinkEditView from './views/LinkEditView';
import CreateLinkView from './views/CreateLinkView';
import {AppState} from './store/model';
import {AuthStatus} from './store/model/AuthenticatedUser';
import {useInitialiseUserState} from './services/userAuthService';
import './App.css';

interface State {
  enableRouting: boolean;
  enableCreateLinkRoute: boolean;
}

const selector = (state: AppState): State => ({
  enableRouting: state.authenticatedUser.authStatus !== AuthStatus.INDETERMINATE,
  enableCreateLinkRoute: state.appConfigs?.features?.addLink ?? false,
});

function App() {
  const {
    enableRouting,
    enableCreateLinkRoute,
  } = useSelector(selector);
  const initialiseUserState = useInitialiseUserState();

  useEffect(() => {
    initialiseUserState().catch(console.log);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (enableRouting) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LinkDetailsListView/>}/>
          <Route path='/links/:linkId/edit' element={<LinkEditView/>}/>
          <Route path='/login' element={<LoginView/>}/>
          <Route path='/register' element={<RegisterView/>}/>
          {enableCreateLinkRoute && <Route path='/links/create' element={<CreateLinkView/>}/>}
        </Routes>
      </BrowserRouter>
    );
  } else {
    return <AppLoadingView/>;
  }
}

export default App;
