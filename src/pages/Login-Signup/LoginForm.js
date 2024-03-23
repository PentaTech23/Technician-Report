import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions , Link as MuiLink, Stack, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import Iconify from '../../components/iconify';

const firebaseConfig = {
  apiKey: 'AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc',
  authDomain: 'wp4-technician-dms.firebaseapp.com',
  projectId: 'wp4-technician-dms',
  storageBucket: 'wp4-technician-dms.appspot.com',
  messagingSenderId: '1065436189229',
  appId: '1:1065436189229:web:88094d3d71b15a0ab29ea4',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
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

    // Function to set error message with a time limit
    const setErrorMessageWithTimeout = (message, duration) => {
      setError(message);
  
      // Clear error message after the specified duration
      setTimeout(() => {
        setError('');
      }, duration);
    };

    
  useEffect(() => {
    let isHandled = false;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthenticated(!!user);
      setIsLoading(false);

      if (!isHandled && user) {
        const db = getFirestore(app);
        const usersCollection = collection(db, 'WP4-pendingUsers');

        // Query the collection to find the document with the matching UID
        const querySnapshot = await getDocs(query(usersCollection, where('uid', '==', user.uid)));

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();

          if (userData && userData.status === 'registered') {
            const storedPageUrl = localStorage.getItem('currentPageUrl');
            const prevPath = storedPageUrl || '/dashboard';
            navigate(prevPath);
            localStorage.setItem('authenticated', 'true');
          } else {
            handleDialogOpen('Pending', 'Your account is still pending or not registered. Please wait for approval or contact support.');
            await signOut(auth);
          }
        } else {
          alert('Your account is still pending or not registered.');
          await signOut(auth);
        }

        isHandled = true;
      }
    });

    const isUserAuthenticated = localStorage.getItem('authenticated') === 'true';
    setAuthenticated(isUserAuthenticated);

    return () => unsubscribe();
  }, [navigate, location, auth]);


  // ---------------------------------------
  // Handle login function
  
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/', { replace: true }); // Redirect to home page after successful login
    } catch (error) {
      console.error('Error signing in: ', error.message);
      setErrorMessageWithTimeout('Invalid email / password. Try again.', 5000);
    } finally {
      setIsLoading(false);
    }
  };


  // Use navigate function to navigate to the signup page
  const handleSignupClick = () => {
    navigate('/signup');
  };
  


  return (
    <>
      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <TextField
            name="email"
            label="Email address"
            placeholder="@bulsu.edu.ph"
            size="large"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{ width: '300px' }}
          />
          <TextField
            name="password"
            label="Password"
            size="large"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
            InputProps={{
              endAdornment: (
                <InputAdornment position="end"  onClick={() => setShowPassword(!showPassword)} />
              ),
            }}
          />
      </Stack>
          
      <Stack direction="row" alignItems="right" justifyContent="right" sx={{ my: 2, paddingLeft: '5px', paddingBottom: '10px' }}>
          <MuiLink  
            variant="subtitle2" 
            underline="none" // Remove underline
            color="242424" // Use the default text color
            sx={{ 
              '&:hover': {
                textDecoration: 'underline', // Add underline on hover
              }
            }}
          >
            Forgot password?
          </MuiLink>
        </Stack>
        
      <Stack spacing={3}>
        <Button
          fullWidth
          size="large"
          type="submit" // Use type="button" to prevent form submission
          variant="contained"
          style={{ backgroundColor: '#f06418', color: 'white' }}
         
        >
          Login
        </Button>

        <MuiLink 
          variant="subtitle2"
          underline="none"
          sx={{ 
            color:"#242424",
            textAlign: 'center',
            '&:hover': {
              textDecoration: 'underline',
              color: '#f06418' // Change color on hover
            }
          }}
          onClick={handleSignupClick}
        >
          Don't have an account? <span style={{ color: '#f06418' }}>Click here!</span>
        </MuiLink>
        {error && ( 
          <Typography
            variant="body2"
            color="error"
            sx={{
              marginTop: 1,
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '3px',
              borderRadius: '4px',
              border: '1px solid #f5c6cb',
            }}
          >
            {error}
          </Typography>
        )}
        </Stack>
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>{dialogContent}</DialogContent>
          <DialogActions>
            <LoadingButton onClick={handleDialogClose} autoFocus>
              OK
            </LoadingButton>
          </DialogActions>
        </Dialog>
        
      </form>
    </>
  );
}