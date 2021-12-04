import React,{useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
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
import { pageActions } from '../../actions/pageInfo.action';
import {selectionActions} from '../../actions/selection.action';


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

const fakeRows= [
  {id:1,name:'aaa'},
  {id:2,name:'bbb'},
  {id:3,name:'cccc'},
  {id:4,name:'ddd'},
  {id:5,name:'eee'},
  {id:6,name:'fff'},
  {id:7,name:'ggg'}
]
export default function Elections() {
  const alertContent = useSelector(state=>state.alert);
  const dispatch = useDispatch();
  const history = useHistory();

  const [data, setData] = useState({
    rows:[
      
    ],
    columns:[
      {field:'id',width:150},
      {field:'name', width:150},
     
    ]
  })
 
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = React.useState('');

  const electionContractAddress=useSelector(state=>state.electionContractAddress);
  const [electionContract, setElectionContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertClose=(event,reason)=>{
    if(reason==="clickaway"){
      return;
    }
    setAlertOpen(false);
 }
 const handleSelectionChange=(id)=>{
   let selectedName='';
   console.log(data);
   data.rows.map((row)=>{
      // alert('same');
    if(row.id==id){
      selectedName=row.name;
    }
   });

   const selectedItem={
     selectedId:id,
     selectedName:selectedName
   }
   dispatch(selectionActions.setSelectedItem(selectedItem));
   history.push('/elections/election-vote');
 }
  const checkMetaMask = async() =>{
    try{
        const web3 =await getWeb3();
       
        await web3.eth.requestAccounts();
        
        const accounts = await web3.eth.getAccounts();
        
        if(accounts.length>0){
           
            setCurrentAccount(accounts[0]);
            
            const contract = new web3.eth.Contract(contractAbi,electionContractAddress);
            contract.getPastEvents('NewElection',{fromBlock:0,toBlock:'latest'})
                    .then(events=>{
                      const elections = [];
                      events.forEach(element=>{
                        elections.push({
                          id:element.returnValues.id,
                          name:element.returnValues.name
                        })
                      })
                      setData(data=>({...data,rows:elections}));
                      setRows(elections);
                    })
                    
             setElectionContract(contract);
             
        }
        /**mock part 
        setData(data=>({...data,rows:fakeRows}));
        setRows(fakeRows);*/

        
    } catch(error){
        dispatch(alertActions.error("Can't found MetaMask. Please install MetaMask or unlock Metask."));
        setAlertOpen(true);
    }
    
}
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.rows.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
   
    setRows(filteredRows);
  };

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
        
        <Paper style={{ height: '70vh', width: '80%', margin:'5%'}} elevation={24}>
          <DataGrid
            onSelectionModelChange={(newSelectionModel)=>{
              handleSelectionChange(newSelectionModel[0]);
            }}
            components={{ Toolbar: QuickSearchToolbar }}
            rows={rows}
            columns={data.columns}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(''),
              },
            }}
          />
        </Paper>
      </>
  );
}



