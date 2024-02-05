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

const PrintProfilingReport = forwardRef((props, ref) => {
  const [year, setYear] = useState('');
  const [custodian, setCustodian] = useState('');
  const [month, setMonth] = useState('');
  const [totalMRData, setTotalMRData] = useState(0);
  const [totalFacultyMRData, setTotalFacultyMRData] = useState(0);
  const [availableYear, setAvailableYear] = useState([]);
  const [availableMonth, setAvailableMonth] = useState([]);
  const [availbleCustodian, setAvailableCustodian] = useState([]);
  const [condemnedItemsData, setCondemnedItemsData] = useState([]);
  const [facultyMRData, setFacultyMRData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const uniqueMonths = {};

  // Filter out duplicates and update the uniqueMonths object
  const uniqueMonthsArray = availableMonth.filter((monthObj) => {
    const { month, numericMonth } = monthObj;
    const key = `${numericMonth}-${month}`;
    if (!uniqueMonths[key]) {
      uniqueMonths[key] = true;
      return true;
    }
    return false;
  });
  uniqueMonthsArray.sort((a, b) => a.numericMonth - b.numericMonth);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    fetchMRData();
    fetchCondemnedData();
  }, [custodian, month, year]);

  const fetchMRData = async () => {
    try {
      const MRqueryData = collectionGroup(db, 'MEMORANDUM-OF-RECEIPTS');
      const mrSnapshot = await getDocs(MRqueryData);

      const totalMRData = [];
      const memorandumData = [];
      const facultyMRData = [];
      const MonthMR = [];
      const availableYear = [];
      const availableCustodian = [];
      const equipmentsData = [];

      mrSnapshot.docs.forEach((doc) => {
        const monthValidation = new Date(doc.data().DateInspectedBy).getMonth();
        const yearValidation = new Date(doc.data().DateInspectedBy).getFullYear();

        memorandumData.push(doc.data());

        if (
          (`${year}` === '' || `${year}` === `${yearValidation}`) &&
          (`${month}` === '' || `${month}` === `${monthValidation}`) &&
          (`${custodian.toLowerCase()}` === `${doc.data().EntityName.toLowerCase()}` || `${custodian}` === '')
        ) {
          totalMRData.push(doc.data());

          const { inputFieldCict, inputFieldOffice, inputFieldOther, EntityName } = doc.data();

          if (Array.isArray(inputFieldCict)) {
            inputFieldCict.forEach(({ Quantity, unitCost, Description }) => {
              equipmentsData.push({
                Quantity: Quantity || null,
                UnitCost: unitCost || null,
                Description: Description || null,
                Custodian: EntityName || null,
              });
            });
          }

          if (Array.isArray(inputFieldOffice)) {
            inputFieldOffice.forEach(({ Quantity, unitCost, Description }) => {
              equipmentsData.push({
                Quantity: Quantity || null,
                UnitCost: unitCost || null,
                Description: Description || null,
                Custodian: EntityName || null,
              });
            });
          }

          if (Array.isArray(inputFieldOther)) {
            inputFieldOther.forEach(({ Quantity, unitCost, Description }) => {
              equipmentsData.push({
                Quantity: Quantity || null,
                UnitCost: unitCost || null,
                Description: Description || null,
                Custodian: EntityName || null,
              });
            });
          }
        }
      });

      if (Array.isArray(totalMRData)) {
        totalMRData.forEach(({ EntityName }) => {
          const existingItem = facultyMRData.find(
            (item) => item.facultyName.toLowerCase() === EntityName.toLowerCase()
          );

          if (existingItem) {
            existingItem.total += 1;
          } else {
            facultyMRData.push({
              facultyName: EntityName,
              total: 1,
            });
          }
        });
      }

      if (Array.isArray(memorandumData)) {
        memorandumData.forEach(({ EntityName }) => {
          const existingItem = availableCustodian.find(
            (item) => item.facultyName.toLowerCase() === EntityName.toLowerCase()
          );

          if (existingItem) {
            existingItem.total += 1;
          } else {
            availableCustodian.push({
              facultyName: EntityName,
              total: 1,
            });
          }
        });
      }

      if (Array.isArray(memorandumData)) {
        memorandumData.forEach(({ DateInspectedBy }) => {
          const yearFromInspectedBy = new Date(DateInspectedBy).getFullYear();
          const existingItem = availableYear.find((item) => item.year === yearFromInspectedBy.toString());

          if (existingItem) {
            existingItem.total += 1;
          } else {
            availableYear.push({
              year: yearFromInspectedBy.toString(),
              total: 1,
            });
          }
        });
      }

      if (Array.isArray(memorandumData)) {
        memorandumData.forEach(({ DateInspectedBy }) => {
          const monthFromInspectedBy = new Date(DateInspectedBy).getMonth();

          const monthName = monthNames[monthFromInspectedBy];
          const existingItem = MonthMR.find((item) => item.month === monthName);

          if (existingItem) {
            existingItem.total += 1;
          } else {
            MonthMR.push({
              month: monthName,
              numericMonth: monthFromInspectedBy,
              total: 1,
            });
          }
        });
      }

      setEquipmentData(equipmentsData);
      setAvailableYear(availableYear);
      setAvailableMonth((prevMonth) => [...prevMonth, ...MonthMR]);
      setAvailableCustodian(availableCustodian);
      setFacultyMRData(facultyMRData);
      setTotalFacultyMRData(facultyMRData.length);
      setTotalMRData(totalMRData.length);
    } catch (error) {
      console.error('Error fetching MR data:', error);
    }
  };

  const fetchCondemnedData = async () => {
    try {
      const MRqueryData = collectionGroup(db, 'CONDEMNED-ITEMS');
      const mrSnapshot = await getDocs(MRqueryData);

      const totalCondemnedData = [];
      const condemnedItems = [];
      const condemnedData = [];
      const totalCondemnedItems = [];
      const MonthCondemned = [];

      mrSnapshot.docs.forEach((doc) => {
        condemnedData.push(doc.data());
        const monthValidation = new Date(doc.data().DateReceivedBy).getMonth();
        const yearValidation = new Date(doc.data().DateReceivedBy).getFullYear();

        if (
          (`${year}` === '' || `${year}` === `${yearValidation}`) &&
          (`${month}` === '' || `${month}` === `${monthValidation}`)
        ) {
          totalCondemnedData.push(doc.data());

          const { inputField } = doc.data();

          if (Array.isArray(inputField)) {
            inputField.forEach(({ EndUser, IcsNo, ItemDescription, Quantity, Remarks }) => {
              condemnedItems.push({
                EndUser: EndUser || null,
                IcsNo: IcsNo || null,
                ItemDescription: ItemDescription || null,
                Quantity: Quantity || null,
                Remarks: Remarks || null,
              });
            });
          }
        }
      });

      if (Array.isArray(condemnedData)) {
        condemnedData.forEach(({ DateReceivedBy }) => {
          const monthFromInspectedBy = new Date(DateReceivedBy).getMonth();

          const monthName = monthNames[monthFromInspectedBy];
          const existingItem = MonthCondemned.find((item) => item.month === monthName);

          if (existingItem) {
            existingItem.total += 1;
          } else {
            MonthCondemned.push({
              month: monthName,
              numericMonth: monthFromInspectedBy,
              total: 1,
            });
          }
        });
      }

      if (Array.isArray(condemnedItems)) {
        condemnedItems.forEach(({ ItemDescription, Quantity }) => {
          const existingItem = totalCondemnedItems.find(
            (item) => item.condemnedItems.toLowerCase() === ItemDescription.toLowerCase()
          );

          if (existingItem) {
            existingItem.total += Number(Quantity);
          } else {
            totalCondemnedItems.push({
              condemnedItems: ItemDescription,
              total: Number(Quantity),
            });
          }
        });
      }

      setCondemnedItemsData(totalCondemnedItems);
      setAvailableMonth((prevMonth) => [...prevMonth, ...MonthCondemned]);
    } catch (error) {
      console.error('Error fetching Condemned data:', error);
    }
  };

  const handleOnClickYear = (event) => {
    setYear(event.target.value);
  };

  const handleOnClickCustodian = (event) => {
    setCustodian(event.target.value);
  };

  const handleOnClickMonth = (event) => {
    setMonth(event.target.value);
  };
  return (
    <div ref={ref}>
      <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px', marginTop: '30px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10} md={10} sx={{ marginBottom: '50px' }}>
            <Grid container spacing={2}>
              <Grid item xs={4} sm={2.5} md={2.5}>
                <div
                  className="flex"
                  style={{
                    backgroundColor: 'white',
                    height: '150px',
                  }}
                >
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {totalMRData}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    TOTAL MR
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={2.5} md={2.5}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {condemnedItemsData.length}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    CONDEMNED ITEMS
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={2.5} md={2.5}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {totalFacultyMRData}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    FACULTIES WITH MR
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={2} md={2} sx={{ marginBottom: '50px' }}>
            <div>
              <select
                onChange={handleOnClickMonth}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={month}
              >
                <option value="">Month</option>
                {uniqueMonthsArray.map(({ month, numericMonth }, index) => (
                  <option key={index} value={numericMonth}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                onChange={handleOnClickYear}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={year}
              >
                <option value="">Year</option>
                {availableYear.map(({ year }, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                onChange={handleOnClickCustodian}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={custodian}
              >
                <option value="">Custodian</option>
                {availbleCustodian.map(({ facultyName }, index) => (
                  <option key={index} value={facultyName}>
                    {facultyName}
                  </option>
                ))}
              </select>
            </div>
          </Grid>
          <Grid item xs={3} md={3} lg={3}>
            <Grid item xs={12} sm={12} md={12}>
              <div
                className="second-box"
                style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
              >
                <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
                  Total of Items Condemned
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <TableContainer style={{ maxHeight: '200px' }}>
                    <Table>
                      <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                        <TableRow>
                          <th align="center" style={{ color: 'white' }}>
                            Items
                          </th>
                          <th align="center" style={{ color: 'white' }}>
                            Total Condemned
                          </th>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {condemnedItemsData.map(({ condemnedItems, total }, index) => (
                          <TableRow key={index}>
                            <TableCell align="center" component="th" scope="row">
                              {condemnedItems}
                            </TableCell>
                            <TableCell align="center">{total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ResponsiveContainer>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ marginTop: '10px' }}>
              <div
                className="second-box"
                style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
              >
                <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
                  Total MR of Faculties
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <TableContainer style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <Table>
                      <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                        <TableRow>
                          <th align="center" style={{ color: 'white' }}>
                            Faculty Name
                          </th>
                          <th align="center" style={{ color: 'white' }}>
                            Total MR
                          </th>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {facultyMRData.map(({ facultyName, total }, index) => (
                          <TableRow key={index}>
                            <TableCell align="center">{facultyName}</TableCell>
                            <TableCell align="center">{total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ResponsiveContainer>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={9} md={9} lg={9}>
            <div
              className="sixth-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
                ITEMS/EQUIPMENTS MR
              </Typography>

              <ResponsiveContainer width="100%" height={430}>
                <TableContainer component={Paper} style={{ maxHeight: '430px', overflowY: 'auto' }}>
                  <Table style={{ border: '1px solid #ddd' }}>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th style={{ textAlign: 'center', color: 'white' }}>Quantity</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Items/Equipments</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Unit Cost</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Custodian</th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {equipmentData.map(({ Quantity, Description, UnitCost, Custodian }, index) => (
                        <TableRow key={index}>
                          <TableCell style={{ textAlign: 'center' }}>{Quantity}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{Description}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{UnitCost}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{Custodian}</TableCell>
                        </TableRow>
                      ))}
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

export default PrintProfilingReport;
