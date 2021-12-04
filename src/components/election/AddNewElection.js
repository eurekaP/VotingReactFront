import React,{useState, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import { makeStyles } from "@material-ui/core";
import {alertActions} from '../../actions/alert.action';
import {userActions} from '../../actions/user.action';
import {styled} from '@mui/material/styles';
import http from '../../http.comon';
import {
    Grid,
    Box,
    CssBaseline,
    TextField,
    Button,
    Typography,
    Divider,
    Paper,
    Modal,
    Backdrop,
    Fade,
    TextareaAutosize,
    IconButton,
    Snackbar
    
} from '@material-ui/core'
import Chip from '@mui/material/Chip';
import {
     MonetizationOn,
     Contacts,
     Add
} from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import BackupIcon from '@mui/icons-material/Backup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import isEmpty from "is-empty";
import getWeb3 from '../../getWeb3';
import {contractAbi} from '../../app/contractAbi';
import AppsIcon from '@mui/icons-material/Apps';
import { pageActions } from "../../actions/pageInfo.action";
import moment from 'moment';

const ListItem = styled('li')(({theme})=>({
    margin:theme.spacing(0.5),
    listStyle:'none',
}));

const Alert=React.forwardRef(function Alert(props, ref){
    return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  });
const useStyles=makeStyles((theme)=>({
    root:{
        flexGrow:1,
        backgroundColor:"transparent",
        height:"100vh",
    },
    paper: {
      margin: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      elevation:3,
      width:"100%",
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
      padding:theme.spacing(0,0,10,0),
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
        
        width:"90%",
        height:"80%",
        borderRadius:"2em",
    },
    textField:{
        margin:theme.spacing(1,0,1,0),
    },
    iconBtn:{
        backgroundColor:"#00aa00",
        color:"#fff",
        '&:hover': {
            backgroundColor: '#007700',
        },
        
        // width:"90%",
        marginTop:"1vh",
        marginBottom:"1vh",
    },
    linkBtn:{
        backgroundColor: 'transparent', 
        textTransform:"none",
        textDecoration:"true",
        fontSize:28, 
        color:"#0000ff",
        '&:hover': {
            color:"#ff0000",
        },
        textDecoration:"true",
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
export default function AddNewElection(){
    const classes=useStyles();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [dlgOpen, setDlgOpen] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [linkOpen, setLinkOpen] = useState(false);
    const [txhash, setTxhash] = useState('');
    const [inputs, setInputs] = useState({
        candidateName:'',
        description:''
    })

    const [candidateList, setCandidateList] = useState([]);
    const [electionName, setElectionName] = useState('');
    let [avatarFile, setAvatarFile] = useState('');
    
    const {candidateName, description}=inputs;
    
    const alertContent = useSelector(state=>state.alert);
    const dispatch = useDispatch();

    const electionContractAddress=useSelector(state=>state.electionContractAddress);
    const [electionContract, setElectionContract] = useState(null);
    const [currentAccount, setCurrentAccount] = useState('');
    const [balance, setBalance] = useState('');
    
    const getBalance=async()=>{
        const web3 = await getWeb3();
        web3.eth.getBalance(currentAccount, function(error, result){
            if(result){
                setBalance( web3.utils.fromWei(result, 'ether'));
            }
        })
    }
    const checkMetaMask = async() =>{
        try{
            const web3 =await getWeb3();
           
            await web3.eth.requestAccounts();
            
            const accounts = await web3.eth.getAccounts();
            
            if(accounts.length>0){
               
                setCurrentAccount(accounts[0]);
                web3.eth.getBalance(accounts[0], function(error, result){
                    if(result){
                        setBalance( web3.utils.fromWei(result, 'ether'));
                    }
                })
            }
            const contract = new web3.eth.Contract(contractAbi,electionContractAddress);
            
            setElectionContract(contract);
            
        } catch(error){
            dispatch(alertActions.error("Can't found MetaMask. Please install MetaMask."));
            setAlertOpen(true);
        }
        
    }
    useEffect(()=>{
        dispatch(alertActions.clear());
        dispatch(pageActions.setPageName('elections'));
        checkMetaMask();
        // getBalance();
    },[]);

    const handleCandidateChange=(e)=>{
        const {name, value} = e.target;
        setInputs({...inputs, [name]:value});
    }
    const handleCandidateDlgOpen=()=>{
        setDlgOpen(true);
        setLinkOpen(false);
        setTxhash('');
    }
    const handleClose=()=>{
        setDlgOpen(false);
    }
    const handleImageUpload=(e)=>{
        const file = e.target.files[0];
        let base64String = '';
        const reader=new FileReader();

        reader.onload = function () {
            base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        
          }
        reader.readAsDataURL(file);
        
        setTimeout(function() {
            setAvatarFile(base64String);
          }, 1000);
        setAvatar(file.name);
    }
    const handleAlertClose=(event,reason)=>{
        if(reason==="clickaway"){
          return;
        }
        setAlertOpen(false);
    }
    const handleToEtherscan=()=>{
        window.open("https://ropsten.etherscan.io/tx/");
    }
    const handleAddElection=()=>{
        
        if(!electionName || !startDate || !endDate || candidateList.length==0){
            dispatch(alertActions.error("You should complete the form!"));
            setAlertOpen(true);
           
        } else{
            let st = moment(startDate).unix();
            let en = moment(endDate).unix();

            const dateJSON={
                startDate:st,
                endDate:en
            }
            try{
                http.post('/auth/user/upload-image', {candidateList:candidateList})
                .then(res=>{
                    const _candidateList = res.data.candidateList;
                    console.log('This is start of add election event');
                    console.log(electionName);
                    console.log(_candidateList.map(JSON.stringify));
                    console.log(JSON.stringify(dateJSON));
                    // console.log(_candidateList);

                    setTimeout(function() {
                        // alert(currentAccount);
                        electionContract.methods.adminAddElection(
                            electionName, 
                            _candidateList.map(JSON.stringify), 
                            JSON.stringify(dateJSON)
                            ).send({
                                from:currentAccount
                            }).on('transactionHash', function(hash){
                                console.log('This is hash : ', hash);
                                setElectionName('');
                                setStartDate(null);
                                setEndDate(null);
                                setCandidateList([]);
                                setTxhash(hash);
                            })
                            .on('receipt', function(receipt){
                                console.log('receipt okay');
                                dispatch(alertActions.success("Your transaction to add a new bounty is approved."));
                                setAlertOpen(true);
                                setLinkOpen(true);
                                getBalance();
                            })
                            .on('error', function(error, receipt) {
                                dispatch(alertActions.error("Something wrong with this transaction!"));
                                setAlertOpen(true);
                            });
                    }, 1000);
                }, error=>{
                    try{
                        dispatch(alertActions.error(error.response.data));
                    } catch(err){
                        dispatch(alertActions.error('Some errors occurred while registering candidate...'));
                    }
                   
                    setAlertOpen(true);
                })
            } catch(error){
                dispatch(alertActions.error('Some errors occurred while registering candidate...'))
                setAlertOpen(true);
            }
            

            
        }

    }

    const handleCandidateSubmit=()=>{
        if(candidateName && description && avatarFile!=''){
            
            const newCandidate={
                description: description,
                name: candidateName,
                avatarBase64: avatarFile
            }
            setCandidateList(candidateList=>[...candidateList, newCandidate]);
            setAvatar('');
            setInputs({ candidateName:'',description:''});

            setDlgOpen(false);
        } else{
            dispatch(alertActions.error("Please fill the form."));
            setAlertOpen(true);
        }
    };
    const handleELectionNameChange=(e)=>{
        setElectionName(e.target.value);
        setLinkOpen(false);
        setTxhash('');
    }
    const handleDelete = (chipToDelete) => () => {
        
        setCandidateList((candidateList) => candidateList.filter((chip) => chip.name !== chipToDelete.name));
    };
    return(
        <>
             {
               
              <Snackbar open={!isEmpty(alertContent) && alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                  <Alert onClose={handleAlertClose} severity={alertContent.type} sx={{width:'100%'}}>
                  {alertContent.message}
                  </Alert>
              </Snackbar>
             }
            <Grid component="main" className={classes.root} style={{margin:'3%'}}>
                <Grid container>
                     <Grid container item md={6} justifyContent="center" >
                       <Paper className={classes.paper} style={{ borderRadius:"0.35em", paddingTop:"10px", paddingBottom:"10px"}} elevation={16}>
                            <Grid  container alignItems="center" item >
                                <Grid>
                                    <Box style={{backgroundColor:"#007fff", width:"80px", height:"80px",marginLeft:"10px"}}>
                                        <Contacts  style={{marginTop:"15px", marginLeft:"15px", fontSize:50}}/>
                                    </Box>
                                </Grid>
                                <Grid style={{paddingLeft:"1vw", textOverflow:'hidden'}}>
                                    <Grid>
                                        <Typography variant="h6" >
                                            Your Address:
                                        </Typography>
                                    </Grid>
                                    <Grid style={{textOverflowX:'hidden'}}>
                                        <Typography 
                                            variant="body2" 
                                            color="primary" 
                                            style={{
                                                width:'200px', 
                                                overflowX:'hidden', 
                                                textOverflow:'ellipsis'}}>
                                            {currentAccount} 
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>{/* */}
                    </Grid> 
                    <Grid container item md={6} justifyContent="center" >
                       <Paper className={classes.paper} style={{ borderRadius:"0.35em", paddingTop:"10px", paddingBottom:"10px"}} elevation={16}>
                            <Grid  container alignItems="center" item >
                                <Grid>
                                    <Box style={{backgroundColor:"#007fff", width:"80px", height:"80px",marginLeft:"10px"}}>
                                        <MonetizationOn  style={{marginTop:"15px", marginLeft:"15px", fontSize:50}}/>
                                    </Box>
                                </Grid>
                                <Grid style={{paddingLeft:"1vw", }}>
                                    <Grid>
                                        <Typography variant="h6" >
                                            Your Balance:
                                        </Typography>
                                    </Grid>
                                    <Grid >
                                        <Typography variant="body2" color="primary" >
                                            {balance} 
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>{/* */}
                    </Grid> 
                </Grid>
                <Grid container>
                    {
                        linkOpen &&
                        <Paper className={classes.paper} 
                        elevation={24} >
                            <Grid container alignItems="center">
                                <AppsIcon style={{fontSize:48, color:"#aa0000", marginLeft:"2vw"}}/>
                                <Typography variant="h5" style={{marginLeft:"1vw", paddingTop:"1vw", paddingBottom:"1vw"}}>
                                    Click <Button className={classes.linkBtn} style={{ backgroundColor: 'transparent' }} onClick={handleToEtherscan}>here</Button> to see the details of the transaction in etherscan.
                                </Typography>
                            </Grid>
                        </Paper>
                    }
                </Grid>
                <Grid container>
                    <Paper className={classes.paper} 
                       elevation={24}>
                        <CssBaseline/>
                        <Grid container >
                            <Typography variant="h5" style={{marginLeft:"12vw", paddingTop:"2vw"}}>
                                Add New Election
                            </Typography>
                        </Grid>
                        
                        <Divider  style={{width:"100%"}}/>
                        <Grid container justifyContent="center"  item md={12} style={{width:"70%"}}>
                            <form className={classes.form}>
                                <Grid container >
                                    <Grid container justifyContent="center"item md={6} style={{padding:"1vw",}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                renderInput={(props) => <TextField {...props} />}
                                                label="Start Date"
                                                value={startDate}
                                                inputFormat="MM/dd/yyyy hh:mm a"
                                                onChange={(newValue) => {
                                                setStartDate(newValue);
                                                }}
                                                style={{width:"100vw"}} 
                                            />
                                    
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid container justifyContent="center" item md={6} style={{padding:"1vw"}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DateTimePicker
                                                renderInput={(props) => <TextField {...props} />}
                                                label="End Date"
                                                value={endDate}
                                                
                                                inputFormat="MM/dd/yyyy hh:mm a"
                                                valueDefault={null}
                                                onChange={(newValue) => {
                                                setEndDate(newValue);
                                                }}
                                            />
                                    
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid  container justifyContent="center" item md={4}>
                                        <TextField
                                            variant="outlined"
                                            label="Name"
                                            required
                                            fullWidth
                                            value={electionName}
                                            className={classes.textField}
                                            onChange={handleELectionNameChange}
                                        />
                                    </Grid>
                                    <Grid container item md={4} justifyContent="center" alignItems="center"> 
                                        <Button className={classes.button} startIcon={<Add />} onClick={handleCandidateDlgOpen}>
                                            Add Candidate    
                                        </Button>
                                    </Grid>
                                    <Grid container item md={4} justifyContent="center" alignItems="center">
                                        <Button className={classes.button} startIcon={<Add />} onClick={handleAddElection}>
                                            Add New Election
                                        </Button>
                                    </Grid>
                                   
                                </Grid>
                                <Grid container component="ul" >
                                    {candidateList.map((data,key) => {
                                       
                                        return (
                                        <ListItem key={key}>
                                            <Chip
                                            color="primary"
                                            label={data.name}
                                            onDelete={handleDelete(data)}
                                            
                                           />
                                        </ListItem>
                                        );
                                    })}
                                </Grid>
                                                
                            </form>
                        </Grid>
                        
                    </Paper>
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
                        <Grid>
                            <Grid>
                                <Typography>New Candidate</Typography>
                                <Divider/>
                            </Grid>
                            <Grid container style={{width:"100%"}} justifyContent="center">
                                <Grid container justifyContent="center" item md={6} style={{marginTop:"2vh"}}>
                                    <TextField 
                                    variant="outlined" 
                                    label="Name" 
                                    style={{width:"98%"}}
                                    name="candidateName"
                                    value={candidateName}
                                    onChange={handleCandidateChange}
                                    />
                                </Grid>
                                <Grid container justifyContent="center" item md={6} style={{marginTop:"2vh"}}>
                                    <Grid container justifyContent="center" item md={10} >
                                        <TextField 
                                        variant="outlined" 
                                        value={avatar} 
                                        label="Avata URL" 
                                        style={{width:"98%"}}/>
                                    </Grid>
                                     <Grid container justifyContent="center" item md={2}>
                                        <IconButton
                                            variant="contained"
                                            component="label"
                                            className={classes.iconBtn}>
                                            <BackupIcon/>
                                            <input
                                                type="file"
                                                hidden
                                                onChange={handleImageUpload}
                                            />
                                            </IconButton>
                                        
                                    </Grid>
                                    
                                </Grid>
                               
                                
                            </Grid>
                            <Grid style={{marginTop:"2vh"}}>
                                <Typography>Description</Typography>
                                <Divider/>
                            </Grid>
                            <Grid container justifyContent="center" style={{marginTop:"2vh", width:"100%"}}>
                                
                                <TextareaAutosize
                                    maxRows={4}
                                    aria-label="maximum height"
                                    placeholder="Please input your descriptions."
                                    style={{width:"99%", minHeight:"20vh"}}
                                    name="description"
                                    value={description}
                                    onChange={handleCandidateChange}
                                    />
                            </Grid>
                            <Grid container style={{marginTop:"2vh"}}>
                                <Typography style={{flexGrow:1}}/>
                                <Button className={classes.button} style={{width:"20vw"}} onClick={handleCandidateSubmit}>Save Candidate</Button>
                            </Grid>
                        </Grid>
                        
                    </Box>
                    </Fade>
                </Modal>
            </Grid>
        </>
    );
}