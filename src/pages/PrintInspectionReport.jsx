import React, { forwardRef, useEffect, useState } from 'react';
import { getFirestore, collectionGroup, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ResponsiveContainer } from 'recharts'; // @mui

import {
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Container,
  Typography,
  TableBody,
  TableContainer,
} from '@mui/material';

const firebaseConfig = {
  apiKey: 'AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc',
  authDomain: 'wp4-technician-dms.firebaseapp.com',
  projectId: 'wp4-technician-dms',
  storageBucket: 'wp4-technician-dms.appspot.com',
  messagingSenderId: '1065436189229',
  appId: '1:1065436189229:web:88094d3d71b15a0ab29ea4',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const PrintInspectionReport = forwardRef((props, ref) => {
  const [inspectionReportsData, setInspectionReportsData] = useState([]);
  const [room, setRoom] = useState('');
  const [custodian, setCustodian] = useState('');
  const [availableCustodian, setAvailableCustodian] = useState([]);
  const [availableRoom, setAvailableRoom] = useState([]);
  const [pendingRepairsCount, setPendingRepairsCount] = useState(0);
  const [repairedCount, setRepairedCount] = useState(0);

  const handleOnClickRoom = (event) => {
    setRoom(event.target.value);
  };
  const handleOnClickCustodian = (event) => {
    setCustodian(event.target.value);
  };

  useEffect(() => {
    fetchInspectionReportsData();
    fetchServiceReportsData();
  }, [custodian, room]);

  const fetchInspectionReportsData = async () => {
    try {
      // Replace 'INSPECTION-REPORT-FORM' with your actual collection name
      const inspectionReportsQuery = collectionGroup(db, 'INSPECTION-REPORT-FORM');

      const inspectionReportsSnapshot = await getDocs(inspectionReportsQuery);

      const inspectionData = [];
      const pendingRepairsCount = [];
      const repairedCount = [];
      const availableData = [];
      const availableCustodian = [];

      inspectionReportsSnapshot.forEach((doc) => {
        availableData.push(doc.data());

        if (
          (`${custodian.toLowerCase()}` === `${doc.data().FullName.toLowerCase()}` || `${custodian}` === '') &&
          (`${room.toLowerCase()}` === `${doc.data().LocationRoom.toLowerCase()}` || `${room}` === '')
        ) {
          repairedCount.push(doc.data());

          const { inputField } = doc.data();

          if (Array.isArray(inputField)) {
            inputField.forEach(({ Recommendation, Issue, ActionTakenSolution, Description }) => {
              inspectionData.push({
                Recommendation: Recommendation || null,
                Issue: Issue || null,
                ActionTakenSolution: ActionTakenSolution || null,
                Description: Description || null,
              });
            });
          }
        }
      });

      if (Array.isArray(availableData)) {
        availableData.forEach(({ FullName }) => {
          const existingItem = availableCustodian.find((item) => item.name.toLowerCase() === FullName.toLowerCase());

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableCustodian.push({
              name: FullName,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
      }

      if (Array.isArray(availableData)) {
        availableData.forEach(({ LocationRoom }) => {
          const existingItem = availableRoom.find((item) => item.room.toLowerCase() === LocationRoom.toLowerCase());

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableRoom.push({
              room: LocationRoom,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
      }

      setInspectionReportsData(inspectionData);
      // setPendingRepairsCount(pendingRepairsCount.length);
      setRepairedCount(repairedCount.length);
      setAvailableCustodian(availableCustodian);
      setAvailableRoom(availableRoom);
    } catch (error) {
      console.error('Error fetching inspection reports data:', error);
    }
  };

  const fetchServiceReportsData = async () => {
    try {
      // Replace 'INSPECTION-REPORT-FORM' with your actual collection name
      const serviceRequestQuery = collectionGroup(db, 'SERVICE-REQUEST');

      const serviceRequestSnapshot = await getDocs(serviceRequestQuery);

      const pendingRepairsCount = [];

      serviceRequestSnapshot.forEach((doc) => {
        if (
          (`${custodian.toLowerCase()}` === `${doc.data().FullName.toLowerCase()}` || `${custodian}` === '') &&
          (`${room.toLowerCase()}` === `${doc.data().LocationRoom.toLowerCase()}` || `${room}` === '')
        ) {
          const myArray = doc.data().Services;
          const myStatus = doc.data().status;

          if ((myStatus.includes('PENDING') && myArray.includes(' Repair')) || myArray.includes('Repair')) {
            pendingRepairsCount.push(doc.data());
          }
        }
      });

      setPendingRepairsCount(pendingRepairsCount.length);
    } catch (error) {
      console.error('Error fetching service request data:', error);
    }
  };

  return (
    <div ref={ref}>
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px', marginTop: '30px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={10} md={10} sx={{ marginBottom: '50px' }}>
            <Grid container spacing={3}>
              <Grid item xs={4} sm={2.5} md={2.5}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0',
                  }}
                >
                  <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#ff5500', textAlign: 'center' }}>
                    {repairedCount}
                  </div>
                  {/* to be totaled */}
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
                    COMPUTERS REPAIRED
                  </div>
                </div>
              </Grid>

              <Grid item xs={4} sm={2.5} md={2.5}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0',
                  }}
                >
                  <div style={{ fontSize: '60px', fontWeight: 'bold', color: '#ff5500', textAlign: 'center' }}>
                    {pendingRepairsCount}
                  </div>
                  {/* to be totaled */}
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
                    PENDING REPAIRS
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={2} md={2}>
            <select
              onChange={handleOnClickCustodian}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              value={custodian}
            >
              <option value="">Custodian</option>
              {availableCustodian.map(({ name }, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              onChange={handleOnClickRoom}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              value={room}
            >
              <option value="">Room</option>
              {availableRoom.map(({ room }, index) => (
                <option key={index} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <div
              className="sixth-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                INSPECTION REPORT
              </Typography>

              <ResponsiveContainer width="100%" height={350}>
                <TableContainer component={Paper} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table style={{ border: '1px solid #ddd' }}>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th style={{ textAlign: 'center', color: 'white' }}>ISSUE</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>DESCRIPTION</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>ACTION TAKEN/SOLUTION</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>RECOMMENDATION</th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inspectionReportsData.map(
                        ({ Recommendation, Issue, Description, ActionTakenSolution }, index) => (
                          <TableRow key={index}>
                            <TableCell style={{ textAlign: 'center' }}>{Issue}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{Description}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{ActionTakenSolution}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{Recommendation}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
});

export default PrintInspectionReport;
