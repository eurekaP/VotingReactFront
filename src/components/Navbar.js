import React,{useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Typography } from '@material-ui/core';
import {Link, useHistory} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {userActions} from '../actions/user.action';
import {
    Grid
} from '@material-ui/core';

const useStyles=makeStyles((theme)=>({
    appBar:{
        paddingTop:"2vh",
        paddingBottom:"2vh",
        backgroundColor:"#071722",
        color:"fff",
    },
    logo:{
        width:"45px",
    },
    button:{
        borderRadius:"25px",
        '&:hover': {
            backgroundColor: 'transparent',
            color: '#3c52b2',
        },
    },
    title:{
        // flexGrow:1,
        width:"5vw",
        fontFamily:"Cooper Black",
        fontSize:18
    },
    customeColor:{
        backgroundColor:theme.palette,
    },
    iconButton:{
        // fontFamily:"Microsoft Sans Serif Regular",
        fontWeight:1000,
        fontSize:24,
        marginRight:theme.spacing(2),
        color:"#fff",
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#009900',
      },

      ['@media (max-width:400px)']: {
        fontSize: 16,
        fontWeight: 500,
        margin: 0,
      },
    },
    linkButton:{
        textDecoration:"none",
    },
    offset:theme.mixins.toolbar
}));

function Navbar(){
    const classes=useStyles();
    let history=useHistory();
    const dispatch = useDispatch();

    useEffect(()=>({

    },[]));
    const handleToAdminPage=()=>{
        history.push("/admin");
    }
    const handleToHome=()=>{
        history.push('/');
    }

    const handleToVoterLoginPage=()=>{
        dispatch(userActions.logout());
        history.push('/voter-login');

    }
    const handleToElectionsPage=()=>{
        history.push('/candidate-login');
    }
    return(
        <>
            <AppBar color="default" className={classes.appBar} elevation={0}>
                <ToolBar>
                    <Grid container style={{width:"100%"}}>
                        <Grid  container item  xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Button className={classes.button} onClick={handleToHome}>
                                <img src="/image/logo-white.png" className={classes.logo} />
                                <Typography variant="h5" style={{marginLeft:"1vw", color:"white"}}>
                                    NepalVotes
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid  container justifyContent="center" item xs={12} sm={12} md={6} lg={6} xl={6}> 
                            <IconButton color="inherit" className={classes.iconButton} onClick={handleToHome}>
                                Home
                            </IconButton>
                            <IconButton color="inherit" className={classes.iconButton} onClick={handleToAdminPage}>
                                Admin
                            </IconButton>
                            <IconButton color="inherit" className={classes.iconButton} onClick={handleToVoterLoginPage}>
                                Voter
                            </IconButton> 
                            <IconButton color="inherit" className={classes.iconButton} onClick={handleToElectionsPage}>
                                Elections
                            </IconButton>
                        </Grid>
                    </Grid>
                   
                </ToolBar>

            </AppBar>
        </>
    );
}
 export default Navbar;
