import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';

import { getFirestore, collectionGroup, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import Iconify from '../components/iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc",
  authDomain: "wp4-technician-dms.firebaseapp.com",
  projectId: "wp4-technician-dms",
  storageBucket: "wp4-technician-dms.appspot.com",
  messagingSenderId: "1065436189229",
  appId: "1:1065436189229:web:88094d3d71b15a0ab29ea4"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default function DashboardAppPage() {
  const theme = useTheme();
  const [property, setProperty] = useState([]);
  const [totalProperty, setTotalProperty] = useState([]);
  const [transferInventory, setTransferInventory] = useState([]);
  const [totalTransferInventory, setTotalTransferInventory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [totalInventory, setTotalInventory] = useState([]);
  const [totalReports, setTotalReports] = useState([]);
  const [aProperty, setAProperty] = useState([]);
  const [totalAProperty, setTotalAProperty] = useState([]);
  const [aTransferInventory, setATransferInventory] = useState([]);
  const [totalATransferInventory, setTotalATransferInventory] = useState([]);
  const [aInventory, setAInventory] = useState([]);
  const [totalAInventory, setTotalAInventory] = useState([]);
  const [totalArchives, setTotalArchives] = useState([]);






  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const propertyQuery = collectionGroup(db, 'PROPERTY-TRANSFER-REPORT');
      const transferInventoryQuery = collectionGroup(db, 'INVENTORY-TRANSFER-REPORT');
      const inventoryQuery = collectionGroup(db, 'INVENTORY-TRANSFER-REPORT');
      const aPropertyQuery = collectionGroup(db, 'ARCHIVES-REPORTS-PTR');
      const aTransferInventoryQuery = collectionGroup(db, 'ARCHIVES-REPORTS-ITR');
      const aInventoryQuery = collectionGroup(db, 'ARCHIVES-REPORTS-MARILR');
    

      const propertySnapshot = await getDocs(propertyQuery);
      const transferInventorySnapshot = await getDocs(transferInventoryQuery);
      const inventorySnapshot = await getDocs(inventoryQuery);
      const aPropertySnapshot = await getDocs(aPropertyQuery);
      const aTransferInventorySnapshot = await getDocs(aTransferInventoryQuery);
      const aInventorySnapshot = await getDocs(aInventoryQuery);




      const propertyData = propertySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const transferInventoryData = transferInventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const inventoryData = inventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const aPropertyData = aPropertySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const aTransferInventoryData = aTransferInventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const aInventoryData = aInventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));



      setProperty(propertyData);
      setTransferInventory(transferInventoryData);
      setInventory(inventoryData);
      setAProperty(aPropertyData);
      setATransferInventory(aTransferInventoryData);
      setAInventory(aInventoryData);



    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


        useEffect(() => {
          // Count all the PTR
          const count = () => {
              const total = property.length;
              setTotalProperty(total);
          };
          count();
        }, [property]);

        useEffect(() => {
          // Count all the CI
          const count = () => {
              const total = transferInventory.length;
              setTotalTransferInventory(total);
          };
          count();
        }, [transferInventory]);

        useEffect(() => {
          // Count all the MARILF
          const count = () => {
              const total = inventory.length;
              setTotalInventory(total);
          };
          count();
        }, [inventory]);

        useEffect(() => {
          // Count the total reports
          const count = () => {
            const total = totalProperty + totalTransferInventory  + totalInventory;
              setTotalReports(total);
          };
          count();
        });

        useEffect(() => {
          // Count all the archived PTR
          const count = () => {
              const total = aProperty.length;
              setTotalAProperty(total);
          };
          count();
        }, [aProperty]);

        useEffect(() => {
          // Count all the archived CI
          const count = () => {
              const total = aTransferInventory.length;
              setTotalATransferInventory(total);
          };
          count();
        }, [aTransferInventory]);

        useEffect(() => {
          // Count all the archived MARILF
          const count = () => {
              const total = aInventory.length;
              setTotalAInventory(total);
          };
          count();
        }, [aInventory]);

        useEffect(() => {
          // Count the total archives
          const count = () => {
            const total = totalAProperty + totalATransferInventory + totalAInventory;
              setTotalArchives(total);
          };
          count();
        });
        
        



  return (
    <>
      <Helmet>
        <title>Reports</title>
      </Helmet>

      <Container>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          Reports
        </Typography>
     
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
      <Grid container spacing={3}>
          <Grid item xs={4} sm={4} md={4}>
            { <AppWidgetSummary title="PROPERTY TRANSFER REPORTS" total={totalProperty} color="error" />}
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            { <AppWidgetSummary title="INVENTORY TRANSFER REPORTS" total={totalTransferInventory} color="error" /> }
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            { <AppWidgetSummary title="MONTHLY ASSESSMENT REPORT & INVENTORY LABORATORY FORM" total={totalInventory} color="error" /> }
          </Grid>

          <Grid item xs={9} sm={9} md={9}>
            { <AppWidgetSummary title="TOTAL REPORTS" total={totalReports} color="error" /> }
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            { <AppWidgetSummary title="TOTAL ARCHIVED REPORTS" total={totalArchives} color="error"/> }
          </Grid>


            
           </Grid>
      </Container>
      </Container>
    </>
  );
}

