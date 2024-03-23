import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, documentId, setDoc } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';

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
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  InputAdornment,
  Snackbar,
  TableHead,
  CircularProgress,
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
// components
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
// sections

import { userCollectionRef, firebaseApp, db, useAuthState, archivesRef, storage } from '../../firebase';

// ----------------------------------------------------------------------

export default function UserPage() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const currentPageUrl = window.location.pathname;
    localStorage.setItem('currentPageUrl', currentPageUrl);
  }, []);

  useEffect(() => {
    const storedPageUrl = localStorage.getItem('currentPageUrl');
    if (!storedPageUrl) {
      navigate('/dashboard'); // Navigate to the default page if there's no stored URL
    }
  }, [navigate]);


  const [fetchedData, setFetchedData] = useState([]);
  const [data, setData] = useState([]);
  const [fetchedDataDean, setFetchedDataDean] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle change function
  const [formData, setFormData] = useState({
    email:'',
    status:'',
    timestamp:'',
    userType:'',
    username:'',
});


const DeanfetchAllDocuments = async () => {
  setIsLoading(true);

  try {
    const querySnapshot = await getDocs(userCollectionRef)
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

//  This one is for Search bar
const [searchQuery, setSearchQuery] = useState('');

const handleFilterByName = (event) => {
  setPage(0);
  setSearchQuery(event.target.value);
};

const filteredDataDean = fetchedDataDean.filter((item) => {
  const fieldsToSearchIn = [ 'userType', 'userName', 'email', 'timestamp', 'status'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});


  // Code for Edit Button 
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditOpen = (data) => {
    if (data && data.id) {
      setFormData({
        ...formData,
        email: data.email || '',
        status: data.status || '',
        timestamp: data.timestamp || '',
        userType: data.userType || '',
        username: data.username || '',
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
      const docRef = doc(userCollectionRef, formData.id);
 
      editData.fileURL = formData.fileURL;
      console.log('Data to be sent to Firestore:', formData);

    if (formData.id) {
     
      await updateDoc(docRef, editData);
    } else {
      
      await setDoc(docRef, editData);
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
      const sourceDocumentRef = doc(userCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();
   
    await deleteDoc(doc(userCollectionRef, documentToDelete));
    
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
      const sourceDocumentRef = doc(userCollectionRef, documentToDelete);
      // Set the 'originalLocation' field to the current collection and update the Archive as true
      await updateDoc(sourceDocumentRef, { archived: true, originalLocation: "WP4-pendingUsers" });
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();


      // Fetch existing document names from the Archives collection
      const archivesQuerySnapshot = await getDocs(archivesRef);
      const existingDocumentNames = archivesQuerySnapshot.docs.map((doc) => doc.id);

      // Find the highest number and increment it by 1
      let nextNumber = 0;
      existingDocumentNames.forEach((docName) => {
        const match = docName.match(/^USERS-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!Number.isNaN(num) && num >= nextNumber) {
            nextNumber = num + 1;
          }
        }
      });

      // Generate the new document name
      const newDocumentName = `USERS-${nextNumber.toString().padStart(2, "0")}`;

      // Add the document to the "Archives" collection with the new document name
      await setDoc(doc(archivesRef, newDocumentName), sourceDocumentData);

      // Delete the original document from the Service Request collection
      await deleteDoc(doc(userCollectionRef, documentToDelete));

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
      return deleteDoc(doc(userCollectionRef, itemId));
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



useEffect(() => {
  DeanfetchAllDocuments();
}, []);

  const getStatusColor = (status) => {
    console.log('Status:', status); // Add this line for debugging

    if (status === 'registered') {
      return 'success'; // Green color for 'approved'
    }
    if (status === 'pending') {
      return 'warning'; // Orange color for 'pending'
    }
    if (status === 'REJECTED') {
      return 'error'; // Red color for 'reject'
    }
    return 'info'; // Default color for other status values
  };
  


  const [openFilter, setOpenFilter] = useState(false);
 
  const handleOpenFilter = () => {
       setOpenFilter(true);
     };
   
     const handleCloseFilter = () => {
       setOpenFilter(false);
     };

     
     const [selectedOption, setSelectedOption] = useState('All');
    
     const handleOptionChange = (e) => {
       setSelectedOption(e.target.value);
     };

     

// This one is for Pagination


const [page, setPage] = useState(0); // Add these state variables for pagination
const [rowsPerPage, setRowsPerPage] = useState(5);

const startIndex = page * rowsPerPage;
const endIndex = startIndex + rowsPerPage;
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
        </div>  
      </Stack>

      {isLoading ? (
        <CircularProgress />
      ) : (
      
            <TableContainer sx={{ minWidth: 800 }} component={Paper}>
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
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
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
                          <TableCell>{item.username}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>{item.timestamp && item.timestamp.toDate().toLocaleString()}</TableCell>
                          <TableCell>{item.userType}</TableCell>
                          <TableCell >
                            <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDataDean.length}
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
            <MenuItem onClick={() => handleEditOpen(selectedItem)}>Edit</MenuItem>
            <MenuItem onClick={() => handleDelete(selectedItem.id)}>Remove</MenuItem>
          </Popover>
        </Container>


     

      {/* This is the container for the Edit button, Dean's User page edit view  */}
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
                INSPECTION REPORT
              </Typography>
              <DialogContent>
                <form onSubmit={handleEditSubmit}>
                 
                  <Grid container spacing={1} columns={8}>

                    <Grid item xs={2}>
                      <TextField
                        type="date"
                        name="Date"
                        variant="outlined"
                        size="small"
                        label="Date"
                        value={editData ? editData.Date : ''}
                        onChange={(e) => setEditData({ ...editData, Date: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                  </Grid>
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
      </Dialog>

          {/* Other code like snackbar, dialogs */}
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
        open={snackbarOpen1}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen1(false)}
        message="The Document was edited successfully!"
      />
      <Snackbar
        open={snackbarOpenArchive}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenArchive(false)}
        message="The Document was archived successfully!"
      />
      <Snackbar
        open={snackbarOpenDelete}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenDelete(false)}
        message="The Document was deleted successfully!"
      />


    </>
  );
}
