import React,{useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Switch, Route, useHistory} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { pageActions } from '../../actions/pageInfo.action';
import {
  Grid
} from '@mui/material'
import MoreIcon from '@mui/icons-material/MoreVert';
import {
  LibraryAdd,
  FindInPage,
  AssignmentInd,
  PersonAdd,
  SettingsInputAntenna,
  FlashOnTwoTone

} from '@material-ui/icons'
import AddNewElection from './AddNewElection';
import AddNewAdmin from './AddNewAdmin';
import Elections from './Elections';
import VoterManagement from './VoterManagement';
import ElectionVote from './ElectionVote';
import ElectionStatus from './ElectionStatus';


export default function ElectionsPage() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [pagename, setPagename]=React.useState("Add New Election");
  const dispatch =useDispatch();
  const history = useHistory();
  const isAdmin = useSelector(state=>state.adminInfo.isAdmin);

  useEffect(()=>{
    dispatch(pageActions.setPageName('elections'));
  })
  const handleToNewElecton=()=>{
    history.push('/elections/election-new');
    setPagename("Add New Election");
  }
  const handleToElections=()=>{
    history.push('/elections');
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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleToLogout=()=>{
    history.push('/');
  }
  return (
    <React.Fragment>
      <Grid component='main' container>
        <Grid container style={{backgroundColor:'#071722', padding:'10px'}}>
            <img src='../image/android-icon.png' style={{width:'48px',height:'48px'}}/>
            <Typography component="h5" variant='h5' style={{color:'#fff', paddingLeft:'10px', marginTop:'10px'}}> {isAdmin ? pagename : 'Elections'} </Typography>
            <Box style={{flexGrow:1}}/>
            
              <Tooltip title="Account settings">
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                  <MoreIcon style={{color:'#fff'}}/>
                </IconButton>
              </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            {
              isAdmin ? 
            <>
              <MenuItem onClick={handleToNewElecton}>
                <ListItemIcon>
                  <LibraryAdd/> 
                </ListItemIcon>
                Add New Election
              </MenuItem>
              <MenuItem onClick={handleToElections}>
                <ListItemIcon>
                  <FindInPage /> 
                </ListItemIcon>
                Elections
              </MenuItem>
              
              <MenuItem onClick={handleToVoterManagement}>
                <ListItemIcon>
                  <AssignmentInd fontSize="small" />
                </ListItemIcon>
                Voter Management
              </MenuItem>
              <MenuItem onClick={handleToNewAdmin}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Add New Admin
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem onClick={handleToLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </>
            :
            <MenuItem onClick={handleToLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
            }
          </Menu>
        </Grid>
        <Grid container justifyContent="center">
          <Switch>
            <Route exact path='/elections' component={Elections}/>
            <Route path='/elections/add-new-admin' component={AddNewAdmin} />
            <Route path='/elections/election-new' component={AddNewElection} />
            <Route path='/elections/voter-management' component={VoterManagement} />
            <Route path='/elections/election-vote' component={ElectionVote}/>
            <Route path='/elections/election-status' component={ElectionStatus}/>

          </Switch>
      </Grid>
      </Grid>
    </React.Fragment>
  );
}