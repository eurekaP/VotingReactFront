
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import Grid from '@material-ui/core/Grid';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';

import {Typography, AppBar} from '@material-ui/core';

import Particle from "react-particles-js";
import particlesConfig from './assets/particlesConfig.json';
import './App.css';

import AdminLoginPage from './components/AdminLoginPage';
import VoterLoginPage from './components/voter/VoterLoginPage';
import VoterRegisterPage from './components/voter/VoterRegisterPage';
import ElectionsPage from './components/election/ElectionsPage';

import ForgotPassword from './components/ForgotPassword';
import CandidateLogin from './components/CandidateLogin';



function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

function App(props) {
  const pageName = useSelector(state=>state.pageInfo.pageName);

  useEffect(()=>{
    
  })
  return (
      
      <Router>
        
        <CssBaseline />
        {
          pageName!="elections" && <Navbar/>
        }
        {
          pageName!="elections" && <Toolbar id="back-to-top-anchor"/> 
        }
        <Grid container id="main">
            <Switch>
              <Route exact path="/" component={HomePage}/>
              <Route path="/admin" component={AdminLoginPage}/>
              <Route path='/voter-login' component={VoterLoginPage}/>
              <Route path='/voter-register' component={VoterRegisterPage} />
              <Route path='/elections' component={ElectionsPage}/>
              <Route path='/forgot-password' component={ForgotPassword} />
              <Route path='/candidate-login' component={CandidateLogin}/>
            </Switch>
         </Grid> 
         <ScrollTop {...props}>
           <Fab color="secondary" size="small" aria-label="scroll back to top">
             <KeyboardArrowUpIcon />
           </Fab>
         </ScrollTop>
         
         </Router>
      
  );
}

export default App;
 