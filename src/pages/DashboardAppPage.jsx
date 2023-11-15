import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getFirestore, collectionGroup, getDocs } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';// @mui
import { useTheme } from '@mui/material/styles';
import { Paper, Table, TableCell, TableHead, TableRow, Grid, Container, Typography, Pagination, TableBody, TableContainer, TextField } from '@mui/material';
import { AppWidgetSummary} from '../sections/@dashboard/app';


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
  const [totalRooms, setTotalRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState([]);
  const [irequest, setIrequest] = useState([]);
  const [totalIrequest, setTotalIrequest] = useState([]);
  const [brequest, setBrequest] = useState([]);
  const [totalBrequest, setTotalBrequest] = useState([]);
  const [itemCounts, setItemCounts] = useState([]);
  const [borrowCounts, setBorrowCounts] = useState([]);
  const [labInventoryData, setLabInventoryData] = useState([]);
  const [equipInventoryData, setEquipInventoryData] = useState([]);
  const [inspection, setInspection] = useState([]);
  const [totalInspection, setTotalInspection] = useState([]);
  const [totalForms, setTotalForms] = useState([]);
  const [mreceipts, setMreceipts] = useState([]);
  const [totalMreceipts, setTotalMreceipts] = useState([]);
  const [citems, setCitems] = useState([]);
  const [totalCitems, setTotalCitems] = useState([]);
  const [totalProfiling, setTotalProfiling] = useState([]);
  const [property, setProperty] = useState([]);
  const [totalProperty, setTotalProperty] = useState([]);
  const [transferInventory, setTransferInventory] = useState([]);
  const [totalTransferInventory, setTotalTransferInventory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [totalInventory, setTotalInventory] = useState([]);
  const [totalReports, setTotalReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLabInventoryData, setFilteredLabInventoryData] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState('');
  const [filteredLabInventoryData2, setFilteredLabInventoryData2] = useState([]);
  const [searchTerm3, setSearchTerm3] = useState('');
  const [filteredLocationRoom, setFilteredLocationRoom] = useState([]);

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
    fetchLabInventoryData();
  }, []);

  const fetchLabInventoryData = async () => {
    try {
      // Replace 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM' with your actual collection name
      const labInventoryQuery = collectionGroup(db, 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM');
      const labInventorySnapshot = await getDocs(labInventoryQuery);
  
      // Initialize an array to store the fetched data
      const labInventoryDataArray = [];
  
      labInventorySnapshot.docs.forEach((doc) => {
        const inputFieldObservations = doc.data().inputFieldObservations || [];
  
        inputFieldObservations.forEach((observation) => {
          // Add each observation to the array
          labInventoryDataArray.push(observation);
        });
      });
  
      // Set both lab inventory data and filtered data in the state
      setLabInventoryData(labInventoryDataArray);
      setFilteredLabInventoryData(labInventoryDataArray);
    } catch (error) {
      console.error('Error fetching lab inventory data:', error);
    }
  };
  
  useEffect(() => {
    fetchEquipInventoryData();
  }, []);

  const fetchEquipInventoryData = async () => {
    try {
      // Replace 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM' with your actual collection name
      const equipInventoryQuery = collectionGroup(db, 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM');
      const equipInventorySnapshot = await getDocs(equipInventoryQuery);

      // Initialize an array to store the fetched data
      const equipInventoryDataArray = [];

      equipInventorySnapshot.docs.forEach((doc) => {
        const inputFieldObservations1 = doc.data().inputFieldObservations1 || [];

        inputFieldObservations1.forEach((observation) => {
          // Add each observation to the array
          equipInventoryDataArray.push(observation);
        });
      });

      // Set the lab inventory data in the state
      setEquipInventoryData(equipInventoryDataArray);
    } catch (error) {
      console.error('Error fetching equipment inventory data:', error);
    }
  };

  
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
  const itemsPerPage2 = 5; // Set the number of items per page

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

      const serviceQuery = collectionGroup(db, 'SERVICE-REQUEST');
      const irequestQuery = collectionGroup(db, 'ITEM-REQUEST');
      const brequestQuery = collectionGroup(db, 'ITEM-BORROWERS');
      const inspectionQuery = collectionGroup(db, 'INSPECTION-REPORT-FORM');
      const mreceiptsQuery = collectionGroup(db, 'MEMORANDUM-OF-RECEIPTS');
      const citemsQuery = collectionGroup(db, 'CONDEMNED-ITEMS');
      const propertyQuery = collectionGroup(db, 'PROPERTY-TRANSFER-REPORT');
      const transferInventoryQuery = collectionGroup(db, 'INVENTORY-TRANSFER-REPORT');
      const inventoryQuery = collectionGroup(db, 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM');

      const serviceSnapshot = await getDocs(serviceQuery);
      const irequestSnapshot = await getDocs(irequestQuery);
      const brequestSnapshot = await getDocs(brequestQuery);
      const inspectionSnapshot = await getDocs(inspectionQuery);
      const mreceiptsSnapshot = await getDocs(mreceiptsQuery);
      const citemsSnapshot = await getDocs(citemsQuery);
      const propertySnapshot = await getDocs(propertyQuery);
      const transferInventorySnapshot = await getDocs(transferInventoryQuery);
      const inventorySnapshot = await getDocs(inventoryQuery);


      const serviceData = serviceSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const irequestData =irequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const brequestData =brequestSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const inspectionData =inspectionSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const mreceiptsData = mreceiptsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const citemsData = citemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const propertyData = propertySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const transferInventoryData = transferInventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const inventoryData = inventorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      
    
      setServices(serviceData);
      setIrequest(irequestData);
      setBrequest(brequestData);
      setInspection(inspectionData);
      setMreceipts(mreceiptsData);
      setCitems(citemsData);
      setProperty(propertyData);
      setTransferInventory(transferInventoryData);
      setInventory(inventoryData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

          useEffect(() => {
            // Count the number of pc
            const countPCNum = () => {
                const total = labInventoryData.length;
                setTotalRooms(total);
            };

            countPCNum();
        }, [labInventoryData]);


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



 // Create a function to count the services in "SERVICE-REQUEST" collection
 function countServiceRequests() {
  const serviceCounts = {};

  // Count the services in the "Services" array
  services.forEach((service) => {
    if (services) {
      services.forEach((service) => {
        if (service && service.Services) {
          service.Services.forEach((serviceType) => {
            if (serviceCounts[serviceType]) {
              serviceCounts[serviceType] += 1;
            } else {
              serviceCounts[serviceType] = 1;
            }
          });
        }
      });
    }
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
            { <AppWidgetSummary title="Forms " total={totalForms} color="info" /> }
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Profilings" total={totalProfiling} color="warning" /> }
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            { <AppWidgetSummary title="Reports" total={totalReports} color="error"/> }
          </Grid>




          <Grid item xs={12} md={8} lg={8}>
          <div className="first-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF'}}>
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
          <div className="second-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF'}}>
            <Typography variant="h5" style={{ textAlign: 'center' }}>Total Service Requests Per Room</Typography>
            <ResponsiveContainer width="100%" height={350}>
            <TableContainer style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table>
                <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                  <TableRow>
                    <th align='center' style={{  color: 'white'  }}>Room</th>
                    <th align="center" style={{ color: 'white'  }}>Total Requests</th>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {LocationRoom.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell align='center' component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.services}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </ResponsiveContainer>
          </div>
          </Grid>



          <Grid item xs={12} md={5} lg={5}>
          <div className="third-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}>
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
          <div className="fourth-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}>
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



          {/* <Grid item xs={12} md={6} lg={6}>
          <div className="fifth-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA' }}>
            <Typography variant="h5" style={{ textAlign: 'center' }}>Number of Computer Units Per Room</Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width={300} height={300} barSize={50} data={RoomNo}>
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
                  </Grid> */}


<Grid item xs={12} md={12} lg={12}>
        <div className="sixth-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}>
          <Typography variant="h5" style={{ textAlign: 'center' }}>Computer Inventory</Typography>
          <TextField 
            type="text"
            label="Search Computer Inventory..."
            variant='outlined'
            defaultValue="Small"
            size="small"
            style={{ marginBottom: '10px', marginLeft: '10px' }}
            value={searchTerm2}
            onChange={(e) => setSearchTerm2(e.target.value)}
            
          />


          <ResponsiveContainer width="100%" height={350}>
            <TableContainer component={Paper} style={{ maxHeight: '300px', overflowY: 'auto'}}>
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

      <Grid item xs={12} md={12} lg={12}>
        <div className="seventh-box" style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}>
          <Typography variant="h5" style={{ textAlign: 'center' }}>Room Equipment Inventory</Typography>
          <TextField
            type="text"
            label="Search Equipment Inventory..."
            variant='outlined'
            defaultValue="Small"
            size="small"
            value={searchTerm}
            style={{ marginBottom: '10px', marginLeft: '10px' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ResponsiveContainer width="100%" height={350}>
            <TableContainer component={Paper} style={{ maxHeight: '300px', overflowY: 'auto'}}>
              <Table style={{ border: '1px solid #ddd'  }}>
                <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                <TableRow>
                    <th style={{ textAlign: 'center', color: 'white' }}>Room Equipment</th>
                    <th style={{ textAlign: 'center', color: 'white' }}>Brand Description</th>
                    <th style={{ textAlign: 'center', color: 'white' }}>Model No.</th>
                    <th style={{ textAlign: 'center', color: 'white' }}>Serial No.</th>
                    <th style={{ textAlign: 'center', color: 'white' }}>Quantity</th>
                    <th style={{ textAlign: 'center', color: 'white' }}>Remarks</th>
                    <th style={{ textAlign: 'center', color: 'white' }}>Custodian</th>
                   
                    
                    
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

           

          


        </Grid>
      </Container>
      </Container>
    </>
  );
}

