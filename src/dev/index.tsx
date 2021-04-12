import React from 'react';
import ReactDOM from 'react-dom';
import Routes from '../routes';
import './index.less';

const App = () => {
  return <Routes />;
};

ReactDOM.render(<App />, document.getElementById('root'));
