import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
// sections
import { LoginForm } from '.';
import Pimentel1 from '../../img/Pimentel.jpg';
import orangebg from '../../img/orangebg.jpg';
import orangebg2 from '../../img/orangebg2.jpg';
import orangebg3 from '../../img/orangebg3.jpg';
import bulacansu from '../../img/bulacansu.jpg';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  position: 'relative', // Make the container position relative

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url('${bulacansu}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(3px)', // Apply the blur effect to the pseudo-element
    zIndex: -1, // Ensure the pseudo-element is behind the content
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  minWidth: '28vw',
  minHeight: '100vh',
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: '#FBF6EC', // Use a semi-transparent background color
  borderRadius: 16,
  boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.3)', // Increase the blur radius of the shadow
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(255, 255, 255, 0.25)', // Apply the border with transparency
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <StyledRoot style={{ flex: '1', maxHeight: '100vh' }}>
        <div style={{ display: 'flex' }}>
          <StyledContent> 
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '10px' }}>
                <Logo />
              </div>
              <div style={{textAlign: 'center'}}> 
                <Typography variant="h4" sx={{ mb: 5, color: '#f06418' }}>
                  Bulacan State University
                  <Typography variant="h6" sx={{ mb: 5, color: '#242424' }}>
                  College of Information &<br/>Communications Technology
                  </Typography>
                </Typography>
              </div>
             
              <LoginForm />
            </div>
          </StyledContent>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '5%', paddingTop: "5%", paddingRight: '25%'}}> 
          <Typography variant="h1" sx={{ color: '#f06418', position: 'flex-start' }}>
            Technician Reports <a style={{color:'#242424'}}> Management System</a>
          </Typography>
        </div>
      </StyledRoot>
      
    </>
  );
}