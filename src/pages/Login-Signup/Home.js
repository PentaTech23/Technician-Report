import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from '../../firebase';


export const Home = () => {
    const { user } = useAuthState();
    const [username, setUsername] = useState(null);
    const [userType, setUserType] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (user) {
          const db = getFirestore();
          const pendingUsersCollection = collection(db, 'WP4-pendingUsers');
  
          const querySnapshot = await getDocs(
            query(pendingUsersCollection, where('uid', '==', user.uid))
          );
  
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUsername(userData.username);
            setUserType(userData.userType);
          }
        }
      };
  
      fetchUserData();
    }, [user]);
  
    return (
      <>
        <Typography variant="h5" style={{ color: '#ff5500' }}>
          Welcome {username || user?.email} 
        </Typography>
        <br/>
        <Typography variant="h5" style={{ color: '#ff5500' }}>
           {userType && `(${userType})`}
        </Typography>
      </>
    );
  };