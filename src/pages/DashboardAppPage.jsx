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

import Logo from '../img/logo.png';

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
  const [totalBorrows, setTotalBorrows] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalItems, setTotalItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemQuery = collectionGroup(db, 'requests-items-form');
      const userQuery = collectionGroup(db, 'services-requests-form');
      const borrowQuery = collectionGroup(db, 'borrowers-items-form');
      const roomQuery = collectionGroup(db, 'monthly-computer-inventory');
      const equipmentQuery = collectionGroup(db, 'monthly-equipment-inventory');

      const itemSnapshot = await getDocs(itemQuery);
      const userSnapshot = await getDocs(userQuery);
      const borrowSnapshot = await getDocs(borrowQuery);
      const roomSnapshot = await getDocs(roomQuery);
      const equipmentSnapshot = await getDocs(equipmentQuery);

      const itemData = itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const userData = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const borrowData = borrowSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const roomData = roomSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const equipmentData = equipmentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setItems(itemData);
      setUsers(userData);
      setBorrows(borrowData);
      setRooms(roomData);
      setEquipments(equipmentData);

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
          const countItemBorrowed = () => {
              const total = borrows.length;
              setTotalBorrows(total);
          };
          countItemBorrowed();
        }, [borrows]);

        
        useEffect(() => {
          // Count all the service requests
          const countServices = () => {
              const total = users.length;
              setTotalUsers(total);
          };

          countServices();
        }, [users]);

        useEffect(() => {
          // Count all the item requests
          const countItems = () => {
              const total = items.length;
              setTotalItems(total);
          };

          countItems();
        }, [items]);



  const ItemRequested = calculateItemCounts();
  const ServiceRequested = calculateServiceCounts();
  const BorrowedItems = calculateBorrowedItemCounts();
  const RoomNo = calculateRoomNoCounts();

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

  function calculateServiceCounts() {
    let UserServices1Count = 0;
      let UserServices2Count = 0;
      let UserServices3Count = 0;
      let UserServices4Count = 0;
      let UserServices5Count = 0;
      let UserServices6Count = 0;
  
      users.forEach((user) => {
        if (user.Services === 'Application Installation') {
          UserServices1Count+=1;
        } else if (user.Services === 'Network') {
          UserServices2Count+=1;
        } else if (user.Services === 'Inventory') {
          UserServices3Count+=1;
        } else if (user.Services === 'Reformat') {
          UserServices4Count+=1;
        } else if (user.Services === 'Repairs') {
          UserServices5Count+=1;
        } else if (user.Services === 'Others') {
          UserServices6Count+=1;
        }
      });
  
      return [
        { name: 'Application Installation', value: UserServices1Count, fill: '#FFA07A' },
        { name: 'Network', value: UserServices2Count, fill: '#FF6600' },
        { name: 'Inventory', value: UserServices3Count, fill: '#DAA520' },
        { name: 'Reformat', value: UserServices4Count, fill: '#FF9933' },
        { name: 'Repairs', value: UserServices5Count, fill: '#FF9F00' },
        { name: 'Others', value: UserServices6Count, fill: '#F5C77E' },
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

  return (
    <>
          <Container maxWidth="xl" sx={{ backgroundColor: '#F0EFF6',  borderRadius: '10px' }}>
        <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          CICT Technician Report
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Computer Units" total={totalRooms}  />}
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Item Borrow Requests " total={totalBorrows} color="info" /> }
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Service Requests" total={totalUsers} color="warning" /> }
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Item Requests" total={totalItems} color="error"/> }
          </Grid>


          <Grid item xs={12} md={6} lg={6}>
          <div className="first-box">
            <Typography variant="h5">Breakdown of Items Requested</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width={300} height={300} barSize={60} data={ItemRequested}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-4} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: 'black' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items" fill="#FF8042" name='Items Requested' />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
          <div className="second-box">
            <Typography variant="h5">Breakdown of Services Requested</Typography>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart width={300} height={400}>
                <Pie dataKey="value" data={ServiceRequested} cx="50%" cy="50%" outerRadius={120} fill="#8884d8" label />
                <Tooltip />
                <Legend iconType="circle" verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
          <div className="third-box">
            <Typography variant="h5">Breakdown of Borrowed Items</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width={300} height={300} barSize={60} data={BorrowedItems}>
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

          <Grid item xs={12} md={6} lg={6}>
          <div className="fourth-box">
            <Typography variant="h5">Number of Computer Units Per Room</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width={300} height={300} barSize={60} data={RoomNo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-4} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: 'black' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="rooms" fill="#FF8042" name='RoomNo' />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
          <div className="fifth-box">
          <table>
                            <thead>
                                <tr>
                                <th>PC No.</th>
                                <th>Unit Serial No.</th>
                                <th>Processor</th>
                                <th>Monitor</th>
                                <th>Mouse</th>
                                <th>Keyboard</th>
                                <th>Room</th>
                                <th>Status</th>
                                <th>Custodian</th>
                               
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                <tr key={room.id}>
                                    <td>{room.PCNo}</td>
                                    <td>{room.SerialNo}</td>
                                    <td>{room.Processor}</td>
                                    <td>{room.Monitor}</td>
                                    <td>{room.Mouse}</td>
                                    <td>{room.Keyboard}</td>
                                    <td>{room.RoomNo}</td>
                                    <td>{room.Status}</td>
                                    <td>{room.Custodian}</td>
                                   
                                </tr>
                                ))}
                            </tbody>
                        </table>
            </div>
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
          <div className="sixth-box">
          <table>
                            <thead>
                                <tr>
                                <th>Room Equipment</th>
                                <th>Brand</th>
                                <th>Quantity</th>
                                <th>Room</th>
                                <th>Remarks</th>
                                <th>Custodian</th>
                               
                                </tr>
                            </thead>
                            <tbody>
                                {equipments.map((equipment) => (
                                <tr key={equipment.id}>
                                    <td>{equipment.RoomEquipment}</td>
                                    <td>{equipment.Brand}</td>
                                    <td>{equipment.Quantity}</td>
                                    <td>{equipment.RoomNo}</td>
                                    <td>{equipment.Remarks}</td>
                                    <td>{equipment.Custodian}</td>
                                   
                                </tr>
                                ))}
                            </tbody>
                        </table>
          </div>
          </Grid>

        </Grid>
      </Container>
    </>
  );
}