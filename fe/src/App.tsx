import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {useSelector} from 'react-redux';
import './App.css';
import LoginView from './views/LoginView';
import LandingView from './views/LandingView';
import RegisterView from './views/RegisterView';
import AppLoadingView from './views/AppLoadingView';
import {AppState} from './store/model';
import {AuthStatus} from './store/model/AuthenticatedUser';

interface State {
  enableRouting: boolean;
}

const selector = (state: AppState): State => ({
  enableRouting: state.authenticatedUser.authStatus != AuthStatus.INDETERMINATE,
});

function App() {
  const {enableRouting} = useSelector(selector);

  if (enableRouting) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingView/>}/>
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
