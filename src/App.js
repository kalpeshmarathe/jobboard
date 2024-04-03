import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './component/login';
import Register from './component/register';
import Joblisting from './component/joblisting';

function App() {
  return (
    <>
    <Login/>
    </>
  );
}

export default App;
