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
  Pagination,
  TableBody,
  TableContainer,
  TextField,
} from '@mui/material';
import FormatDate from '../../components/FormatDate';

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

const PrintInventoryReport = forwardRef((props, ref) => {
  const [labInventoryData, setLabInventoryData] = useState([]);
  const [equipInventoryData, setEquipInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLabInventoryData, setFilteredLabInventoryData] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState('');
  const [filteredLabInventoryData2, setFilteredLabInventoryData2] = useState([]);
  const [room, setRoom] = useState('');
  const [custodian, setCustodian] = useState('');
  const [month, setMonth] = useState('');
  const [totalComputer, setTotalComputer] = useState(0);
  const [totalDefectiveComputer, setTotalDefectiveComputer] = useState(0);
  const [totalWorkingComputer, setTotalWorkingComputer] = useState(0);
  const [totalNeededRepairComputer, setTotalNeededRepairComputer] = useState(0);
  const [availableRoom, setAvailableRoom] = useState([]);
  const [availableMonth, setAvailableMonth] = useState([]);
  const [missingPeripheral, setMissingPeripheral] = useState([]);
  const [roomEquipment, setRoomEquipment] = useState([]);
  const [availableCustodian, setAvailableCustodian] = useState([]);

  const handleSearch = () => {
    const filteredData = equipInventoryData.filter((observation) => {
      // Customize the conditions based on your search criteria
      return (
        observation.RoomEquipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        observation.BrandDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        observation.ModelNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        observation.SerialNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        observation.Quantity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        observation.Remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
        observation.Custodian.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredLabInventoryData(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, equipInventoryData]);

  const handleSearch2 = () => {
    const filteredData2 = labInventoryData.filter((observation) => {
      // Customize the conditions based on your search criteria
      return (
        observation.PCNum.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.UnitSerialNum.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Processor.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.HDD.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Memory.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Keyboard.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Monitor.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Mouse.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.VGA.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Remarks.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        observation.Status.toLowerCase().includes(searchTerm2.toLowerCase())
      );
    });

    setFilteredLabInventoryData2(filteredData2);
  };

  useEffect(() => {
    handleSearch2();
  }, [searchTerm2, labInventoryData]);

  useEffect(() => {
    fetchInventoryData();
  }, [room, custodian, month]);

  const fetchInventoryData = async () => {
    try {
      const labInventoryQuery = collectionGroup(db, 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM');
      const labInventorySnapshot = await getDocs(labInventoryQuery);

      // Initialize an array to store the fetched data
      const labInventoryDataArray = [];
      const equipInventoryDataArray = [];
      const availableRoom = [];
      const availableCustodian = [];
      const availableMonth = [];
      const missingPeripheral = [];
      const roomEquipment = [];
      const neededRepairComputer = [];
      const defectiveComputer = [];
      const workingComputer = [];
      let totalMemory = 0;
      let totalKeyboard = 0;
      let totalHDD = 0;
      let totalMonitor = 0;
      let totalMouse = 0;
      let totalProcessor = 0;

      labInventorySnapshot.docs.forEach((doc) => {
        availableRoom.push(doc.data());

        if (
          (room === '' || room === doc.data().ComputerRoom) &&
          (custodian.toLowerCase() === doc.data().Custodian.toLowerCase() || custodian === '') &&
          (month === FormatDate(doc.data().Date) || month === '')
        ) {
          const { ComputerRoom, inputFieldObservations, inputFieldObservations1 } = doc.data();

          if (Array.isArray(inputFieldObservations)) {
            inputFieldObservations.forEach(
              ({ Memory, Keyboard, HDD, Monitor, Mouse, PCNum, Processor, Remarks, Status, UnitSerialNum, VGA }) => {
                totalMemory += Memory?.toLowerCase() === 'missing' ? 1 : 0;
                totalKeyboard += Keyboard?.toLowerCase() === 'missing' ? 1 : 0;
                totalHDD += HDD?.toLowerCase() === 'missing' ? 1 : 0;
                totalMonitor += Monitor?.toLowerCase() === 'missing' ? 1 : 0;
                totalMouse += Mouse?.toLowerCase() === 'missing' ? 1 : 0;
                totalProcessor += Processor?.toLowerCase() === 'missing' ? 1 : 0;

                if (Status.toLowerCase() === 'working') {
                  workingComputer.push(Status);
                }
                if (Status.toLowerCase() === 'needed repair') {
                  neededRepairComputer.push(Status);
                }
                if (Status.toLowerCase() === 'defective') {
                  defectiveComputer.push(Status);
                }

                labInventoryDataArray.push({
                  Memory: Memory || null,
                  Keyboard: Keyboard || null,
                  HDD: HDD || null,
                  Monitor: Monitor || null,
                  Mouse: Mouse || null,
                  PCNum: PCNum || null,
                  Processor: Processor || null,
                  Remarks: Remarks || null,
                  Status: Status || null,
                  UnitSerialNum: UnitSerialNum || null,
                  VGA: VGA || null,
                  LocationRoom: ComputerRoom || null,
                });
              }
            );
          }

          if (Array.isArray(inputFieldObservations1)) {
            inputFieldObservations1.forEach(
              ({ BrandDescription, Custodian, ModelNum, Quantity, Remarks, RoomEquipment, SerialNum }) => {
                equipInventoryDataArray.push({
                  BrandDescription: BrandDescription || null,
                  Custodian: Custodian || null,
                  ModelNum: ModelNum || null,
                  Quantity: Quantity || null,
                  Remarks: Remarks || null,
                  RoomEquipment: RoomEquipment || null,
                  SerialNum: SerialNum || null,
                  LocationRoom: ComputerRoom || null,
                });
              }
            );
          }
        }
      });
      missingPeripheral.push(
        {
          name: 'Memory',
          total: totalMemory,
        },
        {
          name: 'Keyboard',
          total: totalKeyboard,
        },
        {
          name: 'HDD',
          total: totalHDD,
        },
        {
          name: 'Monitor',
          total: totalMonitor,
        },
        {
          name: 'Mouse',
          total: totalMouse,
        },
        {
          name: 'Processor',
          total: totalProcessor,
        }
      );
      if (Array.isArray(equipInventoryDataArray)) {
        equipInventoryDataArray.forEach(({ RoomEquipment }) => {
          const existingItem = roomEquipment.find((item) => item.name.toLowerCase() === RoomEquipment.toLowerCase());

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            roomEquipment.push({
              name: RoomEquipment,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
      }

      if (Array.isArray(availableRoom)) {
        availableRoom.forEach(({ Custodian }) => {
          const existingItem = availableCustodian.find((item) => item.name.toLowerCase() === Custodian.toLowerCase());

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableCustodian.push({
              name: Custodian,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
      }

      if (Array.isArray(availableRoom)) {
        availableRoom.forEach(({ Date }) => {
          const existingItem = availableMonth.find((item) => item.month === FormatDate(Date));

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableMonth.push({
              month: FormatDate(Date),
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
      }

      setTotalComputer(labInventoryDataArray.length);
      setTotalWorkingComputer(workingComputer.length);
      setTotalDefectiveComputer(defectiveComputer.length);
      setTotalNeededRepairComputer(neededRepairComputer.length);
      setRoomEquipment(roomEquipment);
      setMissingPeripheral(missingPeripheral);
      setAvailableRoom(availableRoom);
      setAvailableMonth(availableMonth);
      setAvailableCustodian(availableCustodian);
      setLabInventoryData(labInventoryDataArray);
      setEquipInventoryData(equipInventoryDataArray);
      setFilteredLabInventoryData(labInventoryDataArray);
    } catch (error) {
      console.error('Error fetching lab inventory data:', error);
    }
  };

  // Pagination state
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const itemsPerPage1 = 5; // Set the number of items per page
  const itemsPerPage2 = 5; // Set the number of items per page

  const handlePageChange1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handlePageChange2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleOnClickRoom = (event) => {
    setRoom(event.target.value);
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
          <Grid item xs={12} sm={7} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={4} sm={3} md={3}>
                <div
                  className="flex"
                  style={{
                    backgroundColor: 'white',
                    height: '150px',
                  }}
                >
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {totalComputer}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    COMPUTER UNITS
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {totalWorkingComputer}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    WORKING COMPUTERS
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {totalNeededRepairComputer}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    COMPUTERS NEEDED REPAIR
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {totalDefectiveComputer}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    DEFECTIVE COMPUTERS
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <div
              className="second-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="subtitle2" style={{ textAlign: 'center' }}>
                Total Computer Units Per Room
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <TableContainer style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th align="center" style={{ color: 'white' }}>
                          Room
                        </th>
                        <th align="center" style={{ color: 'white' }}>
                          Total
                        </th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableRoom.map(({ ComputerRoom, inputFieldObservations }, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" component="th" scope="row">
                            {ComputerRoom}
                          </TableCell>
                          <TableCell align="center">{inputFieldObservations.length}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ResponsiveContainer>
            </div>
          </Grid>

          <Grid item xs={6} sm={2} md={2}>
            <div>
              <select
                onChange={handleOnClickRoom}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={room}
              >
                <option value="">Room</option>
                {availableRoom.map(({ ComputerRoom }, index) => (
                  <option key={index} value={ComputerRoom}>
                    {ComputerRoom}
                  </option>
                ))}
              </select>
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
                onChange={handleOnClickMonth}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={month}
              >
                <option value="">Month</option>
                {availableMonth.map(({ month }, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </Grid>

          <Grid item xs={8} md={8} lg={8}>
            <div style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}>
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Computer Units Inventory
              </Typography>
              <TextField
                type="text"
                label="Search Computer Inventory..."
                variant="outlined"
                defaultValue="Small"
                size="small"
                style={{ marginBottom: '10px', marginLeft: '10px' }}
                value={searchTerm2}
                onChange={(e) => setSearchTerm2(e.target.value)}
              />

              <ResponsiveContainer width="100%" height={300}>
                <TableContainer component={Paper} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table style={{ border: '1px solid #ddd' }}>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th style={{ textAlign: 'center', color: 'white' }}>PC No.</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Unit Serial No.</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Processor</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>HDD</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Memory</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Keyboard</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Monitor</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Mouse</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>VGA</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Remarks</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Status</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Room/Location</th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLabInventoryData2
                        .slice((page1 - 1) * itemsPerPage1, page1 * itemsPerPage1)
                        .map((observation, index) => (
                          <TableRow key={index}>
                            <TableCell style={{ textAlign: 'center' }}>{observation.PCNum}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.UnitSerialNum}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Processor}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.HDD}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Memory}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Keyboard}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Monitor}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Mouse}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.VGA}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Remarks}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Status}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.LocationRoom}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ResponsiveContainer>
              <Pagination
                count={Math.ceil(filteredLabInventoryData2.length / itemsPerPage1)}
                page={page1}
                onChange={handlePageChange1}
              />
            </div>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <div
              className="second-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Total Missing Peripherals
              </Typography>
              <ResponsiveContainer width="100%" height={380}>
                <TableContainer style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  <Table>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th align="center" style={{ color: 'white' }}>
                          Peripherals
                        </th>
                        <th align="center" style={{ color: 'white' }}>
                          Total Missing
                        </th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {missingPeripheral.map(({ name, total }, index) => (
                        <TableRow key={index}>
                          {total > 0 && (
                            <>
                              <TableCell align="center" component="th" scope="row">
                                {name}
                              </TableCell>
                              <TableCell align="center">{total}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ResponsiveContainer>
            </div>
          </Grid>

          <Grid item xs={8} md={8} lg={8}>
            <div
              className="seventh-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Room Equipment Inventory
              </Typography>
              <TextField
                type="text"
                label="Search Equipment Inventory..."
                variant="outlined"
                defaultValue="Small"
                size="small"
                value={searchTerm}
                style={{ marginBottom: '10px', marginLeft: '10px' }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <ResponsiveContainer width="100%" height={300}>
                <TableContainer component={Paper} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table style={{ border: '1px solid #ddd' }}>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th style={{ textAlign: 'center', color: 'white' }}>Room Equipment</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Brand Description</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Model No.</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Serial No.</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Quantity</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Remarks</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Custodian</th>
                        <th style={{ textAlign: 'center', color: 'white' }}>Room/Location</th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLabInventoryData
                        .slice((page2 - 1) * itemsPerPage2, page2 * itemsPerPage2)
                        .map((observation, index) => (
                          <TableRow key={index}>
                            <TableCell style={{ textAlign: 'center' }}>{observation.RoomEquipment}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.BrandDescription}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.ModelNum}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.SerialNum}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Quantity}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Remarks}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.Custodian}</TableCell>
                            <TableCell style={{ textAlign: 'center' }}>{observation.LocationRoom}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ResponsiveContainer>
              <Pagination
                count={Math.ceil(filteredLabInventoryData.length / itemsPerPage2)}
                page={page2}
                onChange={handlePageChange2}
              />
            </div>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <div
              className="second-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Total of Room Equipment
              </Typography>
              <ResponsiveContainer width="100%" height={380}>
                <TableContainer style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  <Table>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th align="center" style={{ color: 'white' }}>
                          Room Equipment
                        </th>
                        <th align="center" style={{ color: 'white' }}>
                          Total
                        </th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roomEquipment.map(({ name, total }, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" component="th" scope="row">
                            {name}
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
        </Grid>
      </Container>
    </div>
  );
});

export default PrintInventoryReport;
