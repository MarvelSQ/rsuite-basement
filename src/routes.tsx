import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainPage from './pages';
import UserPage from './pages/User';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={MainPage} exact></Route>
        <Route path="/user" component={UserPage} />
      </Switch>
    </BrowserRouter>
  );
}
