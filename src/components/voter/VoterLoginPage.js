import React, {useState, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../../actions/alert.action";
import { userActions } from "../../actions/user.action";
import { adminActions } from "../../actions/admin.action";
import { 
    makeStyles,
    Grid,
    Typography, 
    Button,
    TextField,
    FormControlLabel,
    Checkbox,
    Avatar,
    InputAdornment,
    Snackbar,
    FormHelperText,
    CssBaseline,
    Divider,
    Box,
    Fade,
    Backdrop,
    Modal
} from "@material-ui/core";
import {
    AccountBox,
    Email
} from '@material-ui/icons';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import MuiAlert from '@material-ui/lab/Alert';
import isEmpty from 'is-empty';
import Webcam from 'react-webcam';
import LinearProgress from '@mui/material/LinearProgress';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import http from '../../http.comon';
import {forgotEmailActions} from '../../actions/forgotEmail.action';
import { pageActions } from "../../actions/pageInfo.action";
import Particles from '../Particles'

const videoConstraints = {
    width:1280,
    height:720,
    facingMode:"user"
  };

const Alert=React.forwardRef(function Alert(props, ref){
    return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  });

const useStyles=makeStyles((theme)=>({
    root:{
        // backgroundColor:"#071722",
        backgroundImage: `url('./image/background.jpg')`,
        flexGrow: 1,
        paddingTop: '150px',
    },
    drawerHeader:{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1,1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        // justifyContent: 'flex-start',
        backgroundColor:"#071722",
        width:"100%",
    },
    createButton:{
        position:"relative",
        backgroundColor:"#00aa00",
        color:"#fff",
        '&:hover': {
            backgroundColor: '#007700',
        },
        width:"98%",
        height:'40px',
        margin:theme.spacing(1,1,1,1),
    },
    paper: {
      margin: '10%',
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      paddingBottom:'10%',
    },
    submit: {
      width:"100%",
      margin: theme.spacing(3, 0, 2),
    },
    linkButton:{
        
        backgroundColor:'transparent',
        color:'#0000ff',
        '&:hover':{
            backgroundColor:'trasparent',
            color:'#ff0000',
            textDecoration:'underline',
        },
        width:"100%",
        textDecoration:'underline',
    }
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius:"0.5em",
    p: 4,
  };
  
export default function VoterLoginPage() {
    
    const classes=useStyles();
    const history=useHistory();
    const alertContent = useSelector(state=>state.alert);
    const loggedIn = useSelector(state=>state.authentication.loggedIn);
    const loggingIn = useSelector(state=>state.authentication.loggingIn);

    const webcamRef=React.useRef(null);
    const [image, setImage] = useState(null);
    const [webCamEnable, setWebCamEnable] = useState(true);

    const dispatch = useDispatch();

    const [open, setOpen]=useState(false);
    const [dlgOpen, setDlgOpen] = useState(false);
    const [mailDlgOpen, setMailDlgOpen] = useState(false);
    const [inputs, setInputs]=useState({
        username:"",
        password:""
    });
    const [submitted, setSubmitted] = useState(false);
    const {username, password} = inputs;
    const [user, setUser] = useState({});
    const [code, setCode] = useState('');
    const [vcode, setVcode]=useState('');
    const [address, setAddress] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    useEffect(()=>{
        dispatch(userActions.logout());
        dispatch(alertActions.clear());
        dispatch(adminActions.isAdmin(false));
        dispatch(pageActions.setPageName('voterlogin'));
    },[]);

    const handleAddressChange=(e)=>{
        setAddress(e.target.value);
    }
    const handleSendToEmail=()=>{
        if(!address){
            dispatch(alertActions.error('Please enter your email address.'));
            setOpen(true);
            return;
        }

        http.post('/auth/user/send-email',{email:address})
            .then(res=>{
                console.log(res);
                const {email, verificationCode} = res.data;
                setForgotEmail(email);
                setVcode(verificationCode);
                setMailDlgOpen(false);
                setDlgOpen(true);
                setCode('');

            },error=>{
                dispatch(alertActions.error(error.response.data));
                setOpen(true);
                setAddress('');
                console.log(error);
            });
      
    }
    const handleResetCancel=()=>{
        setMailDlgOpen(false);
        setAddress('');
    }
    const handleToSignup=()=>{
        history.push('/voter-register');
    }
    /**
     * open email modal to enter email to be use reset password
     */

    const handleToForgotPassword=()=>{
        setAddress('');
        setMailDlgOpen(true);
    }
    /**
     * compare verification code and user enter code
     * if true, open forgot password page
     * @returns 
     */
    const handleConfirm=()=>{
        if(!code){
          dispatch(alertActions.error('Please enter verification code from your email.'));
          setOpen(true);
          return;
        }
        if(code==vcode){
            dispatch(forgotEmailActions.setForgotEmail(forgotEmail));
            setForgotEmail('');
            setDlgOpen(false);
            setVcode('');
            setCode('');
            history.push('/forgot-password');
  
        } else{
          dispatch(alertActions.error('Incorrect verification code'));
          setCode('');
          setOpen(true);
        }
        
  
      }
    /**
     * cancel email verification code confirm
     */
    const handleVerificationCancel=()=>{
        setVcode('');
        setDlgOpen(false);
    }
    /**
     * enter user code from own email.
     * @param {*} e 
     */
    const handleCodeChange=(e)=>{
        const val=e.target.value;
        setCode(val);
    }
    const capture = React.useCallback(
      ()=>{
        const imageSrc = webcamRef.current.getScreenshot();
        // const imageSrc = './image/driver.png';

        setImage(imageSrc);
      },
      [webcamRef]
    );
    /**
     * close alert dialog.
     * @param {*} event 
     * @param {*} reason 
     * @returns 
     */
    const handleClose=(event,reason)=>{
        if(reason==="clickaway"){
          return;
        }
        setOpen(false);
    }
    /**
     * submit login informations
     * @returns 
     */
    const handleSubmit=()=>{
        setSubmitted(true);
        if(username && password){
            if(image==null)
            {
                dispatch(alertActions.error("Please turn on your camera and take a photo from yourself."));
                setOpen(true);
                return;
            }
            const base64Image = Buffer.from(image).toString().replace(/^data:image\/png;base64,/, "");
           
            const userData = {
                username:username,
                password:password,
                base64Image:base64Image
            }

            dispatch(userActions.login(userData));
            dispatch(alertActions.clear());
            // setWebCamEnable(false);
            setOpen(true);
        }
    }
    /**
     * enter username and password on login page
     * @param {*} e 
     */
    const handleChange=(e)=>{
        const {name, value}=e.target;
        setInputs(inputs=>({...inputs, [name]:value}));
    }

    return(
        <>
            {
              <Snackbar open={!isEmpty(alertContent) && open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity={alertContent.type} sx={{width:'100%'}}>
                  {alertContent.message}
                  </Alert>
              </Snackbar>
            }
            <Particles/>

            <Grid container className={classes.root} justifyContent="center" alignItems="center">
                {loggedIn ? history.push('/elections') : ''}
                {/* <Grid className={classes.drawerHeader}/> */}
                
                <Grid container>
                    <Grid container item xs={12} sm={7} md={7} justifyContent="center">
                        <Grid container justifyContent="center" style={{backgroundColor:"#fff",width:"80%",height:"90%", borderRadius:"0.35em"}}>
                            <Grid className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="User Name"
                                        name="username"
                                        autoComplete="username"
                                        autoFocus
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AccountBox />
                                              </InputAdornment>
                                            ),
                                          }}
                                        value={username} onChange={handleChange}
                                    />
                                     {submitted && !username && <FormHelperText error>Required user name</FormHelperText>}
                                
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <Email />
                                              </InputAdornment>
                                            ),
                                          }}
                                        value={password} onChange={handleChange}
                                    />
                                    {submitted && !password && <FormHelperText error>Required password</FormHelperText>}
                                
                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Remember me"
                                    />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        onClick={(e)=>handleSubmit(e)}
                                    >
                                        Sign In
                                    </Button>
                                    
                                    <Grid container style={{marginTop:"normal"}}>
                                        <Grid container justifyContent="center" item md={5}>
                                            <Button 
                                            className={classes.linkButton} 
                                            style={{textTransform:"none", backgroundColor:"transparent"}}
                                            onClick={handleToForgotPassword}>
                                                Forgot password?
                                            </Button>
                                        </Grid>
                                        <Grid container  justifyContent="center"  item md={7}>
                                            <Button 
                                            className={classes.linkButton} 
                                            style={{textTransform:"none", backgroundColor:"transparent"}}
                                            onClick={handleToSignup}>
                                                Don't have an account? Sign Up
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {
                                      loggingIn &&
                                      <Grid container style={{width:"100%"}}>
                                        <LinearProgress style={{padding:"0.2vw",width:"100%", marginTop:'2vh'}}/>
                                      </Grid>
                                    }
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    <Grid  container item xs={12} sm={5} md={5} justifyContent="center" style={{height:"90vh"}} alignItems="center">
                        <Grid container justifyContent="center" alignItems="center" style={{width:'90%'}}>
                            <Grid container   style={{backgroundColor:"#fff",width:"90%", minHeight:"90%", borderRadius:"0.35em"}}>
                                <Grid container justifyContent="center" style={{marginTop:"2vh"}}>
                                  { webCamEnable &&
                                     <Webcam 
                                      audio={false}
                                      ref={webcamRef} 
                                      screenshotFormat="image/png"
                                      videoConstraints={videoConstraints}  
                                      style={{width:"98%", height:"98%"}}
                                      />
                                  }
                                  
                                </Grid>
                                <Grid container justifyContent="center">
                                  <Button className={classes.createButton} onClick={capture}>
                                    Take Photo   
                                  </Button>
                                </Grid>
                            </Grid>
                           
                        </Grid>
                        { !isEmpty(image) &&
                            <Grid container justifyContent="center" alignItems="center" style={{marginTop:"2vh",width:'90%'}}>
                                <Grid container justifyContent="center" alignItems="center" style={{backgroundColor:"#fff",width:"90%",minHeight:"90%", marginBottom:"0vh", borderRadius:"0.35em"}}>
                                    <img src={image} style={{width:"98%", height:"98%"}}/>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                        
                    
                </Grid>
                <Grid item >

                
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={mailDlgOpen}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                   
                >
                    <Fade in={mailDlgOpen}>
                    <Box sx={style}>
                      <Grid container justifyContent="center" >
                            <CssBaseline/>
                            <Grid container alignItems="center">
                                <Typography variant="body1">
                                    Please enter your email address.
                                </Typography>
                            </Grid>
                            <Divider style={{width:"100%"}}/>
                            <Grid container justifyContent="center" item md={12} style={{width:"70%", paddingTop:"20px"}}>
                                <form className={classes.form}>
                                    
                                    <Grid container>
                                        <Grid  container justifyContent="center" >
                                            <TextField
                                                variant="outlined"
                                                label="Email Address"
                                                required
                                                fullWidth
                                                className={classes.textField}
                                                value={address}
                                                onChange={handleAddressChange}
                                            />
                                        </Grid>
                                        
                                    </Grid>
                                    <Grid container>
                                        <Grid container item md={6} justifyContent="center"> 
                                            <Button className={classes.createButton} onClick={handleSendToEmail}>
                                                Send     
                                            </Button>
                                        </Grid>
                                        <Grid container item md={6} justifyContent="center">
                                            <Button className={classes.createButton} onClick={handleResetCancel}>
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                      </Box>
                    </Fade>
                </Modal>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={dlgOpen}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                   
                >
                    <Fade in={dlgOpen}>
                    <Box sx={style}>
                      <Grid container justifyContent="center" >
                            <CssBaseline/>
                            <Grid container alignItems="center">
                                <MarkEmailReadIcon color="primary" style={{marginLeft:"8vw",fontSize:64}}/>
                                <Typography variant="h5">
                                    Email Verification
                                </Typography>
                            </Grid>
                            <Divider style={{width:"100%"}}/>
                            <Grid container justifyContent="center" item md={12} style={{width:"70%", paddingTop:"20px"}}>
                                <form className={classes.form}>
                                    <Grid container>
                                        <Grid  container justifyContent="center" >
                                            <Typography variant="body2" style={{padding:'1vw'}}>
                                                We sent verification code to your email. Please enter code.
                                            </Typography>
                                        </Grid>
                                        
                                    </Grid>
                                    <Grid container>
                                        <Grid  container justifyContent="center" >
                                            <TextField
                                                variant="outlined"
                                                label="Verification Code"
                                                required
                                                fullWidth
                                                className={classes.textField}
                                                value={code}
                                                onChange={handleCodeChange}
                                            />
                                        </Grid>
                                        
                                    </Grid>
                                    <Grid container>
                                        <Grid container item md={6} justifyContent="center"> 
                                            <Button className={classes.createButton} onClick={handleConfirm}>
                                                Confirm     
                                            </Button>
                                        </Grid>
                                        <Grid container item md={6} justifyContent="center">
                                            <Button className={classes.createButton} onClick={handleVerificationCancel}>
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                      </Box>
                    </Fade>
                </Modal>
                </Grid>
            </Grid>
        </>
    );
}