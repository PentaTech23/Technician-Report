import { useState, useCallback } from 'react'; // Import useEffect
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { initializeApp } from 'firebase/app';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, IconButton, InputAdornment, TextField, Typography, Container, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
// components
import Logo from '../../components/logo';
import Iconify from '../../components/iconify';
import Pimentel1 from '../../img/Pimentel.jpg';

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

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  padding: theme.spacing(8, 7),
  backgroundColor: '#FBF6EC ',
  borderRadius: 16,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // backdropFilter: 'blur(50px)', // Apply the blur effect
  border: '1px solid rgba(255, 255, 255, 0.25)', // Apply the border with transparency
}));

const ContentContainer = styled('div')(() => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export const SignUp = () => {
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const email = document.getElementById('email');
      const password = document.getElementById('password');

      // Check if the email matches the desired format
      const emailRegex = /^[a-zA-Z0-9._-]+@bulsu\.edu\.ph$/;
      if (!emailRegex.test(email.value)) {
        alert('Please use a valid email address.');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store user data in the "WP4-pendingUsers" collection in Firestore
        const db = getFirestore(app);
        const pendingUsersCollection = collection(db, 'WP4-pendingUsers');

        await addDoc(pendingUsersCollection, {
          username,
          email: email.value,
          userType,
          status: 'pending',
          timestamp: new Date(),
          uid: user.uid,
        });

        // Show a message to the user that they need to check their email for verification
        alert('Please check your email for verification.');
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        alert(error.message);
      }
    },
    [username, userType]
  );

  return (
    <>
      <Helmet>
        <title> Register </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <ContentContainer>
            <StyledContent>
              <Logo />
              <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
                Register
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3} mb={2}>
                  <TextField
                    id="username"
                    label="User Name"
                    placeholder="User Name"
                    size="small"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <TextField
                    id="email"
                    label="Email Address"
                    placeholder="Email Address"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <TextField
                    id="password"
                    label="Password"
                    placeholder="Password"
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Select id="userType" value={userType} onChange={(e) => setUserType(e.target.value)} size="small">
                    <MenuItem disabled value="">
                      Select Role
                    </MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="technician">Technician</MenuItem>
                  </Select>
                </Stack>
                <LoadingButton
                  fullWidth
                  size="large"
                  type="button"
                  variant="contained"
                  onClick={handleSubmit}
                  loading={isLoading}
                  style={{ backgroundColor: '#0073e6', color: 'white' }}
                >
                  Sign Up
                </LoadingButton>
                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
                  <Link to="/" variant="subtitle2">
                    Click here to Login!
                  </Link>
                </Stack>
              </form>
            </StyledContent>
          </ContentContainer>
        </Container>
      </StyledRoot>
    </>
  );
};

export default SignUp;
