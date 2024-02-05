import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  getDocs,
  where,
  updateDoc,
  deleteDoc,
  addDoc,
  getDoc,
  documentId,
  setDoc,
} from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
// @mui
import {
  Card,
  Table,
  Stack,
  Box,
  Paper,
  Avatar,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  LinearProgress,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Backdrop,
  Snackbar,
  TableHead,
  CircularProgress,
  TextField,
  Select,
} from '@mui/material';

// components
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import LoadingSpinner from './LoadingSpinner';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products'
// mock
import POSTS from '../../_mock/blog';
import PRODUCTS from '../../_mock/products';


const firebaseConfig = {
  apiKey: 'AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc',
  authDomain: 'wp4-technician-dms.firebaseapp.com',
  projectId: 'wp4-technician-dms',
  storageBucket: 'wp4-technician-dms.appspot.com',
  messagingSenderId: '1065436189229',
  appId: '1:1065436189229:web:88094d3d71b15a0ab29ea4',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore db
const db = getFirestore(firebaseApp);

// Access main collection
const mainCollectionRef = collection(db, 'WP4-TECHNICIAN-DMS');

// Access FORMS document under main collection
const formsDocRef = doc(mainCollectionRef, 'FORMS');

// Add to subcollection
const serviceRequestCollectionRef = collection(formsDocRef, 'SERVICE-REQUEST');

// Access ARCHIVES document under main collection
const archivesRef = doc(mainCollectionRef, 'ARCHIVES');

const archivesCollectionRef = collection(archivesRef, 'ARCHIVES-FORMS');

// Second declaration
const storage = getStorage(firebaseApp);
// const isNotFound = !filteredData.length && !!handleFilterByName;
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

//  Clear the whole Form function
export default function UserPage() {

    const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);



  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const initialFormData = {
    ControlNum: '',
    Date: '',
    FullName: '',
    LocationRoom: '',
    Requisitioner: '',
    Services: [],
    otherServices: '',
    Remarks: '',
    fileInput: '',
    fileURL: '',
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };

  // Handle change function
  const [formData, setFormData] = useState({
    ControlNum: null,
    Date: '',
    FullName: '',
    LocationRoom: null,
    Requisitioner: '',
    Services: [], // If this is an array, it can be empty initially
    otherServices: '',
    Remarks: '',
    fileURL: '',
  });

  // Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(serviceRequestCollectionRef);
      const dataFromFirestore = [];

      querySnapshot.forEach((doc) => {
        // Handle each document here
        const data = doc.data();
        data.id = doc.id; // Add the ID field
        dataFromFirestore.push(data);
      });

      setFetchedData(dataFromFirestore);
    } catch (error) {
      console.error('Error fetching data from Firestore: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const currentDocumentName = 'SRF-00'; // Initialize it with your default document name

  // Function to increment the document name

  const incrementDocumentName = async (nextNumber = 0) => {
    const newDocumentName = `SRF-${nextNumber.toString().padStart(2, '0')}`;

    // Check if the document with the new name already exists
    const docSnapshot = await getDoc(doc(serviceRequestCollectionRef, newDocumentName));

    if (docSnapshot.exists()) {
      // The document with the new name exists, so increment and try again
      return incrementDocumentName(nextNumber + 1);
    }

    // The document with the new name doesn't exist, so we can use it
    return newDocumentName; // Return the generated document name
  };

  // function for Adding new documents
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      ControlNum,
      Date,
      FullName,
      LocationRoom,
      Requisitioner,
      Services = [],
      otherServices,
      Remarks,
      fileURL,
    } = formData;

    try {
      // Use the current document name when adding a new document
      const documentName = await incrementDocumentName();

      const docRef = doc(serviceRequestCollectionRef, documentName);

      const docData = {
        ControlNum,
        Date,
        FullName,
        LocationRoom,
        Requisitioner,
        Services,
        otherServices,
        Remarks,
        fileURL: fileURL || '',
        archived: false, // Include the 'archived' field and set it to false for new documents
        originalLocation: 'SERVICE-REQUEST', // Include the 'originalLocation' field
      };

      await setDoc(docRef, docData);

      // Create a new data object that includes the custom ID
      const newData = { ...docData, id: documentName };

      // Update the state with the new data, adding it to the table
      setFetchedData([...fetchedData, newData]);

      setOpen(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      alert('Input cannot be incomplete');
    }
    setFormData(initialFormData);
  };

  //  This one is for Search bar
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterByName = (event) => {
    setPage(0);
    setSearchQuery(event.target.value);
  };

  const filteredData = fetchedData.filter((item) => {
    const fieldsToSearchIn = ['ControlNum', 'Date', 'FullName', 'LocationRoom', 'Requisitioner'];

    const servicesMatch = (item, searchQuery) => {
      return (
        item.Services &&
        Array.isArray(item.Services) &&
        item.Services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    };

    return fieldsToSearchIn.some((field) => {
      if (item[field] && typeof item[field] === 'string') {
        return item[field].toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (field === 'Services' && Array.isArray(item[field])) {
        return servicesMatch(item, searchQuery);
      }
      return false;
    });
  });

  // This one is for the Edit button
  const [editData, setEditData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditOpen = (data) => {
    if (data && data.id) {
      // Populate the form fields with existing data
      setFormData({
        ...formData,
        ControlNum: data.ControlNum || '',
        Date: data.Date || '',
        FullName: data.FullName || '',
        LocationRoom: data.LocationRoom || '',
        Requisitioner: data.Requisitioner || '',
        Services: data.Services || '',
        otherServices: data.otherServices || '',
        fileURL: data.fileURL || '',
        id: data.id, // Set the document ID here
      });
      setEditData(data);
      setEditOpen(true);
      handleMenuClose();
    }
  };

  const handleEditClose = () => {
    setEditData(null);
    setEditOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      // Include the checkbox values in editData
      const updatedEditData = {
        ...editData,
        Services: formData.Services, // Update Services with checkbox values
        // Include other properties here
      };

      const docRef = doc(serviceRequestCollectionRef, formData.id);

      // Update the editData object with the new file URL
      updatedEditData.fileURL = formData.fileURL;

      await updateDoc(docRef, updatedEditData);
      handleEditClose();
      setSnackbarOpen1(true);
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  // This one is for the Delete button
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const handleConfirmDeleteWithoutArchive = async () => {
    try {
      if (documentToDelete) {
        const sourceDocumentRef = doc(serviceRequestCollectionRef, documentToDelete);
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        await deleteDoc(doc(serviceRequestCollectionRef, documentToDelete));

        // Update the UI by removing the deleted row
        setFetchedData((prevData) => prevData.filter((item) => item.id !== documentToDelete));

        setSnackbarOpenDelete(true); // Show a success message

        // setDocumentToDelete(documentId);
        // setArchiveDialogOpen(true);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      // Close the confirmation dialog
      setArchiveDialogOpen(false);
      // Reset the documentToDelete state
      setDocumentToDelete(null);
    }
  };

  const handleDelete = (documentId) => {
    // Show a confirmation dialog before deleting
    setArchiveDialogOpen(true);
    setDocumentToDelete(documentId);
    handleMenuClose();
  };

  // This one is for Archives

  const [snackbarOpenArchive, setSnackbarOpenArchive] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      if (documentToDelete) {
        const sourceDocumentRef = doc(serviceRequestCollectionRef, documentToDelete);
        // Set the 'originalLocation' field to the current collection and update the Archive as true
        await updateDoc(sourceDocumentRef, { archived: true, originalLocation: 'SERVICE-REQUEST' });
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        // Fetch existing document names from the Archives collection
        const archivesQuerySnapshot = await getDocs(archivesCollectionRef);
        const existingDocumentNames = archivesQuerySnapshot.docs.map((doc) => doc.id);

        // Find the highest number and increment it by 1
        let nextNumber = 0;
        existingDocumentNames.forEach((docName) => {
          const match = docName.match(/^SRF-(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!Number.isNaN(num) && num >= nextNumber) {
              nextNumber = num + 1;
            }
          }
        });

        // Generate the new document name
        const newDocumentName = `SRF-${nextNumber.toString().padStart(2, '0')}`;

        // Add the document to the "Archives" collection with the new document name
        await setDoc(doc(archivesCollectionRef, newDocumentName), sourceDocumentData);

        // Delete the original document from the Service Request collection
        await deleteDoc(doc(serviceRequestCollectionRef, documentToDelete));

        // Update the UI by removing the archived document
        setFetchedData((prevData) => prevData.filter((item) => item.id !== documentToDelete));

        // Show a success message
        setSnackbarOpenArchive(true);
      }
    } catch (error) {
      console.error('Error archiving document:', error);
    } finally {
      // Close the confirmation dialog
      setArchiveDialogOpen(false);
      // Reset the documentToDelete state
      setDocumentToDelete(null);
    }
  };

  // This one is for Uploading files

  const handleFileUpload = async (file) => {
    try {
      const allowedFileTypes = [
        'application/pdf', // PDF
        'image/png', // PNG images
        'image/jpeg', // JPEG images
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (XLSX)
        'application/msword', // MS Word (DOC)
        'application/vnd.ms-excel', // MS Excel (XLS)
        'text/plain', // Plain text
        // Add more MIME types for other file formats as needed
      ];

      if (!allowedFileTypes.includes(file.type)) {
        console.error('Unsupported file type. Please upload a valid document.');
        return;
      }

      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Now you have the downloadURL, you can store it in Firestore or your form data
      // You can add it to the `formData` object or create a separate field for it
      setFormData((prevFormData) => ({
        ...prevFormData,
        fileURL: downloadURL, // Change this field name to match your data structure
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // This one is for Pagination

  const [page, setPage] = useState(0); // Add these state variables for pagination
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    console.log('Page changed to:', newPage); // Log the new page number
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log('Rows per page changed to:', newRowsPerPage); // Log the new rows per page value
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page when changing rows per page
  };
  
  const [snackbarOpenDelete, setSnackbarOpenDelete] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  // This one is for menu button
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMenuOpen = (event, item) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  };

  // This one is for checkboxes
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  const handleSelection = (documentId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(documentId)) {
        return prevSelectedItems.filter((id) => id !== documentId);
      }
      return [...prevSelectedItems, documentId];
    });
  };

  const handleSelectAll = () => {
    if (bulkDeleteMode) {
      // If bulk delete mode is already active, clear the selected items
      setSelectedItems([]);
    } else {
      // If bulk delete mode is not active, select all items
      const allDocumentIds = fetchedData.map((item) => item.id);
      setSelectedItems(allDocumentIds);
    }
    setBulkDeleteMode(!bulkDeleteMode);
    setSelectAll(!selectAll); // Toggle the selectAll state
  };

  // Checkbox bulk deletion

  const handleTrashIconClick = () => {
    // Check if any items are selected
    if (selectedItems.length === 0) {
      // If no items are selected, show an error message or handle it as you prefer
      console.error('No items selected for deletion.');
      return;
    }

    // Open a confirmation dialog before deleting
    // You can use a state variable to manage the dialog's open state
    setDeleteConfirmationDialogOpen(true);
  };

  // Add a state variable for managing the confirmation dialog
  // Function to handle the confirmation and actually delete the items
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);

  // Function to handle the confirmation and actually delete the items
  const handleConfirmDeleteAll = async () => {
    try {
      // Create an array of promises to delete each selected item
      const deletePromises = selectedItems.map(async (itemId) => {
        return deleteDoc(doc(serviceRequestCollectionRef, itemId));
      });

      // Use Promise.all to await all the delete operations
      await Promise.all(deletePromises);

      // Update the UI by removing the deleted rows
      setFetchedData((prevData) => {
        return prevData.filter((item) => !selectedItems.includes(item.id));
      });

      // Clear the selected items
      setSelectedItems([]);
      setBulkDeleteMode(false);

      // Close the confirmation dialog
      setDeleteConfirmationDialogOpen(false);

      // Show a success message
      setSnackbarOpenDelete(true);
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  };

  // This one is for view button
  const [viewItem, setViewItem] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const handleViewOpen = (item) => {
    setViewItem(item);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewItem(null);
    setViewOpen(false);
  };
    const [openFilter, setOpenFilter] = useState(false);
  
    const handleOpenFilter = () => {
      setOpenFilter(true);
    };
  
    const handleCloseFilter = () => {
      setOpenFilter(false);
    };
  
  

  // This one is for idk lol
  const [open, setOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [snackbarOpen1, setSnackbarOpen1] = useState(false);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [isOtherChecked, setIsOtherChecked] = useState(false);

  const handleServiceChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked && value !== ' Others:') {
      // Add the new value to the array
      setFormData((prevData) => ({
        ...prevData,
        Services: [...prevData.Services, value],
      }));
    } else if (!isChecked && value !== ' Others:') {
      // Remove the selected service from the array
      setFormData((prevData) => ({
        ...prevData,
        Services: prevData.Services.filter((service) => service !== value),
      }));
    }
  };

  // This is for the edit button on checkboxes input (services)

  return (
    <>
      <Helmet>
        <title> Service Request Form </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h2" style={{ color: '#ff5500' }}>
            Service Request Form
          </Typography>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <TextField
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleFilterByName}
                sx={{ width: '%' }}
              />
            </div>

            <div>
              <Button
                onClick={fetchAllDocuments}
                variant="contained"
                size="large"
                style={{
                  margin: '0 8px', // Add margin for spacing
                  display: 'flex',
                  justifyContent: 'center',
                   // Set the background color to transparent
                   // Remove the box shadow
                }}
              >
                 {/* {isLoading ? <LoadingSpinner /> : 'Refresh'} */}
                Refresh
              </Button>
            </div>
          </div>

          <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
            {selectedItems.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleTrashIconClick}>
                  <Iconify icon="material-symbols:delete-forever-outline-rounded" color="red" width={42} height={42} />
                </IconButton>
                <Typography variant="subtitle1" style={{ paddingRight: '16px' }}>
                  {selectedItems.length} items selected
                </Typography>
              </div>
            )}

{/* <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack> */}
        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {/* <BlogPostsSort options={SORT_OPTIONS}  style={{ marginLeft: 'auto'}}/>
            <Filter  style={{ marginLeft: 'auto'}}/> */}
              <Button onClick={handleClickOpen} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
                New Document
              </Button>
            </div>

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
                SERVICE REQUEST
              </Typography>
              <DialogContent>
                <form onSubmit={handleSubmit}>
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
                        name="ControlNum"
                        variant="outlined"
                        label="Control Number"
                        placeholder='ControlNum'
                        value={formData.ControlNum || ''}
                        fullWidth
                        onChange={(e) => setFormData({ ...formData, ControlNum: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <TextField
                        type="date"
                        name="Date"
                        placeholder='Date'
                        fullWidth
                        value={formData.Date || ''}
                        onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={16}>
                      <TextField
                        type="text"
                        name="FullName"
                        fullWidth
                        placeholder='FullName'
                        variant="outlined"
                        label="Faculty Name"
                        value={formData.FullName || ''}
                        onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={16}>
                      <TextField
                        type="text"
                        name="Requisitioner"
                        label="Requisitioner"
                        placeholder='Requisitioner'
                        fullWidth
                        value={formData.Requisitioner || ''}
                        onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
                        // sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <fieldset>
                        <legend name="Services">SERVICES:</legend>
                        <Checkbox
                          value=" Application Installation,"
                          checked={formData.Services.includes(' Application Installation,')}
                          onChange={handleServiceChange}
                        />
                        Application Installation
                        <br />
                        <Checkbox
                          value=" Network,"
                          checked={formData.Services.includes(' Network,')}
                          onChange={handleServiceChange}
                        />
                        Network
                        <br />
                        <Checkbox
                          value=" Inventory,"
                          checked={formData.Services.includes(' Inventory,')}
                          onChange={handleServiceChange}
                        />
                        Inventory
                        <br />
                        <Checkbox
                          value=" Reformat,"
                          checked={formData.Services.includes(' Reformat,')}
                          onChange={handleServiceChange}
                        />
                        Reformat
                        <br />
                        <Checkbox
                          value=" Repair,"
                          checked={formData.Services.includes(' Repair,')}
                          onChange={handleServiceChange}
                        />
                        Repair
                        <br />
                        <div style={{ marginLeft: '42px' }}>
                          Others:
                          <br />
                          <input
                            type="text"
                            name="Others:"
                            value={formData.otherServices || ''}
                            onChange={(e) => setFormData({ ...formData, otherServices: e.target.value })}
                          />
                        </div>
                      </fieldset>
                    </Grid>

                    <Grid item xs={8} spacing={1}>
                      <Grid container spacing={3} column={6}>
                        <Grid item xs={12}>
                          <TextField
                            type="text"
                            name="LocationRoom"
                            label="Location/Room"
                            fullWidth
                            placeholder='LocationRoom'
                            value={formData.LocationRoom || ''}
                            onChange={(e) => setFormData({ ...formData, LocationRoom: e.target.value })}
                            // sx={{ width: '100%', marginBottom: '10px' }}
                          />
                          <br />
                        </Grid>
                          <Grid item xs={12}>
                            <TextField
                              type="text"
                              name="Remarks"
                              variant="outlined"
                              label="Remarks"
                              placeholder='Remarks'
                              multiline
                              value={formData.Remarks || ''}
                              onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                              // minRows={5}
                              fullWidth
                              // maxRows={80}
                              // marginBottom="10px"
                            />
                            <br />
                          </Grid>
                        
                      <Grid item xs={12}>
                        { <Typography variant="subtitle1">Document Upload:</Typography> }
                      <TextField
                          type="file"
                          fullWidth
                          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                          sx={{ width: '100%' }}
                          
                        />
                      </Grid>
                    </Grid>
                    </Grid>
                  </Grid>

                  <br />
                </form>
              </DialogContent>
              <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
                  <Button variant="contained" onClick={clearForm} sx={{ marginRight: '5px', marginLeft: '5px' }}>
                    Clear
                  </Button>
                  <Button variant="contained" onClick={handleClose} sx={{ marginRight: '5px', marginLeft: '5px' }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
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
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              message="The Service Request Document was created successfully!"
            />
          </div>
        </Stack>
      </Container>

      <Container>
        {isLoading ? (
          // <CircularProgress />

           <Box  sx={{ width: '100%' }}>
            {/* <CircularProgressWithLabel value={progress} /> */}
            <LinearProgressWithLabel value={progress} />
            {/* <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} /> */}
         </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox checked={selectAll} onChange={handleSelectAll} color="primary" />
                  </TableCell>
                  <TableCell>Control Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Location/Room</TableCell>
                  <TableCell>Requesitioner</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Other Service</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Menu</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {displayedData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox checked={selectedItems.includes(item.id)} onChange={() => handleSelection(item.id)} />
                    </TableCell>
                    <TableCell>{item.ControlNum}</TableCell>
                    <TableCell>{item.Date}</TableCell>
                    <TableCell>{item.FullName}</TableCell>
                    <TableCell>{item.LocationRoom}</TableCell>
                    <TableCell>{item.Requisitioner}</TableCell>
                    <TableCell>{item.Services}</TableCell>
                    <TableCell>{item.otherServices}</TableCell>
                    <TableCell>
                      {item.fileURL ? (
                        // Render a clickable link to download the file
                        <Link to={item.fileURL} target="_blank" download>
                          Download
                        </Link>
                      ) : (
                        // Display "No File" if there's no file URL
                        'No File'
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton aria-label="menu" onClick={(event) => handleMenuOpen(event, item)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* {isNotFound && (
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
                )} */}



            </Table>
          </TableContainer>
        )}
        <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
          <DialogTitle>Remove Document</DialogTitle>
          <DialogContent>Do you want to delete or archive this document?</DialogContent>
          <DialogActions>
            <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDeleteWithoutArchive} color="error">
              Delete
            </Button>
            <Button onClick={handleConfirmDelete} style={{ color: 'orange' }}>
              Archive
            </Button>
          </DialogActions>
        </Dialog>
        <TablePagination
          rowsPerPageOptions={[4, 10, 25]}
          component="div"
          count={filteredData.length} // Make sure this reflects the total number of rows
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {/* This is the dialog for the Edit button */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                SERVICE REQUEST
              </Typography>
              <DialogContent>
                <form onSubmit={handleEditSubmit}>
                  {/* Fields to edit */}
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
                        name="ControlNum"
                        label="Control Number"
                        value={editData ? editData.ControlNum : ''}
                        onChange={(e) => setEditData({ ...editData, ControlNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <TextField
                        type="date"
                        name="Date"
                        label="Date"
                        value={editData ? editData.Date : ''}
                        onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={16}>
                      <TextField
                        type="text"
                        name="FullName"
                        label="Faculty Name"
                        value={editData ? editData.FullName : ''}
                        onChange={(e) => setEditData({ ...editData, FullName: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={16}>
                      <TextField
                        type="text"
                        name="Requisitioner"
                        label="Requisitioner"
                        value={editData ? editData.Requisitioner : ''}
                        onChange={(e) => setEditData({ ...editData, Requisitioner: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      <br />
                    </Grid>

                    <Grid item xs={8}>
                      <fieldset>
                        <legend name="Services">SERVICES:</legend>
                        <Checkbox
                          value=" Application Installation,"
                          checked={formData.Services.includes(' Application Installation,')}
                          onChange={handleServiceChange}
                        />
                        Application Installation
                        <br />
                        <Checkbox
                          value=" Network,"
                          checked={formData.Services.includes(' Network,')}
                          onChange={handleServiceChange}
                        />
                        Network
                        <br />
                        <Checkbox
                          value=" Inventory,"
                          checked={formData.Services.includes(' Inventory,')}
                          onChange={handleServiceChange}
                        />
                        Inventory
                        <br />
                        <Checkbox
                          value=" Reformat,"
                          checked={formData.Services.includes(' Reformat,')}
                          onChange={handleServiceChange}
                        />
                        Reformat
                        <br />
                        <Checkbox
                          value=" Repair,"
                          checked={formData.Services.includes(' Repair,')}
                          onChange={handleServiceChange}
                        />
                        Repair
                        <br />
                        <div style={{ marginLeft: '42px' }}>
                          Others:
                          <input
                            type="text"
                            value={editData ? editData.otherServices : ''}
                            onChange={(e) => setEditData({ ...editData, otherServices: e.target.value })}
                          />
                        </div>
                      </fieldset>
                      <br />
                    </Grid>

                    <Grid item xs={8} spacing={1}>
                      <Grid>
                        <TextField
                          type="text"
                          name="LocationRoom"
                          label="Location/Room"
                          value={editData ? editData.LocationRoom : ''}
                          onChange={(e) => setEditData({ ...editData, LocationRoom: e.target.value })}
                          sx={{ width: '100%', marginBottom: '10px' }}
                        />
                        <br />
                        <br />
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle1">Remarks:</Typography>
                        <TextField
                          type="text"
                          name="Remarks"
                          label="Remarks"
                          value={editData ? editData.Remarks : ''}
                          onChange={(e) => setEditData({ ...editData, Remarks: e.target.value })}
                          sx={{ width: '100%', marginBottom: '10px' }}
                        />
                        <br />
                        <br />
                      </Grid>
                      <Grid>
                        <Typography variant="subtitle1">File:</Typography>
                        <TextField
                          type="file"
                          name="fileInput"
                          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                          inputProps={{
                            className:
                              'w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <br />
                </form>
              </DialogContent>
              <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
                  <Button variant="contained" onClick={handleEditClose} sx={{ marginRight: '5px', marginLeft: '5px' }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleEditSubmit}
                    type="submit"
                    sx={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    Save
                  </Button>
                </div>
              </DialogActions>
            </div>
          </div>
        </Dialog>
        <Snackbar
          open={snackbarOpen1}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen1(false)}
          message="The Service Request Document was edited successfully!"
        />
        <Snackbar
          open={snackbarOpenDelete}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpenDelete(false)}
          message="The Service Request Document was deleted successfully!"
        />

        <Snackbar
          open={snackbarOpenArchive}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpenArchive(false)}
          message="The Service Request Document was archived successfully!"
        />
        <Popover
          open={Boolean(menuAnchorEl)}
          anchorEl={menuAnchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleViewOpen(selectedItem)}>View</MenuItem>
          <MenuItem onClick={() => handleEditOpen(selectedItem)}>Edit</MenuItem>
          <MenuItem onClick={() => handleDelete(selectedItem.id)}>Remove</MenuItem>
        </Popover>

        {/* Dialog for View button */}
        <Dialog open={viewOpen} onClose={handleViewClose}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                SERVICE REQUEST
              </Typography>
              <DialogContent>
                <Grid
                  container
                  spacing={2}
                  columns={16}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={8}>
                    <Typography variant="subtitle1">Control Number:</Typography>
                    <TextField
                      type="text"
                      name="ControlNum"
                      
                      value={viewItem ? viewItem.ControlNum : ''}
                      disabled
                      sx={{ width: '100%', marginBottom: '10px' }}
                    />
                  </Grid>

                  <Grid item xs={8}>
                    <Typography variant="subtitle1">Date:</Typography>
                    <TextField
                      type="date"
                      name="Date"
                      
                      value={viewItem ? viewItem.Date : ''}
                      disabled
                      sx={{ width: '100%', marginBottom: '10px' }}
                    />
                  </Grid>

                  <Grid item xs={16}>
                    <Typography variant="subtitle1">Faculty Name:</Typography>
                    <TextField
                      type="text"
                      name="FullName"
                      
                      value={viewItem ? viewItem.FullName : ''}
                      disabled
                      sx={{ width: '100%', marginBottom: '10px' }}
                    />
                  </Grid>

                  <Grid item xs={16}>
                    <Typography variant="subtitle1">Requisitioner:</Typography>
                    <TextField
                      type="text"
                      name="Requisitioner"
                    
                      value={viewItem ? viewItem.Requisitioner : ''}
                      disabled
                      sx={{ width: '100%', marginBottom: '10px' }}
                    />
                  </Grid>

                  <Grid item xs={8}>
                    <fieldset>
                      <legend name="Services">SERVICES:</legend>
                      <Checkbox
                        value=" Application Installation,"
                        checked={viewItem && viewItem.Services.includes(' Application Installation,')}
                        disabled
                      />
                      Application Installation
                      <br />
                      <Checkbox
                        value=" Network,"
                        checked={viewItem && viewItem.Services.includes(' Network,')}
                        disabled
                      />
                      Network
                      <br />
                      <Checkbox
                        value=" Inventory,"
                        checked={viewItem && viewItem.Services.includes(' Inventory,')}
                        disabled
                      />
                      Inventory
                      <br />
                      <Checkbox
                        value=" Reformat,"
                        checked={viewItem && viewItem.Services.includes(' Reformat,')}
                        disabled
                      />
                      Reformat
                      <br />
                      <Checkbox
                        value=" Repair,"
                        checked={viewItem && viewItem.Services.includes(' Repair,')}
                        disabled
                      />
                      Repair
                      <br />
                      <div style={{ marginLeft: '42px' }}>
                        Others:
                        <input type="text" value={viewItem ? viewItem.otherServices : ''} disabled />
                      </div>
                    </fieldset>
                  </Grid>

                  <Grid item xs={8} spacing={1}>
                    <Grid>
                      <Typography variant="subtitle1">Location/Room:</Typography>
                      <TextField
                        type="text"
                        name="LocationRoom"
                        
                        value={viewItem ? viewItem.LocationRoom : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      <br />
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle1">Remarks:</Typography>
                      <TextField
                        type="text"
                        name="Remarks"
                        
                        value={viewItem ? viewItem.Remarks : ''}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      <br />
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle1">File:</Typography>
                      {viewItem && viewItem.fileURL ? (
                        <a href={viewItem.fileURL} target="_blank" rel="noreferrer noopener" download>
                          View / Download File
                        </a>
                      ) : (
                        'No File'
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <br />
                <br />
              </DialogContent>
            </div>
          </div>
          <DialogActions>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
              <Button variant="contained" onClick={handleViewClose} sx={{ marginRight: '5px', marginLeft: '5px' }}>
                Close
              </Button>
            </div>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteConfirmationDialogOpen} onClose={() => setDeleteConfirmationDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete {selectedItems.length} items?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDeleteAll} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
