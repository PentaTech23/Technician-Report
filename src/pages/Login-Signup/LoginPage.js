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

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  
  backgroundImage: `url('${Pimentel1}')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  minHeight: '1050px', 
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
  maxWidth: 480,
  margin: 'auto',
  padding: theme.spacing(8, 7),
  backgroundColor: '#FBF6EC', 
  borderRadius: 16,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // backdropFilter: 'blur(50px)', // Apply the blur effect
  border: '1px solid rgba(255, 255, 255, 0.25)', // Apply the border with transparency
}));


const ContentContainer = styled('div')(({ theme }) => ({
  minHeight: '100vh', 
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Login</title>
      </Helmet>


      <StyledRoot >

        <Container maxWidth="sm"  >
          <ContentContainer> 
         
          <StyledContent >
          <Logo />
           
          <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }} >
              Sign in
            </Typography>

            <LoginForm />
          </StyledContent>
          </ContentContainer>
        </Container>
      </StyledRoot>
      
    </>
  );
}

