import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, documentId, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import {Card,Grid,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow,
        MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,
        TablePagination,Dialog, DialogTitle, DialogContent, DialogActions, Button, 
        Backdrop,Box, Snackbar, TableHead, CircularProgress, TextField, Select,
        FormControl, InputLabel } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products'
import { useAuthState, firebaseApp, db, mainCollectionRef, formsDocRef, RequestCollectionRef, BorrowersCollectionRef, archivesRef, storage } from '../../firebase';

export default function UserPage() {

// Check the user's userType
const { user } = useAuthState();
const [username, setUsername] = useState(null);
const [userType, setUserType] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    if (user) {
      const db = getFirestore();
      const pendingUsersCollection = collection(db, 'WP4-pendingUsers');

      const querySnapshot = await getDocs(
        query(pendingUsersCollection, where('uid', '==', user.uid))
      );
        
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUsername(userData.username);
        setUserType(userData.userType);

        if (userData.uid && typeof userData.uid === 'string') {
          fetchUserDocuments(userData.uid);
        } else {
          console.error('Invalid UID in userData:', userData.uid);
        }
      }
    }
  };

  fetchUserData();
}, [user]);

const isFaculty = userType === 'faculty';
const isTechnician = userType === 'technician';
const isDean = userType === 'dean';

// Start of Code
  const [fetchedData, setFetchedData] = useState([]);
  const [fetchedDataTechnician, setFetchedDataTechnician] = useState([]);
  const [fetchedDataDean, setFetchedDataDean] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};

  const initialFormData = {
    ControlNum: '',
    Date: '',
    LocationRoom: '',
    Requisitioner: '',
    Items: [],
    otherItems: '',
    fileInput: '',
    fileURL: '',
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };

  // Handle change function
  const [formData, setFormData] = useState({
    Date: '',
    LocationRoom: '',
    Requisitioner: '',
    Items: [], // If this is an array, it can be empty initially
    otherItems: '',
    fileURL: '',
  });

// Technician Show Query/table fetch from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(RequestCollectionRef);
      const dataFromFirestore = [];

      querySnapshot.forEach((doc) => {
        // Handle each document here
        const data = doc.data();
        data.id = doc.id; // Add the ID field
        dataFromFirestore.push(data);
      });

      setFetchedDataTechnician(dataFromFirestore);
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDocuments();
   }, []);

// Dean Show Query/table fetch from firestore

const DeanfetchAllDocuments = async () => {
  setIsLoading(true);

  try {
    const querySnapshot = await getDocs(
      query(RequestCollectionRef, where('status', '!=', 'PENDING (Technician)'))
    );

    const dataFromFirestore = [];

    querySnapshot.forEach((doc) => {
      // Handle each document here
      const data = doc.data();
      data.id = doc.id; // Add the ID field
      dataFromFirestore.push(data);
    });

    setFetchedDataDean(dataFromFirestore);
  } catch (error) {
    console.error("Error fetching data from Firestore: ", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  DeanfetchAllDocuments();
}, []);

// Show Query based on UID: 
const fetchUserDocuments = async (userUID) => {
  setIsLoading(true);

  try {
    // Ensure userUID is a string before proceeding
    if (typeof userUID !== 'string') {
      console.error('Invalid userUID:', userUID);
      return;
    }

    const querySnapshotuid = await getDocs(
      query(RequestCollectionRef, where('uid', '==', userUID))
    );

    const dataFromFirestore = [];

    querySnapshotuid.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      dataFromFirestore.push(data);
    });

    setFetchedData(dataFromFirestore);
  } catch (error) {
    console.error("Error fetching user's documents from Firestore: ", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  // Ensure that user data is available before fetching documents
  if (user?.uid) {
    fetchUserDocuments(user.uid);
  }
}, [user]); // Trigger the fetch when the user object changes


// Function to increment the document name

  const incrementDocumentName = async (nextNumber = 0) => {
    const newDocumentName = `RIF-${nextNumber.toString().padStart(2, "0")}`;

    // Check if the document with the new name already exists
    const docSnapshot = await getDoc(doc(RequestCollectionRef, newDocumentName));

    if (docSnapshot.exists()) {
      // The document with the new name exists, so increment and try again
      return incrementDocumentName(nextNumber + 1);
    }

    // The document with the new name doesn't exist, so we can use it
    return newDocumentName; // Return the generated document name
  };

  // Add function

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { Date, LocationRoom, Requisitioner, Items=[], otherItems, fileURL } = formData;
  
    // Validation logic for required fields
    if (!Date|| !LocationRoom || !Requisitioner) {
      alert('Please fill out all required fields');
      return;
    }
    try {
      const documentName = await incrementDocumentName();
      const docRef = doc(RequestCollectionRef, documentName);
  
      const docData = {
        Date,
        LocationRoom,
        FullName: Requisitioner || '',
        Requisitioner,
        Items,
        otherItems,
        fileURL: fileURL || '',
        archived: false,
        originalLocation: "ITEM-REQUEST",
        uid: user?.uid || '',
        status: "PENDING (Technician)",
      };
  
      await setDoc(docRef, docData);
  
      const newData = { ...docData, id: documentName };
      setFetchedData([...fetchedData, newData]);
  
      setOpen(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      alert("Input cannot be incomplete");
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
  const fieldsToSearchIn = ['id', 'Date',  'LocationRoom', 'Requisitioner'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataTechnician = fetchedDataTechnician.filter((item) => {
  const fieldsToSearchIn = ['id', 'Date',  'LocationRoom', 'Requisitioner'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataDean = fetchedDataDean.filter((item) => {
  const fieldsToSearchIn = ['id', 'Date', 'LocationRoom', 'Requisitioner'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
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
      Date: data.Date || '',
      LocationRoom: data.LocationRoom || '',
      FullName: data.Requisitioner || '',
      Requisitioner: data.Requisitioner || '',
      Items: data.Items || '',
      otherItems: data.otherItems || '',
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
      Items: formData.Items, // Update Services with checkbox values
      // Include other properties here
    };

    const docRef = doc(RequestCollectionRef, formData.id);

    // Update the editData object with the new file URL
    updatedEditData.fileURL = formData.fileURL;

    await updateDoc(docRef, updatedEditData);
    handleEditClose();
    setSnackbarOpen1(true);
  } catch (error) {
    console.error("Error updating data in Firestore: ", error);
  }
};

// This one is for the Delete button
const [documentToDelete, setDocumentToDelete] = useState(null);

const handleConfirmDeleteWithoutArchive = async () => {
  try {

    if (documentToDelete) {
      const sourceDocumentRef = doc(RequestCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();
   
    await deleteDoc(doc(RequestCollectionRef, documentToDelete));
    
    // Update the UI by removing the deleted row
    setFetchedData((prevData) => prevData.filter((item) => item.id !== documentToDelete));
    
    setSnackbarOpenDelete(true); // Show a success message

    // setDocumentToDelete(documentId);
    // setArchiveDialogOpen(true);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
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
      const sourceDocumentRef = doc(BorrowersCollectionRef, documentToDelete);
      // Set the 'originalLocation' field to the current collection and update the Archive as true
      await updateDoc(sourceDocumentRef, { archived: true, originalLocation: "ITEM-REQUEST" });
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();


      // Fetch existing document names from the Archives collection
      const archivesQuerySnapshot = await getDocs(archivesRef);
      const existingDocumentNames = archivesQuerySnapshot.docs.map((doc) => doc.id);

      // Find the highest number and increment it by 1
      let nextNumber = 0;
      existingDocumentNames.forEach((docName) => {
        const match = docName.match(/^RIF-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!Number.isNaN(num) && num >= nextNumber) {
            nextNumber = num + 1;
          }
        }
      });

      // Generate the new document name
      const newDocumentName = `RIF-${nextNumber.toString().padStart(2, "0")}`;

      // Add the document to the "Archives" collection with the new document name
      await setDoc(doc(archivesRef, newDocumentName), sourceDocumentData);

      // Delete the original document from the Service Request collection
      await deleteDoc(doc(RequestCollectionRef, documentToDelete));

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
      'image/png',       // PNG images
      'image/jpeg',      // JPEG images
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (XLSX)
      'application/msword', // MS Word (DOC)
      'application/vnd.ms-excel', // MS Excel (XLS)
      'text/plain',      // Plain text
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
const displayedDataTechnician = filteredDataTechnician.slice(startIndex, endIndex);
const displayedDataDean = filteredDataDean.slice(startIndex, endIndex);

const handlePageChange = (event, newPage) => {
  console.log("Page changed to:", newPage); // Log the new page number
  setPage(newPage);
};

const handleRowsPerPageChange = (event) => {
  const newRowsPerPage = parseInt(event.target.value, 10);
  console.log("Rows per page changed to:", newRowsPerPage); // Log the new rows per page value
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
    console.error("No items selected for deletion.");
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
      return deleteDoc(doc(RequestCollectionRef, itemId));
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
    console.error("Error deleting documents:", error);
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
  const [isOtherChecked, setIsOtherChecked] = useState(false);

  const handleServiceChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
  
    if (isChecked && value !== ' Others:') {
      // Add the new value to the array
      setFormData((prevData) => ({
        ...prevData,
        Items: [...prevData.Items, value],
      }));
    } else if (!isChecked && value !== ' Others:') {
      // Remove the selected service from the array
      setFormData((prevData) => ({
        ...prevData,
        Items: prevData.Items.filter((service) => service !== value),
      }));
    }
  };

  const [openFilter, setOpenFilter] = useState(false);
 
 const handleOpenFilter = () => {
      setOpenFilter(true);
    };
  
    const handleCloseFilter = () => {
      setOpenFilter(false);
    };

    const getStatusColor = (status) => {
      if (status === 'APPROVED') {
        return 'success'; // Green color for 'approved'
      }
      if (status === 'PENDING (Dean)') {
        return 'warning'; // Orange color for 'pending'
      }
      if (status === 'PENDING (Technician)') {
        return 'warning'; // Orange color for 'pending'
      }
      if (status === 'REJECTED') {
        return 'error'; // Red color for 'reject'
      }
      return 'info'; // Default color for other status values
    };
    


      const [selectedOption, setSelectedOption] = useState('All');
    
      const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
      };
  

  return (
    <>
      <Helmet>
        <title> Request Item Form | Minimal UI </title>
      </Helmet>

      
        {/* This is the beginning of the Container for Faculty */}
        {isFaculty && ( 
      <Container>
  
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Request Item Form
      </Typography>

      <p>Selected Option: {selectedOption}</p>

        
    </Stack>


    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>

        <div>
        <Button onClick={handleClickOpen} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Document
          </Button>
        </div>
      </div>

     

      <Stack direction="row" alignItems="center" justifyContent="space-between">
      <div style={{ marginLeft: '10px'}}>
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="options-label">File Status:</InputLabel>
          <Select
            labelId="options-label"
            id="options"
            value={selectedOption}
            onChange={handleOptionChange}
            label="Select an option"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Pending (Technician)">Pending (Technician)</MenuItem>
            <MenuItem value="Pending (Dean)">Pending (Dean)</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
        </Box>
       
        </div>
        <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center'}}>
        {selectedItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleTrashIconClick} >
              <Iconify icon="material-symbols:delete-forever-outline-rounded" color="red" width={42} height={42} />
            </IconButton>
            <Typography variant="subtitle1" style={{ paddingRight: '16px' }}>
              {selectedItems.length} items selected
            </Typography>
          </div>
        )}

        </div>
     
      </Stack>

      <div style={{ marginLeft: 'auto', display: 'flex' }}>
        <ProductFilterSidebar 
              alignItems="center"
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter} 
            />
        <Button
          onClick={() => fetchUserDocuments(user?.uid)}
          variant="contained"
          size="large"
        
          style={{
            margin: '0 8px',
            paddingRight: '10px',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            backgroundColor: '#ff5500',
          }}
          startIcon= {<RefreshIcon />}
        />
  
        <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleFilterByName}
            sx={{ width: '%' }}
          />
        </div>
        
        <Dialog open={open} onClose={handleClose}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ mb: 5 }} style={{ alignSelf: 'center', color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop:'10px' }}>
              Request Item Form
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
                    type="date"
                    name="Date"
                    value={formData.Date || ''}
                    onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={16}>
                    <TextField
                    type="text"
                    name="Requisitioner"
                    label="Requisitioner"
                    value={formData.Requisitioner || ''}
                    onChange={(e) => setFormData({ ...formData, Requisitioner: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <fieldset>
                    <legend name="Items" >ITEMS:</legend>
                    <Checkbox
                      value="Mouse"
                      checked={formData.Items.includes('Mouse')}
                      onChange={handleServiceChange}
                    />
                    Mouse 
                    <br />
                    <Checkbox
                      value="Keyboard"
                      checked={formData.Items.includes('Keyboard')}
                      onChange={handleServiceChange}
                    />
                    Keyboard
                    <br />
                    <Checkbox
                      value="Monitor"
                      checked={formData.Items.includes('Monitor')}
                      onChange={handleServiceChange}
                    />
                    Monitor
                    <br />
                    <Checkbox
                      value="AVR"
                      checked={formData.Items.includes('AVR')}
                      onChange={handleServiceChange}
                    />
                    AVR
                    <br />
                    <Checkbox
                      value="CPU"
                      checked={formData.Items.includes('CPU')}
                      onChange={handleServiceChange}
                    />
                    CPU
                    <br />
                    <div style={{ marginLeft: '42px' }}> 
                    Others:
                    <input
                    type="text"
                    name="Others:"
                    value={formData.otherItems || ''}
                    onChange={(e) => setFormData({ ...formData, otherItems: e.target.value })}
                    />
                      </div>
                  </fieldset>
                    </Grid>

                    <Grid item xs={8} spacing={1}>
                      <Grid>
                      <TextField
                    type="text"
                    name="LocationRoom"
                    label="Location/Room"
                    value={formData.LocationRoom || ''}
                    onChange={(e) => setFormData({ ...formData, LocationRoom: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                        <br/>
                      </Grid>
                      <Grid>
                      <Typography variant="subtitle1">File:</Typography>
                  <TextField
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    sx={{ width: '100%' }}
                  />
                        <br/>
                      </Grid>
                    </Grid>
                  </Grid>

                  <br />
                  
                </form>
              </DialogContent>
              <DialogActions>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
                  <Button variant="contained" onClick={clearForm} sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Clear
                  </Button>
                  <Button variant="contained" onClick={handleClose} sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSubmit} type="submit" sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Create
                  </Button>
                </div>
              </DialogActions>
            </div>
          </div>
        </Dialog>
  </Stack> 
{/* End of Faculty userType "New Document" function */}
    
{/* Start of Faculty userType "Table" function */}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  color="primary"
                />
                </TableCell>
                <TableCell  style={{ textAlign: 'center' }}>Document ID</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>Date</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>Location/Room</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>Requisitioner</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>Items</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>File Status</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>File</TableCell>
                <TableCell  style={{ textAlign: 'center' }}>Menu</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell> 
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelection(item.id)}
                      />
                  </TableCell>
                  <TableCell  style={{ textAlign: 'center' }}>{item.id}</TableCell>
                  <TableCell  style={{ textAlign: 'center' }}>{item.Date}</TableCell>
                  <TableCell  style={{ textAlign: 'center' }}>{item.LocationRoom}</TableCell>
                  <TableCell  style={{ textAlign: 'center' }}>{item.Requisitioner}</TableCell>
                  <TableCell  style={{ textAlign: 'center' }}>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
                  </TableCell>
                  <TableCell>
                    {item.fileURL ? (
                      <Link to={item.fileURL} target="_blank" download>
                        Download 
                      </Link>
                    ) : (
                      "No File"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="menu"
                      onClick={(event) => handleMenuOpen(event, item)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
       <TablePagination
        rowsPerPageOptions={[4, 10, 25]}
        component="div"
        count={filteredData.length} 
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
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

        </Container>
      )}
  {/* End of Faculty usertype view for tables and edit dialog */}
  
  {/* Start of Technician usertype view for Search bar (top side) */}
  {isTechnician && ( 
  <Container>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
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
        <Button
          onClick={() => fetchAllDocuments()}
          variant="contained"
          size="large"
          style={{
            margin: '0 8px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Refresh
        </Button>
        </div>
        <div>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleFilterByName}
            sx={{ width: '%' }}
          />
        </div>
        <div style={{ margin: '0 8px' }}>
        <FormControl fullWidth>
          <InputLabel id="options-label">Select an option</InputLabel>
          <Select
            labelId="options-label"
            id="options"
            value={selectedOption}
            onChange={handleOptionChange}
            label="Select an option"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Pending (Technician)">Pending (Technician)</MenuItem>
            <MenuItem value="Pending (Dean)">Pending (Dean)</MenuItem>
            <MenuItem value="Archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </div>
      </div>

    

      <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
        {selectedItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleTrashIconClick} >
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="The Document was created successfully!"
      />
      </div>  
      </Stack> 
      
  {/* End of Technician usertype view for Search bar (top side) */}

  {/* Start of Technician usertype view for tables */}

    {isLoading ? (
      <CircularProgress />
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                color="primary"
              />
              </TableCell>
              <TableCell>Control Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Location/Room</TableCell>
                <TableCell>Requisitioner</TableCell>
                <TableCell>Items</TableCell>
              <TableCell>File Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Menu</TableCell>

            </TableRow>
          </TableHead>
          
          <TableBody>
            {displayedDataTechnician.map((item, index) => (
              <TableRow key={index}>
                <TableCell> 
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelection(item.id)}
                    />
                </TableCell>
                <TableCell>{item.id}</TableCell>
                  <TableCell>{item.Date}</TableCell>
                  <TableCell>{item.FullName}</TableCell>
                  <TableCell>{item.LocationRoom}</TableCell>
                  <TableCell>{item.Requisitioner}</TableCell>
                  <TableCell>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                <TableCell style={{ color: 'white' , backgroundColor: getStatusColor(item.status) }}>{item.status}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex' }}>
                    <IconButton style={{ color: 'green' }}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton style={{ color: 'red' }}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell>
                  {item.fileURL ? (
                    // Render a clickable link to download the file
                    <Link to={item.fileURL} target="_blank" download>
                      Download 
                    </Link>
                  ) : (
                    // Display "No File" if there's no file URL
                    "No File"
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="menu"
                    onClick={(event) => handleMenuOpen(event, item)}
                  >
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
      <DialogContent>
        Do you want to delete or archive this document?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button>
        <Button onClick={handleConfirmDelete} style={{ color: 'orange' }}>Archive</Button>
      </DialogActions>
    </Dialog>
    
     <TablePagination
      rowsPerPageOptions={[4, 10, 25]}
      component="div"
      count={filteredDataTechnician.length} // Make sure this reflects the total number of rows
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
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
      <MenuItem onClick={() => handleDelete(selectedItem.id)}>Remove</MenuItem>
    </Popover>



    </Container>
  )}
  {/* End of Technician usertype view for tables */}

 {/* Start of Dean usertype view for Search bar (top side) */}
 {isDean && ( 
  <Container>

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
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
          onClick={() => DeanfetchAllDocuments()}
          variant="contained"
          size="large"
          style={{
            margin: '0 8px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Refresh
        </Button>
        </div>
      </div>

      <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
        {selectedItems.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleTrashIconClick} >
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="The Document was created successfully!"
      />
      </div>  
      </Stack> 
      
  {/* End of Dean usertype view for Search bar (top side) */}

  {/* Start of Dean usertype view for tables */}
 
    {isLoading ? (
      <CircularProgress />
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                color="primary"
              />
              </TableCell>
              <TableCell>Control Number</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Location/Room</TableCell>
                <TableCell>Requisitioner</TableCell>
                <TableCell>Items</TableCell>
              <TableCell>File Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Menu</TableCell>

            </TableRow>
          </TableHead>
          
          <TableBody>
            {displayedDataDean.map((item, index) => (
              <TableRow key={index}>
                <TableCell> 
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelection(item.id)}
                    />
                </TableCell>
                <TableCell>{item.id}</TableCell>
                  <TableCell>{item.Date}</TableCell>
                  <TableCell>{item.FullName}</TableCell>
                  <TableCell>{item.LocationRoom}</TableCell>
                  <TableCell>{item.Requisitioner}</TableCell>
                  <TableCell>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                <TableCell style={{color: 'white' , backgroundColor: getStatusColor(item.status) }}>{item.status}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex' }}>
                    <IconButton style={{ color: 'green' }}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton style={{ color: 'red' }}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell>
                  {item.fileURL ? (
                    // Render a clickable link to download the file
                    <Link to={item.fileURL} target="_blank" download>
                      Download 
                    </Link>
                  ) : (
                    // Display "No File" if there's no file URL
                    "No File"
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="menu"
                    onClick={(event) => handleMenuOpen(event, item)}
                  >
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
      <DialogContent>
        Do you want to delete or archive this document?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button>
        <Button onClick={handleConfirmDelete} style={{ color: 'orange' }}>Archive</Button>
      </DialogActions>
    </Dialog>
    
     <TablePagination
      rowsPerPageOptions={[4, 10, 25]}
      component="div"
      count={filteredDataTechnician.length} // Make sure this reflects the total number of rows
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
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
      <MenuItem onClick={() => handleDelete(selectedItem.id)}>Remove</MenuItem>
    </Popover>

    </Container>
  )}
  {/* End of Dean usertype view for tables */}

  {/* Start of public container for all user */}
    <Container> 
      {/* This is the dialog for the Edit button */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ mb: 5 }} style={{ alignSelf: 'center', color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop:'10px' }}>
                REQUEST ITEMS FORM
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
                    type="date"
                    name="Date"
                    value={editData ? editData.Date : ''}
                    onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
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
                    </Grid>

                    <Grid item xs={8}>
                    <fieldset>
                    <legend name="Items" >Items:</legend>
                    <Checkbox
                      value="Mouse"
                      checked={formData.Items.includes('Mouse')}
                      onChange={handleServiceChange}
                    />
                    Mouse
                    <br />
                    <Checkbox
                      value="Keyboard"
                      checked={formData.Items.includes('Keyboard')}
                      onChange={handleServiceChange}
                    />
                    Keyboard
                    <br />
                    <Checkbox
                      value="Monitor"
                      checked={formData.Items.includes('Monitor')}
                      onChange={handleServiceChange}
                    />
                    Monitor
                    <br />
                    <Checkbox
                      value="AVR"
                      checked={formData.Items.includes('AVR')}
                      onChange={handleServiceChange}
                    />
                    AVR
                    <br />
                    <Checkbox
                      value="CPU"
                      checked={formData.Items.includes('CPU')}
                      onChange={handleServiceChange}
                    />
                    CPU
                    <br />
                    <div style={{ marginLeft: '42px' }}>
                    Others:
                    <input
                      type="text"
                      value={editData  ? editData .otherItems :''}
                      onChange={(e) => setEditData({ ...editData, otherItems: e.target.value })}
                    />
                    </div>
                  </fieldset>
                  <br/>
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
                        <br/>
                      </Grid>
                      <Grid>
                      <Typography variant="subtitle1">File:</Typography>
                  <TextField
                    type="file"
                    name="fileInput"
                    accept=".pdf,.png,.jpg,.jpeg,.xlsx,.doc,.xls,text/plain"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    inputProps={{ className: "w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input" }}
                  />
                        <br/>
                      </Grid>
                    </Grid>
                  </Grid>

                  <br />
          </form>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'auto' }}>
            <Button variant="contained" onClick={handleEditClose} sx={{marginRight: '5px', marginLeft: '5px'}}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditSubmit} type="submit" sx={{marginRight: '5px', marginLeft: '5px'}}>
              Save
            </Button>
          </div>
        </DialogActions>
        </div>
      </div>
      </Dialog>

    {/* Dialog for View button */}
      <Dialog open={viewOpen} onClose={handleViewClose}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" sx={{ mb: 5 }} style={{ alignSelf: 'center', color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop: '10px' }}>
               REQUEST ITEMS FORM
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
                    placeholder="Control Number"
                    value={viewItem  ? viewItem .id : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <Typography variant="subtitle1">Date:</Typography>
                  <TextField
                    type="date"
                    name="Date"
                    placeholder="Date"
                    value={viewItem ? viewItem.Date : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={16}>
                    <Typography variant="subtitle1">Requisitioner:</Typography>
                  <TextField
                    type="text"
                    name="Requisitioner"
                    placeholder="Requisitioner"
                    value={viewItem  ? viewItem .Requisitioner : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <fieldset>
                    <legend name="Items">ITEMS:</legend>
                    <Checkbox
                      value="Mouse"
                      checked={viewItem && viewItem.Items.includes('Mouse')}
                      disabled
                    />
                    Mouse
                    <br />
                    <Checkbox
                      value="Keyboard"
                      checked={viewItem && viewItem.Items.includes('Keyboard')}
                      disabled
                    />
                    Keyboard
                    <br />
                    <Checkbox
                      value="Monitor"
                      checked={viewItem && viewItem.Items.includes('Monitor')}
                      disabled
                    />
                    Monitor
                    <br />
                    <Checkbox
                      value="AVR"
                      checked={viewItem && viewItem.Items.includes('AVR')}
                      disabled
                    />
                    AVR
                    <br />
                    <Checkbox
                      value="CPU"
                      checked={viewItem && viewItem.Items.includes('CPU')}
                      disabled
                    />
                    CPU
                    <br />
                    <div style={{ marginLeft: '42px' }}>
                    Others:
                    <input
                      type="text"
                      value={viewItem ? viewItem.otherItems : ''}
                      disabled
                    />
                    </div>
                  </fieldset>
                    </Grid>

                    <Grid item xs={8} spacing={1}>
                      <Grid>
                      <Typography variant="subtitle1">Location/Room:</Typography>
                  <TextField
                    type="text"
                    name="LocationRoom"
                    placeholder="Location/Room"
                    value={viewItem  ? viewItem .LocationRoom : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                        <br/>
                      </Grid>
                      <Grid>
                      <Typography variant="subtitle1">File:</Typography>
                    {viewItem && viewItem.fileURL ? (
                      <a href={viewItem.fileURL} target="_blank" rel="noreferrer noopener" download>
                        View / Download File
                      </a>
                    ) : (
                      "No File"
                    )}
                        <br/>
                      </Grid>
                    </Grid>
                  </Grid>

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

       {/* Dialog for Remove Button */}
    <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Remove Document</DialogTitle>
        <DialogContent>
          Do you want to delete or archive this document?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button>
          <Button onClick={handleConfirmDelete} style={{ color: 'orange' }}>Archive</Button>
        </DialogActions>
    </Dialog>
        
         {/* Dialog for Delete Button */}
    <Dialog
      open={deleteConfirmationDialogOpen}
      onClose={() => setDeleteConfirmationDialogOpen(false)}
    >
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {selectedItems.length} items?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDeleteAll} color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  

   
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="The Document was created successfully!"
      />
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


    </Container>
    </>
  );}


