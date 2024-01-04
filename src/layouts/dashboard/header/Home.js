import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from '../../../firebase';

export const Home = () => {
  const { user } = useAuthState();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const db = getFirestore(app);
        const pendingUsersCollection = collection(db, 'WP4-pendingUsers');

        const querySnapshot = await getDocs(
          query(pendingUsersCollection, where('uid', '==', user.uid))
        );

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUsername(userData.username);
        }
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <>
      <h1>Welcome {username}</h1>
      <Typography>Welcome {username}</Typography>
      {/* <button onClick={() => signOut(getAuth())}>Sign Out</button> */}
    </>
  );
};