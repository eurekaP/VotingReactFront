import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {alertActions} from '../actions/alert.action';
import isEmpty from "is-empty";
import { makeStyles } from "@material-ui/core";
import http from '../http.comon';
import {pageActions} from '../actions/pageInfo.action';

import {
    Grid,
    Box,
    CssBaseline,
    TextField,
    Button,
    Typography,
    Divider,
    Paper,
    Snackbar

} from '@material-ui/core'
import MuiAlert from '@mui/lab/Alert';
import LockIcon from '@mui/icons-material/Lock';

const Alert=React.forwardRef(function Alert(props, ref){
    return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  });

const useStyles=makeStyles((theme)=>({
    root:{
        flexGrow:1,
        backgroundColor:"#071722",
        height:"100%",
    },
    paper: {
      margin: theme.spacing(12),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      elevation:3,
      width:"60%",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      padding:theme.spacing(0,0,8,0),
    },
    panel:{
        // margin:theme.spacing(2,4,2,4),
    },
    button:{
        backgroundColor:"#00aa00",
        color:"#fff",
        '&:hover': {
            backgroundColor: '#007700',
        },
        margin:theme.spacing(1,0,1,0),
        width:"98%",
    },
    textField:{
        margin:theme.spacing(1,0,1,0),
    },
    
}));

export default function ForgotPassword(){
    const classes=useStyles();
    const alertContent = useSelector(state=>state.alert);
    const forgotEmail = useSelector(state=>state.forgotEmail.forgotEmail);
    const dispatch = useDispatch();
    const [code, setCode] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const history = useHistory();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(()=>{
        dispatch(alertActions.clear()); 
        dispatch(pageActions.setPageName('forgotpassword'));
    },[]);
    
   
    const handleAlertClose=(event,reason)=>{
        if(reason==="clickaway"){
            return;
        }

        setAlertOpen(false);
    }
    /**
     * enter new password.
     * @param {} e 
     */
    const handleNewPasswordChange=(e)=>{
        const value = e.target.value;
        setNewPassword(value);
    }
    /**
     * enter password to confirm new password
     * @param {*} e 
     */
    const handleConfirmPasswordChange=(e)=>{
        const value = e.target.value;
        setConfirmPassword(value);
    }
    /**
     * submit new pasword to server
     */
    const handleSetNewPassword=()=>{
       if(!newPassword || !confirmPassword){
           dispatch(alertActions.error('Please fill the form!'));
           setAlertOpen(true);
           return;
       } else{
           if(newPassword != confirmPassword){
               dispatch(alertActions.error('Please enter correct password!'));
               setAlertOpen(true);
               return;
           }
           http.post('/auth/user/reset-password', {email:forgotEmail, newPassword:newPassword})
                .then(res=>{
                    history.push('/voter-login');
                }, error=>{
                    dispatch(alertActions.error(error.response.data));
                    setAlertOpen(true);
                })
       }
    }
    const handleToLogin=()=>{
        history.push('/voter-login')
    }


    return(
        <>
            {
                <Snackbar open={!isEmpty(alertContent) && alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                    <Alert onClose={handleAlertClose} severity={alertContent.type} sx={{width:'100%'}}>
                    {alertContent.message}
                    </Alert>
                </Snackbar>
            }
            <Grid component="main" className={classes.root}>
               
                <Grid container justifyContent="center">
                    <Paper className={classes.paper} 
                       elevation={24}>
                        <CssBaseline/>
                        <Grid container alignItems="center" style={{padding:8}}>
                            <LockIcon color="primary" style={{marginLeft:"8vw",fontSize:48}}/>
                            <Typography variant="h5">
                                New Password
                            </Typography>
                        </Grid>
                        <Divider style={{width:"100%"}}/>
                        <Grid container justifyContent="center" item md={12} style={{width:"70%", paddingTop:"20px"}}>
                            <form className={classes.form}>
                                <Grid container>
                                    <Grid  container justifyContent="center" >
                                        <Typography variant="body2" style={{padding:'1vw'}}>
                                            Please reset your password.
                                        </Typography>
                                    </Grid>
                                    
                                </Grid>
                                <Grid container>
                                    <Grid  container justifyContent="center" >
                                        <TextField
                                            variant="outlined"
                                            label="New Password"
                                            type="password"
                                            required
                                            fullWidth
                                            className={classes.textField}
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                        />
                                    </Grid>
                                    <Grid  container justifyContent="center" >
                                        <TextField
                                            variant="outlined"
                                            label="Confirm Password"
                                            type="password"
                                            required
                                            fullWidth
                                            className={classes.textField}
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid container item md={6} justifyContent="center"> 
                                        <Button className={classes.button} onClick={handleSetNewPassword}>
                                            Set     
                                        </Button>
                                    </Grid>
                                    <Grid container item md={6} justifyContent="center">
                                        <Button className={classes.button} onClick={handleToLogin}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                               
                            </form>
                        </Grid>
                        
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}