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
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
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
const MARILFCollectionRef = collection(formsDocRef, 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM');

// Access ARCHIVES document under main collection
const archivesRef = doc(mainCollectionRef, 'ARCHIVES');

const archivesCollectionRef = collection(archivesRef, 'ARCHIVES-FORMS');

// Second declaration
const storage = getStorage(firebaseApp);

// ----------------------------------------------------------------------

export default function ReportsMARILF() {
  // -------------------------testing for the dynamic input fields ---------------------------------------------

  // -------------------------OBSERVATIONS FIELDS ---------------------------------------------
  const [inputFieldObservations, setInputFieldObservations] = useState([
    {
      PCNum: '',
      Processor: '',
      UnitSerialNum: '',
      Monitor: '',
      HDD: '',
      Memory: '',
      VGA: '',
      Keyboard: '',
      Mouse: '',
      Status: '',
      Remarks: '',
    },
  ]);

  const handleAddFieldObservations = () => {
    setInputFieldObservations([
      ...inputFieldObservations,
      {
        PCNum: '',
        Processor: '',
        UnitSerialNum: '',
        Monitor: '',
        HDD: '',
        Memory: '',
        VGA: '',
        Keyboard: '',
        Mouse: '',
        Status: '',
        Remarks: '',
      },
    ]);
  };

  const handleRemoveFieldObservations = (index) => {
    const values = [...inputFieldObservations];
    values.splice(index, 1);
    setInputFieldObservations(values);
  };

  const handleChangeInputObservations = (index, event) => {
    console.log(index, event.target.name);
    const values = [...inputFieldObservations];
    values[index][event.target.name] = event.target.value;
    setInputFieldObservations(values);
  };

  // -------------------------EDIT OBSERVATIONS FIELDS ---------------------------------------------

  const handleEditAddFieldObservations = () => {
    const newField = {
      PCNum: '',
      Processor: '',
      UnitSerialNum: '',
      Monitor: '',
      HDD: '',
      Memory: '',
      VGA: '',
      Keyboard: '',
      Mouse: '',
      Status: '',
      Remarks: '',
    };
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputFieldObservations: [...prevEditData.inputFieldObservations, newField],
    }));
    console.log('After adding field:', editData);
  };

  const handleEditRemoveFieldObservations = async (index) => {
    try {
      const docRef = doc(MARILFCollectionRef, formData.id); // Use the document ID for updating

      // Create a copy of the editData
      const editDataCopy = { ...editData };

      // Remove the specific item from the inputField array in Firestore
      editDataCopy.inputFieldObservations.splice(index, 1);

      // Update Firestore document with the modified inputField
      await updateDoc(docRef, editDataCopy); // Update the document in Firestore

      // Update the local state (formData) with the modified inputField
      setFormData((prevData) => ({
        ...prevData,
        inputFieldObservations: editDataCopy.inputFieldObservations,
      }));
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleRemoveAllFieldObservations = () => {
    const values = [...inputFieldObservations];
    // Remove all fields by splicing from the end of the array to the beginning
    for (let i = values.length - 1; i >= 0; i -= 1) {
      values.splice(i, 1);
    }
    // Update the inputField state with the modified array
    setInputFieldObservations(values);
  };

  const handleEditChangeInputObservations = (index, event, fieldName) => {
    setEditData((prevData) => {
      const newInputFieldObservations = [...prevData.inputFieldObservations];
      newInputFieldObservations[index][fieldName] = event.target.value;
      return {
        ...prevData,
        inputFieldObservations: newInputFieldObservations,
      };
    });
  };

  // -------------------------Observations 1 FIELDS ---------------------------------------------
  const [inputFieldObservations1, setInputFieldObservations1] = useState([
    {
      RoomEquipment: '',
      BrandDescription: '',
      Quantity: '',
      SerialNum: '',
      ModelNum: '',
      Custodian: '',
      Remarks: '',
    },
  ]);

  const handleAddFieldObservations1 = () => {
    setInputFieldObservations1([
      ...inputFieldObservations1,
      {
        RoomEquipment: '',
        BrandDescription: '',
        Quantity: '',
        SerialNum: '',
        ModelNum: '',
        Custodian: '',
        Remarks: '',
      },
    ]);
  };

  const handleRemoveFieldObservations1 = (index) => {
    const values = [...inputFieldObservations1];
    values.splice(index, 1);
    setInputFieldObservations1(values);
  };

  const handleChangeInputObservations1 = (index, event) => {
    console.log(index, event.target.name);
    const values = [...inputFieldObservations1];
    values[index][event.target.name] = event.target.value;
    setInputFieldObservations1(values);
  };

  // -------------------------EDIT Observations1 FIELDS ---------------------------------------------

  const handleEditAddFieldObservations1 = () => {
    const newField = {
      RoomEquipment: '',
      BrandDescription: '',
      Quantity: '',
      SerialNum: '',
      ModelNum: '',
      Custodian: '',
      Remarks: '',
    };
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputFieldObservations1: [...prevEditData.inputFieldObservations1, newField],
    }));
    console.log('After adding field:', editData);
  };

  const handleEditRemoveFieldObservations1 = async (index) => {
    try {
      const docRef = doc(MARILFCollectionRef, formData.id); // Use the document ID for updating

      // Create a copy of the editData
      const editDataCopy = { ...editData };

      // Remove the specific item from the inputField array in Firestore
      editDataCopy.inputFieldObservations1.splice(index, 1);

      // Update Firestore document with the modified inputField
      await updateDoc(docRef, editDataCopy); // Update the document in Firestore

      // Update the local state (formData) with the modified inputField
      setFormData((prevData) => ({
        ...prevData,
        inputFieldObservations1: editDataCopy.inputFieldObservations1,
      }));
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleRemoveAllFieldObservations1 = () => {
    const values = [...inputFieldObservations1];
    // Remove all fields by splicing from the end of the array to the beginning
    for (let i = values.length - 1; i >= 0; i -= 1) {
      values.splice(i, 1);
    }
    // Update the inputField state with the modified array
    setInputFieldObservations1(values);
  };

  const handleEditChangeInputObservations1 = (index, event, fieldName) => {
    setEditData((prevData) => {
      const newInputFieldObservations1 = [...prevData.inputFieldObservations1];
      newInputFieldObservations1[index][fieldName] = event.target.value;
      return {
        ...prevData,
        inputFieldObservations1: newInputFieldObservations1,
      };
    });
  };

  // ----------------------------------------------------------------------

  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const initialFormData = {
    ComputerRoom: '',
    Date: '',

    inputFieldObservations: [],
    inputFieldObservations1: [],

    PreparedBy: '',
    ApprovedBy: '',
    CheckedBy: '',
    Custodian: '',

    fileInput: '',
    fileURL: '',
  };

  const clearForm = () => {
    handleRemoveAllFieldObservations();
    handleRemoveAllFieldObservations1();
    setFormData(initialFormData);
  };

  const [formData, setFormData] = useState({
    ComputerRoom: '',
    Date: '',

    inputFieldObservations: [],
    inputFieldObservations1: [],

    PreparedBy: '',
    ApprovedBy: '',
    CheckedBy: '',
    Custodian: '',

    fileURL: '',
  });

  // Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(MARILFCollectionRef);
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
    const docSnapshot = await getDoc(doc(MARILFCollectionRef, newDocumentName));

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
      ComputerRoom,
      Date,

      // inputFieldObservations,
      // inputFieldObservations1,

      PreparedBy,
      ApprovedBy,
      CheckedBy,
      Custodian,

      fileURL,
    } = formData;

    try {
      // Use the current document name when adding a new document
      const documentName = await incrementDocumentName();

      const docRef = doc(MARILFCollectionRef, documentName);

      const docData = {
        ComputerRoom,
        Date,

        inputFieldObservations,
        inputFieldObservations1,

        PreparedBy,
        ApprovedBy,
        CheckedBy,
        Custodian,

        fileURL: fileURL || '',
        archived: false,
        originalLocation: 'MONTHLY-ASSESSMENT-REPORT-INVENTORY-LABORATORY-FORM',
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
    const fieldsToSearchIn = ['ComputerRoom', 'Date', 'Custodian'];

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
        ComputerRoom: data.ComputerRoom || '',
        Date: data.Date || '',

        inputFieldObservations: data.inputFieldObservations || '',
        inputFieldObservations1: data.inputFieldObservations1 || '',

        PreparedBy: data.PreparedBy || '',
        ApprovedBy: data.ApprovedBy || '',
        CheckedBy: data.CheckedBy || '',
        Custodian: data.Custodian || '',

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
      const docRef = doc(MARILFCollectionRef, formData.id); // Use the document ID for updating

      // Update the editData object with the new file URL
      editData.fileURL = formData.fileURL;

      if (formData.id) {
        await updateDoc(docRef, editData);
      } else {
        await setDoc(docRef, editData);
      }

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
        const sourceDocumentRef = doc(MARILFCollectionRef, documentToDelete);
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        await deleteDoc(doc(MARILFCollectionRef, documentToDelete));

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
        const sourceDocumentRef = doc(MARILFCollectionRef, documentToDelete);
        // Set the 'originalLocation' field to the current collection and update the Archive as true
        await updateDoc(sourceDocumentRef, { archived: true, originalLocation: 'MEMORANDUM-OF-RECEIPTS' });
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
        await deleteDoc(doc(MARILFCollectionRef, documentToDelete));

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
        return deleteDoc(doc(MARILFCollectionRef, itemId));
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
        <title> Monthly Assessment Report Inventory Laboratory Form </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h2" style={{ color: '#ff5500' }}>
            Monthly Assessment Report <br />
            Inventory Laboratory Form
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
                New User
              </Button>
            </div>

            <Dialog open={open} onClose={handleClose} maxWidth="xl">
              {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width:'1000px'}}> */}
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
                Monthly Assessment Report <br />
                Inventory Laboratory Form
              </Typography>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <br />
                  <Grid container spacing={1}>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="ComputerRoom"
                        variant="outlined"
                        label="Computer Room"
                        size="small"
                        value={formData.ComputerRoom || ''}
                        onChange={(e) => setFormData({ ...formData, ComputerRoom: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="date"
                        name="Date"
                        variant="outlined"
                        size="small"
                        value={formData.Date || ''}
                        onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="PreparedBy"
                        variant="outlined"
                        label="Prepared By"
                        size="small"
                        value={formData.PreparedBy || ''}
                        onChange={(e) => setFormData({ ...formData, PreparedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={6} md={4}>
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

                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="CheckedBy"
                        variant="outlined"
                        label="Checked By"
                        size="small"
                        value={formData.CheckedBy || ''}
                        onChange={(e) => setFormData({ ...formData, CheckedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="Custodian"
                        variant="outlined"
                        label="Custodian/Co-Custodian"
                        size="small"
                        value={formData.Custodian || ''}
                        onChange={(e) => setFormData({ ...formData, Custodian: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                  </Grid>

                  {/* // ------------------------------ testing the dynamic form---------------------------------------- */}
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
                        PC OBSERVATIONS
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleAddFieldObservations();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                    {inputFieldObservations.map((inputFieldObservations, index) => (
                      <div key={index}>
                        <Grid
                          container
                          spacing={1}
                          columns={11}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {/* First Column */}
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="PCNum"
                              label="PC No."
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.PCNum}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Processor"
                              label="Processor"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Processor}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="UnitSerialNum"
                              label="UnitSerialNum"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.UnitSerialNum}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Monitor"
                              label="Monitor"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Monitor}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="HDD"
                              label="HDD"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.HDD}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Memory"
                              label="Memory"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Memory}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="VGA"
                              label="VGA"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.VGA}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Keyboard"
                              label="Keyboard"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Keyboard}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Mouse"
                              label="Mouse"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Mouse}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Status"
                              label="Status"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Status}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              type="text"
                              name="Remarks"
                              label="Remarks"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations.Remarks}
                              onChange={(event) => handleChangeInputObservations(index, event)}
                            />
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
                                handleRemoveFieldObservations(index);
                              }}
                              // variant="warning"
                            >
                              Remove
                            </Button>
                            {/* Content for the eighth column */}
                          </Grid>
                          <br />
                        </Grid>
                        <br />
                      </div>
                    ))}
                  </div>

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
                        Equipments Observation
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleAddFieldObservations1();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                    {inputFieldObservations1.map((inputFieldObservations1, index) => (
                      <div key={index}>
                        <Grid
                          container
                          spacing={1}
                          columns={14}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {/* First Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="RoomEquipment"
                              label="Room Equipment"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.RoomEquipment}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="BrandDescription"
                              label="Brand/Description"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.BrandDescription}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.Quantity}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="SerialNum"
                              label="Serial Number"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.SerialNum}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="ModelNum"
                              label="Model Number"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.ModelNum}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="Custodian"
                              label="Custodian"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.Custodian}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <TextField
                              type="text"
                              name="Remarks"
                              label="Remarks"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldObservations1.Remarks}
                              onChange={(event) => handleChangeInputObservations1(index, event)}
                            />
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
                                handleRemoveFieldObservations1(index);
                              }}
                            >
                              Remove
                            </Button>
                            {/* Content for the eighth column */}
                          </Grid>
                          <br />
                          <div>
                            <br />
                            <br />
                          </div>
                        </Grid>
                        <br />
                      </div>
                    ))}
                  </div>
                  <div>
                    <br />
                    <br />
                  </div>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
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
              {/* </div>
              </div> */}
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
                  <TableCell>Computer Room</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Custodian</TableCell>
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
                    <TableCell>{item.ComputerRoom}</TableCell>
                    <TableCell>{item.Date}</TableCell>
                    <TableCell>{item.Custodian}</TableCell>
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
          {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width:'1000px'}}> */}
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
            Monthly Assessment Report <br /> Inventory Laboratory Form
          </Typography>
          <DialogContent>
            <form onSubmit={handleEditSubmit}>
              <br />
              <Grid container spacing={1} columns={12}>
                <Grid item xs={4}>
                  <TextField
                    type="text"
                    name="ComputerRoom"
                    variant="outlined"
                    label="Computer Room"
                    size="small"
                    value={editData ? editData.ComputerRoom : ''}
                    onChange={(e) => setEditData({ ...editData, ComputerRoom: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="date"
                    name="Date"
                    variant="outlined"
                    size="small"
                    value={editData ? editData.Date : ''}
                    onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name="PreparedBy"
                    variant="outlined"
                    label="Prepared By"
                    size="small"
                    value={editData ? editData.PreparedBy : ''}
                    onChange={(e) => setEditData({ ...editData, PreparedBy: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
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
                    name="CheckedBy"
                    variant="outlined"
                    label="Checked By"
                    size="small"
                    value={editData ? editData.CheckedBy : ''}
                    onChange={(e) => setEditData({ ...editData, CheckedBy: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    name="Custodian"
                    variant="outlined"
                    label="Custodian/Co-Custodian"
                    size="small"
                    value={editData ? editData.Custodian : ''}
                    onChange={(e) => setEditData({ ...editData, Custodian: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                </Grid>
              </Grid>

              {/* // ------------------------------ testing the dynamic form---------------------------------------- */}
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
                    PC OBSERVATIONS
                  </Typography>
                </Grid>
                <Grid>
                  <Button
                    onClick={() => {
                      handleEditAddFieldObservations();
                    }}
                    variant="contained"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <div>
                {editData &&
                  editData.inputFieldObservations.map((input, index) => (
                    <div key={index}>
                      <Grid
                        container
                        spacing={1}
                        columns={12}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {/* First Column */}
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="PCNum"
                            label="PC No."
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.PCNum : input?.PCNum}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'PCNum')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Processor"
                            label="Processor"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Processor : input?.Processor}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Processor')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="UnitSerialNum"
                            label="UnitSerialNum"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={
                              editData ? editData.inputFieldObservations[index]?.UnitSerialNum : input?.UnitSerialNum
                            }
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'UnitSerialNum')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Monitor"
                            label="Monitor"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Monitor : input?.Monitor}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Monitor')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="HDD"
                            label="HDD"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.HDD : input?.HDD}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'HDD')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Memory"
                            label="Memory"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Memory : input?.Memory}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Memory')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="VGA"
                            label="VGA"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.VGA : input?.VGA}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'VGA')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Keyboard"
                            label="Keyboard"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Keyboard : input?.Keyboard}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Keyboard')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Mouse"
                            label="Mouse"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Mouse : input?.Mouse}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Mouse')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Status"
                            label="Status"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Status : input?.Status}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Status')}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <TextField
                            type="text"
                            name="Remarks"
                            label="Remarks"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations[index]?.Remarks : input?.Remarks}
                            onChange={(event) => handleEditChangeInputObservations(index, event, 'Remarks')}
                          />
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
                              handleEditRemoveFieldObservations(index);
                            }}
                            // variant="warning"
                          >
                            Remove
                          </Button>
                          {/* Content for the eighth column */}
                        </Grid>
                        <br />
                      </Grid>
                      <br />
                    </div>
                  ))}
              </div>

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
                    Equipments Observation
                  </Typography>
                </Grid>
                <Grid>
                  <Button
                    onClick={() => {
                      handleEditAddFieldObservations1();
                    }}
                    variant="contained"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <div>
                {editData &&
                  editData.inputFieldObservations1.map((input, index) => (
                    <div key={index}>
                      <Grid
                        container
                        spacing={1}
                        columns={14}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        {/* First Column */}
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="RoomEquipment"
                            label="Room Equipment"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={
                              editData ? editData.inputFieldObservations1[index]?.RoomEquipment : input?.RoomEquipment
                            }
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'RoomEquipment')}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="BrandDescription"
                            label="Brand/Description"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={
                              editData
                                ? editData.inputFieldObservations1[index]?.BrandDescription
                                : input?.BrandDescription
                            }
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'BrandDescription')}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="Quantity"
                            label="Quantity"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations1[index]?.Quantity : input?.Quantity}
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'Quantity')}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="SerialNum"
                            label="Serial Number"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations1[index]?.SerialNum : input?.SerialNum}
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'SerialNum')}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="ModelNum"
                            label="Model Number"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations1[index]?.ModelNum : input?.ModelNum}
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'ModelNum')}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="Custodian"
                            label="Custodian"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations1[index]?.Custodian : input?.Custodian}
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'Custodian')}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            type="text"
                            name="Remarks"
                            label="Remarks"
                            // sx={{ width: '100px' }}
                            variant="outlined"
                            fullWidth
                            size="small"
                            value={editData ? editData.inputFieldObservations1[index]?.Remarks : input?.Remarks}
                            onChange={(event) => handleEditChangeInputObservations1(index, event, 'Remarks')}
                          />
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
                              handleEditRemoveFieldObservations1(index);
                            }}
                          >
                            Remove
                          </Button>
                          {/* Content for the eighth column */}
                        </Grid>
                        <br />
                        <div>
                          <br />
                          <br />
                        </div>
                      </Grid>
                      <br />
                    </div>
                  ))}
              </div>

              <Typography variant="subtitle1">File:</Typography>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <TextField
                    type="file"
                    name="fileInput"
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
        </Dialog>
        <Snackbar
          open={snackbarOpen1}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen1(false)}
          message="The Inspection Report Document was edited successfully!"
        />
        <Snackbar
          open={snackbarOpenDelete}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpenDelete(false)}
          message="The Inspection Report Document was deleted successfully!"
        />

        <Snackbar
          open={snackbarOpenArchive}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpenArchive(false)}
          message="The Inspection Report Document was archived successfully!"
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
            INSPECTION REPORT
          </Typography>
          <DialogContent>
            <Typography variant="subtitle1">Name:</Typography>
            <br />
            <Grid container spacing={1}>
              <Grid item xs={6} md={4}>
                <TextField
                  type="text"
                  name="EntityName"
                  variant="outlined"
                  label="Entity Name"
                  size="small"
                  value={viewItem ? viewItem.EntityName : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  type="text"
                  name="CollegeCampusOffice"
                  variant="outlined"
                  label="College/Campus/Office"
                  size="small"
                  value={viewItem ? viewItem.CollegeCampusOffice : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  name="SAIPARNum"
                  variant="outlined"
                  label="SAIPAR Number"
                  size="small"
                  value={viewItem ? viewItem.SAIPARNum : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1">Acknowledged By:</Typography>
            <br />
            <Grid container spacing={1}>
              <Grid item xs={6} md={4}>
                <TextField
                  type="text"
                  name="AcknowledgedBy"
                  variant="outlined"
                  label="Acknowledged By"
                  size="small"
                  value={viewItem ? viewItem.AcknowledgedBy : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
                {/* <Item>xs=6 md=4</Item> */}
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  type="text"
                  name="PositionAcknowledgedBy"
                  variant="outlined"
                  size="small"
                  label="Position/College/Campus/Office"
                  value={viewItem ? viewItem.PositionAcknowledgedBy : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  type="date"
                  name="DateAcknowledgedBy"
                  variant="outlined"
                  size="small"
                  value={viewItem ? viewItem.DateAcknowledgedBy : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle1">Inspected By:</Typography>
            <br />
            <Grid container spacing={1}>
              <Grid item xs={6} md={4}>
                <TextField
                  type="text"
                  name="InspectedBy"
                  variant="outlined"
                  label="Inspected By"
                  size="small"
                  value={viewItem ? viewItem.InspectedBy : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
                {/* <Item>xs=6 md=4</Item> */}
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  type="text"
                  name="PositionInspectedBy"
                  variant="outlined"
                  size="small"
                  label="Position/College/Campus/Office"
                  value={viewItem ? viewItem.PositionInspectedBy : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  type="date"
                  name="DateInspectedBy"
                  variant="outlined"
                  size="small"
                  value={viewItem ? viewItem.DateInspectedBy : ''}
                  disabled
                  sx={{ width: '100%', marginBottom: '10px' }}
                />
              </Grid>
            </Grid>

            {/* // ------------------------------ testing the dynamic form---------------------------------------- */}
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
                  PC OBSERVATIONS
                </Typography>
              </Grid>
            </Grid>
            <div>
              {formData.inputFieldObservations.map((input, index) => (
                <div key={index}>
                  <Grid
                    container
                    spacing={1}
                    columns={12}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* First Column */}
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="PCNum"
                        label="PC No."
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.PCNum : input?.PCNum // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Processor"
                        label="Processor"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Processor : input?.Processor // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="UnitSerialNum"
                        label="UnitSerialNum"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.UnitSerialNum : input?.UnitSerialNum // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Monitor"
                        label="Monitor"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Monitor : input?.Monitor // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="HDD"
                        label="HDD"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.HDD : input?.HDD // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Memory"
                        label="Memory"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Memory : input?.Memory // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="VGA"
                        label="VGA"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.VGA : input?.VGA // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Keyboard"
                        label="Keyboard"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Keyboard : input?.Keyboard // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Mouse"
                        label="Mouse"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Mouse : input?.Mouse // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Status"
                        label="Status"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Status : input?.Status // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        type="text"
                        name="Remarks"
                        label="Remarks"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations[index]?.Remarks : input?.Remarks // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>

                    {/* Eighth Column */}

                    <br />

                    <br />
                    <br />
                  </Grid>
                  <br />
                </div>
              ))}
            </div>

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
                  Equipments Observation
                </Typography>
              </Grid>
            </Grid>
            <div>
              {formData.inputFieldObservations1.map((input, index) => (
                <div key={index}>
                  <Grid
                    container
                    spacing={1}
                    columns={14}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* First Column */}

                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="RoomEquipment"
                        label="Room Equipment"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.RoomEquipment : input?.RoomEquipment // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="BrandDescription"
                        label="Brand/Description"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.BrandDescription : input?.BrandDescription // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="Quantity"
                        label="Quantity"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.Quantity : input?.Quantity // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="SerialNum"
                        label="Serial Number"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.SerialNum : input?.SerialNum // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="ModelNum"
                        label="Model Number"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.ModelNum : input?.ModelNum // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="Custodian"
                        label="Custodian"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.Custodian : input?.Custodian // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        type="text"
                        name="Remarks"
                        label="Remarks"
                        // sx={{ width: '100px' }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={
                          viewItem ? viewItem.inputFieldObservations1[index]?.Remarks : input?.Remarks // Use optional chaining to handle potential undefined values
                        }
                        disabled
                      />
                    </Grid>
                    {/* Eighth Column */}

                    <br />
                    <div>
                      <br />
                      <br />
                    </div>
                  </Grid>
                  <br />
                </div>
              ))}
            </div>
            <div>
              <br />
              <br />
            </div>

            <Typography variant="subtitle1">File:</Typography>
            {viewItem && viewItem.fileURL ? (
              <a href={viewItem.fileURL} target="_blank" rel="noreferrer noopener" download>
                View / Download File
              </a>
            ) : (
              'No File'
            )}
          </DialogContent>

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
