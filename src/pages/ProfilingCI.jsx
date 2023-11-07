import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
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
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Backdrop,
  Snackbar,
  TableHead,
  Modal,
  CircularProgress,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
// components
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products'


// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

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
const formsDocRef = doc(mainCollectionRef, 'PROFILING');

// Add to subcollection
const CondemnedItemsCollectionRef = collection(formsDocRef, 'CONDEMNED-ITEMS');

// Access ARCHIVES document under main collection
const archivesRef = doc(mainCollectionRef, 'ARCHIVES');

const archivesCollectionRef = collection(archivesRef, 'ARCHIVES-FORMS');

// Second declaration
const storage = getStorage(firebaseApp);

// ----------------------------------------------------------------------

//  Clear the whole Form function
export default function FormsIRF() {
  // -------------------------testing for the dynamic input fields ---------------------------------------------

  const [inputField, setInputField] = useState([
    {
        ItemDescription: '',
        Quantity: '',
        IcsNo: '',
        EndUser: '',
        remarks: '',
    },
  ]);

  const handleChangeInput = (index, event) => {
    console.log(index, event.target.name);
    const values = [...inputField];
    values[index][event.target.name] = event.target.value;
    setInputField(values);
  };

  const handleAddField = () => {
    setInputField([
      ...inputField,
      {
        ItemDescription: '',
        Quantity: '',
        IcsNo: '',
        EndUser: '',
        remarks: '',
      },
    ]);
  };

  const handleRemoveField = (index) => {
    const values = [...inputField];
    values.splice(index, 1);
    setInputField(values);
  };

  const handleEditChangeInput = (index, event, fieldName) => {
    setEditData((prevData) => {
      const newInputField = [...prevData.inputField];
      newInputField[index][fieldName] = event.target.value;
      return {
        ...prevData,
        inputField: newInputField,
      };
    });
  };

  const handleEditAddField = () => {
    const newField = {
      ItemDescription: '',
        Quantity: '',
        IcsNo: '',
        EndUser: '',
        remarks: '',
    };
  
    // Modify editData to add a new field
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputField: [...prevEditData.inputField, newField],
    }));
  
    console.log('After adding field:', editData);
  };

  const handleEditRemoveField = async (index) => {
    try {
      const docRef = doc(CondemnedItemsCollectionRef, formData.id); // Use the document ID for updating
  
      // Create a copy of the editData
      const editDataCopy = { ...editData };
  
      // Remove the specific item from the inputField array in Firestore
      editDataCopy.inputField.splice(index, 1);
  
      // Update Firestore document with the modified inputField
      await updateDoc(docRef, editDataCopy); // Update the document in Firestore
  
      // Update the local state (formData) with the modified inputField
      setFormData((prevData) => ({
        ...prevData,
        inputField: editDataCopy.inputField,
      }));
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleRemoveAllField = () => {
    const values = [...inputField];
        // Remove all fields by splicing from the end of the array to the beginning
    for (let i = values.length - 1; i >= 0; i-=1) {
      values.splice(i, 1);
    }
    // Update the inputField state with the modified array
    setInputField(values);
  };
  // ----------------------------------------------------------------------

  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const initialFormData = {
    RRSPNum: '',
    Date: '',
    EntityName: '',
    inputField: [],
    ReturnedBy: '',
    DateReturnedBy: '',
    ReceivedBy: '',
    DateReceivedBy: '',
    fileInput: '',
    fileURL: '',
  };

  const clearForm = () => {
    handleRemoveAllField();
    setFormData(initialFormData);
  };

  // Handle change function
  const [formData, setFormData] = useState({
    RRSPNum: '',
    Date: '',
    EntityName: '',
    inputField: [],
    ReturnedBy: '',
    DateReturnedBy: '',
    ReceivedBy: '',
    DateReceivedBy: '',
    fileURL: '',
  });

  // Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(CondemnedItemsCollectionRef);
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
    const docSnapshot = await getDoc(doc(CondemnedItemsCollectionRef, newDocumentName));

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
    RRSPNum,
    Date,
    EntityName,
    ReturnedBy,
    DateReturnedBy,
    ReceivedBy,
    DateReceivedBy,
    fileURL,
    } = formData;

    try {
      // Use the current document name when adding a new document
      const documentName = await incrementDocumentName();

      const docRef = doc(CondemnedItemsCollectionRef, documentName);

      const docData = {
        RRSPNum,
        Date,
        EntityName,
        ReturnedBy,
        DateReturnedBy,
        ReceivedBy,
        DateReceivedBy,
        fileURL: fileURL || '',
        inputField,
        archived: false, // Include the 'archived' field and set it to false for new documents
        originalLocation: 'CONDEMNED-ITEMS', // Include the 'originalLocation' field
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
  };

  //  This one is for Search bar
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterByName = (event) => {
    setPage(0);
    setSearchQuery(event.target.value);
  };

  const filteredData = fetchedData.filter((item) => {
    const fieldsToSearchIn = ['RSSPNum', 'Date', 'EntityName', 'ReturnedBy', 'ReceivedBy'];

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
        RRSPNum: data.RRSPNum || '',
        Date: data.Date || '',
        EntityName: data.EntityName || '',
        inputField: data.inputField || '',
        ReturnedBy: data.ReturnedBy || '',
        DateReturnedBy: data.DateReturnedBy || '',
        ReceivedBy: data.ReceivedBy || '',
        DateReceivedBy: data.DateReceivedBy || '',
        fileURL: data.fileURL || '',
        id: data.id,

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
      const docRef = doc(CondemnedItemsCollectionRef, formData.id); // Use the document ID for updating

      // Update the editData object with the new file URL
      editData.fileURL = formData.fileURL;
      console.log('Data to be sent to Firestore:', formData);

    if (formData.id) {
      // Update the existing document with editData
      await updateDoc(docRef, editData);
    } else {
      // Create a new document with all fields from editData
      await setDoc(docRef, editData);
    }
  
      handleEditClose();
      setSnackbarOpen1(true);
    } catch (error) {
      console.error('Error updating/adding data in Firestore: ', error);
    }
  };

  // This one is still for Edit button but for the file upload part

  const handleFileEditUpload = async (file) => {
    const docRef = doc(CondemnedItemsCollectionRef, formData.id); // Use the document ID for updating
    try {
      if (file) {
        const storageRef = ref(storage, `documents/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update the Firestore document here using 'updateDoc' or another method
        await updateDoc(docRef, { fileURL: downloadURL });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // This one is for the Delete button
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const handleConfirmDeleteWithoutArchive = async () => {
    try {
      if (documentToDelete) {
        const sourceDocumentRef = doc(CondemnedItemsCollectionRef, documentToDelete);
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        await deleteDoc(doc(CondemnedItemsCollectionRef, documentToDelete));

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
        const sourceDocumentRef = doc(CondemnedItemsCollectionRef, documentToDelete);
        // Set the 'originalLocation' field to the current collection and update the Archive as true
        await updateDoc(sourceDocumentRef, { archived: true, originalLocation: 'CONDEMNED-ITEMS' });
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
        await deleteDoc(doc(CondemnedItemsCollectionRef, documentToDelete));

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
        return deleteDoc(doc(CondemnedItemsCollectionRef, itemId));
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

  // This one is for idk lol
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const [openFilter, setOpenFilter] = useState(false);
 
  const handleOpenFilter = () => {
       setOpenFilter(true);
     };
   
     const handleCloseFilter = () => {
       setOpenFilter(false);
     };
 


  return (
    <>
      <Helmet>
        <title> Condemned Items </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h2" style={{ color: '#ff5500' }}>
            Condemned Items
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
              <Button onClick={handleClickOpen} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
                New User
              </Button>
            </div>

            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth="xl"
              
            >
              {/* <div style={{ display: 'flex', flexDirection: 'row' }}> */}
              {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width:'1000px'}}> */}
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
                CONDEMNED ITEMS
              </Typography>
              <Typography
                        variant="h6"
                        // sx={{ mb: 5 }}
                        style={{
                          alignSelf: 'center',
                          // color: '#ff5500',
                          // margin: 'auto',
                          // fontSize: '40px',
                          // fontWeight: 'bold',
                          // marginTop: '10px',
                        }}
                      >
                      This is to acknowledged Receipt of Returned Semi-Expandable Property *RSSP*
                        </Typography>

              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1}>

                  <Grid item xs={6} md={7}>
                      <TextField
                        type="text"
                        name="EntityName"
                        variant="outlined"
                        label="Entity Name"
                        required
                        size="small"
                        value={formData.EntityName || ''}
                        onChange={(e) => setFormData({ ...formData, EntityName: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      {/* <Item>xs=6 md=4</Item> */}
                    </Grid>
                    
                    <Grid item xs={8} md={2}>
                      <TextField
                        type="date"
                        name="Date"
                        variant="outlined"
                        required
                        size="small"
                        value={formData.Date || ''}
                        onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="RRSPNum"
                        variant="outlined"
                        label="RRSP Number"
                        size="small"
                        required
                        value={formData.RRSPNum || ''}
                        onChange={(e) => setFormData({ ...formData, RRSPNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    
                    <Grid item xs={4} md={4}>
                      <TextField
                        type="text"
                        name="ReturnedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Returned By"
                        value={formData.ReturnedBy || ''}
                        onChange={(e) => setFormData({ ...formData, ReturnedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <TextField
                        type="date"
                        name="DateReturnedBy"
                        variant="outlined"
                        required
                        size="small"
                        value={formData.DateReturnedBy || ''}
                        onChange={(e) => setFormData({ ...formData, DateReturnedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={4} md={4}>
                      <TextField
                        type="text"
                        name="ReceivedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Received By "
                        value={formData.ReceivedBy || ''}
                        onChange={(e) => setFormData({ ...formData, ReceivedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3} md={2}>
                      <TextField
                        type="date"
                        name="DateReceivedBy"
                        variant="outlined"
                        required
                        size="small"
                        value={formData.DateReceivedBy || ''}
                        onChange={(e) => setFormData({ ...formData, DateReceivedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                   
                  </Grid>
                  <br/>


                  {/* // ------------------------------ testing the dynamic form---------------------------------------- */}
                  <div>
                    
                  <Grid container spacing={0} direction="row" justifyContent="space-between" alignItems="center">
                    <Grid>
                      <Typography
                        variant="h6"
                        sx={{ mb: 5 }}
                        style={{
                          alignSelf: 'center',
                          color: '#ff5500',
                          margin: 'auto',
                          // fontSize: '40px',
                          fontWeight: 'bold',
                          marginTop: '10px',
                          marginBottom: '10px',
                        }}
                      >
                        Items
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleAddField();
                        }}
                        variant="contained"
                      >
                        Add Row
                      </Button>
                    </Grid>
                  </Grid>
                    
                    

                    {inputField.map((inputField, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={14} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}

                          <Grid item xs={4}>
                            <TextField
                              name="ItemDescription"
                              label="Item Description"
                              variant="outlined"
                              fullWidth
                              
                              size="small"
                              value={inputField.ItemDescription}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the second column */}
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputField.Quantity}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                          </Grid>

                          {/* Second Column */}
                          

                          {/* Third Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="IcsNo"
                              label="Ics No"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputField.IcsNo}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={3}>
                            <TextField
                              name="EndUser"
                              label="End User"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputField.EndUser}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputField.remarks}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the seventh column */}
                          </Grid>

                          {/* Eighth Column */}
                          <Grid item xs={1}>
                            {/* <Button
                              onClick={() => {
                                handleAddField();
                              }}
                            >
                              Add
                            </Button> */}
                            <Button
                              onClick={() => {
                                handleRemoveField(index);
                              }}
                            >
                              Remove
                            </Button>
                            {/* Content for the eighth column */}
                          </Grid>
                          
                        </Grid>
                        <br/>
                      </div>
                      
                    ))}
                  </div>
                  <Grid container spacing={1}>
                   
                      <Grid item xs={10}>
                        <TextField
                          type="file"
                          variant="outlined"
                          size="small"
                          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                          sx={{ width: '100%' }}
                        />
                      </Grid>
                    </Grid>
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
              {/* </div> */}
              {/* </div> */}
            </Dialog>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              message="The Document was created successfully!"
            />
          </div>
        </Stack>
      </Container>

      <Container>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox checked={selectAll} onChange={handleSelectAll} color="primary" />
                  </TableCell>
                  <TableCell>RRSP No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Entity Name</TableCell>
                  <TableCell>ReturnedBy</TableCell>
                  <TableCell>ReceivedBy</TableCell>
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
                    <TableCell>{item.RRSPNum}</TableCell>
                    <TableCell>{item.Date}</TableCell>
                    <TableCell>{item.EntityName}</TableCell>
                    <TableCell>{item.ReturnedBy}</TableCell>
                    <TableCell>{item.ReceivedBy}</TableCell>
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
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xl">
          
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
                CONDEMNED ITEMS REPORT
              </Typography>
              <Typography
                        variant="h6"
                        // sx={{ mb: 5 }}
                        style={{
                          alignSelf: 'center',
                          // color: '#ff5500',
                          // margin: 'auto',
                          // fontSize: '40px',
                          // fontWeight: 'bold',
                          // marginTop: '10px',
                        }}
                      >
                      This is to acknowledged Receipt of Returned Semi-Expandable Property *RSSP*
                        </Typography>

              <DialogContent>
                <form onSubmit={handleEditSubmit}>
                  
                <Grid container spacing={1}>
                  <Grid item xs={6} md={7}>
                      <TextField
                        type="text"
                        name="EntityName"
                        variant="outlined"
                        label="Entity Name"
                        required
                        size="small"
                        value={editData ? editData.EntityName : ''}
                        onChange={(e) => setEditData({ ...editData, EntityName: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      {/* <Item>xs=6 md=4</Item> */}
                    </Grid>
                    
                 
                    <Grid item xs={8} md={2}>
                      <TextField
                        type="date"
                        name="Date"
                        variant="outlined"
                        required
                        size="small"
                        value={editData ? editData.Date : ''}
                        onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="RRSPNum"
                        variant="outlined"
                        label="RRSP Number"
                        size="small"
                        required
                        value={editData ? editData.RRSPNum : ''}
                        onChange={(e) => setEditData({ ...editData, RRSPNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    
                    <Grid item xs={4} md={4}>
                      <TextField
                        type="text"
                        name="ReturnedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Returned By"
                        value={editData ? editData.ReturnedBy : ''}
                        onChange={(e) => setEditData({ ...editData, ReturnedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <TextField
                        type="date"
                        name="DateReturnedBy"
                        variant="outlined"
                        required
                        size="small"
                        value={editData ? editData.DateReturnedBy : ''}
                        onChange={(e) => setEditData({ ...editData, DateReturnedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={4} md={4}>
                      <TextField
                        type="text"
                        name="ReceivedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Received By "
                        value={editData ? editData.ReceivedBy : ''}
                        onChange={(e) => setEditData({ ...editData, ReceivedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3} md={2}>
                      <TextField
                        type="date"
                        name="DateReceivedBy"
                        variant="outlined"
                        required
                        size="small"
                        value={editData ? editData.DateReceivedBy : ''}
                        onChange={(e) => setEditData({ ...editData, DateReceivedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                   
                  </Grid>
                  <br/>
                   {/* // ------------------------------ testing the dynamic form---------------------------------------- */}
                   <div>
                    
                    <Grid container spacing={0} direction="row" justifyContent="space-between" alignItems="center">
                      <Grid>
                        <Typography
                          variant="h6"
                          sx={{ mb: 5 }}
                          style={{
                            alignSelf: 'center',
                            color: '#ff5500',
                            margin: 'auto',
                            // fontSize: '40px',
                            fontWeight: 'bold',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          Items
                        </Typography>
                      </Grid>
                      <Grid>
                        <Button
                          onClick={() => {
                            handleEditAddField();
                          }}
                          variant="contained"
                        >
                          Add Row
                        </Button>
                      </Grid>
                    </Grid>
                      
                    {editData && editData.inputField.map((input, index) => (
                        <div key={index}>
                          <Grid container spacing={1} columns={14} direction="row" justifyContent="space-between" alignItems="center">
                            {/* First Column */}
  
                            <Grid item xs={4}>
                              <TextField
                                name="ItemDescription"
                                label="Item Description"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={
                                  editData
                                ? editData.inputField[index]?.ItemDescription
                                : input?.ItemDescription}
                                onChange={(event) => handleEditChangeInput(index, event, 'ItemDescription')}
                              />
                              {/* Content for the second column */}
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                                type="text"
                                name="Quantity"
                                label="Quantity"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={
                                  editData
                                ? editData.inputField[index]?.Quantity
                                : input?.Quantity}
                                onChange={(event) => handleEditChangeInput(index, event, 'Quantity')}
                              />
                            </Grid>
  
                            {/* Second Column */}
                            
  
                            {/* Third Column */}
                            <Grid item xs={2}>
                              <TextField
                                name="IcsNo"
                                label="Ics No"
                                multiline
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={
                                  editData
                                ? editData.inputField[index]?.IcsNo
                                : input?.IcsNo}
                                onChange={(event) => handleEditChangeInput(index, event, 'IcsNo')}
                              />
                              {/* Content for the third column */}
                            </Grid>
  
                            {/* Fourth Column */}
                            <Grid item xs={3}>
                              <TextField
                                name="EndUser"
                                label="End User"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={
                                  editData
                                ? editData.inputField[index]?.EndUser
                                : input?.EndUser}
                                onChange={(event) => handleEditChangeInput(index, event, 'EndUser')}
                              />
                              {/* Content for the fourth column */}
                            </Grid>
  
                            {/* Fifth Column */}
  
                            {/* Seventh Column */}
                            <Grid item xs={2}>
                              <TextField
                                name="remarks"
                                label="Remarks"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={
                                  editData
                                ? editData.inputField[index]?.remarks
                                : input?.remarks}
                                onChange={(event) => handleEditChangeInput(index, event, 'remarks')}
                              />
                              {/* Content for the seventh column */}
                            </Grid>
  
                            {/* Eighth Column */}
                            <Grid item xs={1}>
                              {/* <Button
                                onClick={() => {
                                  handleAddField();
                                }}
                              >
                                Add
                              </Button> */}
                              <Button
                                onClick={() => {
                                  handleEditRemoveField(index);
                                }}
                              >
                                Remove
                              </Button>
                              {/* Content for the eighth column */}
                            </Grid>
                            
                          </Grid>
                          <br/>
                        </div>
                        
                      ))}
                    </div>
                    <Grid container spacing={1}>
                    <Typography variant="subtitle1">File:</Typography>
                        <Grid item xs={10}>
                          <TextField
                            type="file"
                            variant="outlined"
                            size="small"
                            accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                            sx={{ width: '100%' }}
                          />
                        </Grid>
                      </Grid>
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
                {/* </div> */}
                {/* </div> */}
              </Dialog>
        <Snackbar
          open={snackbarOpen1}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen1(false)}
          message="The Document was edited successfully!"
        />
        <Snackbar
          open={snackbarOpenDelete}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpenDelete(false)}
          message="The Document was deleted successfully!"
        />

        <Snackbar
          open={snackbarOpenArchive}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpenArchive(false)}
          message="The Document was archived successfully!"
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
        <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="xl">
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
                CONDEMNED ITEMS REPORT
              </Typography>
              <DialogContent>
              <Grid container spacing={1}>
                  <Grid item xs={6} md={7}>
                      <TextField
                        type="text"
                        name="EntityName"
                        variant="outlined"
                        label="Entity Name"
                        required
                        size="small"
                        value={viewItem ? viewItem.EntityName : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      {/* <Item>xs=6 md=4</Item> */}
                    </Grid>
                    
                 
                    <Grid item xs={8} md={2}>
                      <TextField
                        type="date"
                        name="Date"
                        variant="outlined"
                        required
                        size="small"
                        label="Date"
                        value={viewItem ? viewItem.Date : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        name="RRSPNum"
                        variant="outlined"
                        label="RRSP Number"
                        size="small"
                        required
                        value={viewItem ? viewItem.RRSPNum : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    
                    <Grid item xs={4} md={4}>
                      <TextField
                        type="text"
                        name="ReturnedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Returned By"
                        value={viewItem ? viewItem.ReturnedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={3} md={2}>
                      <TextField
                        type="date"
                        name="DateReturnedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Date Returned "
                        value={viewItem ? viewItem.DateReturnedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={4} md={4}>
                      <TextField
                        type="text"
                        name="ReceivedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Received By "
                        value={viewItem ? viewItem.ReceivedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>


                    <Grid item xs={3} md={2}>
                      <TextField
                        type="date"
                        name="DateReceivedBy"
                        variant="outlined"
                        required
                        size="small"
                        label="Date Received "
                        value={viewItem ? viewItem.DateReceivedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      <br />
                    </Grid>
                  </Grid>
  
 {/* // ------------------------------ testing the dynamic form---------------------------------------- */}
 <div>
                    
                    <Grid container spacing={0} direction="row" justifyContent="space-between" alignItems="center">
                      <Grid>
                        <Typography
                          variant="h6"
                          sx={{ mb: 5 }}
                          style={{
                            alignSelf: 'center',
                            color: '#ff5500',
                            margin: 'auto',
                            // fontSize: '40px',
                            fontWeight: 'bold',
                            marginTop: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          Items
                        </Typography>
                      </Grid>
                      
                    </Grid>
                      
                    {formData.inputField.map((input, index) => (
                        <div key={index}>
                          <Grid container spacing={1} columns={14} direction="row" justifyContent="space-between" alignItems="center">
                            {/* First Column */}
  
                            <Grid item xs={4}>
                              <TextField
                                name="ItemDescription"
                                label="Item Description"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={
                                  viewItem ? viewItem.inputField[index]?.ItemDescription : input?.ItemDescription // Use optional chaining to handle potential undefined values
                                }
                                disabled
                              />
                              {/* Content for the second column */}
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                                type="text"
                                name="Quantity"
                                label="Quantity"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={
                                  viewItem ? viewItem.inputField[index]?.Quantity : input?.Quantity // Use optional chaining to handle potential undefined values
                                }
                                disabled
                              />
                            </Grid>
  
                            {/* Second Column */}
                            
  
                            {/* Third Column */}
                            <Grid item xs={2}>
                              <TextField
                                name="IcsNo"
                                label="Ics No"
                                multiline
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={
                                  viewItem ? viewItem.inputField[index]?.IcsNo : input?.IcsNo // Use optional chaining to handle potential undefined values
                                }
                                disabled
                              />
                              {/* Content for the third column */}
                            </Grid>
  
                            {/* Fourth Column */}
                            <Grid item xs={3}>
                              <TextField
                                name="EndUser"
                                label="End User"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={
                                  viewItem ? viewItem.inputField[index]?.EndUser : input?.EndUser // Use optional chaining to handle potential undefined values
                                }
                                disabled
                              />
                              {/* Content for the fourth column */}
                            </Grid>
  
                            {/* Fifth Column */}
  
                            {/* Seventh Column */}
                            <Grid item xs={2}>
                              <TextField
                                name="remarks"
                                label="Remarks"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={
                                  viewItem ? viewItem.inputField[index]?.remarks : input?.remarks // Use optional chaining to handle potential undefined values
                                }
                                disabled
                              />
                              {/* Content for the seventh column */}
                            </Grid>
  
                            {/* Eighth Column */}
                            <Grid item xs={1}>
                              {/* <Button
                                onClick={() => {
                                  handleAddField();
                                }}
                              >
                                Add
                              </Button> */}
                             
                              {/* Content for the eighth column */}
                            </Grid>
                            
                          </Grid>
                          <br/>
                        </div>
                        
                      ))}
                    </div>
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
                </DialogContent>
                <DialogActions>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
                    <Button variant="contained" onClick={handleViewClose} sx={{ marginRight: '5px', marginLeft: '5px' }}>
                     Cancel
                    </Button>
                  
                  </div>
                </DialogActions>
                {/* </div> */}
                {/* </div> */}
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
