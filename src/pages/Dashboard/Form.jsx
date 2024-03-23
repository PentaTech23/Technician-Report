import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFirestore, collectionGroup, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { Grid, Container, Typography } from '@mui/material';
import { AppWidgetSummary} from '../../sections/@dashboard/app';



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

  
  const navigate = useNavigate();

  useEffect(() => {
    const currentPageUrl = window.location.pathname;
    localStorage.setItem('currentPageUrl', currentPageUrl);
  }, []);

  useEffect(() => {
    const storedPageUrl = localStorage.getItem('currentPageUrl');
    if (!storedPageUrl) {
      navigate('/dashboard'); // Navigate to the default page if there's no stored URL
    }
  }, [navigate]);

  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState([]);
  const [irequest, setIrequest] = useState([]);
  const [totalIrequest, setTotalIrequest] = useState([]);
  const [brequest, setBrequest] = useState([]);
  const [totalBrequest, setTotalBrequest] = useState([]);
  const [inspection, setInspection] = useState([]);
  const [totalInspection, setTotalInspection] = useState([]);
  const [totalForms, setTotalForms] = useState([]);
  const [ibf, setIbf] = useState([]);
  const [totalIbf, setTotalIbf] = useState([]);
  const [irf, setIrf] = useState([]);
  const [totalIrf, setTotalIrf] = useState([]);
  const [rif, setRif] = useState([]);
  const [totalRif, setTotalRif] = useState([]);
  const [srf, setSrf] = useState([]);
  const [totalSrf, setTotalSrf] = useState([]);
  const [totalArchives, setTotalArchives] = useState([]);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const serviceQuery = collectionGroup(db, 'SERVICE-REQUEST');
      const irequestQuery = collectionGroup(db, 'ITEM-REQUEST');
      const brequestQuery = collectionGroup(db, 'ITEM-BORROWERS');
      const inspectionQuery = collectionGroup(db, 'INSPECTION-REPORT-FORM');
      const ibfQuery = collectionGroup(db, 'ARCHIVES-FORMS-IBF');
      const irfQuery = collectionGroup(db, 'ARCHIVES-FORMS-IRF');
      const rifQuery = collectionGroup(db, 'ARCHIVES-FORMS-RIF');
      const srfQuery = collectionGroup(db, 'ARCHIVES-FORMS-SRF');
  

      const serviceSnapshot = await getDocs(serviceQuery);
      const irequestSnapshot = await getDocs(irequestQuery);
      const brequestSnapshot = await getDocs(brequestQuery);
      const inspectionSnapshot = await getDocs(inspectionQuery);
      const ibfSnapshot = await getDocs(ibfQuery);
      const irfSnapshot = await getDocs(irfQuery);
      const rifSnapshot = await getDocs(rifQuery);
      const srfSnapshot = await getDocs(srfQuery);



      const serviceData = serviceSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const irequestData =irequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const brequestData =brequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const inspectionData =inspectionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const ibfData =ibfSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const irfData =irfSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const rifData =rifSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const srfData =srfSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
 

      setServices(serviceData);
      setIrequest(irequestData);
      setBrequest(brequestData);
      setInspection(inspectionData);
      setIbf(ibfData);
      setIrf(irfData);
      setRif(rifData);
      setSrf(srfData);


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


        useEffect(() => {
          // Count all the item borrow requests
          const countControlNum = () => {
              const total = brequest.length;
              setTotalBrequest(total);
          };
          countControlNum();
        }, [brequest]);

        
        useEffect(() => {
          // Count all the service requests
          const countControlNum = () => {
              const total = services.length;
              setTotalServices(total);
          };

          countControlNum();
        }, [services]);

        useEffect(() => {
          // Count all the item requests
          const countControlNum = () => {
              const total = irequest.length;
              setTotalIrequest(total);
          };

          countControlNum();
        }, [irequest]);

        useEffect(() => {
          // Count all the inspection forms
          const countControlNum = () => {
              const total = inspection.length;
              setTotalInspection(total);
          };

          countControlNum();
        }, [inspection]);

        useEffect(() => {
          // Count all the forms
          const countControlNum = () => {
            const total = totalServices + totalIrequest + totalBrequest + totalInspection;
              setTotalForms(total);
          };
          countControlNum();
        });

        useEffect(() => {
          // Count all the archived IRF
          const countControlNum = () => {
              const total = irf.length;
              setTotalIrf(total);
          };

          countControlNum();
        }, [irf]);

        useEffect(() => {
          // Count all the archived IBF
          const countControlNum = () => {
              const total = ibf.length;
              setTotalIbf(total);
          };

          countControlNum();
        }, [ibf]);

        useEffect(() => {
          // Count all the archived RIF
          const countControlNum = () => {
              const total = rif.length;
              setTotalRif(total);
          };

          countControlNum();
        }, [rif]);

        useEffect(() => {
          // Count all the archived SRF
          const countControlNum = () => {
              const total = srf.length;
              setTotalSrf(total);
          };

          countControlNum();
        }, [srf]);
        
        useEffect(() => {
          // Count all the arcived forms
          const countControlNum = () => {
            const total = totalSrf + totalIrf + totalIbf + totalRif;
              setTotalArchives(total);
          };
          countControlNum();
        });
        



  return (
    <>
      <Helmet>
        <title>Forms</title>
      </Helmet>

      <Container>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          Forms
        </Typography>
     
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
      <Grid container spacing={3}>
              <Grid item xs={3} sm={3} md={3}>
                  {<AppWidgetSummary title="SERVICE REQUEST FORMS" total={totalServices} color="error" />}
              </Grid>

          <Grid item xs={3} sm={3} md={3}>
            { <AppWidgetSummary title="BORROWERS ITEM FORMS" total={totalBrequest} color="error" /> }
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            { <AppWidgetSummary title="REQUEST ITEM FORMS" total={totalIrequest} color="error" /> }
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            { <AppWidgetSummary title="INSPECTION REPORT FORM" total={totalInspection} color="error"/> }
          </Grid>

          <Grid item xs={9} sm={9} md={9}>
            { <AppWidgetSummary title="TOTAL FORMS" total={totalForms} color="error"/> }
          </Grid>

          <Grid item xs={3} sm={3} md={3}>
            { <AppWidgetSummary title="TOTAL ARCHIVED FORMS" total={totalArchives} color="error"/> }
          </Grid>
            
           </Grid>
      </Container>
      </Container>
    </>
  );
}