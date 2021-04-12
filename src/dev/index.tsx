import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from '../pages';
import './index.less';

const App = () => {
  return <MainPage />;
};

ReactDOM.render(<App />, document.getElementById('root'));
