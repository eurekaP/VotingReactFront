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
// import { selectionActions } from '../../actions/selection.action';
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

const chartData = [
    { argument: 'Alex', value: 30 },
    { argument: 'Denys Meydanove', value: 20 },
    { argument: 'Nikolai Baska', value: 26 },
    { argument: 'Venezina', value: 42 },
    { argument: 'Pusharugu', value: 12 },
    { argument: 'Alex1', value: 10 },
    { argument: 'Denys Meydanove1', value: 26 },
    { argument: 'Nikolai Bask1a', value: 11 },
];

const fakeElectionOptions = [
    {optionIndex:1, optionLength:5, totalOptionVote:25,totalVote:60, percentage:45,name:'abcd',avatarUrl:'driver.png',description:'This is option of '},
    {optionIndex:2, optionLength:3, totalOptionVote:30,totalVote:75, percentage:40,name:'aaaa',avatarUrl:'driver2.png',description:'This is option of '},
    {optionIndex:3, optionLength:2, totalOptionVote:40,totalVote:50, percentage:80,name:'abcvvvd',avatarUrl:'ipad-dashboard.jpg',description:'This is option of '},
    {optionIndex:4, optionLength:7, totalOptionVote:10,totalVote:60, percentage:10,name:'absadfcd',avatarUrl:'driver.png',description:'This is option of '},
    {optionIndex:5, optionLength:4, totalOptionVote:50,totalVote:80, percentage:65,name:'abadfaacd',avatarUrl:'driver2.png',description:'This is option of '},
    {optionIndex:6, optionLength:5, totalOptionVote:60,totalVote:90, percentage:60,name:'abadfcd',avatarUrl:'guy-holding-ipad',description:'This is option of '},
];

export default function ElectionVote(){
    const classes=useStyles();
    const dispatch = useDispatch();
    const selectedId = useSelector(state=>state.selectionInfo.selectedId);
    const selectedName = useSelector(state=>state.selectionInfo.selectedName);
    const electionContractAddress = useSelector(state=>state.electionContractAddress);
    const [electionContract, setElectionContract] = useState('');
    const [currentAccount, setCurrentAccount] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);

    const [electionName, setElectionName] = useState('');
    const [electionOptions, setElectionOptions] = useState([]);
    const [registered, setRegistered] = useState(false);
    const [voted, setVoted] = useState(false);
    const [votedName, setVotedName] = useState('');
    const [activeId, setActiveId] = useState(null);
    const alertContent = useSelector(state=>state.alert);

    const history = useHistory();

    useEffect(()=>{
        checkMetaMask();
        checkPromissionToVote();
    },[]);

    useEffect(()=>{
        if(electionContract)
        {
            electionContract.methods.userVote(currentAccount, selectedId).call({
                from:currentAccount
            }).then(vote_res=>{
                console.log('res', vote_res);
                if(vote_res=='0'){
                    setVoted(false);
                    setVotedName('');
                } else{
                    setVoted(true);
                    console.log('length : ', electionOptions.length);
                    if(electionOptions.length != 0){
                        setVotedName(electionOptions[Number(vote_res)].name);
                    }
                }
                return electionContract.methods.voters(currentAccount).call({
                    from:currentAccount
                });
            }).then(res=>{
                console.log('registered voite :', res);
                if(res){
                    setRegistered(true);
                } else{
                    setRegistered(false);
                }
            }).catch(err => {
                console.log('error', err);
            })
        }
        
    },[electionOptions]);

    const handleToBack=()=>{
        // dispatch(selectionActions.clear());
        history.push('/elections');
    }
    const checkPromissionToVote=()=>{
        console.log('checkPromissionToVote');
        
        if(electionContract)
        {
            electionContract.methods.voters(currentAccount).call({
                from:currentAccount
            }).then(res=>{
                if(res){
                    setRegistered(true);
                } else{
                    setRegistered(false);
                }
            }).catch(err =>{   
                console.log(err);
            })
        }
    }
    const handleSelectCandidate=(index)=>{
        
        setActiveId(index);
    }
    const checkMetaMask=async()=>{

        try{
            const web3 =await getWeb3();
            await web3.eth.requestAccounts();
            const accounts = await web3.eth.getAccounts();
            
            setElectionOptions([]);
            
            if(accounts.length>0){
                setCurrentAccount(accounts[0]);
                const contract = new web3.eth.Contract(contractAbi,electionContractAddress);
                setElectionContract(contract);
                contract.methods.electionInfo(selectedId).call({
                    from:accounts[0]
                }).then(res=>{
                    console.log('GetElectionInfo', res);
                   
                    const electionJson = JSON.parse(res._json);

                    const st = Number(electionJson.startDate);
                    const en = Number(electionJson.endDate);

                    setStartDate(st);
                    setEndDate(en);

                    setElectionName(res.name);
                    let candidateList = res._options.map(JSON.parse);
                    let candidateImageList = [];
                    
                    http.post('/auth/user/get-image',candidateList)
                    .then(response=>{
                        candidateImageList = response.data.candidateList;
                        let totalVote = res._total;
                        let percentage = 0;
                        
                        let electionOptionsList = [];
                        for(let i=0;i<candidateImageList.length;i++){
                            let totalOptionVote = res._optionVotes[i];
                            percentage = totalVote == '0' ? 0 : (Number(totalOptionVote) / Number(totalVote)) * 100;

                            const electionOption={
                                optionIndex:i,
                                name:candidateImageList[i].name,
                                avatar:candidateImageList[i].base64Image,
                                description:candidateImageList[i].description,
                                optionLength:candidateImageList.length,
                                totalOptionVote:totalOptionVote,
                                totalVote:res._total,
                                percentage:percentage
                            }
                            electionOptionsList.push(electionOption);
                            // setElectionOptions(electionOptions=>([...electionOptions, electionOption]));
                        }
                        setElectionOptions(electionOptionsList);
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log('error', err);
                })
                        
                // setElectionOptions(fakeElectionOptions);
            }
            
        }catch(error){

        }
    }

    const handleVote=()=>{
        
        if(activeId==null){
            dispatch(alertActions.error('You should choose one of the candidate.'));
            setAlertOpen(true);
            return;
        }
        const currentDate = moment().unix();
        if(currentDate<startDate){
            dispatch(alertActions.error('The election is not started yet'));
            setAlertOpen(true);
            return;
        }
        if(currentDate>endDate){
            dispatch(alertActions.error('The election was expired'));
            setAlertOpen(true);
            return;
        }
        console.log('selectedId', selectedId);
        console.log('activeid', activeId);
        electionContract.methods.vote(selectedId, activeId).send({
            from:currentAccount
        }).on('transactionHash', function(hash){
               
          })
          .on('receipt', function(receipt){
                dispatch(alertActions.success('You have successfully vote to the selected candidate'));
                // Refresh the electionOptions state variable....
                setAlertOpen(true);

                if(electionOptions.length != 0){
                    setVotedName(electionOptions[activeId].name);
                }
          })
          .on('error', function(error, receipt) {
               console.log(error);
                dispatch(alertActions.error('Some thing wrong with this transaction!'));
                setAlertOpen(true);
           })
    }

    const handleElectionStatus=() => {
        alert(selectedId);
        alert(selectedName);
        // history.push('/election-status')
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
                <Grid container style={{padding:'1%'}}>
                    <Grid container item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Paper className={classes.paper} elevation={8}>
                            <Chart data={chartData}>
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
                                dataSource={chartData}
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
                    {chartData.map((chart, index) => (
                        
                        <Grid container item xs={12} sm={12} md={3} lg={3} xl={3}> 
                            <Paper className={classes.paper} elevation={8} style={{padding: '5%'}}>
                                <Typography className={classes.boardTitle}> {chart.argument} </Typography>
                                <Typography className={classes.boardIndex}> {`#${index + 1}`} </Typography>
                                <Typography className={classes.boardContent}> {chart.value} </Typography>
                            </Paper>

                        </Grid>
                    ))}
                </Grid>
                {/* <Grid container item xs={12} sm={12} md={7} lg={7} xl={7} style={{padding:'1%'}}>

                    <Paper className={classes.paper} elevation={1}>
                        <form className={classes.form}>
                            <Grid container style={{padding:'3%',flexWrap:'nowrap'}}>
                                <Typography style={{fontWeight:'bold'}}> Election Name:</Typography>
                                <Box style={{flexGrow:0.5}}/>
                                <Typography style={{width:'200px',marginRight:'2%', overflowX:'hidden', textOverflow:'ellipsis'}}>{selectedName}</Typography>
                            </Grid>
                            <Divider/>
                            <Grid container  style={{padding:'3%',flexWrap:'nowrap'}}>
                                <Typography style={{fontWeight:'bold'}}> ElectionID:</Typography>
                                <Box style={{flexGrow:0.5}}/>
                                <Typography style={{width:'200px', overflowX:'hidden', textOverflow:'ellipsis'}}>{selectedId}</Typography>
                            </Grid>
                            <Divider/>

                            <Grid container style={{padding:'3%',flexWrap:'nowrap'}}>
                                <Typography style={{fontWeight:'bold'}}>Your Address:</Typography>
                                <Box style={{flexGrow:0.5}}/>
                                <Typography  style={{width:'200px', overflowX:'hidden', textOverflow:'ellipsis'}}>{currentAccount}</Typography>
                            </Grid>
                            <Divider/>

                            <Grid container style={{padding:'3%',flexWrap:'nowrap'}}>
                                <Typography style={{fontWeight:'bold'}}>View Statistics:</Typography>
                                <Box style={{flexGrow:0.4}}/>
                                <Button 
                                    className={classNames(classes.button, classes.statusbutton)}  
                                    startIcon={<ChartIcon/>} onClick={handleElectionStatus}>
                                    Election Status    
                                </Button>
                            </Grid>
                            <Divider/>
                            
                            <Grid container style={{flexGrow:1,marginTop:'30px', maxHeight:'80vh', overflowY:'auto'}}>
                                {
                                    electionOptions.map((option)=>(
                                    
                                    <Grid container key={option.optionIndex} style={{paddingRight:'5%', paddingBottom:'20px'}}>
                                       <Grid container style={{flexWrap:'nowrap'}}>
                                            <Typography style={{fontWeight:'bold'}}>{option.name}</Typography>
                                            <Box style={{flexGrow:1}}/>
                                            <Typography style={{fontWeight:'bold', paddingRight:'5px', color:'#2196f3'}}>{option.totalOptionVote}</Typography>
                                            <Typography >({option.percentage}%)</Typography>
                                        </Grid>
                                        <Grid container style={{paddingBottom:'5%'}}>
                                            <LinearProgress variant="determinate" value={option.percentage} style={{width:'100%', color:'#2196f3', padding:'3px'}}/>
                                        </Grid>
                                         
                                    </Grid>
                                ))} 
                                
                                <Grid container >
                                    {electionOptions.map((card) => (
                                        <Grid 
                                            container 
                                            item 
                                            key={card.optionIndex} 
                                            xs={12} sm={12} md={12} 
                                            style={{padding:'3%'}}
                                            onClick={()=>handleSelectCandidate(card.optionIndex)}
                                            >
                                            <Card 
                                                className={card.optionIndex == activeId ? classes.cardActive : classes.card} 
                                                style={{flexWrap:'nowrap', width:'100%'}} >
                                                <CardActionArea>
                                                    <Grid container justifyContent="center" alignItems="center">

                                                        <Grid container justifyContent="center" item xs={12} sm={3} md={3} style={{padding:'1%'}}>
                                                            
                                                        <Avatar
                                                                src={`data:../image/png;base64,${card.avatar}`}
                                                                classes={{ root: classes.avatar, circle: classes.circle }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={9} md={9}>
                                                            <CardContent className={classes.cardContent}>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                {card.name}
                                                                </Typography>
                                                                <Typography>{card.description } { card.name}</Typography>
                                                            </CardContent>
                                                            
                                                        </Grid>
                                                    </Grid>
                                               
                                                </CardActionArea>
                                                
                                                
                                            </Card>
                                        </Grid>
                                        ))}
                                </Grid>
                            </Grid>
                            <Grid container style={{padding:'3%'}}>
                                <Box style={{flexGrow:1,}}/>
                                <Button 
                                    className={classes.button}  
                                    startIcon={<TelegramIcon/>} onClick={handleVote}>
                                    Vote    
                                </Button>
                            </Grid>
                            
                        </form>
                    </Paper>
                </Grid>
                <Grid container item xs={12} sm={12} md={5} lg={5} xl={5} style={{padding:'1%'}}>
                   <Box className={classes.paper}>
                        <Paper elevation={16} style={{maxHeight:'150px', marginBottom:'30px'}}>
                            <form className={classes.form}>
                                <Grid container justifyContent="center">
                                    <Typography style={{fontWeight:'bold', fontSize:18}}> Are you registered to vote?</Typography>
                                </Grid>
                                <Divider/>
                                <Grid container justifyContent="center" alignItems="center">
                                    {
                                        registered ? <Check style={{color:'#2196f3', paddingRight:'1%'}}/> :<HighlightOffIcon style={{color:'#ff0000', paddingRight:'1%'}}/>
                                    }
                                    <Typography 
                                        style={{
                                            paddingTop:'5%',
                                            paddingBottom:'5%',
                                            color:registered ? '#2196f3':'#ff0000'
                                            }}>{registered ? 'Registered' : 'Not registered'}</Typography>
                                </Grid>
                            </form>
                        </Paper>
                    
                    
                        <Paper elevation={16} style={{maxHeight:'150px', marginBottom:'30px'}}>
                            <form className={classes.form} >
                                <Grid container justifyContent="center">
                                    <Typography style={{fontWeight:'bold', fontSize:18}}>Your Vote In This Election</Typography>
                                </Grid>
                                
                                <Divider/>
                                <Grid container justifyContent="center" alignItems="center">
                                    {
                                        voted ?
                                        <Typography style={{paddingTop:'5%',paddingBottom:'5%'}}>{votedName}</Typography>
                                        :
                                        <Typography style={{paddingTop:'5%',paddingBottom:'5%'}}> You have not voted yet</Typography>
                                    }
                                    
                                </Grid>
                                <Grid>

                                </Grid>
                            </form>
                        </Paper>
                        <Paper elevation={16} style={{maxHeight:'200px', marginBottom:'30px'}} >
                            <form className={classes.form}>
                                <Grid container justifyContent="center">
                                    <Typography style={{fontWeight:'bold', fontSize:18}}> Election Date</Typography>
                                </Grid>
                                
                                <Divider/>
                                <Grid container justifyContent="center">
                                    <Typography style={{paddingTop:'3%', color:'#007fff', fontWeight:'bold'}}>Start Date: {moment.unix(startDate).format('YYYY-MM-DD HH:MM')}</Typography>
                                </Grid>
                                <Grid container justifyContent="center">
                                    <Typography style={{paddingTop:'3%', color:'#007fff', fontWeight:'bold'}}>End Date: {moment.unix(endDate).format('YYYY-MM-DD HH:MM')}</Typography>
                                </Grid>
                            </form>
                        </Paper>
                    </Box>
                </Grid> */}
            </Grid>
        </>
    );
}