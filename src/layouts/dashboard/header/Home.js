import { Typography } from '@mui/material'
import { getAuth, signOut }  from 'firebase/auth' 
import { useAuthState } from '../../../firebase'


export const Home = () => {
    const { user } = useAuthState()

    return (
        <>
            <h1>Welcome {user?.email} </h1>
            <Typography>Welcome {user?.email}  </Typography>
            {/* <button onClick={()=>signOut(getAuth())}>Sign Out</button> */}
        </>
    )
}

// export default welcome