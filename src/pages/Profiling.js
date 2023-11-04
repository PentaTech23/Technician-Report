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
  const [mreceipts, setMreceipts] = useState([]);
  const [totalMreceipts, setTotalMreceipts] = useState([]);
  const [citems, setCitems] = useState([]);
  const [totalCitems, setTotalCitems] = useState([]);
  const [totalProfiling, setTotalProfiling] = useState([]);
  const [areceipts, setAreceipts] = useState([]);
  const [totalAreceipts, setTotalAreceipts] = useState([]);
  const [aitems, setAitems] = useState([]);
  const [totalAitems, setTotalAitems] = useState([]);
  const [totalArchives, setTotalArchives] = useState([]);





  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const mreceiptsQuery = collectionGroup(db, 'MEMORANDUM-OF-RECEIPTS');
      const citemsQuery = collectionGroup(db, 'CONDEMNED-ITEMS');
      const areceiptsQuery = collectionGroup(db, 'ARCHIVES-PROFILING-MR');
      const aitemsQuery = collectionGroup(db, 'ARCHIVES-PROFILING-CI');
    

      const mreceiptsSnapshot = await getDocs(mreceiptsQuery);
      const citemsSnapshot = await getDocs(citemsQuery);
      const areceiptsSnapshot = await getDocs(areceiptsQuery);
      const aitemsSnapshot = await getDocs(aitemsQuery);




      const mreceiptsData = mreceiptsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const citemsData = citemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const areceiptsData = areceiptsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const aitemsData = aitemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


      setMreceipts(mreceiptsData);
      setCitems(citemsData);
      setAreceipts(areceiptsData);
      setAitems(aitemsData);


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


        useEffect(() => {
          // Count all the MR
          const countSaiparNo = () => {
              const total = mreceipts.length;
              setTotalMreceipts(total);
          };
          countSaiparNo();
        }, [mreceipts]);

        useEffect(() => {
          // Count all the CI
          const countEntityName = () => {
              const total = citems.length;
              setTotalCitems(total);
          };
          countEntityName();
        }, [citems]);

        useEffect(() => {
          // Count the total profiling
          const countDate = () => {
            const total = totalCitems + totalMreceipts;
              setTotalProfiling(total);
          };
          countDate();
        });

        useEffect(() => {
          // Count all the archives MR
          const countSaiparNo = () => {
              const total = areceipts.length;
              setTotalAreceipts(total);
          };
          countSaiparNo();
        }, [areceipts]);

        useEffect(() => {
          // Count all the CI
          const countEntityName = () => {
              const total = aitems.length;
              setTotalAitems(total);
          };
          countEntityName();
        }, [aitems]);

        useEffect(() => {
          // Count the total profiling
          const countDate = () => {
            const total = totalAitems + totalAreceipts;
              setTotalArchives(total);
          };
          countDate();
        });
        



  return (
    <>
      <Helmet>
        <title>Profiling</title>
      </Helmet>

      <Container>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          Profiling
        </Typography>
     
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
      <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={6}>
            { <AppWidgetSummary title="TOTAL MEMORANDUM RECEIPTS" total={totalMreceipts} color="error" />}
          </Grid>

          <Grid item xs={6} sm={6} md={6}>
            { <AppWidgetSummary title="TOTAL CONDEMNED ITEMS" total={totalCitems} color="error" /> }
          </Grid>

          <Grid item xs={9} sm={9} md={9}>
            { <AppWidgetSummary title="TOTAL PROFILING" total={totalProfiling} color="error" /> }
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            { <AppWidgetSummary title="TOTAL ARCHIVED PROFILING" total={totalArchives} color="error"/> }
          </Grid>

            
           </Grid>
      </Container>
      </Container>
    </>
  );
}