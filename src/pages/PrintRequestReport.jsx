import React, { forwardRef, useEffect, useState } from 'react';
import { getFirestore, collectionGroup, getDocs, Timestamp, collection } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';
import { BarChart, PieChart, Pie, LineChart, Line, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // @mui
import {
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

const PrintRequestReport = forwardRef((props, ref) => {
  const [service, setService] = useState('');
  const [year, setYear] = useState('');
  const [custodian, setCustodian] = useState('');
  const [room, setRoom] = useState('');
  const [serviceRequestCount, setServiceRequestCount] = useState(0);
  const [itemRequestCount, setItemRequestCount] = useState(0);
  const [itemBorrowerCount, setItemBorrowerCount] = useState(0);
  const [data, setData] = useState([]);
  const [services, setServices] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableServicesForFilter, setAvailableServicesForFilter] = useState([]);
  const [availableBorrowerItem, setAvailableBorrowerItem] = useState([]);
  const [availableRequestItem, setAvailableRequestItem] = useState([]);
  const [availableRoom, setAvailableRoom] = useState([]);
  const [availableRoomForFilter, setAvailableRoomForFilter] = useState([]);
  const [availableYear, setAvailableYear] = useState([]);
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [availableFacultyForFilter, setAvailableFacultyForFilter] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const uniqueYearsArray = availableYear.filter((yearObj, index, array) => {
    const currentYear = yearObj.year;
    // Check if the current year is the first occurrence in the array
    return array.findIndex((item) => item.year === currentYear) === index;
  });
  uniqueYearsArray.sort((a, b) => a.year - b.year);

  useEffect(() => {
    fetchServiceRequest();
    fetchItemRequest();
    fetchItemBorrower();
  }, [year, service, custodian, room]);

  const fetchServiceRequest = async () => {
    try {
      const serviceRequestQuery = collectionGroup(db, 'SERVICE-REQUEST');

      const serviceRequestSnapshot = await getDocs(serviceRequestQuery);

      const serviceRequestData = [];
      const serviceData = [];
      const serviceDataForFilter = [];
      const availableService = [];
      const availableServiceForFilter = [];
      const availableRoom = [];
      const availableRoomForFilter = [];
      const availableFaculty = [];
      const availableFacultyForFilter = [];
      const yearService = [];
      const yearServiceData = [];

      serviceRequestSnapshot.forEach((doc) => {
        yearServiceData.push(doc.data());
        serviceDataForFilter.push(doc.data().Services);
        const yearValidation = new Date(doc.data().Date).getFullYear();
        const myArrayForServices = doc.data().Services;
        const myStringForCustodian = doc.data().FullName;

        if (
          (`${year}` === '' || `${year}` === `${yearValidation}`) &&
          (myArrayForServices.includes(service) || service === '') &&
          (myStringForCustodian.includes(custodian) || custodian === '') &&
          (`${room.toLowerCase()}` === `${doc.data().LocationRoom.toLowerCase()}` || `${room}` === '')
        ) {
          serviceRequestData.push(doc.data());
          serviceData.push(doc.data().Services);
        }
      });

      if (Array.isArray(yearServiceData)) {
        yearServiceData.forEach(({ Date: borrowDate }) => {
          const yearFormat = new Date(borrowDate).getFullYear();
          const existingItem = yearService.find((item) => item.year === yearFormat.toString());

          if (existingItem) {
            existingItem.total += 1;
          } else {
            yearService.push({
              year: yearFormat.toString(),
              total: 1,
            });
          }
        });
      }
      if (Array.isArray(yearServiceData)) {
        yearServiceData.forEach(({ LocationRoom }) => {
          const existingItem = availableRoomForFilter.find(
            (item) => item.room.toLowerCase() === LocationRoom.toLowerCase()
          );

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableRoomForFilter.push({
              room: LocationRoom,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
        availableRoomForFilter.sort((a, b) => a.room.localeCompare(b.room));
      }

      if (Array.isArray(yearServiceData)) {
        yearServiceData.forEach(({ FullName }) => {
          const existingItem = availableFacultyForFilter.find(
            (item) => item.name.toLowerCase() === FullName.toLowerCase()
          );

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableFacultyForFilter.push({
              name: FullName,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
        availableFacultyForFilter.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (Array.isArray(serviceDataForFilter)) {
        serviceDataForFilter.forEach((item) => {
          let services;

          if (Array.isArray(item)) {
            // Handle the case where the item is an array
            services = item;
          } else if (typeof item === 'object' && item.data) {
            // Handle the case where the item is an object with a 'data' property
            services = item.data;
          } else if (typeof item === 'string') {
            // Handle the case where the item is a string
            services = [item];
          } else {
            // Handle other cases, if any
            services = [];
          }

          services.forEach((service) => {
            const existingItem = availableServiceForFilter.find(
              (item) => item.service.toLowerCase() === service.toLowerCase()
            );

            if (existingItem) {
              existingItem.total += 1;
            } else {
              availableServiceForFilter.push({
                service,
                total: 1,
              });
            }
          });
        });
      }

      if (Array.isArray(serviceData)) {
        serviceData.forEach((item) => {
          let services;

          if (Array.isArray(item)) {
            // Handle the case where the item is an array
            services = item;
          } else if (typeof item === 'object' && item.data) {
            // Handle the case where the item is an object with a 'data' property
            services = item.data;
          } else if (typeof item === 'string') {
            // Handle the case where the item is a string
            services = [item];
          } else {
            // Handle other cases, if any
            services = [];
          }

          services.forEach((service) => {
            const existingItem = availableService.find((item) => item.service.toLowerCase() === service.toLowerCase());

            if (existingItem) {
              existingItem.total += 1; // Increment total if item already exists
            } else {
              availableService.push({
                service,
                total: 1, // Initialize total to 1 for new items
              });
            }
          });
        });
      }

      if (Array.isArray(serviceRequestData)) {
        serviceRequestData.forEach(({ LocationRoom }) => {
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
        availableRoom.sort((a, b) => a.room.localeCompare(b.room));
      }

      if (Array.isArray(serviceRequestData)) {
        serviceRequestData.forEach(({ FullName }) => {
          const existingItem = availableFaculty.find((item) => item.name.toLowerCase() === FullName.toLowerCase());

          if (existingItem) {
            existingItem.total += 1; // Increment total if item already exists
          } else {
            availableFaculty.push({
              name: FullName,
              total: 1, // Initialize total to 1 for new items
            });
          }
        });
        availableFaculty.sort((a, b) => a.name.localeCompare(b.name));
      }

      const formattedAvailableService = formatPieChartData(availableService);
      setAvailableYear((prevYear) => [...prevYear, ...yearService]);
      setPieChartData(formattedAvailableService);
      setAvailableFaculty(availableFaculty);
      setAvailableFacultyForFilter(availableFacultyForFilter);
      setAvailableRoom(availableRoom);
      setAvailableRoomForFilter(availableRoomForFilter);
      setAvailableServices(availableService);
      setAvailableServicesForFilter(availableServiceForFilter);
      setServices(yearServiceData);
      setServiceRequestCount(serviceRequestData.length);
    } catch (error) {
      console.error('Error fetching service requests data:', error);
    }
  };

  const fetchItemRequest = async () => {
    try {
      const ItemRequestQuery = collectionGroup(db, 'ITEM-REQUEST');

      const ItemRequestSnapshot = await getDocs(ItemRequestQuery);

      const ItemRequestData = [];
      const RequestItemData = [];
      const availableRequestItem = [];
      const yearItem = [];
      const yearItemData = [];

      ItemRequestSnapshot.forEach((doc) => {
        yearItemData.push(doc.data());
        const yearValidation = new Date(doc.data().Date).getFullYear();

        if (`${year}` === '' || `${year}` === `${yearValidation}`) {
          ItemRequestData.push(doc.data());
          RequestItemData.push(doc.data().Items);
        }
      });

      if (Array.isArray(yearItemData)) {
        yearItemData.forEach(({ Date: borrowDate }) => {
          const yearFormat = new Date(borrowDate).getFullYear();
          const existingItem = yearItem.find((item) => item.year === yearFormat.toString());

          if (existingItem) {
            existingItem.total += 1;
          } else {
            yearItem.push({
              year: yearFormat.toString(),
              total: 1,
            });
          }
        });
      }

      if (Array.isArray(RequestItemData)) {
        RequestItemData.forEach((item) => {
          let RequestItems;

          if (Array.isArray(item)) {
            // Handle the case where the item is an array
            RequestItems = item;
          } else if (typeof item === 'object' && item.data) {
            // Handle the case where the item is an object with a 'data' property
            RequestItems = item.data;
          } else if (typeof item === 'string') {
            // Handle the case where the item is a string
            RequestItems = [item];
          } else {
            // Handle other cases, if any
            RequestItems = [];
          }

          RequestItems.forEach((RequestItem) => {
            const existingItem = availableRequestItem.find(
              (item) => item.name.toLowerCase() === RequestItem.toLowerCase()
            );

            if (existingItem) {
              existingItem.items += 1; // Increment borrows if item already exists
            } else {
              availableRequestItem.push({
                name: RequestItem,
                items: 1, // Initialize borrows to 1 for new items
              });
            }
          });
        });
      }
      availableRequestItem.sort((a, b) => b.name - a.name);
      setAvailableYear((prevYear) => [...prevYear, ...yearItem]);
      setAvailableRequestItem(availableRequestItem);
      setItemRequestCount(ItemRequestData.length);
    } catch (error) {
      console.error('Error fetching service requests data:', error);
    }
  };

  const fetchItemBorrower = async () => {
    try {
      const ItemBorrowerQuery = collectionGroup(db, 'ITEM-BORROWERS');

      const ItemBorrowerSnapshot = await getDocs(ItemBorrowerQuery);

      const ItemBorrowerData = [];
      const borrowerItemData = [];
      const availableBorrowerItem = [];
      const yearBorrower = [];
      const yearBorrowerData = [];

      ItemBorrowerSnapshot.forEach((doc) => {
        yearBorrowerData.push(doc.data());
        const yearValidation = new Date(doc.data().Date).getFullYear();

        if (`${year}` === '' || `${year}` === `${yearValidation}`) {
          borrowerItemData.push(doc.data().Items);
          ItemBorrowerData.push(doc.data());
        }
      });

      if (Array.isArray(yearBorrowerData)) {
        yearBorrowerData.forEach(({ Date: borrowDate }) => {
          const yearFormat = new Date(borrowDate).getFullYear();
          const existingItem = yearBorrower.find((item) => item.year === yearFormat.toString());

          if (existingItem) {
            existingItem.total += 1;
          } else {
            yearBorrower.push({
              year: yearFormat.toString(),
              total: 1,
            });
          }
        });
      }

      if (Array.isArray(borrowerItemData)) {
        borrowerItemData.forEach((item) => {
          let borrowerItems;

          if (Array.isArray(item)) {
            // Handle the case where the item is an array
            borrowerItems = item;
          } else if (typeof item === 'object' && item.data) {
            // Handle the case where the item is an object with a 'data' property
            borrowerItems = item.data;
          } else if (typeof item === 'string') {
            // Handle the case where the item is a string
            borrowerItems = [item];
          } else {
            // Handle other cases, if any
            borrowerItems = [];
          }

          borrowerItems.forEach((borrowerItem) => {
            const existingItem = availableBorrowerItem.find(
              (item) => item.name.toLowerCase() === borrowerItem.toLowerCase()
            );

            if (existingItem) {
              existingItem.borrows += 1; // Increment borrows if item already exists
            } else {
              availableBorrowerItem.push({
                name: borrowerItem,
                borrows: 1, // Initialize borrows to 1 for new items
                color: '#ff6347', // You can set your desired color here
              });
            }
          });
        });
      }
      availableBorrowerItem.sort((a, b) => b.borrows - a.borrows);

      setAvailableBorrowerItem(availableBorrowerItem);
      setAvailableYear((prevYear) => [...prevYear, ...yearBorrower]);
      setItemBorrowerCount(ItemBorrowerData.length);
    } catch (error) {
      console.error('Error fetching service requests data:', error);
    }
  };

  const handleOnClickService = (event) => {
    setService(event.target.value);
  };

  const handleOnClickRoom = (event) => {
    setRoom(event.target.value);
  };
  const handleOnClickCustodian = (event) => {
    setCustodian(event.target.value);
  };
  const handleOnClickYear = (event) => {
    setYear(event.target.value);
  };

  const categoryColors = {
    Services: '#8884d8',
    Items: '#82ca9d',
    Borrows: '#ffc658',
  };

  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        const fetchDataForCollection = async (collectionRef, statusFilter) => {
          const snapshot = await getDocs(collectionRef);
          const filteredData = snapshot.docs
            .filter((doc) => statusFilter.includes(doc.data().status))
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
              status: doc.data().status.includes('PENDING') ? 'Pending' : doc.data().status,
            }));
          return filteredData;
        };

        // Fetch data from SERVICE-REQUEST
        const serviceRequestRef = collection(db, 'WP4-TECHNICIAN-DMS', 'FORMS', 'SERVICE-REQUEST');
        const servicesData = await fetchDataForCollection(serviceRequestRef, [
          'PENDING (Technician)',
          'PENDING (Dean)',
          'APPROVED',
          'REJECTED',
        ]);

        // Fetch data from ITEM-REQUEST
        const itemRequestRef = collection(db, 'WP4-TECHNICIAN-DMS', 'FORMS', 'ITEM-REQUEST');
        const itemsData = await fetchDataForCollection(itemRequestRef, [
          'PENDING (Technician)',
          'PENDING (Dean)',
          'APPROVED',
          'REJECTED',
        ]);

        // Fetch data from ITEM-BORROWERS
        const itemBorrowersRef = collection(db, 'WP4-TECHNICIAN-DMS', 'FORMS', 'ITEM-BORROWERS');
        const borrowsData = await fetchDataForCollection(itemBorrowersRef, [
          'PENDING (Technician)',
          'PENDING (Dean)',
          'APPROVED',
          'REJECTED',
        ]);

        // Organize the data based on status
        const newData = [
          {
            status: 'Approved',
            Services: servicesData.filter((item) => item.status === 'APPROVED').length,
            Items: itemsData.filter((item) => item.status === 'APPROVED').length,
            Borrows: borrowsData.filter((item) => item.status === 'APPROVED').length,
          },
          {
            status: 'Pending',
            Services: servicesData.filter((item) => item.status === 'Pending').length,
            Items: itemsData.filter((item) => item.status === 'Pending').length,
            Borrows: borrowsData.filter((item) => item.status === 'Pending').length,
          },
          {
            status: 'Declined',
            Services: servicesData.filter((item) => item.status === 'REJECTED').length,
            Items: itemsData.filter((item) => item.status === 'REJECTED').length,
            Borrows: borrowsData.filter((item) => item.status === 'REJECTED').length,
          },
        ];

        setData(newData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchDataFromFirestore();
  }, []);

  const getLineColor = (serviceType) => {
    const trimmedServiceType = serviceType.trim(); // Trim leading and trailing spaces

    switch (trimmedServiceType) {
      case 'Reformat':
        return '#8884d8'; // Blue
      case 'Repair':
        return '#82ca9d'; // Green
      case 'Inventory':
        return '#ffc658'; // Yellow
      case 'Application Installation':
        return '#ff8042'; // Orange
      case 'Network':
        return '#f44242'; // Red
      default:
        return '#000000'; // Default color
    }
  };

  useEffect(() => {
    const allowedServiceTypes = ['Reformat', 'Repair', 'Inventory', 'Application Installation', 'Network'];

    const formattedData = services
      .filter((service) => service.Date) // Filter out entries with null dates
      .map((service) => ({
        date:
          service.Date instanceof Timestamp
            ? service.Date.toDate()
            : service.Date // Assuming `service.Date` is already a JavaScript Date
            ? new Date(service.Date)
            : null,
        services: Array.isArray(service.Services)
          ? service.Services.flat()
              .map((type) => type.trim().replace(/,$/, '')) // Trim and remove trailing commas
              .filter((type) => allowedServiceTypes.includes(type)) // Filter only allowed service types
          : [],
      }));

    // Initialize groupedData object
    const groupedData = {};

    formattedData.forEach((entry) => {
      const { date, services } = entry;

      if (!date) return;

      const year = date.getFullYear();

      if (!groupedData[year]) {
        groupedData[year] = {};
      }

      services.forEach((serviceType) => {
        if (!groupedData[year][serviceType]) {
          groupedData[year][serviceType] = 0;
        }

        groupedData[year][serviceType] += 1;
      });
    });

    // Filter unique services based on allowedServiceTypes
    const uniqueServices = Array.from(new Set(formattedData.flatMap((entry) => entry.services))).filter((serviceType) =>
      allowedServiceTypes.includes(serviceType)
    );

    const chartDataArray = uniqueServices.map((serviceType) => ({
      serviceType: serviceType.trim(),
      color: getLineColor(serviceType.trim()),
      data: Object.keys(groupedData).map((year) => ({
        year: parseInt(year, 10),
        count: groupedData[year][serviceType] || 0,
      })),
    }));

    setChartData(chartDataArray);
  }, [services]);

  const formatPieChartData = (availableServiceData) => {
    const colors = ['#E07E5A', '#E04D00', '#B58716', '#FFAD84', '#E08000', '#D0A85B', '#FF9800'];
    const formattedData = availableServiceData.map((item, index) => ({
      name: item.service,
      value: item.total,
      fill: colors[index],
    }));

    return formattedData;
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
                    {serviceRequestCount}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    SERVICE REQUESTS
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {itemBorrowerCount}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    BORROW REQUESTS
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {itemRequestCount}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    ITEM REQUESTS
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3}>
                <div className="flex" style={{ backgroundColor: 'white', height: '150px' }}>
                  <Typography variant="h1" style={{ textAlign: 'center', fontWeight: 800, color: '#ff5500' }}>
                    {itemBorrowerCount + itemRequestCount + serviceRequestCount}
                  </Typography>
                  <Typography variant="subtitle1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    OVERALL TOTAL REQUESTS
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={3} lg={3}>
            <div style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}>
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Requests Status
              </Typography>

              <BarChart width={200} height={250} barSize={30} data={data}>
                <XAxis dataKey="status" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Services" stackId="status" fill={categoryColors.Services} name="Services" />
                <Bar dataKey="Items" stackId="status" fill={categoryColors.Items} name="Items" />
                <Bar dataKey="Borrows" stackId="status" fill={categoryColors.Borrows} name="Borrows" />
              </BarChart>
            </div>
          </Grid>

          <Grid item xs={12} sm={2} md={2}>
            <div>
              <select
                onChange={handleOnClickService}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={service}
              >
                <option value="">Service Type</option>

                {availableServicesForFilter.map(({ service }, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <select
                onChange={handleOnClickYear}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                value={year}
              >
                <option value="">Year</option>
                {uniqueYearsArray.map(({ year }, index) => (
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
                {availableFacultyForFilter.map(({ name }, index) => (
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
                {availableRoomForFilter.map(({ room }, index) => (
                  <option key={index} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
          </Grid>

          <Grid item xs={4} md={4} lg={4}>
            <div
              className="first-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Breakdown of Services Requested
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie dataKey="value" data={pieChartData} outerRadius={100} fill="#8884d8" />
                  <Legend verticalAlign="bottom" height={120} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Grid>
          <Grid item xs={4} sm={4} md={4}>
            <div
              className="second-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Total Service Requests Per Room
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th align="center" style={{ color: 'white' }}>
                          Room
                        </th>
                        <th align="center" style={{ color: 'white' }}>
                          Total Requests
                        </th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableRoom.map(({ room, total }, index) => (
                        <TableRow key={index}>
                          <TableCell align="center" component="th" scope="row">
                            {room}
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
          <Grid item xs={4} sm={4} md={4}>
            <div
              className="second-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Service Requested by Faculties
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table>
                    <TableHead style={{ position: 'sticky', top: '0', zIndex: '1', background: '#FF8042' }}>
                      <TableRow>
                        <th align="center" style={{ color: 'white' }}>
                          Faculty Name
                        </th>
                        <th align="center" style={{ color: 'white' }}>
                          Service Requested
                        </th>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableFaculty.map(({ name, total }, index) => (
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

          <Grid item xs={6} md={6} lg={6}>
            <div
              className="third-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Breakdown of Borrowed Items
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart width={200} height={300} barSize={50} data={availableBorrowerItem}>
                  <XAxis dataKey="name" interval={0} />
                  <Tooltip />
                  <Bar dataKey="borrows" fill="#FF8042" name="Borrowed Items" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>

          <Grid item xs={6} md={6} lg={6}>
            <div
              className="fourth-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Breakdown of Item Requests
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart width={270} height={300} barSize={50} data={availableRequestItem}>
                  <XAxis dataKey="name" interval={0} />
                  <Tooltip />
                  <Bar dataKey="items" fill="#FF8042" name="Items Requested" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <div
              className="third-box"
              style={{ borderRadius: '10px', border: '1px solid #D8D9DA', background: '#FFFFFF' }}
            >
              <Typography variant="h5" style={{ textAlign: 'center' }}>
                Services Request Per Year
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData.flatMap((entry) => entry.data)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} />

                  <Tooltip />
                  <Legend height={40} />

                  {chartData.map((chart) => (
                    <Line
                      key={chart.serviceType}
                      type="monotone"
                      dataKey="count"
                      stroke={chart.color}
                      name={chart.serviceType}
                      data={chart.data}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
});

export default PrintRequestReport;
