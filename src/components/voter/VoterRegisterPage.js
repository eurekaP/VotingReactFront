import React, {useState, useEffect} from "react";
import { useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../actions/user.action";
import { alertActions } from "../../actions/alert.action";
import isEmpty from "is-empty";
import Webcam from 'react-webcam';
import LinearProgress from '@mui/material/LinearProgress';

import { 
    makeStyles,
    Grid,
    Typography, 
    Button,
    TextField,
    FormHelperText,
    Avatar,
    InputAdornment,
    Snackbar,
    Box,
    Paper,
    CssBaseline,
    Divider,
    Modal,
    Backdrop,
    Fade,
} from "@material-ui/core";

import {
    AccountBox,
    Email,
    Phone,
    ContactMail,
    Lock
} from "@material-ui/icons";
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MuiAlert from '@material-ui/lab/Alert';
import http from '../../http.comon';
import { pageActions } from "../../actions/pageInfo.action";
import Particles from '../Particles'
import getWeb3 from "../../getWeb3";


const Alert=React.forwardRef(function Alert(props, ref){
  return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
});

const videoConstraints = {
  width:1280,
  height:720,
  facingMode:"user"
};

const useStyles=makeStyles((theme)=>({
    root:{
        // backgroundColor:"#071722",
        backgroundImage: `url('./image/background.jpg')`,
        flexGrow: 1,
    },
    drawerHeader:{
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0,1),
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
        
        margin:theme.spacing(1,1,1,1),
        width:'98%',
        height:'40px',
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
    },
    submit: {
      width:"98%",
      margin: theme.spacing(3, 0, 0, 0),
    },
    modalGrid:{
      margin:'10%',
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

export default function VoterRegisterPage() {
    const classes=useStyles();
    const history=useHistory();
    const webcamRef=React.useRef(null);
    const [image, setImage] = useState(null);
    const [webCamEnable, setWebCamEnable] = useState(true);
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [open, setOpen]=useState(false);
    const [voter, setVoter] = useState({
        name:'',
        username:'',
        email:'',
        phone:'',
        address:'',
        password:'',
        photo:null,
    });

    const [submitted, setSubmitted] = useState(false);
    const [currentAccount, setCurrentAccount] = useState('');

    const alertContent = useSelector(state=>state.alert);
    const registered = useSelector(state=>state.registeration.registered);
    const registering = useSelector(state=>state.registeration.registering);

    const dispatch = useDispatch();
    const [dlgOpen, setDlgOpen] = useState(false);
    const [user, setUser] = useState({});
    const [vcode, setVcode] = useState('');

    useEffect(()=>{
      dispatch(userActions.logout());
      dispatch(alertActions.clear());
      dispatch(pageActions.setPageName('voterregister'));
      checkMetaMask();
    },[]);

    const checkMetaMask = async() => {
      try{
        const web3 = await getWeb3();
        await web3.eth.requestAccounts();
        const accounts = await web3.eth.getAccounts();
           
        if(accounts.length>0){
            
            setCurrentAccount(accounts[0]);
        }
      } catch (error){
        dispatch(alertActions.error("Can't found MetaMask. Please install MetaMask or unlock Metask."));
        setOpen(true);
      }
    }

    const handleConfirm=()=>{
      if(!code){
        dispatch(alertActions.error('Please enter verification code from your email.'));
        setOpen(true);
        return;
      }
      if(code==vcode){  // code == vcode
       
        const newVoter = user;
        newVoter.verified=true;

        dispatch(userActions.register(newVoter));
        dispatch(alertActions.clear());
        
        setOpen(true);
        // setWebCamEnable(false);
        setDlgOpen(false);
        setVcode('');
        setCode('');

      } else{
        dispatch(alertActions.error('Incorrect verification code'));
        setCode('');
        setOpen(true);
      }
    }
    const handleVerificationCancel=()=>{
      setVcode('');
      setDlgOpen(false);
    }
    const handleCodeChange=(e)=>{
      const val=e.target.value;
      setCode(val);
    }
    const capture = React.useCallback(
      ()=>{
        // const imageSrc = webcamRef.current.getScreenshot();
        const imageSrc = './image/driver.png';
        setImage(imageSrc);
      },
      [webcamRef]
    );

    /**
     * close opened alert
     * @param {*} event 
     * @param {*} reason 
     * @returns void
     */
    const handleClose=(event,reason)=>{
      if(reason==="clickaway"){
        return;
      }
      setOpen(false);
    }
    /**
     * submit voter data inputed
     */
    const handleSubmit=()=>{
      try{
        if(currentAccount)
        {
          setSubmitted(true);
          if( voter.name && voter.username && voter.email && voter.phone && voter.address && voter.password){
            if(image==null)
            {
              dispatch(alertActions.error("Please turn on your camera and take a photo from yourself."));
              setOpen(true);
              return;
            }
            const base64Image = Buffer.from(image).toString().replace(/^data:image\/png;base64,/, "");
            
            const newVoter={
              name:voter.name,
              username:voter.username,
              email:voter.email,
              phone:voter.phone,
              address:voter.address,
              password:voter.password,
              base64Image:base64Image,
              luxandId:0,
              walletaccount:currentAccount,
              verified:false
            }
            setEmail(newVoter.email);
            setUser(newVoter);

            http.post('/auth/user/verify-email',{name:voter.name, email:voter.email})
            .then(res=>{
              console.log(res);
              const {email, verificationCode} = res.data;
              setVcode(verificationCode);
              
            },error=>{
              dispatch(alertActions.error(error.toString()));
              setOpen(true);
            })
            
            setDlgOpen(true);
          }
        }

      } catch (error){
        dispatch(alertActions.error("Some errors occurred while connecting your wallet1."));
        setOpen(true);
      } 
    }
    /**
     * get value user input from input
     * @param {*} e 
     */
    const handleChange=(e)=>{
        const {name, value}=e.target;
        setVoter(voter=>({...voter, [name]:value}));
    }
    /**
     * redirect to login page
     */
    const handleCancel=()=>{
        history.push('/voter-login');
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
                {registered?history.push("/voter-login"):""}
          
                {/* <Grid className={classes.drawerHeader}/> */}
                <Grid container>
                    <Grid container item sm={7} md={7} justifyContent="center">
                        <Grid style={{backgroundColor:"#fff",width:"80%", borderRadius:"0.35em", margin:"10%"}}>
                            <Grid className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Register
                                </Typography>
                                <form name="form" onSubmit={handleSubmit} className={classes.form}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AccountBox />
                                              </InputAdornment>
                                            ),
                                          }}
                                       
                                        value={voter.name} onChange={handleChange}
                                    />
                                    {submitted && !voter.name && <FormHelperText error>Required Name</FormHelperText>}
                                
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        margin="normal"
                                        margin-right="2px"
                                        required
                                        
                                        name="username"
                                        label="User Name"
                                        id="username"
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <AccountBox />
                                              </InputAdornment>
                                            ),
                                          }}
                                        
                                        value={voter.username} onChange={handleChange}
                                    />
                                    {submitted && !voter.username && <FormHelperText error>Required User Name</FormHelperText>}
                                     
                                    <TextField
                                    
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <Email />
                                              </InputAdornment>
                                            ),
                                          }}
                                        
                                        value={voter.email} onChange={handleChange}
                                    />
                                    {submitted && !voter.email && <FormHelperText error>Required Email Address</FormHelperText>}
                                    <TextField
                                    
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="phone"
                                        label="Phone"
                                        name="phone"
                                        autoComplete="phone"
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <Phone />
                                              </InputAdornment>
                                            ),
                                          }}
                                        
                                        value={voter.phone} onChange={handleChange}
                                    />
                                    {submitted && !voter.phone && <FormHelperText error>Required Phone Number</FormHelperText>}
                                    <TextField
                                    
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="address"
                                        label="Address"
                                        name="address"
                                        autoComplete="address"
                                        InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <ContactMail />
                                              </InputAdornment>
                                            ),
                                          }}
                                        
                                        value={voter.address} onChange={handleChange}
                                    />
                                    {submitted && !voter.address && <FormHelperText error>Required Address</FormHelperText>}

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
                                                <Lock />
                                              </InputAdornment>
                                            ),
                                          }}
                                        
                                        value={voter.password} onChange={handleChange}
                                    />
                                    {submitted && !voter.password && <FormHelperText error>Required Password</FormHelperText>}
                                    <Grid container>
                                        <Grid container justifyContent="center" item md={6}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                onClick={(e)=>handleSubmit(e)}
                                            >

                                                Sign up
                                            </Button>
                                        </Grid>
                                        <Grid container justifyContent="center" item md={6}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className={classes.submit}
                                                onClick={(e)=>handleCancel(e)}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {
                                      registering &&
                                      <Grid container style={{width:"100%"}}>
                                        <LinearProgress style={{padding:"0.2vw",width:"100%", marginTop:'2vh'}}/>
                                      </Grid>
                                    }
                                   
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                    
                    <Grid  container item sm={5} md={5} justifyContent="center" style={{height:"90vh"}} alignItems="center">
                        <Grid container justifyContent="center" alignItems="center">
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
                        { 
                          !isEmpty(image) &&
                          <Grid container justifyContent="center" alignItems="center" style={{marginTop:"2vh", zIndex:'1'}}>
                              <Grid container justifyContent="center" alignItems="center" style={{backgroundColor:"#fff",width:"90%",minHeight:"90%", marginBottom:"0vh", borderRadius:"0.35em"}}>
                                  <img src={image} style={{width:"98%", height:"98%"}}/>
                              </Grid>
                          </Grid>
                        }
                    </Grid>
                        
                    
                </Grid>
                
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
                              <Grid container justifyContent="center" item md={12} style={{width:"80%", paddingTop:"20px"}}>
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
        </>
    );
}