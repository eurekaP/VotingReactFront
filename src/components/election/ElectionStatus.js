import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import moment from 'moment';
import http from '../../http.comon';
import {alertActions} from '../../actions/alert.action';
import isEmpty from 'is-empty';
import classNames from 'classnames';

import {
    Grid,
    Paper,
    Typography,
    Divider,
    Button,
    Box,
    LinearProgress,
    Card, 
    CardMedia, 
    CardContent, 
    CardActionArea,
    Avatar,
    IconButton,
    Snackbar
} from '@material-ui/core';

import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    BarSeries,

    PieSeries,
    Title,
    // Animation,
} from '@devexpress/dx-react-chart-material-ui';

import PieChart, {
    Legend,
    Export,
    Series,
    Label,
    Font,
    Connector,
} from 'devextreme-react/pie-chart';

import MuiAlert from '@material-ui/lab/Alert';
import {
    ArrowBackIosOutlined,
    Check,
} from '@material-ui/icons'
import TelegramIcon from '@mui/icons-material/Telegram';
import ChartIcon from '@mui/icons-material/BarChart';
import {makeStyles} from '@material-ui/core/styles';
import getWeb3 from '../../getWeb3';
import {contractAbi} from '../../app/contractAbi';
import { selectionActions } from '../../actions/selection.action';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Alert=React.forwardRef(function Alert(props, ref){
    return  <MuiAlert elevation={6} ref={ref} variant="filled" {...props}/>
  });

const useStyles = makeStyles((theme)=>({
    root:{
        flexGrow:1,
        backgroundColor:"#fff",
        height:"100%",
    },
    paper:{
      margin:'5%',
      width:"100%",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: '3%',
        padding:'5%',
    },
    button:{
        backgroundColor:"#2196f3",
        color:"#fff",
        '&:hover': {
            backgroundColor: '#2156a3',
        },
        textTransform:'none',
        width:"120px",
    },
    statusbutton: {
        width: "150px"
    },
    card: {
        display: "flex",
        flexDirection: "row",
    },
    cardActive:{
        display: "flex",
        flexDirection: "row",
        border: `3px solid orange`,
    },
    cardMedia: {
        paddingTop: "56.25%", // 16:9
    
    },
    cardContent: {
        flexGrow: 1,
    },
    avatar: {
        border: `3px solid orange`,
        width: theme.spacing(12),
        height:theme.spacing(12),
        boxShadow:theme.spacing(12),
    },
    boardTitle: {
        fontWeight: 'bold',
        fontSize: '2rem',
        paddingLeft: '0.5rem',
    },
    boardContent: {
        fontSize: '3rem',
        textAlign: 'center',
        padding: '10%',
    },
    boardIndex: {
        color: 'darkgray',
    },
    electionTitle: {
        fontSize: '3rem',
        padding: '1rem',
        textAlign: 'center',
    }
}));


const cards=[
    {
        title:"Secure Voting",
        description:'Each voter has a unique "Voter ID" and "Voter Key" and can only vote once.',
        img:"guy-holding-ipad.jpg"
    },
    {
        title:"Mobile Ready",
        description:'Elections are optimized for ',
        img:"driver2.png"
    },
    {
        title:"Custom Design",
        description:`Personalize your election with your organization's logo and colors. `,
        img:"driver.png"
    },
    
];

export default function ElectionVote(){
    const classes=useStyles();
    const dispatch = useDispatch();
    const selectedId = useSelector(state=>state.selectionInfo.selectedId);
    const selectedName = useSelector(state=>state.selectionInfo.selectedName);
    const electionContractAddress = useSelector(state=>state.electionContractAddress);
    const [electionContract, setElectionContract] = useState('');
    const [currentAccount, setCurrentAccount] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);

    const [electionName, setElectionName] = useState('');
    const [votingStatus, setVotingStatus] = useState([]);

    const alertContent = useSelector(state=>state.alert);

    const history = useHistory();

    useEffect(()=>{
        checkMetaMask();
    },[]);

    const handleToBack=()=>{
        dispatch(selectionActions.clear());
        history.push('/elections');
    }
 
    const checkMetaMask=async()=>{

        try{
            const web3 =await getWeb3();
            await web3.eth.requestAccounts();
            const accounts = await web3.eth.getAccounts();
            
            setVotingStatus([]);
            
            if(accounts.length>0){
                setCurrentAccount(accounts[0]);
                const contract = new web3.eth.Contract(contractAbi,electionContractAddress);
                setElectionContract(contract);
                contract.methods.electionInfo(selectedId).call({
                    from:accounts[0]
                }).then(res=>{
                    console.log('GetElectionInfo', res);
                   
                    let candidateList = res._options.map(JSON.parse);

                    let length = res._optionVotes.length;
                    for(let i = 0; i < length; i++) {
                        const votingInfo = {
                            argument: candidateList[i]['name'],
                            value: Number(res._optionVotes[i])
                        };
                        console.log(votingInfo);
                        setVotingStatus(votingStatus=>([...votingStatus, votingInfo]));

                    }
                }).catch(err => {
                    console.log('error', err);
                })
            }
            
        }catch(error){

        }
    }

    const handleAlertClose=(event,reason)=>{
        if(reason==="clickaway"){
          return;
        }
        setAlertOpen(false);
    }

    function customizeText(arg) {
        return `${arg.valueText} (${arg.percentText})`;
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
            <Grid container container component="main" className={classes.root}>
                <Grid container >
                    <IconButton style={{color:'#2196f3'}} onClick={handleToBack}>
                        <ArrowBackIosOutlined/>
                        Back
                    </IconButton>
                </Grid>
                <Grid container >
                    <Paper className={classes.paper} elevation={0} style={{margin:'0px'}}>
                        <Typography className={classes.electionTitle}> {selectedName} </Typography>
                    </Paper>
                </Grid>
                <Grid container style={{padding:'1%'}}>
                    <Grid container item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Paper className={classes.paper} elevation={8}>
                            <Chart data={votingStatus}>
                                <ArgumentAxis />
                                <ValueAxis />
                            
                                <BarSeries valueField="value" argumentField="argument" />
                            </Chart>
                        </Paper>
                    </Grid>
                    <Grid container item xs={12} sm={12} md={6} lg={6} xl={6}>    
                        <Paper className={classes.paper} elevation={8}>
                            <PieChart id="pie"
                                palette="Bright"
                                dataSource={votingStatus}
                                // title="Olympic Medals in 2008"
                            >
                                <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={4} />
                                <Export enabled={true} />
                                <Series argumentField="argument" valueField="value">
                                <Label
                                    visible={true}
                                    position="columns"
                                    customizeText={customizeText}>
                                    <Font size={16} />
                                    <Connector visible={true} width={0.5} />
                                </Label>
                                </Series>
                            </PieChart>      
                        </Paper>                      
                    </Grid>
                </Grid>
                <Grid container style={{padding:'2%'}}>
                    {votingStatus.map((chart, index) => (
                        
                        <Grid container item xs={12} sm={12} md={3} lg={3} xl={3}> 
                            <Paper className={classes.paper} elevation={8} style={{padding: '5%'}}>
                                <Typography className={classes.boardTitle}> {chart.argument} </Typography>
                                <Typography className={classes.boardIndex}> {`#${index + 1}`} </Typography>
                                <Typography className={classes.boardContent}> {chart.value} </Typography>
                            </Paper>

                        </Grid>
                    ))}
                </Grid>
                
            </Grid>
        </>
    );
}