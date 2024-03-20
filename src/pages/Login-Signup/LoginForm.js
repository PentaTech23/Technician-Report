import { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as MuiLink,Stack, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
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
            const prevPath = location.state?.from || '/dashboard';
            navigate(prevPath);
            localStorage.setItem('authenticated', 'true');
          } else {
            alert('Your account is still pending or not registered. Please wait for approval or contact support.');
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

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing in: ', error.message);
      setError('Invalid email / password. Try again.');
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
            autoComplete="password"
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
        <LoadingButton
          fullWidth
          size="large"
          type="submit" // Use type="button" to prevent form submission
          variant="contained"
          onClick={handleLogin}
          loading={isLoading}
          style={{ backgroundColor: '#f06418', color: 'white' }}
         
        >
          Login
        </LoadingButton>

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
            Don't have an account?  <a style={{color:"#f06418"}}> Click here! </a>
          </MuiLink>
        {error && ( // Render the error message if it exists
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

      </form>
    </>
  );
}
