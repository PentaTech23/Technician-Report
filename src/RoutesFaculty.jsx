import { Navigate, useRoutes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth functions
import React, { useEffect, useState } from 'react';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/OtherPages/BlogPage';

import ProductsPage from './pages/OtherPages/ProductsPage';
import DashboardAppPage from './pages/Dashboard/DashboardAppPage';
import Nav from './layouts/dashboard/nav'; // Import the Nav component
//  Forms Section
import Forms from './pages/Dashboard/Form';
import FormsSRF from './pages/Forms/FormsSRF';
import FormsBIF from './pages/Forms/FormsBIF';
import FormsRIF from './pages/Forms/FormsRIF';
import FormsIRF from './pages/Forms/FormsIRF';
//  Profiling Section
import Profiling from './pages/Dashboard/Profiling';
import ProfilingMR from './pages/Profiling/ProfilingMR';
import ProfilingCI from './pages/Profiling/ProfilingCI';
import ProfilingReport from './pages/Dashboard/ProfilingReport';
import InspectionReport from './pages/Dashboard/InspectionReport';
//  Reports Section
import Reports from './pages/Dashboard/Report';
import ReportsPTR from './pages/Profiling/ProfilingPTR';
import ReportsITR from './pages/Reports/ReportsITR';
import ReportsMARILF from './pages/OtherPages/ReportsMARILF';
import RequestReport from './pages/Dashboard/RequestReport';
import InventoryReport from './pages/Dashboard/InventoryReport';
//  Archives Section
import Archives from './pages/Archives/Archive';
//  Users Section
import UserPage from './pages/UsersPage/UserPage';

// ----------------------------------------------------------------------

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

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup the subscription
    return () => unsubscribe();
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    login: async (email, password) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  };
}

// ----------------------------------------------------------------------
export default function RoutesFaculty({ isFaculty }) {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout isFaculty={isFaculty} />,
      children: [
        { element: <Navigate to="/dashboard/form" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        //  Forms Section
        { path: 'form', element: <Forms /> },
        { path: 'service_request', element: <FormsSRF /> },
        { path: 'borrowers_item', element: <FormsBIF /> },
        { path: 'request_item', element: <FormsRIF /> },
        { path: 'inspection_report', element: <FormsIRF /> },
        //  Profiling Section
        { path: 'profiling', element: <Profiling /> },
        { path: 'profiling_mr', element: <ProfilingMR /> },
        { path: 'profiling_ci', element: <ProfilingCI /> },
        //  Reports Section
        { path: 'reports', element: <Reports /> },
        { path: 'reports_ptr', element: <ReportsPTR /> },
        { path: 'reports_marilf', element: <ReportsMARILF /> },
        //  Archives Section
        { path: 'archives', element: <Archives /> },
      ],
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        // { path: '404', element: <Page404 /> },
        // { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },

    {
      /* <Route path="/login" element={<LoginPage /> } >
              
                <Route path="signup/*" element={<SignUpComponent />} />
              </Route> */
    },
  ]);

  return routes;
}
