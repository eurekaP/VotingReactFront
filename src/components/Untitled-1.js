                   
                   
                   import React,{useEffect, useState} from 'react';
                   import { useDispatch, useSelector } from 'react-redux';
                   import {Switch, Route, useHistory} from 'react-router-dom';
                   import { styled, useTheme, makeStyles } from '@material-ui/core/styles';
                   import Box from '@material-ui/core/Box';
                   import MuiDrawer from '@material-ui/core/Drawer';
                   import MuiAppBar from '@material-ui/core/AppBar';
                   import Toolbar from '@material-ui/core/Toolbar';
                   import List from '@material-ui/core/List';
                   import CssBaseline from '@material-ui/core/CssBaseline';
                   import Typography from '@material-ui/core/Typography';
                   import Divider from '@material-ui/core/Divider';
                   import IconButton from '@material-ui/core/IconButton';
                   import MenuIcon from '@material-ui/icons/Menu';
                   import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
                   import ChevronRightIcon from '@material-ui/icons/ChevronRight';
                   import ListItem from '@material-ui/core/ListItem';
                   import ListItemIcon from '@material-ui/core/ListItemIcon';
                   import ListItemText from '@material-ui/core/ListItemText';
                   import InboxIcon from '@material-ui/icons/MoveToInbox';
                   import MailIcon from '@material-ui/icons/Mail';
                   import Grid from '@material-ui/core/Grid';
                   import SearchIcon from '@material-ui/icons/Search';
                   import MoreIcon from '@material-ui/icons/MoreVert';
                   
                   import AddNewElection from './AddNewElection';
                   import AddNewAdminPage from './AddNewAdmin';
                   import VoterManagement from './VoterManagement';
                   import Elections from './Elections';
                   import {
                     LibraryAdd,
                     FindInPage,
                     AssignmentInd,
                     PersonAdd,
                     SettingsInputAntenna,
                     FlashOnTwoTone
                   
                   } from '@material-ui/icons'
                   
                   
                   const useStyles=makeStyles((theme)=>({
                       root:{
                         backgroundColor:"#071722",
                        
                     },
                       drawerHeader:{
                           display: 'flex',
                           alignItems: 'center',
                           padding: theme.spacing(0,1),
                           // necessary for content to be below app bar
                           ...theme.mixins.toolbar,
                           justifyContent: 'flex-start',
                           backgroundColor:"#071722",
                           width:"100%",
                       },
                       drawerPaper: {
                           marginTop: "80px",
                           marginBottom: "71px",
                         }
                   }));
                   const drawerWidth = 240;
                   
                   const openedMixin = (theme) => ({
                     width: drawerWidth,
                     transition: theme.transitions.create('width', {
                       easing: theme.transitions.easing.sharp,
                       duration: theme.transitions.duration.enteringScreen,
                     }),
                     overflowX: 'hidden',
                   });
                   
                   const closedMixin = (theme) => ({
                     transition: theme.transitions.create('width', {
                       easing: theme.transitions.easing.sharp,
                       duration: theme.transitions.duration.leavingScreen,
                     }),
                     overflowX: 'hidden',
                     width: theme.spacing(7),
                     [theme.breakpoints.up('sm')]: {
                       width: theme.spacing(9),
                     },
                   });
                   
                   const DrawerHeader = styled('div')(({ theme }) => ({
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'flex-end',
                     padding: theme.spacing(0, 1),
                     // necessary for content to be below app bar
                     ...theme.mixins.toolbar,
                   }));
                   
                   const AppBar = styled(MuiAppBar, {
                     shouldForwardProp: (prop) => prop !== 'open',
                   })(({ theme, open }) => ({
                     zIndex: theme.zIndex.drawer + 1,
                     transition: theme.transitions.create(['width', 'margin'], {
                       easing: theme.transitions.easing.sharp,
                       duration: theme.transitions.duration.leavingScreen,
                     }),
                     ...(open && {
                       marginLeft: drawerWidth,
                       width: `calc(100% - ${drawerWidth}px)`,
                       transition: theme.transitions.create(['width', 'margin'], {
                         easing: theme.transitions.easing.sharp,
                         duration: theme.transitions.duration.enteringScreen,
                       }),
                     }),
                   }));
                   
                   const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
                     ({ theme, open }) => ({
                       width: drawerWidth,
                       flexShrink: 0,
                       whiteSpace: 'nowrap',
                       boxSizing: 'border-box',
                       ...(open && {
                         ...openedMixin(theme),
                         '& .MuiDrawer-paper': openedMixin(theme),
                       }),
                       ...(!open && {
                         ...closedMixin(theme),
                         '& .MuiDrawer-paper': closedMixin(theme),
                       }),
                     }),
                   );
                   
                   export default function ElectionsPage() {
                     const isAdmin = useSelector(state=>state.adminInfo.isAdmin);
                     const classes=useStyles();
                     const history=useHistory();
                     const [pagename, setPagename]=React.useState("Add New Election");
                     
                     const theme = useTheme();
                     const [open, setOpen] = React.useState(true);
                     useEffect(()=>{
                       
                     },[]);
                     const handleDrawerOpen = () => {
                       setOpen(true);
                     };
                   
                     const handleDrawerClose = () => {
                        
                       setOpen(false);
                     };
                     const handleToNewElecton=()=>{
                       // alert("ok");
                       history.push('/elections');
                       setPagename("Add New Election");
                     }
                     const handleToElections=()=>{
                       history.push('/elections/election-view');
                       setPagename("Elections");
                     }
                   
                     const handleToVoterManagement=()=>{
                       history.push('/elections/voter-management');
                       setPagename("Voter Management");
                     }
                     const handleToNewAdmin=()=>{
                       history.push('/elections/add-new-admin');
                       setPagename("Add New Admin");
                     }
                     return (
                         <>
                              <Box sx={{ display: 'flex' }} style={{flexGrow:1}} >
                              
                               <CssBaseline />
                               <AppBar position="fixed" open={open} style={{marginTop:"79px"}}>
                                 <Toolbar>
                                   <IconButton
                                     color="inherit"
                                     aria-label="open drawer"
                                     onClick={handleDrawerOpen}
                                     edge="start"
                                     sx={{
                                       marginRight: '36px',
                                       ...(open && { display: 'none' }),
                                     }}
                                   >
                                     <MenuIcon />
                                   </IconButton>
                                   <Typography variant="h6" noWrap component="div">
                                     {isAdmin ? pagename:'Elections'}
                                   </Typography>
                                   <Box sx={{ flexGrow: 1 }} />
                                   <IconButton color="inherit">
                                     <SearchIcon />
                                   </IconButton>
                                   <IconButton color="inherit">
                                     <MoreIcon />
                                   </IconButton>
                                 </Toolbar>
                               </AppBar>
                               <Drawer variant="permanent" open={open} classes={{paper:classes.drawerPaper}}>
                                 <DrawerHeader>
                                   <IconButton onClick={handleDrawerClose}>
                                     {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                                   </IconButton>
                                 </DrawerHeader>
                                 <Divider />
                                 <List>
                                   {isAdmin &&
                                     <ListItem button onClick={handleToNewElecton}>
                                       <ListItemIcon>
                                         <LibraryAdd/>
                                       </ListItemIcon>
                                       <ListItemText primary="Add New Election" />
                                     </ListItem>
                                   } 
                                   <ListItem button onClick={handleToElections}>
                                     <ListItemIcon>
                                       <FindInPage/>
                                     </ListItemIcon>
                                     <ListItemText primary="Elections" />
                                   </ListItem>
                                  </List>
                                  { isAdmin &&
                                     <ListItem button onClick={handleToVoterManagement}>
                                       <ListItemIcon>
                                         <AssignmentInd/>
                                       </ListItemIcon>
                                       <ListItemText primary="Voter Management" />
                                     </ListItem>
                                   }
                                   { isAdmin &&
                                   <ListItem button onClick={handleToNewAdmin}>
                                     <ListItemIcon>
                                       <PersonAdd/>
                                     </ListItemIcon>
                                     <ListItemText primary="Add New Admin" />
                                   </ListItem>
                                   }
                                 <Divider />
                                
                               </Drawer>
                               <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                                 <DrawerHeader />
                                 <Grid container justifyContent="center">
                                     <Switch>
                                       <Route exact path='/elections' component={AddNewElection}/>
                                       <Route path='/elections/add-new-admin' component={AddNewAdminPage} />
                                       <Route path='/elections/election-new' component={Elections} />
                                       <Route path='/elections/voter-management' component={VoterManagement} />
                                     </Switch>
                                 </Grid>
                               </Box>
                             </Box>
                       </>
                     );
                   }
                  
                   
                    
                    