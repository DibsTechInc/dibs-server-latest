import React, {
  Suspense,
  lazy
} from 'react';
import {
  useSelector
} from 'react-redux';
import {
  ThemeProvider
} from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import {
  CssBaseline,
  StyledEngineProvider
} from '@mui/material/CssBaseline';
import './App.css';

const Widget = lazy(() => import('./widget'));
const StudioAdmin = lazy(() => import('./studio-admin'));
const DibsWebsite = lazy(() => import('./website'));

const App = () => ( <
    Router >
    <
    Suspense fallback = {
      < div > Loading... < /div>}> <
      Routes >
      <
      Route path = "/"
      element = {
        < DibsWebsite / >
      }
      /> <
      Route path = "/studios"
      element = {
        < StudioAdmin / >
      }
      /> <
      Route path = "/widget"
      element = {
        < Widget / >
      }
      /> <
      /Routes> <
      /Suspense> <
      /Router>
    );

    export default App;