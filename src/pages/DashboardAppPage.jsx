import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getFirestore, collectionGroup, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Paper, Table, TableCell, TableHead, TableRow, Grid, Container, Typography, Pagination, TableBody, TableContainer } from '@mui/material';

import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

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
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [totalRooms, setTotalRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState([]);
  const [irequest, setIrequest] = useState([]);
  const [totalIrequest, setTotalIrequest] = useState([]);
  const [brequest, setBrequest] = useState([]);
  const [totalBrequest, setTotalBrequest] = useState([]);
  const [itemCounts, setItemCounts] = useState([]);
  const [borrowCounts, setBorrowCounts] = useState([]);

  
  useEffect(() => {
    fetchBorrowData();
  }, []);

  const fetchBorrowData = async () => {
    try {
      // Replace 'your-collection-name' with the actual name of your collection in Firebase
      const borrowRequestQuery = collectionGroup(db, 'ITEM-BORROWERS');
      const borrowRequestSnapshot = await getDocs(borrowRequestQuery);

      // Initialize an object to store the item counts
      const borrowCountsObj = {};

      borrowRequestSnapshot.docs.forEach((doc) => {
        const borrows = doc.data().Items; // Assuming the field is named 'Items'
        if (Array.isArray(borrows)) {
          borrows.forEach((borrow) => {
            if (borrowCountsObj[borrow]) {
              borrowCountsObj[borrow] += 1;
            } else {
              borrowCountsObj[borrow] = 1;
            }
          });
        }
      });

      // Convert the object into an array of objects
      const borrowCountsArray = Object.entries(borrowCountsObj).map(([borrow, count]) => ({
        name: borrow,
        borrows: count,
      }));

      // Set the item counts in the state
      setBorrowCounts(borrowCountsArray);
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  
  useEffect(() => {
    fetchItemData();
  }, []);

  const fetchItemData = async () => {
    try {
      // Replace 'your-collection-name' with the actual name of your collection in Firebase
      const itemRequestQuery = collectionGroup(db, 'ITEM-REQUEST');
      const itemRequestSnapshot = await getDocs(itemRequestQuery);

      // Initialize an object to store the item counts
      const itemCountsObj = {};

      itemRequestSnapshot.docs.forEach((doc) => {
        const items = doc.data().Items; // Assuming the field is named 'Items'
        if (Array.isArray(items)) {
          items.forEach((item) => {
            if (itemCountsObj[item]) {
              itemCountsObj[item] += 1;
            } else {
              itemCountsObj[item] = 1;
            }
          });
        }
      });

      // Convert the object into an array of objects
      const itemCountsArray = Object.entries(itemCountsObj).map(([item, count]) => ({
        name: item,
        items: count,
      }));

      // Set the item counts in the state
      setItemCounts(itemCountsArray);
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  // Pagination state
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const itemsPerPage1 = 5; // Set the number of items per page
  const itemsPerPage2 = 4; // Set the number of items per page

  const handlePageChange1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handlePageChange2 = (event, newPage) => {
    setPage2(newPage);
  };

  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemQuery = collectionGroup(db, 'requests-items-form');
      const userQuery = collectionGroup(db, 'services-requests-form');
      const serviceQuery = collectionGroup(db, 'SERVICE-REQUEST');
      const borrowQuery = collectionGroup(db, 'borrowers-items-form');
      const roomQuery = collectionGroup(db, 'monthly-computer-inventory');
      const equipmentQuery = collectionGroup(db, 'monthly-equipment-inventory');
      const irequestQuery = collectionGroup(db, 'ITEM-REQUEST');
      const brequestQuery = collectionGroup(db, 'ITEM-BORROWERS');

      const itemSnapshot = await getDocs(itemQuery);
      const userSnapshot = await getDocs(userQuery);
      const serviceSnapshot = await getDocs(serviceQuery);
      const borrowSnapshot = await getDocs(borrowQuery);
      const roomSnapshot = await getDocs(roomQuery);
      const equipmentSnapshot = await getDocs(equipmentQuery);
      const irequestSnapshot = await getDocs(irequestQuery);
      const brequestSnapshot = await getDocs(brequestQuery);
      

      const itemData = itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const userData = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const serviceData = serviceSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const borrowData = borrowSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const roomData = roomSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const equipmentData = equipmentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const irequestData =irequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const brequestData =brequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));


      
      setItems(itemData);
      setUsers(userData);
      setServices(serviceData);
      setBorrows(borrowData);
      setRooms(roomData);
      setEquipments(equipmentData);
      setIrequest(irequestData);
      setBrequest(brequestData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

          useEffect(() => {
            // Count the number of pc
            const countPCNo = () => {
                const total = rooms.length;
                setTotalRooms(total);
            };

            countPCNo();
        }, [rooms]);


        useEffect(() => {
          // Count all the item borrow requests
          const countItems = () => {
              const total = brequest.length;
              setTotalBrequest(total);
          };
          countItems();
        }, [brequest]);

        
        useEffect(() => {
          // Count all the service requests
          const countServices = () => {
              const total = services.length;
              setTotalServices(total);
          };

          countServices();
        }, [services]);

        useEffect(() => {
          // Count all the item requests
          const countItems = () => {
              const total = irequest.length;
              setTotalIrequest(total);
          };

          countItems();
        }, [irequest]);



  const ItemRequested = calculateItemCounts();
  const BorrowedItems = calculateBorrowedItemCounts();
  const RoomNo = calculateRoomNoCounts();
  const LocationRoom = calculateLocationRoomCounts();

   

  function calculateLocationRoomCounts() {
    let LocationRoom1Count = 0;
    let LocationRoom2Count = 0;
    let LocationRoom3Count = 0;
    let LocationRoom4Count = 0;
    let LocationRoom5Count = 0;
    let LocationRoom6Count = 0;
    let LocationRoom7Count = 0;
    let LocationRoom8Count = 0;
    let LocationRoom9Count = 0;
    let LocationRoom10Count = 0;
    let LocationRoom11Count = 0;
    let LocationRoom12Count = 0;
    let LocationRoom13Count = 0;
    let LocationRoom14Count = 0;
    let LocationRoom15Count = 0;
    let LocationRoom16Count = 0;
    let LocationRoom17Count = 0;
    let LocationRoom18Count = 0;
    let LocationRoom19Count = 0;
    let LocationRoom20Count = 0;
    let LocationRoom21Count = 0;
    let LocationRoom22Count = 0;


    services.forEach((service) => {
      if (service.LocationRoom === 'A1') {
        LocationRoom1Count+=1;
      } else if (service.LocationRoom === 'A2') {
        LocationRoom2Count+=1;
      } else if (service.LocationRoom === 'A3') {
        LocationRoom3Count+=1;
      } else if (service.LocationRoom === 'A4') {
        LocationRoom4Count+=1;
      } else if (service.LocationRoom === 'IT13') {
        LocationRoom5Count+=1;
      } else if (service.LocationRoom === 'IT14') {
        LocationRoom6Count+=1;
      } else if (service.LocationRoom === 'IT1') {
        LocationRoom7Count+=1;
      } else if (service.LocationRoom === 'IT2') {
        LocationRoom8Count+=1;
      } else if (service.LocationRoom === 'SDL1') {
        LocationRoom9Count+=1;
      } else if (service.LocationRoom === 'SDL2') {
        LocationRoom10Count+=1;
      } else if (service.LocationRoom === 'SDL3') {
        LocationRoom11Count+=1;
      } else if (service.LocationRoom === 'SDL4') {
        LocationRoom12Count+=1;
      } else if (service.LocationRoom === 'PROGLAB1') {
        LocationRoom13Count+=1;
      } else if (service.LocationRoom === 'PROGLAB2') {
        LocationRoom14Count+=1;
      } else if (service.LocationRoom === 'PROGLAB3') {
        LocationRoom15Count+=1;
      } else if (service.LocationRoom === 'CT6') {
        LocationRoom16Count+=1;
      } else if (service.LocationRoom === 'CT7') {
        LocationRoom17Count+=1;
      } else if (service.LocationRoom === 'CT8') {
        LocationRoom18Count+=1;
      } else if (service.LocationRoom === 'ACAD1') {
        LocationRoom19Count+=1;
      } else if (service.LocationRoom === 'AVR A') {
        LocationRoom20Count+=1;
      } else if (service.LocationRoom === 'AVR B') {
        LocationRoom21Count+=1;
      } else if (service.LocationRoom === 'IT9') {
        LocationRoom22Count+=1;
      }
    });

    return [
      { name: 'A1', services: LocationRoom1Count, fill: '#ff5100' },
      { name: 'A2', services: LocationRoom2Count, fill: '#ff7839' },
      { name: 'A3', services: LocationRoom3Count, fill: '#ff9767' },
      { name: 'A4', services: LocationRoom4Count, fill: '#ffbc9c' },
      { name: 'IT13', services: LocationRoom5Count, fill: '#ffd7c4' },
      { name: 'IT14', services: LocationRoom6Count, fill: '#eb6521' },
      { name: 'IT1', services: LocationRoom7Count, fill: '#f18b57' },
      { name: 'IT2', services: LocationRoom8Count, fill: '#fbb38f' },
      { name: 'SDL1', services: LocationRoom9Count, fill: '#fd963d' },
      { name: 'SDL2', services: LocationRoom10Count, fill: '#ffae69' },
      { name: 'SDL3', services: LocationRoom11Count, fill: '#fb4700' },
      { name: 'SDL4', services: LocationRoom12Count, fill: '#fc6c33' },
      { name: 'PROGLAB1', services: LocationRoom13Count, fill: '#fd9166' },
      { name: 'PROGLAB2', services: LocationRoom14Count, fill: '#fdb599' },
      { name: 'PROGLAB3', services: LocationRoom15Count, fill: '#e78644' },
      { name: 'CT6', services: LocationRoom16Count, fill: '#ff5a00' },
      { name: 'CT7', services: LocationRoom17Count, fill: '#ff6700' },
      { name: 'CT8', services: LocationRoom18Count, fill: '#ff8810' },
      { name: 'ACAD1', services: LocationRoom19Count, fill: '#ffb72f' },
      { name: 'AVR A', services: LocationRoom20Count, fill: '#ffa700' },
      { name: 'AVR B', services: LocationRoom21Count, fill: '#ffa751' },
      { name: 'IT9', services: LocationRoom22Count, fill: '#f0963d' },
    ];
  }


  function calculateRoomNoCounts() {
    let Room1Count = 0;
    let Room2Count = 0;
    let Room3Count = 0;
    let Room4Count = 0;
    let Room5Count = 0;
    let Room6Count = 0;


    rooms.forEach((room) => {
      if (room.RoomNo === 'Maclab') {
        Room1Count+=1;
      } else if (room.RoomNo === 'A3') {
        Room2Count+=1;
      } else if (room.RoomNo === 'IT18') {
        Room3Count+=1;
      } else if (room.RoomNo === 'IT7') {
        Room4Count+=1;
      } else if (room.RoomNo === 'IT2') {
        Room5Count+=1;
      } else if (room.RoomNo === 'IT11') {
        Room6Count+=1;
      }
    });

    return [
      { name: 'Maclab', rooms: Room1Count },
      { name: 'A3', rooms: Room2Count },
      { name: 'IT18', rooms: Room3Count },
      { name: 'IT7', rooms: Room4Count },
      { name: 'IT2', rooms: Room5Count },
      { name: 'IT11', rooms: Room6Count },
    ];
  }



  function calculateItemCounts() {
    let Item1Count = 0;
    let Item2Count = 0;
    let Item3Count = 0;
    let Item4Count = 0;
    let Item5Count = 0;
    let Item6Count = 0;


    items.forEach((item) => {
      if (item.Items === 'Mouse') {
        Item1Count+=1;
      } else if (item.Items === 'Keyboard') {
        Item2Count+=1;
      } else if (item.Items === 'Monitor') {
        Item3Count+=1;
      } else if (item.Items === 'AVR') {
        Item4Count+=1;
      } else if (item.Items === 'CPU') {
        Item5Count+=1;
      } else if (item.Items === 'Others') {
        Item6Count+=1;
      }
    });

    return [
      { name: 'Mouse', items: Item1Count },
      { name: 'Keyboard', items: Item2Count },
      { name: 'Monitor', items: Item3Count },
      { name: 'AVR', items: Item4Count },
      { name: 'CPU', items: Item5Count },
      { name: 'Others', items: Item6Count },
    ];
  }

  

  function calculateBorrowedItemCounts() {
    let Borrow1Count = 0;
    let Borrow2Count = 0;
    let Borrow3Count = 0;
    let Borrow4Count = 0;
    let Borrow5Count = 0;
    let Borrow6Count = 0;

    borrows.forEach((borrow) => {
      if (borrow.ItemBorrowed === 'HDMI') {
        Borrow1Count+=1;
      } else if (borrow.ItemBorrowed === 'Television') {
        Borrow2Count+=1;
      } else if (borrow.ItemBorrowed === 'Projector') {
        Borrow3Count+=1;
      } else if (borrow.ItemBorrowed === 'Chairs') {
        Borrow4Count+=1;
      } else if (borrow.ItemBorrowed === 'Monitor') {
        Borrow5Count+=1;
      } else if (borrow.ItemBorrowed === 'Others') {
        Borrow6Count+=1;
      }
    });

    return [
      { name: 'HDMI', borrows: Borrow1Count },
      { name: 'Television', borrows: Borrow2Count },
      { name: 'Projector', borrows: Borrow3Count },
      { name: 'Chairs', borrows: Borrow4Count },
      { name: 'Monitor', borrows: Borrow5Count },
      { name: 'Others', borrows: Borrow6Count },
    ];
  }

 // Create a function to count the services in "SERVICE-REQUEST" collection
 function countServiceRequests() {
  const serviceCounts = {};

  // Count the services in the "Services" array
  services.forEach((service) => {
    service.Services.forEach((serviceType) => {
      if (serviceCounts[serviceType]) {
        serviceCounts[serviceType]+= 1;
      } else {
        serviceCounts[serviceType] = 1;
      }
    });
  });

  const pieChartData = Object.entries(serviceCounts).map(([name, value, fill]) => ({
    name,
    value,
    fill: '#FFA07A',
  }));

  return pieChartData;
}

    // Calculate the service request counts
    const ServiceRequested = countServiceRequests();

    // Define custom colors for each value
    const colors = ['#FFA07A', '#FF6600', '#DAA520', '#FF9933', '#FF9F00', '#F5C77E'];

    // Modify the ServiceRequested data to include the desired colors
        const pieChartData = ServiceRequested.map((entry, index) => ({
          ...entry,
          fill: colors[index],
        }));

        const ServiceRequestsTable = ({ data }) => {
          return (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Room</TableCell>
                  <TableCell>Total Requests</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.services}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        };

  return (
    <>
      <Helmet>
        <title>CICT Technician Report</title>
      </Helmet>
    <Container>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
        CICT Technician Report
        </Typography>
        
        <Container sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px', paddingBottom: '20px' }}>
   

        <Grid container spacing={3}>
          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Computer Units" total={totalRooms}  />}
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Item Borrow Requests " total={totalBrequest} color="info" /> }
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Service Requests" total={totalServices} color="warning" /> }
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Item Requests" total={totalIrequest} color="error"/> }
          </Grid>




          <Grid item xs={12} md={8} lg={8}>
          <div className="first-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
          <Typography variant="h5"style={{ textAlign: 'center' }}>Breakdown of Services Requested</Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart width={330} height={400}>
                    <Pie 
                    dataKey="value" 
                    data={pieChartData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    fill="#8884d8" 
                    label={({ percent }) => ` ${(percent * 100).toFixed(2)}%`} // Add percentage label here />
                    Tooltip />
                    <Legend iconType="circle" verticalAlign="middle" align="right" layout="vertical" />
                  </PieChart>
                </ResponsiveContainer>
          </div>
          </Grid>


          <Grid item xs={12} md={4} lg={4} >
          <div className="second-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
            <Typography variant="h5" style={{ textAlign: 'center' }}>Total Service Requests Per Room</Typography>
            <ResponsiveContainer width="100%" height={350}>
            <TableContainer style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table>
                <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: 'white' }}>
                  <TableRow>
                    <th align='left' style={{ color: '#7D7C7C', fontWeight: 'normal'  }}>Room</th>
                    <th align="right" style={{ color: '#7D7C7C', fontWeight: 'normal'  }}>Total Requests</th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {LocationRoom.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.services}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </ResponsiveContainer>
          </div>
          </Grid>



          <Grid item xs={12} md={5} lg={5}>
          <div className="third-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
            <Typography variant="h5" style={{ textAlign: 'center' }}>Breakdown of Borrowed Items</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width={300} height={300} barSize={50} data={borrowCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-4} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: 'black' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="borrows" fill="#FF8042" name='Borrowed Items' />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </Grid>

          
          <Grid item xs={12} md={7} lg={7}>
          <div className="fourth-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
          <Typography variant="h5" style={{ textAlign: 'center' }}>Breakdown of Item Requests</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width={270} height={300} barSize={50} data={itemCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-4} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: 'black' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items" fill="#FF8042" name="Items Requested" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
        <div className="sixth-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
          <TableContainer component={Paper} style={{
          maxHeight: '300px',
          overflowY: 'auto',
          borderRadius: '10px', // Set the border-radius property here
        }}>
          <Table style={{ border: '1px solid #ddd' }}>
              <TableHead>
                <TableRow>
                    <th style={{ textAlign: 'center' }}>PC No.</th>
                    <th style={{ textAlign: 'center' }}>Unit Serial No.</th>
                    <th style={{ textAlign: 'center' }}>Processor</th>
                    <th style={{ textAlign: 'center' }}>Monitor</th>
                    <th style={{ textAlign: 'center' }}>Mouse</th>
                    <th style={{ textAlign: 'center' }}>Keyboard</th>
                    <th style={{ textAlign: 'center' }}>Room</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Custodian</th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {rooms
                  .slice((page1 - 1) * itemsPerPage2, page1 * itemsPerPage2)
                  .map((room) => (
                    <TableRow key={room.id}>
                          <td style={{ textAlign: 'center' }}>{room.PCNo}</td>
                          <td style={{ textAlign: 'center' }}>{room.SerialNo}</td>
                          <td style={{ textAlign: 'center' }}>{room.Processor}</td>
                          <td style={{ textAlign: 'center' }}>{room.Monitor}</td>
                          <td style={{ textAlign: 'center' }}>{room.Mouse}</td>
                          <td style={{ textAlign: 'center' }}>{room.Keyboard}</td>
                          <td style={{ textAlign: 'center' }}>{room.RoomNo}</td>
                          <td style={{ textAlign: 'center' }}>{room.Status}</td>
                          <td style={{ textAlign: 'center' }}>{room.Custodian}</td>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                </TableContainer>
                <Pagination
            count={Math.ceil(rooms.length / itemsPerPage2)}
            page={page1}
            onChange={handlePageChange1}
          />
              </div>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
        <div className="seventh-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
          <TableContainer component={Paper} style={{
          maxHeight: '300px',
          overflowY: 'auto',
          borderRadius: '10px', // Set the border-radius property here
        }}>
             <Table style={{ border: '1px solid #ddd' }}>
              <TableHead>
                <TableRow>
                <th style={{ textAlign: 'center' }}>Room Equipment</th>
                <th style={{ textAlign: 'center' }}>Brand</th>
                <th style={{ textAlign: 'center' }}>Quantity</th>
                <th style={{ textAlign: 'center' }}>Room</th>
                <th style={{ textAlign: 'center' }}>Remarks</th>
                <th style={{ textAlign: 'center' }}>Custodian</th>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {equipments
                  .slice((page2 - 1) * itemsPerPage1, page2 * itemsPerPage1)
                  .map((equipment) => (
                    <TableRow key={equipment.id}>
                          <td style={{ textAlign: 'center' }}>{equipment.RoomEquipment}</td>
                          <td style={{ textAlign: 'center' }}>{equipment.Brand}</td>
                          <td style={{ textAlign: 'center' }}>{equipment.Quantity}</td>
                          <td style={{ textAlign: 'center' }}>{equipment.RoomNo}</td>
                          <td style={{ textAlign: 'center' }}>{equipment.Remarks}</td>
                          <td style={{ textAlign: 'center' }}>{equipment.Custodian}</td>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                </TableContainer>
                <Pagination
            count={Math.ceil(equipments.length / itemsPerPage1)}
            page={page2}
            onChange={handlePageChange2}
          />
              </div>
            </Grid>
        </Grid>
      </Container>
      </Container>
    </>
  );
}

