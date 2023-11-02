import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getFirestore, collectionGroup, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const itemQuery = collectionGroup(db, 'requests-items-form');
      const userQuery = collectionGroup(db, 'services-requests-form');
      const borrowQuery = collectionGroup(db, 'borrowers-items-form');

      const itemSnapshot = await getDocs(itemQuery);
      const userSnapshot = await getDocs(userQuery);
      const borrowSnapshot = await getDocs(borrowQuery);

      const itemData = itemSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const userData = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const borrowData = borrowSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setItems(itemData);
      setUsers(userData);
      setBorrows(borrowData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const ItemRequested = calculateItemCounts();
  const ServiceRequested = calculateServiceCounts();
  const BorrowedItems = calculateBorrowedItemCounts();

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
      <Helmet>
        <title>CICT Technician Report</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ backgroundColor: '#F0EFF6', borderRadius: '10px' }}>
      <Typography variant="h2" sx={{ mb: 5 }} style={{ color: '#ff5500' }}>
          CICT Technician Report
        </Typography>
        <div className="dashboardbox">
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
        </div>
      </Container>
    </>
  );
}