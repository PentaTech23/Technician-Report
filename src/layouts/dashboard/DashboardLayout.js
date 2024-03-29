import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Button, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Header from './header';
import Nav from './nav'; // Adjust the import path


const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const MainContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function DashboardLayout({ isFaculty, isDean, isTechnician }) {
  const [open, setOpen] = useState(false);
  
  const closeNav = () => {
    setOpen(false);
  };

  return (
    <StyledRoot>
      <Header setOpen={setOpen}/>
        {open && (
          <Nav
            isFaculty={isFaculty}
            isDean={isDean}
            isTechnician={isTechnician}
            onCloseNav={() => setOpen(false)}
          />
        )}
      <MainContent onClick={closeNav}>
        <Outlet />
      </MainContent>
    </StyledRoot>
  );
}
