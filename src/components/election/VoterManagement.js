import React,{useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import isEmpty from 'is-empty';
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Paper,
  Snackbar
} from '@mui/material'
import MuiAlert from '@mui/lab/Alert';
import getWeb3 from '../../getWeb3';
import {contractAbi} from '../../app/contractAbi';
import {alertActions} from '../../actions/alert.action';
import { userActions } from '../../actions/user.action';
import { pageActions } from '../../actions/pageInfo.action';
import {selectionActions} from '../../actions/selection.action';

import TelegramIcon from '@mui/icons-material/Telegram';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';



const Alert=React.forwardRef(function Alert(props, ref){
  return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
});

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5),
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
      paper: {
        margin: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        elevation:3,
        width:"100%",
      },
      button:{
        backgroundColor:"#00aa00  !important ",
        color:"#fff  !important",
        '&:hover': {
            backgroundColor: '#007700  !important',
        },
        margin:theme.spacing(1,0,1,0),
        width:"98%",
      }
    }),
  { defaultTheme },
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport/>
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Elections() {
  const classes=useStyles();
  const alertContent = useSelector(state=>state.alert);
  const dispatch = useDispatch();
  const history = useHistory();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([
    {field:'no',width:100, headerName: 'No.'},
    {field:'username', width:150, headerName: 'User Name'},
    {field:'name', width:200, headerName: 'Full Name'},
    {field:'email', width:200, headerName: 'Email'},
    {field:'address', width:150, headerName: 'Address'},
    {field:'phone', width:150, headerName: 'Phone'},
    {field:'walletaccount', width:300, headerName: 'Metamask Wallet'},
    {field:'balance', width:150, headerName: 'Balance'},
    {
      field:'action', 
      sortable: false,
      width:200, 
      headerName: 'Action',
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
  
          const api = params.api;
          const thisRow = {};
  
          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field)),
            );

          setOpen(true);
          setSelectedVoterWallet(thisRow['walletaccount']);
          setSelectedVoterName(thisRow['name']);
          
          // return alert(JSON.stringify(thisRow, null, 4));
        };
        
        return <Button 
            className={classes.button}  
            startIcon={<MonetizationOnIcon/>} onClick={onClick}>
            PAY ETH    
        </Button>
      },
    }
  ]);

  const [searchText, setSearchText] = React.useState('');

  const electionContractAddress=useSelector(state=>state.electionContractAddress);
  const voters = useSelector(state=>state.voter.voters);

  const [electionContract, setElectionContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedVoterWallet, setSelectedVoterWallet] = React.useState('');
  const [selectedVoterName, setSelectedVoterName] = React.useState('');
  
  
  const [amount, setAmount] = React.useState(0.001);

  const handleAlertClose=(event,reason)=>{
    if(reason==="clickaway"){
      return;
    }
    setAlertOpen(false);
  }

 const handleClose = () => {
  setOpen(false); 
 };

 const handleAddVoter= async() =>{
    const web3 =await getWeb3();
    try{
        
        electionContract.methods.adminAddVoter(selectedVoterWallet).send({
            from: currentAccount,
            value: web3.utils.toWei((amount).toString(), 'ether')
        })
        .on('transactionHash', function(hash){
            // $('#addSpinner').removeClass('d-block').addClass('d-none');
        })
        .on('receipt', function(receipt){
            handleClose();
            checkMetaMask();
            dispatch(alertActions.success("You confirmed new voter and transfer " + amount + " (ETH) to voter."));
            setAlertOpen(true);
        })
        .on('error', function(error, receipt) {
            dispatch(alertActions.error("Some thing wrong with this transaction!"));
            setAlertOpen(true);
        });
    } catch(err){
        console.log(err);
        dispatch(alertActions.error("Invalid address or some thing wrong with this transaction!"));
        setAlertOpen(true);
    }
    
  }


const checkMetaMask = async() =>{
    try {
        const web3 =await getWeb3();
        await web3.eth.requestAccounts();
        const accounts = await web3.eth.getAccounts();
        
        if(accounts.length>0){
          dispatch(userActions.getAll());
          console.log(voters);

          const pendingVoters = [];

          setCurrentAccount(accounts[0]);
          
          const contract = new web3.eth.Contract(contractAbi,electionContractAddress);
          setElectionContract(contract);

          for(let i=0; i<voters.length; i++){
            let _balance = 0;
            await web3.eth.getBalance(voters[i].walletaccount, function (error, wei) {
              if (!error) {
                _balance = web3.utils.fromWei(wei, 'ether');
                  console.log(_balance + " ETH");
              }
            });
              pendingVoters.push({
              id: voters[i]._id,
              no:i + 1,
              username: voters[i].username,
              name: voters[i].name,
              email: voters[i].email,
              address: voters[i].address,
              phone: voters[i].phone,
              walletaccount: voters[i].walletaccount,
              balance: parseFloat(_balance).toFixed(6) + ' ETH',
              action: ''
            });
            console.log('balance:', _balance);
          }
          
          setRows(pendingVoters);
        }
    } catch (error) {
      dispatch(alertActions.error("Voter list fetching issue."));
      setAlertOpen(true);
    }
  }

  const handleAmountChange=(e)=>{
    const value = e.target.value;
    setAmount(value);
  }

  useEffect(() => {
    dispatch(pageActions.setPageName('elections'));
    checkMetaMask();
  }, []);

  return (
      <>
        {
          
          <Snackbar open={!isEmpty(alertContent) && alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
              <Alert onClose={handleAlertClose} severity={alertContent.type} sx={{width:'100%'}}>
              {alertContent.message}
              </Alert>
          </Snackbar>
        }
        
        <Paper style={{ height: '80vh', width: '90%', margin:'3%'}} elevation={24}>
          <DataGrid
            style = {{ padding: '10px'}}
            onSelectionModelChange={(newSelectionModel)=>{
              // handleSelectionChange(newSelectionModel[0]);
            }}
            // components={{ Toolbar: QuickSearchToolbar }}
            rows={rows}
            columns={columns}
          />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {`Transfor following amount of ETH to "${selectedVoterName}"`}
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {`Wallet Address :  ${selectedVoterWallet}`}
              </Typography>
              <TextField
                  variant="outlined"
                  label="Amount"
                  required
                  fullWidth
                  className={classes.textField}
                  value={amount}
                  onChange={handleAmountChange}
                  style={{marginTop:'2rem', marginBottom: '2rem'}}
              />
              <Button className={classes.button}  startIcon={<MonetizationOnIcon />} onClick={handleAddVoter} style={{padding:'1rem'}}>
                Confirm and Pay
              </Button>
            </Box>
          </Modal>
        </Paper>
      </>
  );
}



