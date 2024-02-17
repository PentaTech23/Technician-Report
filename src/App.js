import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { AuthContextProvider, db, useAuthState } from './firebase'; // Replace with the actual path to your AuthContextProvider and useAuthState

// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// Your route components
import Router from './RoutesTechnician';
import LoginPage from './pages/Login-Signup/LoginPage';
import InspectionReport from './pages/Dashboard/InspectionReport';
import ProfilingReport from './pages/Dashboard/ProfilingReport';
import InventoryReport from './pages/Dashboard/InventoryReport';
import RequestReport from './pages/Dashboard/RequestReport';
// ----------------------------------------------------------------------
import SignUpComponent from './pages/Login-Signup/SignUp';
import RoutesFaculty from './RoutesFaculty';
import RoutesDean from './RoutesDean';
import Nav from './layouts/dashboard/nav'; // Import the Nav component

export default function App() {
  const { isAuthenticated, user } = useAuthState(); // Get the authentication state
  const [isFaculty, setIsFaculty] = useState(false);
  const [isDean, setIsDean] = useState(false);
  const [isTechnician, setIsTechnician] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const pendingUsersCollection = collection(db, 'WP4-pendingUsers');

        const querySnapshot = await getDocs(query(pendingUsersCollection, where('uid', '==', user.uid)));

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setIsFaculty(userData.userType === 'faculty');
          setIsDean(userData.userType === 'dean');
          setIsTechnician(userData.userType === 'technician');
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <AuthContextProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            {/* Show the Navbar (Nav) here */}
           
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpComponent />} />
              {/* Authenticated users can access additional routes */}
              {isAuthenticated && (
                <Route
                path="/*"
                element={
                  isFaculty ? (
                    <RoutesFaculty isFaculty={isFaculty} />
                  ) : isDean ? (
                    <RoutesDean isDean={isDean} />
                  ) : (
                    <Router isTechnician={isTechnician} />
                  )
                }
              />
              )}
              {/* Redirect unauthenticated users to the login page for all unmatched paths */}
              {!isAuthenticated && (
                <Route
                  path="*"
                  element={
                    <>
                      <Navigate to="/" />
                    </>
                  }
                />
              )}
            </Routes>
            
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </AuthContextProvider>
  );
}


