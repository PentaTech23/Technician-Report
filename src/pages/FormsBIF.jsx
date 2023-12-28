import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import firebase from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, updateDoc, deleteDoc, addDoc, getDoc, documentId, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { initializeApp } from 'firebase/app';



import {Card,Grid,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow,
        MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,
        TablePagination,Dialog, DialogTitle, DialogContent, DialogActions, Button, 
        Backdrop, Snackbar, TableHead, CircularProgress, TextField, Select,
        FormControl, InputLabel } from '@mui/material';
        import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../components/iconify';

import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products'
import { useAuthState, db, mainCollectionRef, formsDocRef, BorrowersCollectionRef, archivesRef, archivesCollectionRef, storage } from '../firebase';

const firebaseConfig  = {
  apiKey: "AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc",
  authDomain: "wp4-technician-dms.firebaseapp.com",
  projectId: "wp4-technician-dms",
  storageBucket: "wp4-technician-dms.appspot.com",
  messagingSenderId: "1065436189229",
  appId: "1:1065436189229:web:88094d3d71b15a0ab29ea4"
}

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
export default function UserPage() {

  const [status, setStatus] = useState('initialStatus');
  const [documentId, setDocumentId] = useState(null);

  // useEffect(() => {
  //   const fetchDocumentId = async () => {
  //     try {
  //       // Reference to the subcollection "ITEM-BORROWERS" within "WP4-TESTING-AREA"
  //       const subcollectionRef = collection(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS');
  //       const querySnapshot = await getDocs(subcollectionRef);

  //       // Check if there are any documents in the subcollection
  //       if (querySnapshot.size === 0) {
  //         console.error('No documents found in the subcollection.');
  //         return;
  //       }

  //       // Assuming there is only one document in the subcollection
  //       const firstDocument = querySnapshot.docs[0];
  //       setDocumentId(firstDocument.id);
  //       console.log('Document ID:', firstDocument.id);
  //     } catch (error) {
  //       console.error('Error fetching document ID:', error);
  //     }
  //   };

  //   fetchDocumentId();
  // }, [firestore]);
  const [documentIds, setDocumentIds] = useState([]);

  useEffect(() => {
    const fetchDocumentIds = async () => {
      try {
        // Reference to the subcollection "ITEM-BORROWERS" within "WP4-TESTING-AREA"
        const subcollectionRef = collection(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS');
        const querySnapshot = await getDocs(subcollectionRef);
  
        // Check if there are any documents in the subcollection
        if (querySnapshot.size === 0) {
          console.error('No documents found in the subcollection.');
          return;
        }
  
        // Extract all document IDs from the querySnapshot
        const documentIds = querySnapshot.docs.map(doc => doc.id);
  
        // Set the document IDs state
        setDocumentIds(documentIds);
        console.log('Document IDs:', documentIds);
      } catch (error) {
        console.error('Error fetching document IDs:', error);
      }
    };
  
    fetchDocumentIds();
  }, [firestore]);


  // useEffect(() => {
  //   const fetchDocumentId = async () => {
  //     try {
  //       // Reference to the subcollection "ITEM-BORROWERS" within "WP4-TESTING-AREA"
  //       const subcollectionRef = collection(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS');
  //       const querySnapshot = await getDocs(subcollectionRef);
  
  //       // Check if there are any documents in the subcollection
  //       if (querySnapshot.size === 0) {
  //         console.error('No documents found in the subcollection.');
  //         return;
  //       }
  
  //       // Find the document with a specific condition (e.g., where status is 'someValue')
  //       const specificDocument = querySnapshot.docs.find(doc => doc.data().status === 'someValue');
  
  //       if (!specificDocument) {
  //         console.error('No document found with the specified condition.');
  //         return;
  //       }
  
  //       // Set the document ID state
  //       setDocumentId(specificDocument.id);
  //       console.log('Document ID:', specificDocument.id);
  //     } catch (error) {
  //       console.error('Error fetching document ID:', error);
  //     }
  //   };
  
  //   fetchDocumentId();
  // }, [firestore]);

  // const updateStatusInFirebase = async () => {
  //   try {
  //     if (!documentId) {
  //       console.error('Document ID is null. Cannot update status.');
  //       return;
  //     }
  
  //     // Reference to the specific document within the subcollection
  //     const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
  
  //     // Update the status field with the new value
  //     await updateDoc(statusRef, { status: 'PENDING (Dean)' });
  
  //     console.log('Status updated successfully!');
  //     setStatus('PENDING (Dean)'); // Update local state if needed
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //   }
  // };
  const updateStatusInFirebase = async () => {
    try {
      if (documentIds.length === 0) {
        console.error('No document IDs to update.');
        return;
      }
  
      // Update each document in the subcollection
      const updatePromises = documentIds.map(async (documentId) => {
        const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
        await updateDoc(statusRef, { status: 'PENDING (Dean)' });
      });
  
      // Wait for all updates to complete
      await Promise.all(updatePromises);
  
      console.log('Status updated successfully!');
      setStatus('PENDING (Dean)'); // Update local state if needed
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };






  // const [status, setStatus] = useState('initialStatus');
  // const [documentId, setDocumentId] = useState(null);

  // useEffect(() => {
  //   // Reference to the Firestore collection
  //   const collectionRef = firebase.firestore().collection('yourCollection');

  //   // Get documents from the collection
  //   collectionRef.get().then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       // Assuming there is only one document in the collection
  //       setDocumentId(doc.id);
  //     });
  //   });
  // }, []);

  // const updateStatusInFirebase = () => {
  //   const firestore = firebase.firestore();
  //   const statusRef = firestore.collection('mainCollectionRef').doc(documentId);

  //   // Update the status field with a new value
  //   statusRef.update({ status: 'PENDING (Dean)' })
  //     .then(() => {
  //       console.log('Status updated successfully!');
  //       setStatus('PENDING (Dean)'); // Update local state if needed
  //     })
  //     .catch((error) => {
  //       console.error('Error updating status:', error);
  //     });
  // };


  const exportToPDF = (viewItem) => {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF();
  
    // Get the content to be exported
    // const content = document.getElementById('pdf-content');
  
    // // Use html2canvas to capture the content as an image
    // html2canvas(content).then((canvas) => {
    //   const imgData = canvas.toDataURL('image/png');
  
    //   // Add the image to the PDF
    //   pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.text("BORROWER'S FORM", 20, 20);
    pdf.text(`Document ID: ${  viewItem ? viewItem.id : ""}`, 20, 30);
    pdf.text(`Date: ${  viewItem ? viewItem.Date : ""}`, 20, 40);
    pdf.text(`Faculty Name: ${  viewItem ? viewItem.FullName : ""}`, 20, 50);
    pdf.text(`Borrower: ${  viewItem ? viewItem.Borrower : ""}`, 20, 60);
  
    // Add checkboxes
    const itemsText = `ITEMS: ${  viewItem ? viewItem.Items.join(", ") : ""}`;
    pdf.text(itemsText, 20, 70);
  
    // Add location/room and file information
    pdf.text(`Location/Room: ${  viewItem ? viewItem.LocationRoom : ""}`, 20, 80);
    // const fileText = "File: " + (viewItem && viewItem.fileURL ? "View / Download File" : "No File");
    // pdf.text(fileText, 20, 90);
  
      // Save the PDF
      pdf.save('sample.pdf');
    
  };

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
    Date: '',
    FullName: '',
    LocationRoom: '',
    Borrower: '',
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
    FullName: '',
    LocationRoom: '',
    Borrower: '',
    Items: [], // If this is an array, it can be empty initially
    otherItems: '',
    fileURL: '',
  });

// Technician Show Query/table fetch from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(BorrowersCollectionRef);
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
      query(BorrowersCollectionRef, where('status', '!=', 'PENDING (Technician)'))
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
      query(BorrowersCollectionRef, where('uid', '==', userUID))
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
    const newDocumentName = `SRF-${nextNumber.toString().padStart(2, "0")}`;

    // Check if the document with the new name already exists
    const docSnapshot = await getDoc(doc(BorrowersCollectionRef, newDocumentName));

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
  
    const { Date, FullName, LocationRoom, Borrower, Items = [], otherItems, fileURL } = formData;
  
    // Validation logic for required fields
    if (!Date || !FullName || !LocationRoom || !Borrower) {
      alert('Please fill out all required fields');
      return;
    }
    try {
      const documentName = await incrementDocumentName();
      const docRef = doc(BorrowersCollectionRef, documentName);
  
      const docData = {
        Date,
        FullName,
        LocationRoom,
        Borrower,
        Items,
        otherItems,
        fileURL: fileURL || '',
        archived: false,
        originalLocation: "ITEM-BORROWERS",
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
  const fieldsToSearchIn = ['id', 'Date', 'FullName', 'LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataTechnician = fetchedDataTechnician.filter((item) => {
  const fieldsToSearchIn = ['id', 'Date', 'FullName', 'LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataDean = fetchedDataDean.filter((item) => {
  const fieldsToSearchIn = ['id', 'Date', 'FullName', 'LocationRoom', 'Borrower'];

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
      FullName: data.FullName || '',
      LocationRoom: data.LocationRoom || '',
      Borrower: data.Borrower || '',
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

    const docRef = doc(BorrowersCollectionRef, formData.id);

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
      const sourceDocumentRef = doc(BorrowersCollectionRef, documentToDelete);
      const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();
   
    await deleteDoc(doc(BorrowersCollectionRef, documentToDelete));
    
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
      await updateDoc(sourceDocumentRef, { archived: true, originalLocation: "ITEM-BORROWERS" });
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
      const newDocumentName = `SRF-${nextNumber.toString().padStart(2, "0")}`;

      // Add the document to the "Archives" collection with the new document name
      await setDoc(doc(archivesCollectionRef, newDocumentName), sourceDocumentData);

      // Delete the original document from the Service Request collection
      await deleteDoc(doc(BorrowersCollectionRef, documentToDelete));

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
      return deleteDoc(doc(BorrowersCollectionRef, itemId));
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
      switch (status) {
        case 'PENDING (Technician)':
          return 'orange';
          case 'PENDING (Dean)':
            return 'blue';
        case 'APPROVED':
          return 'green';
        case 'REJECTED':
          return 'red';
        default:
          return 'black'; // Default color if status doesn't match any case
      }
    };
    


      const [selectedOption, setSelectedOption] = useState('All');
    
      const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
      };
  

  return (
    <>
      <Helmet>
        <title> BORROWER'S FORM | Minimal UI </title>
      </Helmet>

        {/* This is the beginning of the Container for Faculty */}
        {isFaculty && ( 
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
          onClick={() => fetchUserDocuments(user?.uid)}
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
        <p>Selected Option: {selectedOption}</p>
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

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleClickOpen} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Document
          </Button>
        </div>
        
        <Dialog open={open} onClose={handleClose}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h3" sx={{ mb: 5 }} style={{ alignSelf: 'center', color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop:'10px' }}>
                BORROWER'S FORM
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
                    name="FullName"
                    label="Faculty Name"
                    value={formData.FullName || ''}
                    onChange={(e) => setFormData({ ...formData, FullName: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={16}>
                    <TextField
                    type="text"
                    name="Borrower"
                    label="Borrower"
                    value={formData.Borrower || ''}
                    onChange={(e) => setFormData({ ...formData, Borrower: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <fieldset>
                    <legend name="Items" >ITEMS:</legend>
                    <Checkbox
                      value="HDMI"
                      checked={formData.Items.includes('HDMI')}
                      onChange={handleServiceChange}
                    />
                    HDMI 
                    <br />
                    <Checkbox
                      value="Projector"
                      checked={formData.Items.includes('Projector')}
                      onChange={handleServiceChange}
                    />
                    Projector
                    <br />
                    <Checkbox
                      value="TV"
                      checked={formData.Items.includes('TV')}
                      onChange={handleServiceChange}
                    />
                    TV
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
                      { <Typography variant="subtitle1">File:</Typography> }
                      <TextField
                          type="file"
                          fullWidth
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
    </div>  
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
                <TableCell>Document ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Location/Room</TableCell>
                <TableCell>Borrower</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>File Status</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Menu</TableCell>
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
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.Date}</TableCell>
                  <TableCell>{item.FullName}</TableCell>
                  <TableCell>{item.LocationRoom}</TableCell>
                  <TableCell>{item.Borrower}</TableCell>
                  <TableCell>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                  <TableCell style={{ color: getStatusColor(item.status) }}>{item.status}</TableCell>
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
              <TableCell>Document ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Location/Room</TableCell>
              <TableCell>Borrower</TableCell>
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
                <TableCell>{item.Borrower}</TableCell>
                <TableCell>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                <TableCell style={{ color: getStatusColor(item.status) }}>{item.status}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex' }}>
                    <IconButton style={{ color: 'green' }}>
                      <CheckIcon onClick={updateStatusInFirebase} />
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
              <TableCell>Document ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Location/Room</TableCell>
              <TableCell>Borrower</TableCell>
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
                <TableCell>{item.Borrower}</TableCell>
                <TableCell>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                <TableCell style={{ color: getStatusColor(item.status) }}>{item.status}</TableCell>
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
                BORROWER'S FORM
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
                    name="Borrower"
                    label="Borrower"
                    value={editData ? editData.Borrower : ''}
                    onChange={(e) => setEditData({ ...editData, Borrower: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <fieldset>
                    <legend name="Items" >Items:</legend>
                    <Checkbox
                      value="HDMI"
                      checked={formData.Items.includes('HDMI')}
                      onChange={handleServiceChange}
                    />
                    HDMI
                    <br />
                    <Checkbox
                      value="Projector"
                      checked={formData.Items.includes('Projector')}
                      onChange={handleServiceChange}
                    />
                    Projector
                    <br />
                    <Checkbox
                      value="TV"
                      checked={formData.Items.includes('TV')}
                      onChange={handleServiceChange}
                    />
                    TV
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
               BORROWER'S FORM
            </Typography>
            <DialogContent id="pdf-content">
            <Grid
                    container
                    spacing={2}
                    columns={16}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={8}>
                    <Typography variant="subtitle1">Document ID:</Typography>
                  <TextField
                    type="text"
                    name="id"
                    placeholder="Docuent ID:"
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
                    <Typography variant="subtitle1">Faculty Name:</Typography>
                  <TextField
                    type="text"
                    name="FullName"
                    placeholder="Faculty Name"
                    value={viewItem  ? viewItem .FullName : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={16}>
                    <Typography variant="subtitle1">Borrower:</Typography>
                  <TextField
                    type="text"
                    name="Borrower"
                    placeholder="Borrower"
                    value={viewItem  ? viewItem .Borrower : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <fieldset>
                    <legend name="Items">ITEMS:</legend>
                    <Checkbox
                      value="HDMI"
                      checked={viewItem && viewItem.Items.includes('HDMI')}
                      disabled
                    />
                    HDMI
                    <br />
                    <Checkbox
                      value="Projector"
                      checked={viewItem && viewItem.Items.includes('Projector')}
                      disabled
                    />
                    Projector
                    <br />
                    <Checkbox
                      value="TV"
                      checked={viewItem && viewItem.Items.includes('TV')}
                      disabled
                    />
                    TV
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
            <Button variant="contained" onClick={() => exportToPDF(viewItem)} sx={{ marginRight: '5px', marginLeft: '5px' }}>
        Export to PDF
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


