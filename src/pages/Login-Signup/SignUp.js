import { useState, useCallback } from 'react'; // Import useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';

// @mui
import { styled } from '@mui/material/styles';
import { Link as MuiLink, Stack,  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, InputAdornment, TextField, Typography, Container, Select, MenuItem, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { db, firebaseApp } from '../../firebase'
// hooks

// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
import Pimentel1 from '../../img/Pimentel.jpg';
import pmntlhall from '../../img/pmntlhall.jpg';
import pimentelhall from '../../img/pimentelhall.jpg';

// Get Authentication
const auth = getAuth(firebaseApp);

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex-end',
  },
  position: 'relative', // Make the container position relative

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url('${Pimentel1}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(4px)', // Apply the blur effect to the pseudo-element
    zIndex: -1, // Ensure the pseudo-element is behind the content
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  minwidth: '28vw', // Set a fixed width
  minHeight: '100vh',
  padding: theme.spacing(4),
  backgroundColor: '#FBF6EC',
  borderRadius: 16,
  boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  marginLeft: 'auto', // Align to the right side of the screen
}));

const StyledHeader = styled('div')(({ theme }) => ({
  maxwidth: '72vw', // Set a fixed width
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  paddingLeft: '25%',
  paddingTop: '5%',
  paddingRight: '5%',
}));

// ----------------------------------------------------------------------

export const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = (title, content) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogOpen(true);
  };

  // Use navigate function to navigate to the signup page
  const handleSignupClick = () => {
    navigate('/');
  };

  const handleSubmit = useCallback(async (e) => {
      e.preventDefault();
      
      // Check if any required field is empty
      if (!userType || !username || !email || !password) {
        handleDialogOpen('Error', 'Please fill up all the required fields.');
        return;
      }

      setIsLoading(true);

      // Check if the email matches the desired format
      const emailRegex = /^[a-zA-Z0-9._-]+@bulsu\.edu\.ph$/;
      if (!emailRegex.test(email)) {
        handleDialogOpen('Error', 'Please use a valid email address.');
        setIsLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store user data in the "WP4-pendingUsers" collection in Firestore
        const pendingUsersCollection = collection(db, 'WP4-pendingUsers');

        await addDoc(pendingUsersCollection, {
          username,
          email,
          userType,
          status: 'pending',
          timestamp: new Date(),
          uid: user.uid,
        });

        handleDialogOpen('Success', 'Please wait for your email to be verified by the Dean.');
        setIsLoading(false);
      } catch (error) {
        handleDialogOpen('Error', 'An error occurred. Please try again later.');

        setIsLoading(false);
      }
    },
    [username, userType, email, password]
  );

  return (
    <>
      <Helmet>
        <title> Register </title>
      </Helmet>

      <StyledRoot style={{ flex: '1', maxHeight: '100vh' }}>
        <div style={{ display: 'flex' }}>
          <StyledHeader>
              <Typography variant="h1" sx={{ color: '#f06418', textAlign: 'right'}}>
                Technician Reports <a style={{ color: '#242424' }}> Management System</a>
              </Typography>
          </StyledHeader>
        
            <StyledContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo/>
                <div style={{textAlign: 'center'}}> 
                  <Typography variant="h4" sx={{ color: '#f06418' }}>
                    Bulacan State University
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 5, color: '#242424' }}>
                    College of Information &<br/>Communications Technology
                  </Typography>
                  
                </div>

                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>

                    <Select  id="userType" value={userType} onChange={(e) => setUserType(e.target.value)} size="medium">
                      <MenuItem disabled value="">
                        Select Role
                      </MenuItem>
                      <MenuItem value="faculty">Faculty</MenuItem>
                      <MenuItem value="technician">Technician</MenuItem>
                    </Select>

                    <TextField
                      id="username"
                      label="User Name"
                      placeholder="User Name"
                      size="large"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      
                      sx={{ width: '300px' }}
                    />
                    <TextField
                      id="email"
                      label="Email Address"
                      placeholder="@bulsu.edu.ph"
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <TextField
                      id="password"
                      label="Password"
                      placeholder="Password"
                      style={{marginBottom: '35px'}}
                      value={password}
                      size="large"
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end"  onClick={() => setShowPassword(!showPassword)} />
                        ),
                      }}
                    />

                </Stack>

                <Stack spacing={3}>
                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    style={{ backgroundColor: '#f06418', color: 'white' }}
                  >
                  Sign Up
                </Button>
                
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                  <MuiLink 
                    variant="subtitle2"
                    underline="none" // Remove underline
                    
                    sx={{ 
                      color:"#242424",
                      textAlign: 'center',
                      '&:hover': {
                        textDecoration: 'underline', // Add underline on hover
                      }
                    }}
                    onClick={handleSignupClick} // Call the function to navigate to the signup page
                  >
                    Already have an account?  <span style={{color:"#f06418"}}> Click here! </span>
                  </MuiLink>
                  </Stack>
                </Stack>
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                  <DialogTitle>{dialogTitle}</DialogTitle>
                  <DialogContent>{dialogContent}</DialogContent>
                  <DialogActions>
                    <Button onClick={handleDialogClose} autoFocus>
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </form>
            </div>
          </StyledContent>
        </div>  

        
      </StyledRoot>
    </>
  );
};

export default SignUp;
