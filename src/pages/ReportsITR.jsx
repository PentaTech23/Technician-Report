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
const formsDocRef = doc(mainCollectionRef, 'REPORTS');

// Add to subcollection
const InspectionReportCollectionRef = collection(formsDocRef, 'INVENTORY-TRANSFER-REPORT');

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
      DateAcquired: '',
      ItemNum: '',
      ICSNum: '',
      Description: '',
      Amount: '',
      Condition: '',
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
        DateAcquired: '',
        ItemNum: '',
        ICSNum: '',
        Description: '',
        Amount: '',
        Condition: '',
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
      DateAcquired: '',
      ItemNum: '',
      ICSNum: '',
      Description: '',
      Amount: '',
      Condition: '',
    };
  
    // Modify editData to add a new field
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputField: [...prevEditData.inputField, newField],
    }));
  
    console.log('After adding field:', editData);
  };


  const handleEditTest = () => {
    console.log(inputField);
  };

  const handleEditRemoveField = async (index) => {
    try {
      const docRef = doc(InspectionReportCollectionRef, formData.id); // Use the document ID for updating
  
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
    for (let i = values.length - 1; i >= 0; i -= 1) {
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
    EntityName: '',
    FundCluster: '',
    ITRNum: '',
    TransferType: '',

    ApprovedBy: '',
    ApprovedByDestination: '',
    ApprovedByDate: '',

    ReleasedBy: '',
    ReleasedByDestination: '',
    ReleasedByDate: '',

    ReceivedBy: '',
    ReceivedByDestination: '',
    ReceivedByDate: '',

    inputField: [],
    fileInput: '',
    fileURL: '',
  };

  const clearForm = () => {
    // Remove all fields by calling handleRemoveField for each field in inputField
    handleRemoveAllField();
    // After removing all fields, set the entire form data to its initial state
    setFormData(initialFormData);
  };

  // Handle change function
  const [formData, setFormData] = useState({
    EntityName: '',
    FundCluster: '',
    ITRNum: '',
    TransferType: '',
    
    ApprovedBy: '',
    ApprovedByDestination: '',
    ApprovedByDate: '',

    ReleasedBy: '',
    ReleasedByDestination: '',
    ReleasedByDate: '',

    ReceivedBy: '',
    ReceivedByDestination: '',
    ReceivedByDate: '',

    inputField: [],
    fileURL: '',
  });

  // Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(InspectionReportCollectionRef);
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
    const docSnapshot = await getDoc(doc(InspectionReportCollectionRef, newDocumentName));

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
      EntityName,
      FundCluster,
      ITRNum,
      TransferType,

      ApprovedBy,
      ApprovedByDestination,
      ApprovedByDate,

      ReleasedBy,
      ReleasedByDestination,
      ReleasedByDate,

      ReceivedBy,
      ReceivedByDestination,
      ReceivedByDate,

      fileURL, 
      
    } = formData;
  

    try {
      // Use the current document name when adding a new document
      const documentName = await incrementDocumentName();

      const docRef = doc(InspectionReportCollectionRef, documentName);

      const docData = {

        EntityName,
        FundCluster,
        ITRNum,
        TransferType,
  
        ApprovedBy,
        ApprovedByDestination,
        ApprovedByDate,
  
        ReleasedBy,
        ReleasedByDestination,
        ReleasedByDate,
  
        ReceivedBy,
        ReceivedByDestination,
        ReceivedByDate,

        fileURL: fileURL || '',
        inputField, // Add the dynamic input fields here
        archived: false,
        originalLocation: 'PROPERTY-TRANSFER-REPORT',
      };

      await setDoc(docRef, docData);

      const newData = { ...docData, id: documentName };

      setFetchedData([...fetchedData, newData]);

      setOpen(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      alert('Input cannot be incomplete');
    }
    clearForm();
  };

  //  This one is for Search bar
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterByName = (event) => {
    setPage(0);
    setSearchQuery(event.target.value);
  };

  const filteredData = fetchedData.filter((item) => {
    const fieldsToSearchIn = ['EntityName', 'FundCluster', 'ITRNum', 'ApprovedBy', 'ReleasedBy', 'ReceivedBy'];

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
       
        EntityName: data.EntityName || '',
        FundCluster: data.FundCluster || '',
        ITRNum: data.PTRNum || '',
        TransferType: data.TransferType || '',
  
        ApprovedBy: data.ApprovedBy || '',
        ApprovedByDestination: data.ApprovedByDestination || '',
        ApprovedByDate: data.ApprovedByDate || '',
  
        ReleasedBy: data.ReleasedBy || '',
        ReleasedByDestination: data.ReleasedByDestination || '',
        ReleasedByDate: data.ReleasedByDate || '',
  
        ReceivedBy: data.ReceivedBy || '',
        ReceivedByDestination: data.ReceivedByDestination || '',
        ReceivedByDate: data.ReceivedByDate || '',

        inputField: data.inputField || '',
       
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
      const docRef = doc(InspectionReportCollectionRef, formData.id); // Use the document ID for updating

      // Update the editData object with the new file URL
      editData.fileURL = formData.fileURL;

      if (editData.id) {
        // If an ID exists, update an existing document
        await updateDoc(docRef, editData); // Use editData to update the document
      } else {
        // If no ID exists, add a new document with all fields from formData
        const newDocData = {

          EntityName: formData.EntityName,
          FundCluster:  formData.FundCluster,
          ITRNum:  formData.PTRNum,
          TransferType:  formData.TransferType,
    
          ApprovedBy:  formData.ApprovedBy,
          ApprovedByDestination:  formData.ApprovedByDestination,
          ApprovedByDate: formData.ApprovedByDate,
    
          ReleasedBy:  formData.ReleasedBy,
          ReleasedByDestination:  formData.ReleasedByDestination,
          ReleasedByDate:  formData.ReleasedByDate,
    
          ReceivedBy: formData.ReceivedBy,
          ReceivedByDestination:  formData.ReceivedByDestination,
          ReceivedByDate:  formData.ReceivedByDate,
          
          inputField: [...formData.inputField, ...[editData]],
      
          fileURL: formData.fileURL,

        
        };

        await setDoc(docRef, newDocData); // Set a new document
      }

      handleEditClose();
      setSnackbarOpen1(true);
    } catch (error) {
      console.error('Error updating/adding data in Firestore: ', error);
    }
  };

 
  // This one is for the Delete button
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const handleConfirmDeleteWithoutArchive = async () => {
    try {
      if (documentToDelete) {
        const sourceDocumentRef = doc(InspectionReportCollectionRef, documentToDelete);
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        await deleteDoc(doc(InspectionReportCollectionRef, documentToDelete));

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
        const sourceDocumentRef = doc(InspectionReportCollectionRef, documentToDelete);
        // Set the 'originalLocation' field to the current collection and update the Archive as true
        await updateDoc(sourceDocumentRef, { archived: true, originalLocation: 'INVENTORY-TRANSFER-REPORT' });
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
        await deleteDoc(doc(InspectionReportCollectionRef, documentToDelete));

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
        return deleteDoc(doc(InspectionReportCollectionRef, itemId));
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
        <title> Inventory Transfer Report  Form | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h2" style={{ color: '#ff5500' }}>
            Inventory Transfer Report 
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
              <Button
                onClick={handleClickOpen}
                variant="contained"
                size="large"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Document
              </Button>
            </div>

           

            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth="xl"
              // fullWidth
              // maxWidth="sm"
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
                INVENTORY TRANSFER REPORT
              </Typography>
              <DialogContent
              // fullWidth
              // maxWidth="lg"
              // style={{ width: '1800px' }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1} columns={8}>
                    <Grid item xs={3}>
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
                    </Grid>
                    <Grid item xs={3}>
                    <TextField
                        type="text"
                        name="FundCluster"
                        variant="outlined"
                        label="From Accountable Officer/Agency/Fund Cluster"
                        required
                        size="small"
                        value={formData.FundCluster || ''}
                        onChange={(e) => setFormData({ ...formData, FundCluster: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        name="ITRNum"
                        variant="outlined"
                        label="ITR No."
                        required
                        size="small"
                        value={formData.ITRNum || ''}
                        onChange={(e) => setFormData({ ...formData, ITRNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        name="TransferType"
                        variant="outlined"
                        label="Transfer Type"
                        required
                        size="small"
                        value={formData.TransferType || ''}
                        onChange={(e) => setFormData({ ...formData, TransferType: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>


                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ApprovedBy"
                        variant="outlined"
                        label="Approved By"
                        size="small"
                        value={formData.ApprovedBy || ''}
                        onChange={(e) => setFormData({ ...formData, ApprovedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ApprovedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Approved By Destination"
                        value={formData.ApprovedByDestination || ''}
                        onChange={(e) => setFormData({ ...formData, ApprovedByDestination: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ApprovedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={formData.ApprovedByDate || ''}
                        onChange={(e) => setFormData({ ...formData, ApprovedByDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ReleasedBy"
                        variant="outlined"
                        label="Released By"
                        size="small"
                        value={formData.ReleasedBy || ''}
                        onChange={(e) => setFormData({ ...formData, ReleasedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ReleasedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Released By Destination"
                        value={formData.ReleasedByDestination || ''}
                        onChange={(e) => setFormData({ ...formData, ReleasedByDestination: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ReleasedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={formData.ReleasedByDate || ''}
                        onChange={(e) => setFormData({ ...formData, ReleasedByDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ReceivedBy"
                        variant="outlined"
                        label="Received By"
                        size="small"
                        value={formData.ReceivedBy || ''}
                        onChange={(e) => setFormData({ ...formData, ReceivedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ReceivedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Received By Destination"
                        value={formData.ReceivedByDestination || ''}
                        onChange={(e) => setFormData({ ...formData, ReceivedByDestination: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ReceivedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={formData.ReceivedByDate || ''}
                        onChange={(e) => setFormData({ ...formData, ReceivedByDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
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
                           PROPERTY
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
                        <Grid
                          container
                          spacing={1}
                          columns={13}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {/* First Column */}
                          <Grid item xs={1}>
                            <TextField
                              type="date"
                              name="DateAcquired"
                             
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputField.DateAcquired}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1}>
                            <TextField
                              name="ItemNum"
                              label="Item No."
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputField.ItemNum}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="ICSNum"
                              label="ICS No."
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputField.ICSNum}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              variant="outlined"
                              multiline
                              fullWidth
                              size="small"
                              value={inputField.Description}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the fourth column */}
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              name="Amount"
                              label="Amount"
                              variant="outlined"
                              multiline
                              fullWidth
                              size="small"
                              value={inputField.Amount}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the fourth column */}
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              name="Condition"
                              label="Condition"
                              variant="outlined"
                              multiline
                              fullWidth
                              size="small"
                              value={inputField.Condition}
                              onChange={(event) => handleChangeInput(index, event)}
                            />
                            {/* Content for the fourth column */}
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
                        <br />
                      </div>
                    ))}
                  </div>
                  <br />
                  <Grid>
                    <TextField
                      type="file"
                      variant="outlined"
                      size="small"
                      accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      sx={{ width: '100%' }}
                    />
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
                  <TableCell>Entity Name</TableCell>
                  <TableCell>Fund Cluster</TableCell>
                  <TableCell>ITR No.</TableCell>
                  <TableCell>Approved by</TableCell>
                  <TableCell>Released by</TableCell>
                  <TableCell>Received by</TableCell>
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
                    <TableCell>{item.EntityName}</TableCell>
                    <TableCell>{item.FundCluster}</TableCell>
                    <TableCell>{item.ITRNum}</TableCell>
                    <TableCell>{item.ApprovedBy}</TableCell>
                    <TableCell>{item.ReleasedBy}</TableCell>
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
            PROPERTY TRANSFER REPORT
          </Typography>
          <DialogContent>
            <form onSubmit={handleEditSubmit}>
              {/* Fields to edit */}
              <Grid container spacing={1} columns={8}>
                    <Grid item xs={3}>
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
                    </Grid>
                    <Grid item xs={3}>
                    <TextField
                        type="text"
                        name="FundCluster"
                        variant="outlined"
                        label="From Accountable Officer/Agency/Fund Cluster"
                        required
                        size="small"
                        value={editData ? editData.FundCluster : ''}
                        onChange={(e) => setEditData({ ...editData, FundCluster: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        name="ITRNum"
                        variant="outlined"
                        label="ITR No"
                        required
                        size="small"
                        value={editData ? editData.ITRNum : ''}
                        onChange={(e) => setEditData({ ...editData, ITRNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        name="TransferType"
                        variant="outlined"
                        label="Transfer Type"
                        required
                        size="small"
                        value={editData ? editData.TransferType : ''}
                        onChange={(e) => setEditData({ ...editData, TransferType: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>


                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ApprovedBy"
                        variant="outlined"
                        label="Approved By"
                        size="small"
                        value={editData ? editData.ApprovedBy : ''}
                        onChange={(e) => setEditData({ ...editData, ApprovedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ApprovedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Approved By Destination"
                        value={editData ? editData.ApprovedByDestination : ''}
                        onChange={(e) => setEditData({ ...editData, ApprovedByDestination: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ApprovedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={editData ? editData.ApprovedByDate : ''}
                        onChange={(e) => setEditData({ ...editData, ApprovedByDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ReleasedBy"
                        variant="outlined"
                        label="Released By"
                        size="small"
                        value={editData ? editData.ReleasedBy : ''}
                        onChange={(e) => setEditData({ ...editData, ReleasedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ReleasedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Released By Destination"
                        value={editData ? editData.ReleasedByDestination : ''}
                        onChange={(e) => setEditData({ ...editData, ReleasedByDestination: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ReleasedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={editData ? editData.ReleasedByDate : ''}
                        onChange={(e) => setEditData({ ...editData, ReleasedByDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ReceivedBy"
                        variant="outlined"
                        label="Received By"
                        size="small"
                        value={editData ? editData.ReceivedBy : ''}
                        onChange={(e) => setEditData({ ...editData, ReceivedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ReceivedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Received By Destination"
                        value={editData ? editData.ReceivedByDestination : ''}
                        onChange={(e) => setEditData({ ...editData, ReceivedByDestination: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ReceivedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={editData ? editData.ReceivedByDate : ''}
                        onChange={(e) => setEditData({ ...editData, ReceivedByDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
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
                      PROPERTY
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
                        <Grid
                          container
                          spacing={1}
                          columns={13}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {/* First Column */}
                          <Grid item xs={1}>
                            <TextField
                              type="date"
                              name="DateAcquired"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                editData ? editData.inputField[index]?.DateAcquired : input?.DateAcquired 
                              }
                              onChange={(event) => handleEditChangeInput(index, event, 'DateAcquired')}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1}>
                            <TextField
                              
                              name="ItemNum"
                              label="Item No."
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                editData ? editData.inputField[index]?.ItemNum : input?.ItemNum 
                              }
                              onChange={(event) => handleEditChangeInput(index, event, 'ItemNum')}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="ICSNum"
                              label="ICS No."
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                editData ? editData.inputField[index]?.ICSNum : input?.ICSNum 
                              }
                              onChange={(event) => handleEditChangeInput(index, event, 'ICSNum')}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              variant="outlined"
                              multiline
                              fullWidth
                              size="small"
                              value={
                                editData ? editData.inputField[index]?.Description : input?.Description 
                              }
                              onChange={(event) => handleEditChangeInput(index, event, 'Description')}
                            />
                            {/* Content for the fourth column */}
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              name="Amount"
                              label="Amount"
                              variant="outlined"
                              multiline
                              fullWidth
                              size="small"
                              value={
                                editData ? editData.inputField[index]?.Amount : input?.Amount 
                              }
                              onChange={(event) => handleEditChangeInput(index, event, 'Amount')}
                            />
                            {/* Content for the fourth column */}
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              name="Condition"
                              label="Condition"
                              variant="outlined"
                              multiline
                              fullWidth
                              size="small"
                              value={
                                editData ? editData.inputField[index]?.Condition : input?.Condition 
                              }
                              onChange={(event) => handleEditChangeInput(index, event, 'Condition')}
                            />
                            {/* Content for the fourth column */}
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
                    <br />
                  </div>
                ))}
              </div>

              {/*  END OF DYNAMIC FORM  END OF DYNAMIC FORM END OF DYANMIC FORM */}
              <Grid>
                <Typography variant="subtitle1">File:</Typography>
                <TextField
                  type="file"
                  variant="outlined"
                  size="small"
                  accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  sx={{ width: '100%' }}
                />
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
                INVENTORY TRANSFER REPORT
              </Typography>

              <DialogContent>
            <form onSubmit={handleEditSubmit}>
              {/* Fields to edit */}
              <Grid container spacing={1} columns={8}>
                    <Grid item xs={3}>
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
                    </Grid>
                    <Grid item xs={3}>
                    <TextField
                        type="text"
                        name="FundCluster"
                        variant="outlined"
                        label="From Accountable Officer/Agency/Fund Cluster"
                        required
                        size="small"
                        value={viewItem ? viewItem.FundCluster : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={1}>
                      <TextField
                        name="ITRNum"
                        variant="outlined"
                        label="ITR No"
                        required
                        size="small"
                        value={viewItem ? viewItem.ITRNum : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        name="TransferType"
                        variant="outlined"
                        label="Transfer Type"
                        required
                        size="small"
                        value={viewItem ? viewItem.TransferType : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>


                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ApprovedBy"
                        variant="outlined"
                        label="Approved By"
                        size="small"
                        value={viewItem ? viewItem.ApprovedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ApprovedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Approved By Destination"
                        value={viewItem ? viewItem.ApprovedByDestination : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ApprovedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={viewItem ? viewItem.ApprovedByDate : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ReleasedBy"
                        variant="outlined"
                        label="Released By"
                        size="small"
                        value={viewItem ? viewItem.ReleasedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ReleasedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Released By Destination"
                        value={viewItem ? viewItem.ReleasedByDestination : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ReleasedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={viewItem ? viewItem.ReleasedByDate : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        type="text"
                        name="ReceivedBy"
                        variant="outlined"
                        label="Received By"
                        size="small"
                        value={viewItem ? viewItem.ReceivedBy : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="ReceivedByDestination"
                        variant="outlined"
                        size="small"
                        required
                        label="Received By Destination"
                        value={viewItem ? viewItem.ReceivedByDestination : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="date"
                        name="ReceivedByDate"
                        variant="outlined"
                        size="small"
                        required
                        value={viewItem ? viewItem.ReceivedByDate : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
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
                      PROPERTY
                    </Typography>
                  </Grid>
            
                </Grid>

                {formData.inputField.map((input, index) => (
                 <div key={index}>
                 <Grid
                   container
                   spacing={1}
                   columns={13}
                   direction="row"
                   justifyContent="space-between"
                   alignItems="center"
                 >
                   {/* First Column */}
                   <Grid item xs={1}>
                     <TextField
                       type="date"
                       name="DateAcquired"
                       fullWidth
                       variant="outlined"
                       size="small"
                       value={
                        viewItem ? viewItem.inputField[index]?.DateAcquired : input?.DateAcquired 
                      }
                      disabled
                     />
                   </Grid>

                   {/* Second Column */}
                   <Grid item xs={1}>
                     <TextField
                       name="ItemNum"
                       label="Item No."
                       multiline
                       fullWidth
                       variant="outlined"
                       size="small"
                       value={
                        viewItem ? viewItem.inputField[index]?.ItemNum : input?.ItemNum 
                      }
                      disabled
                     />
                     {/* Content for the second column */}
                   </Grid>

                   {/* Third Column */}
                   <Grid item xs={2}>
                     <TextField
                       name="ICSNum"
                       label="ICS No."
                       multiline
                       fullWidth
                       variant="outlined"
                       size="small"
                       value={
                        viewItem ? viewItem.inputField[index]?.ICSNum : input?.ICSNum 
                      }
                      disabled
                     />
                     {/* Content for the third column */}
                   </Grid>

                   {/* Fourth Column */}
                   <Grid item xs={4}>
                     <TextField
                       name="Description"
                       label="Description"
                       variant="outlined"
                       multiline
                       fullWidth
                       size="small"
                       value={
                        viewItem ? viewItem.inputField[index]?.Description : input?.Description 
                      }
                      disabled
                     />
                     {/* Content for the fourth column */}
                   </Grid>
                   <Grid item xs={1}>
                     <TextField
                       name="Amount"
                       label="Amount"
                       variant="outlined"
                       multiline
                       fullWidth
                       size="small"
                       value={
                        viewItem ? viewItem.inputField[index]?.Amount : input?.Amount 
                      }
                      disabled
                     />
                     {/* Content for the fourth column */}
                   </Grid>
                   <Grid item xs={2}>
                     <TextField
                       name="Condition"
                       label="Condition"
                       variant="outlined"
                       multiline
                       fullWidth
                       size="small"
                       value={
                        viewItem ? viewItem.inputField[index]?.Condition : input?.Condition 
                      }
                      disabled
                     />
                     {/* Content for the fourth column */}
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
                        {/* <Button
                          onClick={() => {
                            handleEditRemoveField(index);
                          }}
                        >
                          Remove
                        </Button> */}
                        
                      </Grid>
                    </Grid>
                    <br />
                  </div>
                ))}
              </div>

              {/*  END OF DYNAMIC FORM  END OF DYNAMIC FORM END OF DYANMIC FORM */}
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

              <br />
            </form>
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
