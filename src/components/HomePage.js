import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, styled } from "@material-ui/core/styles";
import { 
    Container,
    Card, 
    CardMedia, 
    CardContent, 
    Avatar,
    Typography,
    Grid,
    Box,
    Button,
    AppBar,
    Toolbar,
    
} from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import {pageActions} from '../actions/pageInfo.action';
import Particles from './Particles';
import classNames from 'classnames'
import {useHistory} from 'react-router-dom';
import {useRef} from 'react';

function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        {/* <Link color="inherit" href="https://react.school">
          React School
        </Link>{" "} */}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }

  const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    paddingLeft:'5%',
    paddingRight:'5%',
  });
  
const useStyles=makeStyles((theme)=>({
    root:{
        flexGrow: 1,
    },
    home:{
        backgroundColor:"#fff",
    },
    drawerHeader:{
        display: 'flex',
        alignItems: 'center',
        padding: '3%',
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
        backgroundColor:"#071722",
        width:"100%",
    },
    darkBackground:{
        backgroundImage: `url('./image/background.jpg')`,
        paddingTop: '150px',
        // backgroundColor:"#071722",
    },
    summaryTitle:{
        color:"#fff",
        paddingLeft:'5%',
        paddingRight:'5%',
        fontSize: '2.5rem',
        marginBottom: '1rem',

        ['@media (max-width:400px)']: {
            fontSize: '2rem',
        },
    },
    summaryContent:{
        color:"#fff",
        paddingLeft:'5%',
        paddingRight:'5%',
        fontSize: '2rem',
        marginBottom: '1rem',

        ['@media (max-width:400px)']: {
            fontSize: '1.5rem',
        },
    },
    createButton:{
        backgroundColor:"#00aa00",
        color:"#fff",
        '&:hover': {
            backgroundColor: '#007700',
        },
        margin:theme.spacing(1,5,2,5),
        padding:theme.spacing(1, 3),

        fontSize: 24,

        ['@media (max-width:400px)']: {
            fontSize: 18,
        },
    },
    cardPane:{
      padding:'4%',
    },
    footer: {
      padding: '5%',
    },
    flowText:{
        backgroundColor:"#eee",
        padding:'5%',
        textAlign: 'center',
        width: '100%',
    },
    cardGrid: {
        padding:'5%',
    },
    card: {
      display: "flex",
      flexDirection: "column",
        width: '100%',
    },
    cardMedia: {
      paddingTop: "56.25%", // 16:9
      
    },
    cardContent: {
      flexGrow: 1,
    },
    avatar:{
        backgroundColor:blue[500],
        width:"64px",
        height:"64px",
    },
    avatarContainer:{
        // marginLeft:"10%",
        // marginTop:"0.5%", 
        // marginRight:"1vw"
    },
    quoteBox:{
        background:"#d0e0b0",
        borderRadius:"1rem",
        marginBottom:"-0.1em",
        position:"relative",
        padding:"1.2em",
        margin:theme.spacing(5,5,3,5),
    },
    quoteTail:{
        content:" ",
        width:0,
        height:0,
        top:"100%",
        left:"33px",
        borderStyle:"solid",
        borderTop:"12px",
        borderTopColor:'#d0e0b0',
        borderLeft:"12px",
        borderLeftColor:'transparent',
        borderRight:"12px",
        borderRightColor:"transparent",
        borderBottom:"0px",
        borderBottomColor:"trasnparent",
        margin:theme.spacing(0,0,0,0),
    },
    image: {
      backgroundImage: "url(image/guy-holding-ipad.jpg)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",    
      width: "100%",
    //   color:"#fff",
     
    },
    optionTitle:{
        margin:theme.spacing(1,2,1,2),
    },
    optionContent:{
        margin:theme.spacing(1,2,1,2),
    },
    dashboardImg:{
        position: 'relative',
        width: 'auto',
        /* height: 100%, */
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    animateGrid:{
        position: 'absolute',
    },
    zIndex3:{
        zIndex: '3',
    },
    mdHiden:{
        display: 'block',
        ['@media (max-width:400px)']: {
            display: 'none',
        },
    },
    bigTitle:{
        fontSize: 32,
        ['@media (max-width:400px)']: {
            fontSize: 18,
        },
    },
    bigContent: {
        fontSize: 20,
        ['@media (max-width:400px)']: {
            fontSize: 16,
        },
    },
    font18_14: {
        fontSize: 18,
        ['@media (max-width:400px)']: {
            fontSize: 14,
        },
    }
}));

const cards=[
    {
        title:"Privacy",
        description:'Only voter can know who they voted for.',
        img:"./function/privacy.jpg"
    },
    {
        title:"Transparency",
        description:'The system is transparent and everyone with metamask wallet can see The real-time results of the voting process.',
        img:"./function/transparancy.jpg"
    },
    {
        title:"Verifiability",
        description:`The voter can confirm if their ballot is counted efficiently after they voted.`,
        img:"./function/verifiability.jpg"
    },
    {
        title:"Robustness",
        description:`No one can influence or adjust the final voting result whilst tallying.`,
        img:".//function/robustness.jpg"
    }
];

function HomePage(){
    
    const classes=useStyles();
    const learnRef = useRef(null);
    let history=useHistory();


    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(pageActions.setPageName('home'));
    })

    const executeScroll = () => learnRef.current.scrollIntoView()    

    const handleToElectionsPage=()=>{
        history.push('/candidate-login');
    }
    return(
        <>
            <React.Fragment>
                <Grid container component="main" className={classes.root}>
                    
                    {/* <Grid className={classes.drawerHeader}/> */}
                    <Particles/>
                    <Grid container justifyContent="center" className={classNames(classes.darkBackground)}>
                        <Grid className={classes.cardGrid} container justifyContent="center" item xs={12} sm={8} md={8} lg={8} alignItems="center">
                            <Grid container justifyContent="center" alignItems="center">
                                <Grid container justifyContent="center" item md={12} >
                                    <Typography component="h3" variant="h3" className={classes.summaryTitle}style={{paddingTop:'20px'}}>
                                        Decentralized, peer to peer multivoting election
                                    </Typography>
                                </Grid>
                                <Grid container justifyContent="center" item md={12}>
                                    <Typography component="h3" variant="h5" className={classes.summaryContent}>
                                        One stop solution for your organization elections.
                                    </Typography>
                                </Grid>
                                <Grid container justifyContent="center" item md={12}>
                                    <Button className={classes.createButton} onClick={executeScroll}>
                                        Learn More
                                    </Button>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                        <Grid container item  xs={12} sm={4} md={4} lg={4} justifyContent="center" className={classNames(classes.zIndex3, classes.mdHiden)}>
                            <Img src="image/phone.png"/>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Typography className={classNames(classes.flowText, classes.bigTitle)}>
                        “Innovation for Prosperity” by Nepal Academy of Science and Technology(NAST).
                        </Typography>
                    </Grid>
                    <Grid container justifyContent="center" >
                        <Grid className={classes.cardPane}>
                            <Typography component="h3" variant="h4" className={classes.bigTitle}>
                                Conduct your election at any location
                            </Typography>
                        </Grid>
                        <Grid container style={{width:"90%"}}>
                            <Grid container className={classes.cardGrid}>
                                <Grid container spacing={4}>
                                    {cards.map((card,index) => (
                                    <Grid container item key={index} xs={12} sm={6} md={6}>
                                        <Card className={classes.card}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={`image/${card.img}`}
                                                title="Image title"
                                            />
                                            <CardContent className={classes.cardContent}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                {card.title}
                                                </Typography>
                                                <Typography>{card.description}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid> 
                    <Grid container item justifyContent="center"  style={{backgroundColor:'#fff'}}>            
                        <Typography ref={learnRef} variant="h4" className={classes.bigTitle} style={{paddingTop:'5%', paddingBottom:'2%'}}>
                            How the system works?
                        </Typography>
                        {/* <Typography variant="h6" style={{marginLeft:"10%", marginRight:"10%"}}>
                            You're always in control with Election Runner. 
                            It's easy to build and customize an election.
                        </Typography> */}
                    </Grid>
                    <Grid container justifyContent="center" style={{ paddingTop:"1vw", paddingBottom:"3vw",backgroundColor:'#fff'}}>
                        <Grid container justifyContent="center" item md={8}> 
                            
                            <Grid container style={{paddingTop:'3%', paddingLeft:'5%', paddingRight:'5%'}}>
                                <Grid container justifyContent="center" alignItems="center" item sm={1} md={1} className={classes.avatarContainer}>
                                    <Avatar alt="Remy Sharp" className={classes.avatar}>
                                        1
                                    </Avatar>
                                </Grid>
                                <Grid item sm={11} md={11}>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h5" className={classNames(classes.optionTitle, classes.bigTitle)}>
                                            Manage Election
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h6" className={classNames(classes.optionContent, classes.bigContent)}>
                                            Admin adds the election, time and candidate list with their photo and bio.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid> 
                            <Grid container style={{paddingTop:'3%', paddingLeft:'5%', paddingRight:'5%'}}>
                                <Grid container justifyContent="center" alignItems="center"  item sm={1} md={1} className={classes.avatarContainer}>
                                    <Avatar alt="Remy Sharp" className={classes.avatar}>
                                        2
                                    </Avatar>
                                </Grid>
                                <Grid container item sm={11} md={11}>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h5" className={classNames(classes.optionTitle, classes.bigTitle)}>
                                        	Manage Voter
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="left" >
                                        <Typography variant="h6" className={classNames(classes.optionContent, classes.bigContent)}>
                                            Admin can add eligible voter to the system even remove the voter.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>               
                             <Grid container container style={{paddingTop:'3%', paddingLeft:'5%', paddingRight:'5%'}}>
                                <Grid container justifyContent="center" alignItems="center" item sm={1} md={1} className={classes.avatarContainer}>
                                    <Avatar alt="Remy Sharp" className={classes.avatar}>
                                        3
                                    </Avatar>
                                </Grid>
                                <Grid container item sm={11} md={11}>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h5" className={classNames(classes.optionTitle, classes.bigTitle)}>
                                            Participate in an election
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h6" className={classNames(classes.optionContent, classes.bigContent)}>
                                        	Voter registers to the system and should pass the biometric verification to login to the system.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>               
                            <Grid container container style={{paddingTop:'3%', paddingLeft:'5%', paddingRight:'5%'}}>
                                <Grid container justifyContent="center" alignItems="center" item sm={1} md={1} className={classes.avatarContainer}>
                                    <Avatar alt="Remy Sharp" className={classes.avatar}>
                                        4
                                    </Avatar>
                                </Grid>
                                <Grid container item sm={11} md={11}>
                                    <Grid container justifyContent  ="left">
                                        <Typography variant="h5" className={classNames(classes.optionTitle, classes.bigTitle)}>
                                            Free choice for candidates
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h6" className={classNames(classes.optionContent, classes.bigContent)}>
                                        	Voter chooses candidate of their choice and votes. They can immediately verify their ballot has been counted efficiently.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container container style={{paddingTop:'3%', paddingLeft:'5%', paddingRight:'5%'}}>
                                <Grid container justifyContent="center" alignItems="center" item sm={1} md={1} className={classes.avatarContainer}>
                                    <Avatar alt="Remy Sharp" className={classes.avatar}>
                                        5
                                    </Avatar>
                                </Grid>
                                <Grid container item sm={11} md={11}>
                                    <Grid container justifyContent  ="left">
                                        <Typography variant="h5" className={classNames(classes.optionTitle, classes.bigTitle)}>
                                            Monitor Results
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="left">
                                        <Typography variant="h6" className={classNames(classes.optionContent, classes.bigContent)}>
                                        	Immediate result summary allows anyone with metamask wallet to view the result statistics ensuring ultimate transparency.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center">
                                <Button className={classes.createButton} style={{marginTop:"2vw"}}  onClick={handleToElectionsPage}>
                                        View Elections
                                </Button>
                            </Grid>                              
                        </Grid>
                        <Grid container justifyContent="center" alignItems="center" item md={4} className={classes.dashboardImg}>
                            <img src="image/React Chart UI.png" className={classes.mdHiden} style={{width:'130%'}}/>
                        </Grid>                       
                    </Grid>
                    {/* <Grid container >
                        <Grid container justifyContent="center">
                            <Typography variant="h4" style={{paddingTop:'3%'}}>
                                What customers are saying
                            </Typography>
                        </Grid>
                        <Grid container justifyContent="center">
                            <Typography variant="h6">
                                Don't just take our word for it
                            </Typography>
                        </Grid>
                    </Grid> 
                    <Grid container justifyContent="center">
                        <Grid className={classes.quoteBox}>
                            <p>Election Runner provides a clean, attractive and easy-to-use voter interface that runs well on all Internet-enabled devices that we&#039;ve tested. Their support system is unparalleled for the speedy, comprehensive and personal manner in which it is delivered. With a few test elections under our belt, we were totally sold.</p>
                        </Grid>
                        <Grid className={classes.quoteTail}>
                        </Grid>
                        <Grid style={{fontSize:18,paddingLeft:'5%', paddingRight:'5%'}} container justifyContent="center">
                            <b>Michael L.,</b> University of Florida
                        </Grid>
                    </Grid>
                    <Grid container justifyContent ="center">
                        
                        <Grid item md={6}  container justifyContent="center">
                            <Grid  container justifyContent="center">
                                <Grid className={classes.quoteBox}>
                                    <p>I used this app for a union election for a mid sized law office with a very difficult to 
                                        please group of people. I found the app easy to use. The support team was excellent and 
                                        prompt. Would highly recommend as a low cost and simple way to hold an election</p>
                                </Grid>
                                <Grid className={classes.quoteTail}>
                                </Grid>
                            </Grid>
                            <Grid style={{marginTop:"1vw", fontSize:18,paddingLeft:'5%', paddingRight:'5%'}} >
                                <b>Michelle M.,</b> Legal aid buffalo attorney Union
                            </Grid>
                        </Grid>
                        <Grid item md={6}  container justifyContent="center">
                            <Grid  container justifyContent="center">
                                <Grid className={classes.quoteBox}>
                                    <p>I was so happy with my first transaction with Election Runner! I made a couple 
                                        of mistakes me their customer service dept was so nice and all about the 
                                        customer! Wouldn't even think of using anyone else! A+++</p>
                                </Grid>
                                <Grid className={classes.quoteTail}>
                                </Grid>
                            </Grid>
                            <Grid style={{marginTop:"1vw", fontSize:18,paddingLeft:'5%', paddingRight:'5%'}}>
                                <b>Elizabeth H.,</b> Quad Moms
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid className={classes.quoteBox}>
                            <p>We did the impossible this year. We held online student council elections, reducing a three-day process to 
                                30 minutes. I was looking at an alternative platform but realised the day before that it was unworkable. 
                                I stumbled onto ElectionRunner and was not disappointed. 
                                It was easy to use and made the process exciting for all parties. I certainly recommend it.</p>
                        </Grid>
                        <Grid className={classes.quoteTail}>
                        </Grid>
                        <Grid style={{marginTop:"1vw", fontSize:18,paddingLeft:'5%', paddingRight:'5%'}}>
                            <b>Ken D.</b> 
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid container justifyContent="center">
                            <Grid className={classes.quoteBox} style={{width:"100vw"}}>
                            
                                <p>It is the best online election platform I have ever seen. I really enjoyed working on it.</p>
                            </Grid>
                            <Grid className={classes.quoteTail}>
                            </Grid>
                        </Grid>
                        <Grid style={{marginTop:"1vw", fontSize:18,paddingLeft:'5%', paddingRight:'5%'}}>
                            <b>Olaleye T., </b>E-VOTING GROUP 
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Button className={classes.createButton} style={{backgroundColor:blue[500]}}>
                            Read More Reviews
                        </Button>
                    </Grid> */}
                     <Grid container justifyContent="center"  className={classes.image}>
                        <Grid container style={{backgroundColor:`rgba(70,0,120,0.7)`, color:"#fff",paddingBottom:"20px", paddingTop:"50px"}}>
                            
                            <Grid container justifyContent="center" item md={8} >
                                <Grid  container justifyContent="center">
                                    <Typography variant="h4" className={classNames(classes.optionTitle, classes.bigTitle)}>
                                        Start building your first election
                                    </Typography>   
                                </Grid>
                                <Grid  container justifyContent="center">
                                    <Typography variant="h6" className={classNames(classes.optionContent, classes.bigContent)}>
                                        NEPALVOTES is the most powerful online voting software available. 
                                        Don't believe us? See for yourself.
                                    </Typography>      
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center" alignItems="center" item md={4}>
                                <Button className={classes.createButton}>Get Started</Button>
                            </Grid> 
                        
                        </Grid>
                        
                    </Grid>
                    <AppBar position="static" style={{backgroundColor:"#001100", marginBottom:"0px", padding:'2rem'}} elevation={1}>
                        <Grid container style={{paddingLeft: '4vw', paddingRight: '4vw'}}>
                            
                            <Grid  item md={8} sm={12} xs={12} >
                                <Grid item md={12} sm={12} xs={12}>
                                    <Typography variant="body1" className={classes.font18_14}>
                                        Copyright © 2021 NEPALVOTES
                                    </Typography>
                                </Grid>
                                <Grid container  item md={12} sm={12} xs={12}>
                                    <Grid>
                                        <Typography variant="body1" color="inherit" className={classes.font18_14} >
                                        NEPALVOTES is a product of Nepal Ethereum Marketing, LLC.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4} sm={12}  xs={12} className={classes.font18_14}>
                                <a>Terms of Service </a>
                            </Grid>
                            
                        </Grid>
                    </AppBar>
                </Grid> 
            </React.Fragment>
        </>
    );
}
export default HomePage;