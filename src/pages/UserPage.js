import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  Select,
  TableBody,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableHead,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {



    const [data, setData] = useState([]);
    const columns = React.useMemo(
      () => [
        // { Header: 'ID', accessor: 'id' },
        { Header: 'Username', accessor: 'username' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'User Type', accessor: 'userType' },
        { Header: 'Status', accessor: 'status' },
        // Add more columns as needed
      ],
      []
    );
  
    useEffect(() => {
      const fetchData = async () => {
        const db = getFirestore();
        const myCollection = collection(db, 'WP4-pendingUsers'); // Replace 'your-collection' with your actual collection name
  
        const querySnapshot = await getDocs(myCollection);
        const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        setData(newData);
      };
  
      fetchData();
    }, []);
  
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // const [open, setOpen] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const navigate = useNavigate();

  // const handlebtnClick = () => {
  //   navigate('/dashboard', { replace: true });
  // };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  

  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h2"  style={{ color: '#ff5500' }}>
            Users
          </Typography>
          <Button onClick={handleClickOpen} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button>
        </Stack>
        
        <Dialog open={open} onClose={handleClose} maxWidth="md">
              {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> */}
              <Typography
                variant="h3"
                sx={{ mb: 5 }}
                style={{
                  alignSelf: 'center',
                  color: '#ff5500',
                  margin: 'auto',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  marginTop: '10px',
                }}
              >
                Add User Account
              </Typography>
              <DialogContent>
                <form>
                  <Grid
                    container
                    spacing={2}
                    columns={16}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={8}>
                      <TextField
                        type="text"
                        name="Full Name"
                        variant="outlined"
                        label="Full Name"
                        // value={formData.ControlNum || ''}
                        fullWidth
                        // onChange={(e) => setFormData({ ...formData, ControlNum: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <TextField
                        type="text"
                        name="username"
                        label="Username"
                        fullWidth
                        // value={formData.Date || ''}
                        // onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={16}>
                      <TextField
                        type="text"
                        name="email"
                        label="Email Address"
                        fullWidth
                        variant="outlined"
                        
                        // value={formData.FullName || ''}
                        // onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={16}>
                      <TextField
                        type="text"
                        name="password"
                        label="Password"
                        fullWidth
                        // value={formData.Requisitioner || ''}
                        // onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                    <Typography variant="h6" style={{ color: '#ff5500' }}>
                      Account Type
                    </Typography>
                    <Select
                        type="text"
                        name="password"
                        fullWidth
                        defaultValue={"Select"}
                        // value={formData.Requisitioner || ''}
                        // onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      >
                        <MenuItem value={"Dean"}>Dean</MenuItem>
                        <MenuItem value={"Technician"}>Technician</MenuItem>
                        {/* <MenuItem value={30}>Thirty</MenuItem> */}
                      </Select>
                    </Grid>
                    

                    
                  </Grid>

                  <br />
                </form>
              </DialogContent>
              <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
                  <Button variant="contained"  sx={{ marginRight: '5px', marginLeft: '5px' }}>
                    Clear
                  </Button>
                  <Button variant="contained" onClick={handleClose} sx={{ marginRight: '5px', marginLeft: '5px' }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    // onClick={handleSubmit}
                    type="submit"
                    sx={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    Create
                  </Button>
                </div>
              </DialogActions>
              {/* </div>
              </div> */}
            </Dialog>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
              <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.Header}>{column.Header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.accessor}>{row[column.accessor]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
                
                

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover> */}
    </>
  );
}
