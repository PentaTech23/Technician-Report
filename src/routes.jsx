import { Navigate, useRoutes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth functions
import React, { useEffect, useState } from 'react';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import Forms from './pages/Form';
import FormsSRF from './pages/FormsSRF';
import FormsBIF from './pages/FormsBIF';
import FormsRIF from './pages/FormsRIF';
import FormsIRF from './pages/FormsIRF';
import Profiling from './pages/Profiling';
import ProfilingMR from './pages/ProfilingMR';
import ProfilingCI from './pages/ProfilingCI';
import Reports from './pages/Report';
import ReportsPTR from './pages/ReportsPTR';
import ReportsITR from './pages/ReportsITR';
import ReportsMARILF from './pages/ReportsMARILF';
import Archives from './pages/Archive';
import UserPage from './pages/UserPage';
import RequestReport from './pages/RequestReport'; // Add this import
import ProfilingReport from './pages/ProfilingReport';
import InspectionReport from './pages/InspectionReport';
import InventoryReport from './pages/InventoryReport';
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
export default function Router({ isTechnician }) {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout isTechnician={isTechnician} />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        //  Forms Section
        { path: 'form', element: <Forms/>}, 
          { path: 'service_request', element: <FormsSRF/>}, 
          { path: 'borrowers_item', element: <FormsBIF/>},
          { path: 'request_item', element: <FormsRIF/>},
          { path: 'inspection_report', element: <FormsIRF/>},
        //  Profiling Section
        { path: 'profiling', element: <Profiling/> },
          { path: 'profiling_mr', element: <ProfilingMR/> },
          { path: 'profiling_ci', element: <ProfilingCI/> },
        //  Reports Section
        { path: 'reports', element: <Reports/> },
          { path: 'reports_ptr', element: <ReportsPTR/> },
          { path: 'reports_marilf', element: <ReportsMARILF/> },
        //  Archives Section
        { path: 'archives', element: <Archives/> },
        //  User Section
        { path: 'user', element: <UserPage/> },
      ]
    },

    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
      ],
    },
  ]);

  return routes;
}
