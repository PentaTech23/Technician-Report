import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';

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

// import db from './db';



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
  const mainCollectionRef = collection(db, 'SERVICE-REQUEST');

  const archivesRef = doc(mainCollectionRef, 'ARCHIVES');

const archivesCollectionRef = collection(archivesRef, 'ARCHIVES-FORMS');

// Second declaration
const storage = getStorage(firebaseApp);

function SFRinput() {
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
      const querySnapshot = await getDocs(mainCollectionRef);
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
    const docSnapshot = await getDoc(doc(mainCollectionRef, newDocumentName));

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
    //   Date,
      FullName,
      LocationRoom,
      Requisitioner,
    //   Services = [],
    //   otherServices,
      Remarks,
    //   fileURL,
    } = formData;

    try {
      // Use the current document name when adding a new document
      const documentName = await incrementDocumentName();

      const docRef = doc(mainCollectionRef, documentName);

      const docData = {
        ControlNum,
        // Date,
        FullName,
        LocationRoom,
        Requisitioner,
        // Services,
        // otherServices,
        Remarks,
        // fileURL: fileURL || '',
        // archived: false, // Include the 'archived' field and set it to false for new documents
        // originalLocation: 'SERVICE-REQUEST', // Include the 'originalLocation' field
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
        // Date: data.Date || '',
        FullName: data.FullName || '',
        LocationRoom: data.LocationRoom || '',
        Requisitioner: data.Requisitioner || '',
        // Services: data.Services || '',
        // otherServices: data.otherServices || '',
        // fileURL: data.fileURL || '',
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

      const docRef = doc(mainCollectionRef, formData.id);

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
        const sourceDocumentRef = doc(mainCollectionRef, documentToDelete);
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        await deleteDoc(doc(mainCollectionRef, documentToDelete));

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
        const sourceDocumentRef = doc(mainCollectionRef, documentToDelete);
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
        await deleteDoc(doc(mainCollectionRef, documentToDelete));

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
        return deleteDoc(doc(mainCollectionRef, itemId));
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

  return (
    <div>
      {/* <Dialog open={open} onClose={handleClose} maxWidth="md"> */}
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
        {/* <DialogContent> */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} columns={16} direction="row" justifyContent="space-between" alignItems="center">
              <Grid item xs={8}>
                <TextField
                  type="text"
                  name="ControlNum"
                  variant="outlined"
                  label='ControlNum'
                  placeholder="ControlNum"
                  data-testid="ControlNum"
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
                  label="Date"
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
                  label="FullName"
                  placeholder="FullName"
                  variant="outlined"
                  data-testid="FullName"
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
                  placeholder="Requisitioner"
                  data-testid="Requisitioner"
                  fullWidth
                  value={formData.Requisitioner || ''}
                  onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
                  // sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>

              <Grid item xs={8}>
                {/* <fieldset>
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
                </fieldset> */}
              </Grid>

              <Grid item xs={8}>
                <Grid container spacing={3} column={6}>
                  <Grid item xs={12}>
                    <TextField
                      type="text"
                      name="LocationRoom"
                      label="Location/Room"
                      placeholder="Location/Room"
                      fullWidth
                      data-testid="LocationRoom"
                      
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
                      placeholder="Remarks"
                      data-testid="Remarks"
                      
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
                    {/* {<Typography variant="subtitle1">Document Upload:</Typography>}
                    <TextField
                      type="file"
                      fullWidth
                      accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      sx={{ width: '100%' }}
                    /> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <br />
          </form>
        {/* </DialogContent> */}
        {/* <DialogActions> */}
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
              data-testid="submitBtn"
              type="submit"
              sx={{ marginRight: '5px', marginLeft: '5px' }}
            >
              Create
            </Button>
            <Button
                    variant="contained"
                    onClick={handleEditSubmit}
                    type="submit"
                    data-testid="editBtn"
                    sx={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    Edit
                  </Button>
          </div>
        {/* </DialogActions> */}
        {/* </div>
    </div> */}
      {/* </Dialog> */}
      {/* <Dialog data-testid="deleteModal" open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
          <DialogTitle>Remove Document</DialogTitle>
          <DialogContent>Do you want to delete or archive this document?</DialogContent>
          <DialogActions> */}
            <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
            <Button data-testid="deleteButton" onClick={handleConfirmDeleteWithoutArchive} color="error">
              Delete
            </Button>
            <Button data-testid="archiveButton" onClick={handleConfirmDelete} style={{ color: 'orange' }}>
              Archive
            </Button>
          {/* </DialogActions>
        </Dialog> */}
    </div>
    
  );
  
}

export default SFRinput;
