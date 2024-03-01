import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
// import firebase from 'firebase/app';
import { getFirestore, collection, query, onSnapshot, doc, getDocs, where, orderBy, updateDoc, deleteDoc, addDoc, getDoc, documentId, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import {Card,Grid,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow, Box,
        MenuItem,TableBody,TableCell,Container,Typography,IconButton,TableContainer,
        TablePagination,Dialog, DialogTitle, DialogContent, DialogActions, Button, 
        Backdrop, Snackbar, TableHead, CircularProgress, TextField, Select,
        FormControl, InputLabel, Menu, Radio, RadioGroup, FormControlLabel, Drawer, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import { useAuthState, firebaseApp, db, mainCollectionRef, formsDocRef, BorrowersCollectionRef, archivesRef,archivesCollectionRef, storage } from '../../firebase';

import Scrollbar from '../../components/scrollbar';

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
  const updateStatusInFirebase = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'PENDING (Dean)' });
      console.log('Status updated successfully!');
      setStatus('PENDING (Dean)'); // Update local state if needed
      fetchAllDocuments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const updateStatusInFirebaseReject = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'REJECTED' });
      console.log('Status updated successfully!');
      setStatus('REJECTED'); // Update local state if needed
      fetchAllDocuments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };



  const updateStatusInFirebaseDean = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'APPROVED' });
      console.log('Status updated successfully!');
      setStatus('APPROVED'); // Update local state if needed
      DeanfetchAllDocuments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateStatusInFirebaseRejectDean = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'REJECTED' });
      console.log('Status updated successfully!');
      setStatus('REJECTED'); // Update local state if needed
      DeanfetchAllDocuments();
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
    userDate: '',
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
    userDate: '',
    LocationRoom: '',
    Borrower: '',
    Items: [],
    otherItems: '',
    fileURL: '',
  });

// Faculty Code for filter, status type:
  
  const [selectedOption, setSelectedOption] = useState('All');
    
  const handleOptionChange = (e) => {
    const selectedStatus = e.target.value;
    setSelectedOption(selectedStatus);
    fetchUserDocuments(user?.uid, selectedStatus);
  };
  



// Faculty data fetch from firestore 
const fetchUserDocuments = async (userUID, selectedStatus) => {
  setIsLoading(true);
  try {
    if (typeof userUID !== 'string') {
      console.error('Invalid userUID:', userUID);
      return;
    }

    let queryRef = query(BorrowersCollectionRef, where('uid', '==', userUID));

    // Exclude filter condition when selectedStatus is undefined or 'All'
    if (selectedStatus && selectedStatus !== 'All') {
      queryRef = query(queryRef, where('status', '==', selectedStatus));
    }

    const querySnapshotuid = await getDocs(queryRef);
    const dataFromFirestore = [];

    querySnapshotuid.forEach((doc) => {
      const data = doc.data();
      if (data) {
        data.id = doc.id;
        dataFromFirestore.push(data);
      }
    });

    setFetchedData(dataFromFirestore);
  } catch (error) {
    console.error("Error fetching user's documents from Firestore: ", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (user?.uid && selectedOption !== undefined) {
    fetchUserDocuments(user.uid, selectedOption);
  }
}, [user, selectedOption]);

// Technician Code for filter, status type:
 
const [selectedOptionTechnician, setSelectedOptionTechnician] = useState('PENDING (Technician)');
const [sortBy, setSortBy] = useState('newest'); // Default to 'newest'
const [dateFrom, setDateFrom] = useState('');
const [dateTo, setDateTo] = useState('');
const [location, setLocation] = useState('');
const [itemArray, setItemArray] = useState('');

const handleSortByChange = (value) => {
  setSortBy(value);
};

const handleDateFromChange = (event) => {
  setDateFrom(event.target.value);
};

const handleDateToChange = (event) => {
  setDateTo(event.target.value);
};

const handleLocationChange = (event) => {
  setLocation(event.target.value);
};

const handleItemArrayChange = (event) => {
  const { value, checked } = event.target;
  if (checked) {
    setItemArray([...itemArray, value]); // Add the selected item to itemArray
  } else {
    setItemArray(itemArray.filter(item => item !== value)); // Remove the deselected item from itemArray
  }
};

    
const handleOptionChangeTechnician = (e) => {
  const selectedStatusTechnician = e.target.value;
  console.log('Selected Status Technician:', selectedStatusTechnician); // Log the value
  setSelectedOptionTechnician(selectedStatusTechnician);
  fetchAllDocuments(selectedStatusTechnician, sortBy, dateFrom, dateTo, location);
};


// Technician data fetch from firestore
const fetchAllDocuments = async (selectedStatusTechnician, sortBy, dateFrom, dateTo, location, itemsArray) => {
  setIsLoading(true);
  try {
    let queryRefTechnician = BorrowersCollectionRef;

   // Build Firestore query with filter and sorting conditions combined
   if (selectedStatusTechnician) {
    if (selectedStatusTechnician === 'All') {
      if (sortBy === 'newest') {
        queryRefTechnician = query(queryRefTechnician, orderBy('timestamp', 'desc'));
      } else if (sortBy === 'oldest') {
        queryRefTechnician = query(queryRefTechnician, orderBy('timestamp', 'asc'));
      }
    } else if (selectedStatusTechnician === 'APPROVED' || selectedStatusTechnician === 'REJECTED' || selectedStatusTechnician === 'ARCHIVED') {
      if (sortBy === 'newest') {
        queryRefTechnician = query(queryRefTechnician, where('status', '==', selectedStatusTechnician), orderBy('timestamp', 'desc'));
      } else if (sortBy === 'oldest') {
        queryRefTechnician = query(queryRefTechnician, where('status', '==', selectedStatusTechnician), orderBy('timestamp', 'asc'));
      }
    } else if (selectedStatusTechnician === 'PENDING (Technician)' || selectedStatusTechnician === 'PENDING (Dean)') {
      if (sortBy === 'newest') {
        queryRefTechnician = query(queryRefTechnician, where('status', '==', selectedStatusTechnician), orderBy('timestamp', 'desc'));
      } else if (sortBy === 'oldest') {
        queryRefTechnician = query(queryRefTechnician, where('status', '==', selectedStatusTechnician), orderBy('timestamp', 'asc'));
      }
    }
  }

  // Apply date range filtering if both dateFrom and dateTo are provided
  if (dateFrom && dateTo) {
    // Convert date strings to Firestore Timestamps
    const startDate = new Date(dateFrom);
    const endDate = new Date(dateTo);
    // Adjust end date to include documents on the end date
    endDate.setHours(23, 59, 59, 999);

    // Add date range condition to the query
    queryRefTechnician = query(queryRefTechnician, where('timestamp', '>=', startDate), where('timestamp', '<=', endDate));
  }

  // Apply location filter if location is provided
  if (location) {
    queryRefTechnician = query(queryRefTechnician, where('LocationRoom', '==', location));
  }
   

    const querySnapshot = await getDocs(queryRefTechnician);
    const dataFromFirestore = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        data.id = doc.id;
        dataFromFirestore.push(data);
      }
    });
    setFetchedDataTechnician(dataFromFirestore);
  } catch (error) {
    console.error("Error fetching data from Firestore: ", error);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchAllDocuments(selectedOptionTechnician, sortBy, dateFrom, dateTo, location,);
  }, [selectedOptionTechnician, sortBy, dateFrom, dateTo, location,]);

// Dean Code for filter, status type:
  
const [selectedOptionDean, setSelectedOptionDean] = useState('PENDING (Dean)');
    
const handleOptionChangeDean = (e) => {
  const selectedStatusDean = e.target.value;
  setSelectedOptionDean(selectedStatusDean);
  DeanfetchAllDocuments(selectedStatusDean);
};

// Dean fetch data from firestore
const DeanfetchAllDocuments = async (selectedStatusDean) => {
  setIsLoading(true);
  try {
    let queryRefDean = BorrowersCollectionRef; // Remove 'where' clause here

     // Exclude filter condition when selectedStatus is undefined or 'All'
     if (selectedStatusDean && selectedStatusDean !== 'All') 
     {
      queryRefDean = query(queryRefDean, where('status', '==', selectedStatusDean));
     }

   const querySnapshot = await getDocs(queryRefDean);
   const dataFromFirestore = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        data.id = doc.id;
        dataFromFirestore.push(data);
      }
    });
    setFetchedDataDean(dataFromFirestore);
  } catch (error) {
    console.error("Error fetching data from Firestore: ", error);
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  DeanfetchAllDocuments(selectedOptionDean);
}, []);



// Function to increment the document name

  const incrementDocumentName = async (nextNumber = 0) => {
    const newDocumentName = `BIF-${nextNumber.toString().padStart(2, "0")}`;

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
  
    const { userDate, LocationRoom, Borrower, Items = [], otherItems, fileURL } = formData;
  
    // Validation logic for required fields
    if (!userDate || !LocationRoom || !Borrower) {
      alert('Please fill out all required fields');
      return;
    }
    try {
      const documentName = await incrementDocumentName();
      const docRef = doc(BorrowersCollectionRef, documentName);
  
      const docData = {
        userDate,
        timestamp: new Date(),
        LocationRoom,
        FullName : Borrower || '',
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
      fetchUserDocuments(user?.uid);
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
  const fieldsToSearchIn = ['id', 'Date', 'LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataTechnician = fetchedDataTechnician.filter((item) => {
  const fieldsToSearchIn = ['id', 'Date', 'LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataDean = fetchedDataDean.filter((item) => {
  const fieldsToSearchIn = ['id', 'Date','LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

// This one is for the Edit button for Faculty only
const [editData, setEditData] = useState(null);
const [editOpen, setEditOpen] = useState(false);

const handleEditOpen = (data) => {
  if (data && data.id) {
    // Populate the form fields with existing data
    setFormData({
      ...formData,
      Date: data.Date || '',
      timestamp: data.timestamp ? new Date(data.timestamp) : '',
      LocationRoom: data.LocationRoom || '',
      FullName: data.Borrower || '',
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
    fetchUserDocuments(user?.uid);
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
        const match = docName.match(/^BIF-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!Number.isNaN(num) && num >= nextNumber) {
            nextNumber = num + 1;
          }
        }
      });

      // Generate the new document name
      const newDocumentName = `BIF-${nextNumber.toString().padStart(2, "0")}`;

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
const [rowsPerPage, setRowsPerPage] = useState(5);

const startIndex = page * rowsPerPage;
const endIndex = startIndex + rowsPerPage;
const displayedData = filteredData.slice(startIndex, endIndex);
const displayedDataTechnician = filteredDataTechnician.slice(startIndex, endIndex);
const displayedDataDean = filteredDataDean.slice(startIndex, endIndex);

const handlePageChange = (event, newPage) => { 
  setPage(newPage);
};

const handleRowsPerPageChange = (event) => {
  const newRowsPerPage = parseInt(event.target.value, 10);
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

const handleSelectAllFaculty = () => {
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

const handleSelectAllTechnician = () => {
  if (bulkDeleteMode) {
    // If bulk delete mode is already active, clear the selected items
    setSelectedItems([]);
  } else {
    // If bulk delete mode is not active, select all items
    const allDocumentIds = fetchedDataTechnician.map((item) => item.id);
    setSelectedItems(allDocumentIds);
  }
  setBulkDeleteMode(!bulkDeleteMode);
  setSelectAll(!selectAll); // Toggle the selectAll state
};

const handleSelectAllDean = () => {
  if (bulkDeleteMode) {
    // If bulk delete mode is already active, clear the selected items
    setSelectedItems([]);
  } else {
    // If bulk delete mode is not active, select all items
    const allDocumentIds = fetchedDataDean.map((item) => item.id);
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

    const getStatusColor = (status) => {
      if (status === 'APPROVED') {
        return 'success'; // Green color for 'APPROVED'
      }
      if (status === 'PENDING (Dean)') {
        return 'warning'; // Orange color for 'Pending (Dean)'
      }
      if (status === 'PENDING (Technician)') {
        return 'warning'; // Orange color for 'Pending (Technician)'
      }
      if (status === 'REJECTED') {
        return 'error'; // Red color for 'REJECTED'
      }
      if (status === 'ARCHIVED') {
        return 'info'; // Blue/Default color for 'ARCHIVED'
      }
      return 'info'; // Default color for other status values
    };
    
    // const getStatusColor = (status) => {
    //   switch (status) {
    //     case 'PENDING (Technician)':
    //       return 'orange';
    //       case 'PENDING (Dean)':
    //         return 'blue';
    //     case 'APPROVED':
    //       return 'success';
    //     case 'REJECTED':
    //       return 'banned';
    //     default:
    //       return 'red'; // Default color if status doesn't match any case
    //   }
    // };

// Filter code

const SORT_BY_OPTIONS = [
  { value: 'oldest', label: 'Oldest' },
  { value: 'newest', label: 'Newest' },
];


const FILTER_CATEGORY_OPTIONS = [
  'HDMI',
  'Projector',
  'TV',
  'Others',
];


// ----------------------------------------------------------------------



const [openFilter, setOpenFilter] = useState(false);
 
    const handleOpenFilter = () => {
      setOpenFilter(true);
    };
  
    const handleCloseFilter = () => {
      setOpenFilter(false);
    };

const [openSidebar, setOpenSidebar] = useState(null);

    const handleOpenSidebar = (event) => {
      setOpenSidebar(event.currentTarget);
    };
  
    const handleCloseSidebar = () => {
      setOpenSidebar(null);
    };
  
  return (
    <>
      <Helmet>
        <title> BORROWER'S FORM | Minimal UI </title>
      </Helmet>

        {/* This is the beginning of the Container for Faculty */}
        {isFaculty && ( 
      <Container  maxWidth='xl' >
  
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
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

        <Button onClick={handleClickOpen} style={{ backgroundColor:'#33b249' }} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Document
        </Button>
 
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
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="REJECTED">REJECTED</MenuItem>
            <MenuItem value="PENDING (Technician)">PENDING (Technician)</MenuItem>
            <MenuItem value="PENDING (Dean)">PENDING (Dean)</MenuItem>
            <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
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
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={handleOpenFilter}>
        Filters&nbsp;
      </Button>
      <Button
          onClick={() => fetchUserDocuments(user?.uid, selectedOption)}
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
          startIcon={<RefreshIcon />} />

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
              <Typography variant="h3" sx={{ mb: 5 }} 
              style={{
                      alignSelf: 'center', color: '#ff5500', margin: 'auto', 
                      fontSize: '40px', fontWeight: 'bold', marginTop:'10px',   
                      }}>
                Borrower's Form
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
                    <Typography variant="subtitle1">Date:</Typography>
                      <TextField
                        type="date"
                        name="Date"
                        value={formData.userDate || ''}
                        onChange={(e) => setFormData({ ...formData, userDate: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                    <Typography variant="subtitle1">Location/Room:</Typography>
                      <FormControl sx={{ width: '100%', marginBottom: '10px' }} >
                        <Select   
                          id="location-room"
                          value={formData.LocationRoom || ''}
                          onChange={(e) => setFormData({ ...formData, LocationRoom: e.target.value })}
                          style={{ maxHeight: '100px' }}
                        >
                          {Array.from({ length: 20 }, (_, i) => ( // Generate options dynamically
                            <MenuItem
                            key={`IT-${101 + i}`} // Start key and value from 100
                            value={`IT ${101 + i}`}
                          >
                            {`IT ${101 + i}`}
                          </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={16}>
                    <Typography variant="subtitle1">Borrower:</Typography>
                      <TextField
                        type="text"
                        name="Borrower's Name"
                        value={formData.Borrower || ''}
                        onChange={(e) => setFormData({ ...formData, Borrower: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    
                  <Grid item xs={16}> <Typography variant="subtitle1">Items:</Typography></Grid>
                  <Grid item xs={5}>
                    <Checkbox
                      value="HDMI"
                      checked={formData.Items.includes('HDMI')}
                      onChange={handleServiceChange}
                    />  HDMI 
                    <br />
                    </Grid>
                    <Grid item xs={5}>
                    <Checkbox
                      value="TV"
                      checked={formData.Items.includes('TV')}
                      onChange={handleServiceChange}
                    /> TV
                    <br />
                    </Grid>
                    <Grid item xs={6}> 
                    <Checkbox
                      value="Projector"
                      checked={formData.Items.includes('Projector')}
                      onChange={handleServiceChange}
                    /> Projector
                    <br />
                    </Grid>

                    <Grid item xs={12}>
                      <div style={{marginLeft:'15px'}}> 
                        Others:
                        <input
                          type="text"
                          style={{fontSize:'18px'}}
                          name="Others:"
                          value={formData.otherItems || ''}
                          onChange={(e) => setFormData({ ...formData, otherItems: e.target.value })}
                          />
                      </div>
                    </Grid>

                    <Grid item xs={8} spacing={1}>
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
                  <Button style={{ color:'#ffffff', backgroundColor:'#333333', border: '0.5px solid black' }} variant="contained" onClick={clearForm} sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Clear 
                  </Button>
                  <Button style={{ backgroundColor:'#ffbd03' }} variant="contained" onClick={handleClose} sx={{marginRight: '5px', marginLeft: '5px'}}>
                    Cancel
                  </Button>
                  <Button style={{ backgroundColor:'#33b249' }} variant="contained" onClick={handleSubmit} type="submit" sx={{marginRight: '5px', marginLeft: '5px'}}>
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
        <TableContainer component={Paper} style={{ maxHeight: 500 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAllFaculty}
                  color="primary"
                />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>Document ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Date</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Timestamp</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Location/Room</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Borrower</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Items</TableCell>
                <TableCell style={{ textAlign: 'center' }}>File Status</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Menu</TableCell>
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
                  <TableCell style={{ textAlign: 'center' }}>{item.id}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.userDate}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {item.timestamp && item.timestamp.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.LocationRoom}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{item.Borrower}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
                  </TableCell>
            
                  <TableCell style={{ textAlign: 'center' }}>
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
  <Container  maxWidth='xl' >

    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
      </Typography>
      <p>Selected Option: {selectedOptionTechnician}</p>
      </Stack>

      <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
      >


<Stack direction="row" alignItems="center" justifyContent="space-between">
      <div style={{ marginLeft: '10px'}}>
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="options-label">File Status:</InputLabel>
          <Select
            labelId="options-label"
            id="options"
            value={selectedOptionTechnician}
            onChange={handleOptionChangeTechnician}
            label="Select an option"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="REJECTED">REJECTED</MenuItem>
            <MenuItem value="PENDING (Technician)">PENDING (Technician)</MenuItem>
            <MenuItem value="PENDING (Dean)">PENDING (Dean)</MenuItem>
            <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
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
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} 
        onClick={handleOpenFilter}>
          Filters&nbsp;
      </Button>
        <Button
          onClick={() => fetchAllDocuments(selectedOptionTechnician)}
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
          startIcon={<RefreshIcon />} />

        <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleFilterByName}
            sx={{ width: '%' }}
          />
        </div>
      </Stack> 
      
  {/* End of Technician usertype view for Search bar (top side) */}

  {/* Start of Technician usertype view for tables */}

    {isLoading ? (
      <CircularProgress />
    ) : (
      <TableContainer component={Paper} style={{ maxHeight: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllTechnician}
                color="primary"
              />
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>Document ID</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Date</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Timestamp</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Location/Room</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Borrower</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Items</TableCell>
              <TableCell style={{ textAlign: 'center' }}>File Status</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Action</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Menu</TableCell>

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
                <TableCell style={{ textAlign: 'center' }}>{item.id}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.userDate}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {item.timestamp && item.timestamp.toDate().toLocaleString()}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.LocationRoom}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.Borrower}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <div style={{ display: 'center' }}>
                    <IconButton style={{ color: 'green' }}  onClick={() => updateStatusInFirebase(item.id)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton style={{ color: 'red' }} onClick={() => updateStatusInFirebaseReject(item.id)} >
                      <CloseIcon />
                    </IconButton>
                  </div>
                </TableCell>
                
                <TableCell  style={{ textAlign: 'center' }}>
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
      rowsPerPageOptions={[5, 10, 25]}
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
  <Container  maxWidth='xl' >
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
      </Typography>
      <p>Selected Option: {selectedOption}</p>
      </Stack>

      <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={5}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
      >


<Stack direction="row" alignItems="center" justifyContent="space-between">
      <div style={{ marginLeft: '10px'}}>
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="options-label">File Status:</InputLabel>
          <Select
            labelId="options-label"
            id="options"
            value={selectedOptionDean}
            onChange={handleOptionChangeDean}
            label="Select an option"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="REJECTED">REJECTED</MenuItem>
            <MenuItem value="PENDING (Technician)">PENDING (Technician)</MenuItem>
            <MenuItem value="PENDING (Dean)">PENDING (Dean)</MenuItem>
            <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
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
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={handleOpenFilter}>
        Filters&nbsp;
      </Button>
        <Button
          onClick={() => DeanfetchAllDocuments(selectedOptionDean)}
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
          startIcon={<RefreshIcon />} />

        <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleFilterByName}
            sx={{ width: '%' }}
          />
        </div>
      </Stack> 
      
  {/* End of Dean usertype view for Search bar (top side) */}

  {/* Start of Dean usertype view for tables */}
 
    {isLoading ? (
      <CircularProgress />
    ) : (
      <TableContainer component={Paper} style={{ maxHeight: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllDean}
                color="primary"
              />
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>Document ID</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Date</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Timestamp</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Location/Room</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Borrower</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Items</TableCell>
              <TableCell style={{ textAlign: 'center' }}>File Status</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Action</TableCell>
              <TableCell style={{ textAlign: 'center' }}>Menu</TableCell>

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
                <TableCell style={{ textAlign: 'center' }}>{item.id}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.userDate}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {item.timestamp && item.timestamp.toDate().toLocaleString()}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.LocationRoom}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{item.Borrower}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{`${item.Items}${item.otherItems ? `, ${item.otherItems}` : ''}`}</TableCell>
                {/* <TableCell style={{ color: getStatusColor(item.status) }}>{item.status}</TableCell> */}
                <TableCell style={{ textAlign: 'center' }}>
                  <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <div style={{ display: 'center' }}>
                    <IconButton style={{ color: 'green' }}>
                      <CheckIcon onClick={() => updateStatusInFirebaseDean(item.id)} />
                    </IconButton>
                    <IconButton style={{ color: 'red' }}>
                      <CloseIcon onClick={() => updateStatusInFirebaseRejectDean(item.id)} />
                    </IconButton>
                  </div>
                </TableCell>
              
                <TableCell style={{ textAlign: 'center' }}>
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
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={filteredDataDean.length} // Make sure this reflects the total number of rows
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
                    <Typography variant="subtitle1">Document ID:</Typography>
                    <TextField
                    type="text"
                    name="id"
                    value={editData ? editData.id : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                    <Typography variant="subtitle1">Timestamp:</Typography>
                    <TextField
                    type="timestamp"
                    name="timestamp"
                    value={editData ? editData.timestamp.toDate().toLocaleString() : ''}
                    disabled
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    <Grid item xs={8}>
                      <Typography variant="subtitle1">Date:</Typography>
                        <TextField
                          type="date"
                          name="Date"
                          value={editData ? editData.userDate : ''}
                          onChange={(e) => setEditData({ ...editData, userDate: e.target.value })}
                          sx={{ width: '100%', marginBottom: '10px' }}
                        />
                    </Grid>

                    <Grid item xs={8}>
                    <Typography variant="subtitle1">Location/Room:</Typography>
                        <FormControl sx={{ width: '100%', marginBottom: '10px' }} >
                          <Select   
                            id="location-room"
                            value={editData ? editData.LocationRoom : ''}
                            onChange={(e) => setEditData({ ...editData, LocationRoom: e.target.value })}
                            style={{ maxHeight: '100px' }}
                          >
                            {Array.from({ length: 20 }, (_, i) => ( // Generate options dynamically
                              <MenuItem
                              key={`IT-${101 + i}`} // Start key and value from 100
                              value={`IT ${101 + i}`}
                            >
                              {`IT ${101 + i}`}
                            </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={16}>
                    <Typography variant="subtitle1">Borrower:</Typography>
                    <TextField
                    type="text"
                    name="Borrower"
                    value={editData ? editData.Borrower : ''}
                    onChange={(e) => setEditData({ ...editData, Borrower: e.target.value })}
                    sx={{ width: '100%', marginBottom: '10px' }}
                  />
                    </Grid>

                    
                    <Grid item xs={16}> <Typography variant="subtitle1">Items:</Typography></Grid>
                    <Grid item xs={5}>
                      <Checkbox
                        value="HDMI"
                        checked={formData.Items.includes('HDMI')}
                        onChange={handleServiceChange}
                      />  HDMI 
                      <br />
                      </Grid>
                      <Grid item xs={5}>
                      <Checkbox
                        value="TV"
                        checked={formData.Items.includes('TV')}
                        onChange={handleServiceChange}
                      /> TV
                      <br />
                      </Grid>
                      <Grid item xs={6}> 
                      <Checkbox
                        value="Projector"
                        checked={formData.Items.includes('Projector')}
                        onChange={handleServiceChange}
                      /> Projector
                      <br />
                      </Grid>
                      <Grid item xs={12}>
                        <div style={{marginLeft:'15px'}}>
                          Others:
                            <input
                              type="text"
                              style={{fontSize:'18px'}}
                              value={editData  ? editData .otherItems :''}
                              onChange={(e) => setEditData({ ...editData, otherItems: e.target.value })}
                            />
                        </div>
                     </Grid>

                  

                    <Grid item xs={8} spacing={1}>
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
            <Button style={{ backgroundColor:'#ffbd03' }} variant="contained" onClick={handleEditClose} sx={{marginRight: '5px', marginLeft: '5px'}}>
              Cancel
            </Button>
            <Button style={{ backgroundColor:'#33b249' }} variant="contained" onClick={handleEditSubmit} type="submit" sx={{marginRight: '5px', marginLeft: '5px'}}>
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
              Borrower's Form
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
                          placeholder="Document ID:"
                          value={viewItem  ? viewItem .id : ''}
                          disabled
                          sx={{ width: '100%', marginBottom: '10px' }}
                        />
                      </Grid>

                    <Grid item xs={8}>
                      <Typography variant="subtitle1">Location/Room:</Typography>
                        <TextField
                          type="text"
                          name="LocationRoom"
                          placeholder="Location/Room"
                          value={viewItem  ? viewItem .LocationRoom : ''}
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
                        value={viewItem ? viewItem.userDate : ''}
                        disabled
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>

                    <Grid item xs={8}>
                    <Typography variant="subtitle1">Timestamp:</Typography>
                      <TextField
                        type="text"
                        name="id"
                        placeholder="Timestamp"
                        value={viewItem  ? viewItem .timestamp.toDate().toLocaleString() : ''}
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

                    <Grid item xs={16}> <Typography variant="subtitle1">Items:</Typography></Grid>
                    <Grid item xs={5}>
                      <Checkbox
                        value="HDMI"
                        checked={viewItem && viewItem.Items.includes('HDMI')}
                        disabled
                      />  HDMI
                      <br />
                    </Grid>
                    <Grid item xs={5}>
                    <Checkbox
                      value="TV"
                      checked={viewItem && viewItem.Items.includes('TV')}
                      disabled
                    /> TV
                    <br />
                    </Grid>
                    <Grid item xs={6}>
                    <Checkbox
                      value="Projector"
                      checked={viewItem && viewItem.Items.includes('Projector')}
                      disabled
                    /> Projector
                    <br />
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{marginLeft:'15px'}}>
                          Others:
                          <input
                            type="text"
                            style={{fontSize:'18px'}}
                            value={viewItem ? viewItem.otherItems : ''}
                            disabled
                          />
                        </div>
                    </Grid>

                    <Grid item xs={8} spacing={1}>
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
            <Button style={{ backgroundColor:'#ffbd03' }}  variant="contained" onClick={handleViewClose} sx={{ marginRight: '5px', marginLeft: '5px' }}>
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


<Drawer
        anchor="right"
        open={openFilter}
        onClose={handleCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={handleCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>
        <Divider/>
        <Scrollbar>
          <Typography variant="subtitle1" sx={{ ml: 3, mt: 3, }}>
            Sort By:
              <Button
                variant="subtitle1" sx={{ ml: 1}}
                alignItems="left"
                display="flex"
                color="inherit"
                onClick={handleOpenSidebar}
                endIcon={<Iconify icon={openSidebar ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              >
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {sortBy === 'newest' ? 'Newest' : 'Oldest'}
              </Typography>
            </Button>
          </Typography>
          <Menu
            keepMounted
            anchorEl={openSidebar}
            open={Boolean(openSidebar)}
            onClose={handleCloseSidebar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {SORT_BY_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === sortBy}
                onClick={() => {
                  handleSortByChange(option.value);
                  handleCloseSidebar();
                }}
                sx={{ typography: 'body2' }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Date From:
            </Typography>
            <TextField
              id="dateFrom"
              size="small"
              type="date"
              value={dateFrom}
              onChange={handleDateFromChange}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Date To:
            </Typography>
            <TextField
              id="dateTo"
              size="small"
              type="date"
              value={dateTo}
              onChange={handleDateToChange}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Location/Room:
            </Typography>
            <Select   
              style={{ maxHeight: '100px' }}
              id="location"
              size="small"
              value={location}
              onChange={handleLocationChange}
            >
              <MenuItem value="">None</MenuItem> {/* Option for not choosing any location */}
              {Array.from({ length: 20 }, (_, i) => (
                <MenuItem
                  key={`IT-${101 + i}`} // Start key and value from 100
                  value={`IT ${101 + i}`}
                >
                  {`IT ${101 + i}`}
                </MenuItem>
              ))}
            </Select>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                Items
              </Typography>
              <fieldset>
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <div key={item}>
                    <Checkbox
                      value={item}
                      checked={itemArray.includes(item)}
                      onChange={handleItemArrayChange}
                    />
                    {item}
                    <br />
                  </div>
                ))}
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
            </div>
          </Stack>
        </Scrollbar>
        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>

    </Container>
    </>
  );}


