import { Helmet } from 'react-helmet-async';
import React, { useRef, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
// import firebase from 'firebase/app';
import { serverTimestamp, getFirestore, collection, query, onSnapshot, doc, getDocs, where, orderBy, updateDoc, deleteDoc, addDoc, getDoc, documentId, setDoc } from '@firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import {Modal, Card,Grid,Table,Stack,Paper,Avatar,Popover,Checkbox,TableRow, Box,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import CircularProgressWithLabel from '../PageComponents/CircularProgressWithLabel'
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Cict from '../../components/logo/CICTbSULOGO.png'

import { useAuthState, firebaseApp, db, mainCollectionRef, userCollectionRef, formsDocRef, BorrowersCollectionRef, notificationCollectionRef, archivesRef,archivesCollectionRef, storage } from '../../firebase';

import Scrollbar from '../../components/scrollbar';

const firestore = getFirestore(firebaseApp);
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
  

  const [status, setStatus] = useState('initialStatus');
  const [documentId, setDocumentId] = useState(null);
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


// Faculty File Status Update Archive
const updateStatusInFirebaseArchiveFaculty = async (documentId) => {
  try {
    const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
    await updateDoc(statusRef, { status: 'ARCHIVED' });
    setSnackbarOpenArchive(true);
    setStatus('ARCHIVED'); 
    fetchUserDocuments(
      user?.uid,  
      selectedOptionFaculty, 
      sortByFaculty, 
      dateFromFaculty, 
      dateToFaculty, 
      locationFaculty, 
      selectedFilterItemsFaculty, 
      otherItemsFaculty);
  } catch (error) {
    console.error('Error updating status:', error);
  }
  setArchiveDialogOpen(false);
};

// Technician File Status Update
  const updateStatusInFirebase = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'PENDING (Dean)' });
      setSnackbarOpenApproved(true);
      setStatus('PENDING (Dean)'); // Update local state if needed
      fetchAllDocuments(
        selectedOptionTechnician, 
        sortBy, 
        dateFrom, 
        dateTo, 
        location, 
        selectedFilterItems, 
        otherItems
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const updateStatusInFirebaseReject = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'REJECTED' });
      setSnackbarOpenRejected(true);
      setStatus('REJECTED'); // Update local state if needed
      fetchAllDocuments(
        selectedOptionTechnician, 
        sortBy, 
        dateFrom, 
        dateTo, 
        location, 
        selectedFilterItems, 
        otherItems
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };


  const updateStatusInFirebaseArchive = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'ARCHIVED' });
      setSnackbarOpenArchive(true);
      setStatus('ARCHIVED'); // Update local state if needed
      fetchAllDocuments(
        selectedOptionTechnician, 
        sortBy, 
        dateFrom, 
        dateTo, 
        location, 
        selectedFilterItems, 
        otherItems
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setArchiveDialogOpen(false);
  };

// Dean File Status Update

  const updateStatusInFirebaseDean = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'APPROVED' });
      setSnackbarOpenApproved(true);
      setStatus('APPROVED'); // Update local state if needed
      DeanfetchAllDocuments(
        selectedOptionDean, 
        sortByDean, 
        dateFromDean, 
        dateToDean, 
        locationDean, 
        selectedFilterItemsDean, 
        otherItemsDean
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateStatusInFirebaseRejectDean = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'REJECTED' });
      setSnackbarOpenRejected(true);
      setStatus('REJECTED'); // Update local state if needed
      DeanfetchAllDocuments(
        selectedOptionDean, 
        sortByDean, 
        dateFromDean, 
        dateToDean, 
        locationDean, 
        selectedFilterItemsDean, 
        otherItemsDean
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updateStatusInFirebaseArchiveDean = async (documentId) => {
    try {
      const statusRef = doc(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS', documentId);
      await updateDoc(statusRef, { status: 'ARCHIVED' });
      setSnackbarOpenArchive(true);
      setStatus('ARCHIVED'); // Update local state if needed
      DeanfetchAllDocuments(
        selectedOptionDean, 
        sortByDean, 
        dateFromDean, 
        dateToDean, 
        locationDean, 
        selectedFilterItemsDean, 
        otherItemsDean
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
    setArchiveDialogOpen(false);
  };

// Code for Print function to PDF

  const exportToPDF = (viewItem) => {
 
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF();
    const timestampString = viewItem ? viewItem.timestamp.toDate().toLocaleString() : '';
    const itemsText = `${viewItem ? viewItem.Items.join(", ") : ""}`;
    const otherItemsText =`Others: ${viewItem ? viewItem.otherItems : ""}`;
    const comma = otherItemsText ? ", " : "";
    const combinedText = itemsText + comma + otherItemsText;

      // pdf Image vars
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imageWidth = 40; 
    const xPosition = (pageWidth - imageWidth) / 2; 

    pdf.addImage(Cict, 'PNG', xPosition, 10, imageWidth, 0);
      // Set font style to bold for specific texts
      pdf.setFont("times", "bold");
      pdf.text("BORROWER'S FORM", xPosition -10, 55);
      pdf.text("DATE & TIME:", 10, 70);
      pdf.text("CONTROL NO.:", 130, 70);
      pdf.text("FACULTY NAME:", 10, 80);
      pdf.text("LOCATION/ROOM:", 10, 90);
      pdf.text("ITEMS:", 10, 110);
      pdf.text("BORROWER:", 10, 165);
      pdf.text("___________________________________", 10, 176);
      pdf.setFont("times", "normal");
      pdf.text("  Signature over printed name / Designation", 10, 185);
      pdf.setFont("times", "bold");
      pdf.text("Dean, CICT ", 160, 185);
      pdf.text("DR. KENO C. PIAD", 148, 175);
      pdf.text("________________", 150, 176);
  
      // Set font style to normal for the rest
      pdf.setFont("times", "normal");
      pdf.text(timestampString, 55, 70);
      pdf.text(viewItem ? viewItem.id : "", 175, 70);
      pdf.text(viewItem ? viewItem.Borrower : "", 60, 80);
      pdf.text(viewItem ? viewItem.LocationRoom : "", 65, 90);
      pdf.setFont("times", "bold");
      pdf.text(viewItem ? viewItem.Borrower : "", 10, 175);
      pdf.text(viewItem ? viewItem.userDesignation : "", 86, 175);
      // pdf.text(combinedText, 30, 100);

      // Draw checkboxes and their labels
      pdf.setFont("times", "bold");
      drawCheckbox(pdf, 25, 120, viewItem ? viewItem.Items.includes('HDMI') : false, "HDMI");
      drawCheckbox(pdf, 130, 120, viewItem ? viewItem.Items.includes('TV') : false, "TV");
      drawCheckbox(pdf, 25, 140, viewItem ? viewItem.Items.includes('Projector') : false, "Projector");
   
      // Check if otherItems is populated and draw checkbox accordingly
      const otherItemsChecked = !!viewItem?.otherItems;
      drawCheckbox(pdf, 130, 140, otherItemsChecked, otherItemsText);
     
      pdf.save('sample.pdf');
  
};

  function drawCheckbox(pdf, x, y, checked, label) {
    // Draw the checkbox square
    pdf.setDrawColor(0); // Set the border color to black
    pdf.rect(x, y, 10, 10, 'S', { rounded: 4.5 }); // Draw the checkbox outline with slightly rounded corners
    // Fill the checkbox with black color if checked
    if (checked) {
        pdf.setFillColor(0); // Set the fill color to black
        pdf.rect(x, y, 10, 10, 'F'); // Fill the entire checkbox area
    }
    pdf.setTextColor(0); // Set the text color to black
    pdf.text(label, x + 15, y + 8); // Draw the checkbox label
}


  const [pdfData, setPdfData] = useState(null); // State to store the generated PDF data

  const handleExport = async () => {
    const pdfDoc = await new Promise((resolve) => {
      exportToPDF(viewItem, resolve); // Call exportToPDF with a callback
    });
    setPdfData(pdfDoc.output()); // Store the generated PDF data as a base64 string
  };

// Check the user's userType
const { user } = useAuthState();
const [username, setUsername] = useState(null);
const [isFaculty, setIsFaculty] = useState(false);
const [isTechnician, setIsTechnician] = useState(false);
const [isDean, setIsDean] = useState(false);
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
          fetchUserDocuments(
            userData.uid,
            selectedOptionFaculty, 
            sortByFaculty, 
            dateFromFaculty, 
            dateToFaculty, 
            locationFaculty, 
            selectedFilterItemsFaculty, 
            otherItemsFaculty);
        } else {
          console.error('Invalid UID in userData:', userData.uid);
        }
      }
    }
  };

  fetchUserData();
}, [user]);

useEffect(() => {
    setIsFaculty(userType === 'faculty');
    setIsTechnician(userType === 'technician');
    setIsDean(userType === 'dean');
  }, [userType]);

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
    userDesignation: '',
    otherItems: '',
    fileInput: '',
    fileURL: '',
  };



  const clearForm = () => {
    setFormData(initialFormData);
    setShowInput(false);
  };

  // Handle change function
  const [formData, setFormData] = useState({
    userDate: '',
    LocationRoom: '',
    Borrower: '',
    Items: [],
    userDesignation: '',
    otherItems: '',
    fileURL: '',
  });

// Faculty Code for filter, status type:
  
const [selectedOptionFaculty, setSelectedOptionFaculty] = useState('All');
const [sortByFaculty, setSortByFaculty] = useState('newest'); // Default to 'newest'
const [dateFromFaculty, setDateFromFaculty] = useState('');
const [dateToFaculty, setDateToFaculty] = useState('');
const [locationFaculty, setLocationFaculty] = useState('');
const [selectedFilterItemsFaculty, setSelectedFilterItemsFaculty] = useState([]);
const [otherItemsFaculty, setOtherItemsFaculty] = useState(''); // State for Other Items filter
const [showInputFaculty, setShowInputFaculty] = useState(false); // to show <input>
const [showOtherItemsInputFaculty, setShowOtherItemsInputFaculty] = useState(false); // State to show Others <input>
const [filterItemsStringFaculty, setFilterItemsStringFaculty] = useState('');
    

const handleSortByChangeFaculty = (value) => {
  setSortByFaculty(value);
};

const handleDateFromChangeFaculty = (event) => {
  setDateFromFaculty(event.target.value);
};

const handleDateToChangeFaculty = (event) => {
  setDateToFaculty(event.target.value);
};

const handleLocationChangeFaculty = (event) => {
  setLocationFaculty(event.target.value);
};


const handleItemArrayChangeFaculty = (event) => {
  const { value, checked } = event.target;
  const updatedFilterItemsFaculty = checked
    ? [...selectedFilterItemsFaculty, value]
    : selectedFilterItemsFaculty.filter(item => item !== value);
  setSelectedFilterItemsFaculty(updatedFilterItemsFaculty);
  // Convert the updated array of filter items into a single string
  const filterItemsStringFaculty = updatedFilterItemsFaculty.join(', ');
  setFilterItemsStringFaculty(filterItemsStringFaculty);
};


const handleCheckboxChangeFaculty = () => {
  setShowOtherItemsInputFaculty(!showOtherItemsInputFaculty);
  setOtherItemsFaculty('');
  
};

  const handleOptionChangeFaculty = (e) => {
    const selectedStatusFaculty = e.target.value;
    setSelectedOptionFaculty(selectedStatusFaculty);

    fetchUserDocuments(
    user?.uid, 
    selectedStatusFaculty,
    sortByFaculty, 
    dateFromFaculty,
    dateToFaculty, 
    locationFaculty, 
    selectedFilterItemsFaculty, 
    otherItemsFaculty);
};

  



// Faculty data fetch from firestore 
const fetchUserDocuments = async (
  userUID,  
  selectedStatusFaculty,
  sortByFaculty, 
  dateFromFaculty,
  dateToFaculty, 
  locationFaculty, 
  selectedFilterItemsFaculty, 
  otherItemsFaculty) => {
  setIsLoading(true);
  try {
    if (typeof userUID !== 'string') {
      console.error('Invalid userUID:', userUID);
      return;
    }

    let queryRefFaculty = query(BorrowersCollectionRef, where('uid', '==', userUID));

    // Build Firestore query with filter and sorting conditions combined
   if (selectedStatusFaculty) {
    if (selectedStatusFaculty === 'All') {
      if (sortByFaculty === 'newest') {
        queryRefFaculty = query(queryRefFaculty, orderBy('timestamp', 'desc'));
      } else if (sortByFaculty === 'oldest') {
        queryRefFaculty = query(queryRefFaculty, orderBy('timestamp', 'asc'));
      }
    } else if (selectedStatusFaculty === 'APPROVED' || selectedStatusFaculty === 'REJECTED' || selectedStatusFaculty === 'ARCHIVED') {
      if (sortByFaculty === 'newest') {
        queryRefFaculty = query(queryRefFaculty, where('status', '==', selectedStatusFaculty), orderBy('timestamp', 'desc'));
      } else if (sortByFaculty === 'oldest') {
        queryRefFaculty = query(queryRefFaculty, where('status', '==', selectedStatusFaculty), orderBy('timestamp', 'asc'));
      }
    } else if (selectedStatusFaculty === 'PENDING (Technician)' || selectedStatusFaculty === 'PENDING (Dean)') {
      if (sortByFaculty === 'newest') {
        queryRefFaculty = query(queryRefFaculty, where('status', '==', selectedStatusFaculty), orderBy('timestamp', 'desc'));
      } else if (sortByFaculty === 'oldest') {
        queryRefFaculty = query(queryRefFaculty, where('status', '==', selectedStatusFaculty), orderBy('timestamp', 'asc'));
      }
    }
  }
 // Apply date range filtering if both dateFrom and dateTo are provided
 if (dateFromFaculty && dateToFaculty) {
  // Convert date strings to Firestore Timestamps
  const startDateFaculty = new Date(dateFromFaculty);
  const endDateFaculty = new Date(dateToFaculty);
  // Adjust end date to include documents on the end date
  endDateFaculty.setHours(23, 59, 59, 999);

  // Add date range condition to the query
  queryRefFaculty = query(queryRefFaculty, where('timestamp', '>=', startDateFaculty), where('timestamp', '<=', endDateFaculty));
}

// Apply location filter if location is provided
if (locationFaculty) {
  queryRefFaculty = query(queryRefFaculty, where('LocationRoom', '==', locationFaculty));
}
 
// Apply filter for selected items if they are provided
if (filterItemsStringFaculty) {
if (selectedFilterItemsFaculty.length === 1) {
  queryRefFaculty = query(queryRefFaculty, where('ItemsString', '==', filterItemsStringFaculty));
} else if (selectedFilterItemsFaculty.length > 1) {
  queryRefFaculty = query(queryRefFaculty, where('ItemsString', '==', filterItemsStringFaculty));
}
}



// Apply filter for "Other Items" if it's provided
if (showOtherItemsInputFaculty) {


if (otherItemsFaculty) {
  queryRefFaculty = query(queryRefFaculty, where('otherItems', '==', otherItemsFaculty));
} 
}

    const querySnapshotuid = await getDocs(queryRefFaculty);
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
  if (user?.uid && selectedOptionFaculty !== undefined) {
    fetchUserDocuments(
      user.uid, 
      selectedOptionFaculty, 
      sortByFaculty, 
      dateFromFaculty, 
      dateToFaculty, 
      locationFaculty, 
      selectedFilterItemsFaculty, 
      otherItemsFaculty);
  }
}, [
    user, 
    selectedOptionFaculty, 
    sortByFaculty, 
    dateFromFaculty, 
    dateToFaculty, 
    locationFaculty, 
    selectedFilterItemsFaculty, 
    otherItemsFaculty]);


// Technician Code for filter, status type:
const [selectedOptionTechnician, setSelectedOptionTechnician] = useState('PENDING (Technician)');
const [sortBy, setSortBy] = useState('newest'); // Default to 'newest'
const [dateFrom, setDateFrom] = useState('');
const [dateTo, setDateTo] = useState('');
const [location, setLocation] = useState('');
const [selectedFilterItems, setSelectedFilterItems] = useState([]);
const [otherItems, setOtherItems] = useState(''); // State for Other Items filter
const [showInput, setShowInput] = useState(false); // to show <input>
const [showOtherItemsInput, setShowOtherItemsInput] = useState(false); // Statte to show Others <input>
const [filterItemsString, setFilterItemsString] = useState('');

   
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
  const updatedFilterItems = checked
    ? [...selectedFilterItems, value]
    : selectedFilterItems.filter(item => item !== value);
  setSelectedFilterItems(updatedFilterItems);
  // Convert the updated array of filter items into a single string
  const filterItemsString = updatedFilterItems.join(', ');
  setFilterItemsString(filterItemsString);
};


const handleCheckboxChange = () => {
  setShowOtherItemsInput(!showOtherItemsInput);
  setOtherItems('');
  
};
    
const handleOptionChangeTechnician = (e) => {
  const selectedStatusTechnician = e.target.value;
  setSelectedOptionTechnician(selectedStatusTechnician);

  fetchAllDocuments(
    selectedOptionTechnician, 
    sortBy, 
    dateFrom, 
    dateTo, 
    location, 
    selectedFilterItems, 
    otherItems
  );
};


// Technician data fetch from firestore
const fetchAllDocuments = async (
  selectedStatusTechnician, 
  sortBy, 
  dateFrom, 
  dateTo, 
  location, 
  selectedFilterItems, 
  otherItems) => {
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
   
// Apply filter for selected items if they are provided
if (filterItemsString) {
  if (selectedFilterItems.length === 1) {
    queryRefTechnician = query(queryRefTechnician, where('ItemsString', '==', filterItemsString));
  } else if (selectedFilterItems.length > 1) {
    queryRefTechnician = query(queryRefTechnician, where('ItemsString', '==', filterItemsString));
  }
}



// Apply filter for "Other Items" if it's provided
if (showOtherItemsInput) {
  

  if (otherItems) {
    queryRefTechnician = query(queryRefTechnician, where('otherItems', '==', otherItems));
  } 
  // Ensure the sorting order matches the filter property
  // queryRefTechnician = query(queryRefTechnician, where(orderBy('otherItems', '!=', '')));
  // queryRefTechnician = query(queryRefTechnician, orderBy('otherItems'));
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
    fetchAllDocuments(
      selectedOptionTechnician, 
      sortBy, 
      dateFrom, 
      dateTo, 
      location, 
      selectedFilterItems, 
      otherItems
    );
  }, 
    [
      selectedOptionTechnician, 
      sortBy, 
      dateFrom, 
      dateTo, 
      location, 
      selectedFilterItems, 
      otherItems
    ]);

// Dean Code for filter, status type:
  
const [selectedOptionDean, setSelectedOptionDean] = useState('PENDING (Dean)');
const [sortByDean, setSortByDean] = useState('newest'); // Default to 'newest'
const [dateFromDean, setDateFromDean] = useState('');
const [dateToDean, setDateToDean] = useState('');
const [locationDean, setLocationDean] = useState('');
const [selectedFilterItemsDean, setSelectedFilterItemsDean] = useState([]);
const [otherItemsDean, setOtherItemsDean] = useState(''); // State for Other Items filter
const [showInputDean, setShowInputDean] = useState(false); // to show <input>
const [showOtherItemsInputDean, setShowOtherItemsInputDean] = useState(false); // State to show Others <input>
const [filterItemsStringDean, setFilterItemsStringDean] = useState('');

const handleSortByChangeDean = (value) => {
  setSortByDean(value);
};

const handleDateFromChangeDean = (event) => {
  setDateFromDean(event.target.value);
};

const handleDateToChangeDean = (event) => {
  setDateToDean(event.target.value);
};

const handleLocationChangeDean = (event) => {
  setLocationDean(event.target.value);
};



const handleItemArrayChangeDean = (event) => {
  const { value, checked } = event.target;
  const updatedFilterItemsDean = checked
    ? [...selectedFilterItemsDean, value]
    : selectedFilterItemsDean.filter(item => item !== value);
  setSelectedFilterItemsDean(updatedFilterItemsDean);
  // Convert the updated array of filter items into a single string
  const filterItemsStringDean = updatedFilterItemsDean.join(', ');
  setFilterItemsStringDean(filterItemsStringDean);
};


const handleCheckboxChangeDean = () => {
  setShowOtherItemsInputDean(!showOtherItemsInputDean);
  setOtherItemsDean('');
  
};

const handleOptionChangeDean = (e) => {
  const selectedStatusDean = e.target.value;
  setSelectedOptionDean(selectedStatusDean);

  DeanfetchAllDocuments(
    selectedStatusDean, 
    sortByDean, 
    dateFromDean, 
    dateToDean, 
    locationDean, 
    selectedFilterItemsDean, 
    otherItemsDean);
};

// Dean fetch data from firestore
const DeanfetchAllDocuments = async ( 
  selectedStatusDean, 
  sortByDean, 
  dateFromDean, 
  dateToDean, 
  locationDean, 
  selectedFilterItemsDean, 
  otherItemsDean) => {
  setIsLoading(true);
  try {
    let queryRefDean = BorrowersCollectionRef;

    // Build Firestore query with filter and sorting conditions combined
   if (selectedStatusDean) {
    if (selectedStatusDean === 'All') {
      if (sortByDean === 'newest') {
        queryRefDean = query(queryRefDean, orderBy('timestamp', 'desc'));
      } else if (sortByDean === 'oldest') {
        queryRefDean = query(queryRefDean, orderBy('timestamp', 'asc'));
      }
    } else if (selectedStatusDean === 'APPROVED' || selectedStatusDean === 'REJECTED' || selectedStatusDean === 'ARCHIVED') {
      if (sortByDean === 'newest') {
        queryRefDean= query(queryRefDean, where('status', '==', selectedStatusDean), orderBy('timestamp', 'desc'));
      } else if (sortByDean === 'oldest') {
        queryRefDean = query(queryRefDean, where('status', '==', selectedStatusDean), orderBy('timestamp', 'asc'));
      }
    } else if (selectedStatusDean === 'PENDING (Technician)' || selectedStatusDean === 'PENDING (Dean)') {
      if (sortByDean === 'newest') {
        queryRefDean = query(queryRefDean, where('status', '==', selectedStatusDean), orderBy('timestamp', 'desc'));
      } else if (sortByDean === 'oldest') {
        queryRefDean = query(queryRefDean, where('status', '==', selectedStatusDean), orderBy('timestamp', 'asc'));
      }
    }
  }

  // Apply date range filtering if both dateFrom and dateTo are provided
  if (dateFromDean && dateToDean) {
    // Convert date strings to Firestore Timestamps
    const startDateDean = new Date(dateFromDean);
    const endDateDean = new Date(dateToDean);
    // Adjust end date to include documents on the end date
    endDateDean.setHours(23, 59, 59, 999);

    // Add date range condition to the query
    queryRefDean = query(queryRefDean, where('timestamp', '>=', startDateDean), where('timestamp', '<=', endDateDean));
  }

  // Apply location filter if location is provided
  if (locationDean) {
    queryRefDean = query(queryRefDean, where('LocationRoom', '==', locationDean));
  }
   
// Apply filter for selected items if they are provided
if (filterItemsStringDean) {
  if (selectedFilterItemsDean.length === 1) {
    queryRefDean = query(queryRefDean, where('ItemsString', '==', filterItemsStringDean));
  } else if (selectedFilterItemsDean.length > 1) {
    queryRefDean = query(queryRefDean, where('ItemsString', '==', filterItemsStringDean));
  }
}



// Apply filter for "Other Items" if it's provided
if (showOtherItemsInputDean) {

  if (otherItemsDean) {
    queryRefDean = query(queryRefDean, where('otherItems', '==', otherItemsDean));
  } 

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
  DeanfetchAllDocuments(
    selectedOptionDean, 
    sortByDean, 
    dateFromDean, 
    dateToDean, 
    locationDean, 
    selectedFilterItemsDean, 
    otherItemsDean
  );
}, 
  [
    selectedOptionDean, 
    sortByDean, 
    dateFromDean, 
    dateToDean, 
    locationDean, 
    selectedFilterItemsDean, 
    otherItemsDean
  ]);



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

// Add/Submit Document Function
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { userDate, LocationRoom, Borrower, Items = [], otherItems, fileURL, userDesignation } = formData;
  
    // Validation logic for required fields
    if (!userDate || !LocationRoom || !Borrower || !userDesignation) {
      alert('Please fill out all required fields');
      return;
    }
    try {
      const documentName = await incrementDocumentName();
      const docRef = doc(BorrowersCollectionRef, documentName);
  
       // Convert Items array to a string
      const ItemsString = Items.join(', ');

      const docData = {
        userDate,
        timestamp: new Date(),
        LocationRoom,
        FullName : Borrower || '',
        Borrower,
        Items,
        ItemsString, // Include the stringified Items array
        otherItems,
        fileURL: fileURL || '',
        archived: false,
        originalLocation: "ITEM-BORROWERS",
        uid: user?.uid || '',
        status: "PENDING (Technician)",
        userDesignation,
      };
  
      await setDoc(docRef, docData);
  
      const newData = { ...docData, id: documentName };
      setFetchedData([...fetchedData, newData]);
  
      setOpen(false);
      setSnackbarOpen(true);
      fetchUserDocuments(user?.uid,  
        selectedOptionFaculty, 
        sortByFaculty, 
        dateFromFaculty, 
        dateToFaculty, 
        locationFaculty, 
        selectedFilterItemsFaculty, 
        otherItemsFaculty);

         // Send notifications to Technicians and Deans
    await sendNotificationToTechnicianAndDean(documentName);

    } catch (error) {
      console.error("Error submitting document: ", error);
    }
  
    setFormData(initialFormData);
    setShowInput(false);
  };

  //  This one is for Search bar
  const [searchQuery, setSearchQuery] = useState('');

const handleFilterByName = (event) => {
  setPage(0);
  setSearchQuery(event.target.value);
};

const filteredData = fetchedData.filter((item) => {
  const fieldsToSearchIn = ['id', 'userDate', 'LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataTechnician = fetchedDataTechnician.filter((item) => {
  const fieldsToSearchIn = ['id', 'userDate', 'LocationRoom', 'Borrower'];

  return fieldsToSearchIn.some(field => {
    if (item[field] && typeof item[field] === 'string') {
      return item[field].toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
});

const filteredDataDean = fetchedDataDean.filter((item) => {
  const fieldsToSearchIn = ['id', 'userDate','LocationRoom', 'Borrower'];

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
const [showEditMessageDialog, setShowEditMessageDialog] = useState(false);

const handleEditOpen = (data) => {
  if (data && data.id) {
    if (data.status === "PENDING (Dean)" || data.status === "APPROVED") {
      // Display a dialog with the message
      setShowEditMessageDialog(true);
      return; // Exit the function
    }

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
      userDesignation: data.userDesignation || '',
    });
    setEditData(data);
    setEditOpen(true);
    handleMenuClose(); 
  }
};

const handleEditClose = () => {
  setEditData(null); 
  setEditOpen(false);
  clearForm();
};

const handleEditSubmit = async () => {
  try {
    // Validation logic for required fields
    if (!editData.userDate || !editData.LocationRoom || !editData.Borrower || !editData.userDesignation) {
      alert('Please fill out all required fields');
      return;
    }

    // Include the checkbox values in editData
    const updatedEditData = {
      ...editData,
      Items: formData.Items,
      status: "PENDING (Technician)", 
      timestamp: new Date(),// Update Services with checkbox values
      // Include other properties here
    };

    // Convert Items array to a string
    const ItemsString = formData.Items.join(', ');

    // Include ItemsString in the updated editData
    updatedEditData.ItemsString = ItemsString;

    const docRef = doc(BorrowersCollectionRef, formData.id);

    // Update the editData object with the new file URL
    updatedEditData.fileURL = formData.fileURL;

    await updateDoc(docRef, updatedEditData);
    handleEditClose();
    setSnackbarOpen1(true);
    fetchUserDocuments(
      user?.uid,
      selectedOptionFaculty, 
      sortByFaculty, 
      dateFromFaculty, 
      dateToFaculty, 
      locationFaculty, 
      selectedFilterItemsFaculty, 
      otherItemsFaculty);

       // Send notifications to Technicians and Deans
    await sendNotificationToTechnicianAndDean(formData.id);

  } catch (error) {
    console.error("Error submitting document: ", error);
  }
};

// This one is for the Delete button
const [documentToDelete, setDocumentToDelete] = useState('');

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
  handleMenuClose(); 
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

// Filter code

const SORT_BY_OPTIONS = [
  { value: 'oldest', label: 'Oldest' },
  { value: 'newest', label: 'Newest' },
];


const FILTER_CATEGORY_OPTIONS = [
  'HDMI',
  'TV',
  'Projector',
];

const handleClearAll = () => {
  // Reset all filter states to their default values
  setSortBy('newest');
  setDateFrom('');
  setDateTo('');
  setLocation('');
  setSelectedFilterItems([]);
  setOtherItems('');
  setShowOtherItemsInput(false);
};

const handleClearAllDean = () => {
  // Reset all filter states to their default values
  setSortByDean('newest');
  setDateFromDean('');
  setDateToDean('');
  setLocationDean('');
  setSelectedFilterItemsDean([]);
  setOtherItemsDean('');
  setShowOtherItemsInputDean(false);
};


const handleClearAllFaculty = () => {
  // Reset all filter states to their default values
  setSortByFaculty('newest');
  setDateFromFaculty('');
  setDateToFaculty('');
  setLocationFaculty('');
  setSelectedFilterItemsFaculty([]);
  setOtherItemsFaculty('');
  setShowOtherItemsInputFaculty(false);
};


// ----------------------------------------------------------------------


// -------- Technician Filter Code --------
const [openFilter, setOpenFilter] = useState(false);
const [openSidebar, setOpenSidebar] = useState(null);
 
    const handleOpenFilter = () => {
      setOpenFilter(true);
    };
  
    const handleCloseFilter = () => {
      setOpenFilter(false);
    };

    const handleOpenSidebar = (event) => {
      setOpenSidebar(event.currentTarget);
    };
  
    const handleCloseSidebar = () => {
      setOpenSidebar(null);
    };
  
// -------- Dean Filter Code --------
const [openFilterDean, setOpenFilterDean] = useState(false);
const [openSidebarDean, setOpenSidebarDean] = useState(null);
 
    const handleOpenFilterDean = () => {
      setOpenFilterDean(true);
    };
  
    const handleCloseFilterDean = () => {
      setOpenFilterDean(false);
    };

    const handleOpenSidebarDean = (event) => {
      setOpenSidebarDean(event.currentTarget);
    };
  
    const handleCloseSidebarDean = () => {
      setOpenSidebarDean(null);
    };

// -------- Faculty Filter Code --------
const [openFilterFaculty, setOpenFilterFaculty] = useState(false);
const [openSidebarFaculty, setOpenSidebarFaculty] = useState(null);
 
    const handleOpenFilterFaculty = () => {
      setOpenFilterFaculty(true);
    };
  
    const handleCloseFilterFaculty = () => {
      setOpenFilterFaculty(false);
    };

    const handleOpenSidebarFaculty = (event) => {
      setOpenSidebarFaculty(event.currentTarget);
    };
  
    const handleCloseSidebarFaculty = () => {
      setOpenSidebarFaculty(null);
    };
  

// ---------- TECHNICIAN Dialog for APPROVE, REJECT & ARCHIVE ------------
const [snackbarOpenApproved, setSnackbarOpenApproved] = useState(false);
const [snackbarOpenRejected, setSnackbarOpenRejected] = useState(false);

const [techApproveConfirmationDialogOpen, setTechApproveConfirmationDialogOpen] = useState(false);
const [techRejectConfirmationDialogOpen, setTechRejectConfirmationDialogOpen] = useState(false);
const [techArchiveConfirmationDialogOpen, setTechArchiveConfirmationDialogOpen] = useState(false);
const [techManageDialogOpen, setTechManageDialogOpen] = useState(false);
const [selectedItemForManage, setSelectedItemForManage] = useState('');

// Open Manage dialog, while carrying item.id
const handleManageDialogOpen = (itemId) => {
  setSelectedItemForManage(itemId);
  setTechManageDialogOpen(true);
};

const handleApproveButtonClick = () => {
  setTechApproveConfirmationDialogOpen(true);
  setTechManageDialogOpen(false)
};

const handleRejectButtonClick = () => {
  setTechRejectConfirmationDialogOpen(true);
  setTechManageDialogOpen(false)
};

const handleArchiveButtonClick  = () => {
  setTechArchiveConfirmationDialogOpen(true);
  setTechManageDialogOpen(false)
};

const handleApproveClick = () => {
  if (selectedItemForManage) {
    updateStatusInFirebase(selectedItemForManage);
    setTechApproveConfirmationDialogOpen(false);
  } else {
    console.error('No selectedItem available for approval');
  }
};

const handleRejectClick = () => {
  if (selectedItemForManage) {
    updateStatusInFirebaseReject(selectedItemForManage);
    setTechRejectConfirmationDialogOpen(false);
  } else {
    console.error('No selectedItem available for rejection');
  }
};

const handleArchiveClick = () => {
  if (selectedItemForManage) {
    updateStatusInFirebaseArchive(selectedItemForManage);
    setTechArchiveConfirmationDialogOpen(false);
  } else {
    console.error('No selectedItem available for rejection');
  }
};


// ---------- Dean Dialog for APPROVE, REJECT & ARCHIVE ------------

const [deanApproveConfirmationDialogOpen, setDeanApproveConfirmationDialogOpen] = useState(false);
const [deanRejectConfirmationDialogOpen, setDeanRejectConfirmationDialogOpen] = useState(false);
const [deanArchiveConfirmationDialogOpen, setDeanArchiveConfirmationDialogOpen] = useState(false);
const [deanManageDialogOpen, setDeanManageDialogOpen] = useState(false);
const [deanselectedItemForManage, setDeanSelectedItemForManage] = useState('');

// Open Manage dialog, while carrying item.id
const handleDeanManageDialogOpen = (itemId) => {
  setDeanSelectedItemForManage(itemId);
  setDeanManageDialogOpen(true);
};

const handleDeanApproveButtonClick = () => {
  setDeanApproveConfirmationDialogOpen(true);
  setDeanManageDialogOpen(false)
};

const handleDeanRejectButtonClick = () => {
  setDeanRejectConfirmationDialogOpen(true);
  setDeanManageDialogOpen(false)
};

const handleDeanArchiveButtonClick  = () => {
  setDeanArchiveConfirmationDialogOpen(true);
  setDeanManageDialogOpen(false)
};


const handleDeanApproveClick = () => {
  if (deanselectedItemForManage) {
    updateStatusInFirebaseDean(deanselectedItemForManage);
    setDeanApproveConfirmationDialogOpen(false);
  } else {
    console.error('No selectedItem available for approval');
  }
};

const handleDeanRejectClick = () => {
  if (deanselectedItemForManage) {
    updateStatusInFirebaseRejectDean(deanselectedItemForManage);
    setDeanRejectConfirmationDialogOpen(false);
  } else {
    console.error('No selectedItem available for rejection');
  }
};

const handleDeanArchiveClick = () => {
  if (deanselectedItemForManage) {
    updateStatusInFirebaseArchiveDean(deanselectedItemForManage);
    setDeanArchiveConfirmationDialogOpen(false);
  } else {
    console.error('No selectedItem available for rejection');
  }
};


const [autoArchived, setAutoArchived] = useState(false);

// Auto Archiving Effect
useEffect(() => {
  const autoArchive = async () => {
    try {
      const q = query(collection(firestore, 'WP4-TESTING-AREA', 'FORMS', 'ITEM-BORROWERS'), 
      where('status', 'in', ['PENDING (Technician)', 'PENDING (Dean)']));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
        // Check if the document is older than 5 days
        const currentDate = new Date();
        const documentDate = doc.data().timestamp.toDate(); // Assuming 'timestamp' is a Firestore Timestamp
        const differenceInDays = Math.floor((currentDate - documentDate) / (1000 * 60 * 60 * 24));

        if (differenceInDays >= 5) {
        // Update status to "ARCHIVED"
        await updateDoc(doc.ref, { status: 'ARCHIVED' });
        }
      });

      // Set snackbar and status (if needed)
      setStatus('ARCHIVED');
      setAutoArchived(true);
    } catch (error) {
      console.error('Error auto-archiving documents:', error);
    }
    setArchiveDialogOpen(false); // Close the archive dialog
  };

  // Run the auto archiving function when the component mounts
  autoArchive();

  // Clean up function (optional)
  return () => {
    // Any cleanup code if needed
  };
}, []); // Empty dependency array to run the effect only once

// Fetching Effect, dependent on Auto Archiving
useEffect(() => {
  // Execute fetch documents based on user's role after setting status to ARCHIVED
  if (autoArchived) {
    if (isFaculty) {
      fetchUserDocuments(
        user?.uid,  
        selectedOptionFaculty, 
        sortByFaculty, 
        dateFromFaculty, 
        dateToFaculty, 
        locationFaculty, 
        selectedFilterItemsFaculty, 
        otherItemsFaculty
      );

    } 
    else if (isTechnician) {
      fetchAllDocuments(
        selectedOptionTechnician, 
        sortBy, 
        dateFrom, 
        dateTo, 
        location, 
        selectedFilterItems, 
        otherItems
      );
 
    } 
    else if (isDean) {
      DeanfetchAllDocuments(
        selectedOptionDean, 
        sortByDean, 
        dateFromDean, 
        dateToDean, 
        locationDean, 
        selectedFilterItemsDean, 
        otherItemsDean
      );
  
    }
  }
}, [autoArchived, isFaculty, isTechnician, isDean]);

// Notification code
const sendNotificationToTechnicianAndDean = async (documentName) => {
  try {
    // Create the query to find users with userType "technician" or "dean"
    const userQuery = query(userCollectionRef, where('userType', 'in', ['technician', 'dean']));
    
    // Execute the query and get the query snapshot
    const querySnapshot = await getDocs(userQuery);
    
    // Iterate over the query snapshot and send notifications to each user found
    querySnapshot.forEach(async (doc) => {
      const receiverUID = doc.data().uid; // Receiver UID (User ID)
      const userType = doc.data().userType; // User Type
      const userName = doc.data().username; // User Type
      
      // Determine the appropriate notification message based on userType
      let notificationMessage = "";
      let userTypeMessage = ""; // Initialize userTypeMessage variable
      
      if (userType === "technician") {
        notificationMessage = `Hey ${userName}, you have the document ${documentName} pending for approval.`;
        userTypeMessage = "technician"; // Set userTypeMessage to "technician"
      } else if (userType === "dean") {
        notificationMessage = `Hello ${userName}, the Technicians have ${documentName} pending for approval.`;
        userTypeMessage = "dean"; // Set userTypeMessage to "dean"
      }
      
      // Add notification to notifications collection
      await addDoc(notificationCollectionRef, {
        receiverUID, 
        userName,
        message: notificationMessage,
        userType: userTypeMessage, // Include userType in the notification data
        timestamp: serverTimestamp(),
      });
    });

    
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
};

  return (
    <>
      <Helmet>
        <title> BORROWER'S FORM | Minimal UI </title>
      </Helmet>
      <div style={{ backgroundColor: "#f2f2f2" }}>

        {/* This is the beginning of the Container for Faculty */}
        {isFaculty && ( 
      <Container  maxWidth='xl' >
  
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
      </Typography>
      <p>Selected Option: {selectedOptionFaculty}</p>
    </Stack>
 
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mb={3}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}
    >
    
 
     <Stack direction="row" alignItems="center" justifyContent="space-between" style={{maxHeight: '50px'}}>
      <Box>
        <Button onClick={handleClickOpen} style={{ backgroundColor:'#44c763', height:'54px'  }} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Document
        </Button>
      </Box>
      <div style={{ marginLeft: '10px'}} >
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth >
          <InputLabel  id="options-label">File Status:</InputLabel>
          <Select
            labelId="options-label"
            id="options"
            value={selectedOptionFaculty}
            onChange={handleOptionChangeFaculty}
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
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={handleOpenFilterFaculty}>
        Filters&nbsp;
      </Button>
      <Button
          onClick={() => fetchUserDocuments(
            user?.uid,  
            selectedOptionFaculty, 
            sortByFaculty, 
            dateFromFaculty, 
            dateToFaculty, 
            locationFaculty, 
            selectedFilterItemsFaculty, 
            otherItemsFaculty)}
          variant="contained"
          size="large"
          style={{
              margin: '0 8px',
              paddingRight: '10px',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              height:'56px' ,
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

        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { minWidth: '40%', paddingLeft: '5px', paddingRight: '15px' } }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div  style={{ flexBasis: '10px', maxWidth: '10px', flexGrow: 0, paddingTop: '20px'}}>
              <IconButton
                    style={{
                      backgroundColor: '#ffffff',
                      alignSelf: 'left',
                      alignItems: 'center',
                      size: '30px',
                      color: '#ff5500',
                    }}
                    onClick={handleClose}
                    sx={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    <ArrowBackIcon />
                </IconButton>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="h3" sx={{ mb: 5 }} style={{ color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop: '10px' }}>
                  Borrower's Form
                </Typography>      
                  <DialogContent >
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
                              {Array.from({ length: 20 }, (_, i) => ( 
                                <MenuItem
                                key={`IT-${101 + i}`} 
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

                        <Grid item xs={16} container alignItems="center"> 
                          <Checkbox
                            checked={showInput}
                            onChange={(e) => setShowInput(e.target.checked)}
                          /> Others:

                          <div style={{marginLeft:'15px'}}> 
                            {showInput && (
                              <input
                                type="text"
                                style={{ fontSize: '18px', width:'80%' }}
                                name="Others"
                                value={formData.otherItems || ''}
                                onChange={(e) =>
                                  setFormData({ ...formData, otherItems: e.target.value })
                                }
                              />
                            )}
                          </div>
                        </Grid>

                        <Grid item xs={8} spacing={1}>
                          <Typography variant="subtitle1">Designation:</Typography> 
                            <TextField
                              type="text"
                              name="Designation"
                              value={formData.userDesignation || ''}
                              onChange={(e) => setFormData({ ...formData, userDesignation: e.target.value })}
                              sx={{ width: '100%' }}
                              />
                        </Grid>

                        <Grid item xs={8} spacing={1}>
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
                    </form>
                  </DialogContent>
                  </div>
                </div>

                <DialogActions style={{ justifyContent: 'flex-end', padding: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                    <Button style={{ color:'#ffffff', backgroundColor:'#333333', border: '0.5px solid black', marginRight: '25px' }} variant="contained" onClick={clearForm}>
                      Clear 
                    </Button>
                    <Button style={{ backgroundColor:'#33b249', marginRight: '10px' }} variant="contained" onClick={handleSubmit} type="submit">
                      Create
                    </Button>
                  </div>
                </DialogActions>
          
        </Dialog>
   
  </Stack> 



{/* End of Faculty userType "New Document" function */}
    
{/* Start of Faculty userType "Table" function */}

      {isLoading ? (
        <CircularProgressWithLabel />
      ) : (
        <TableContainer component={Paper} style={{ maxHeight: 500 }}>
          <Table>
            <TableHead >
              <TableRow>
                <TableCell style={{backgroundColor: '#5c5c5c'}}>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAllFaculty}
                  color="primary"
                />
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Document ID</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Date</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Timestamp</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Location/Room</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Borrower</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Items</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>File Status</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Menu</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell style={{backgroundColor: '#fff'}}>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelection(item.id)}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>{item.id}</TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>{item.userDate}</TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                    {item.timestamp && item.timestamp.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>{item.LocationRoom}</TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>{item.Borrower}</TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                    {item.ItemsString && item.ItemsString}
                    {item.otherItems && item.ItemsString && ', '}
                    {item.otherItems && (
                      <>
                        <div>Others: {item.otherItems}</div>
                      </>
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                    <Label color={getStatusColor(item.status)}>{item.status}</Label>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center', backgroundColor: '#fff' }}>
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
      <MenuItem onClick={() => handleDelete(selectedItem.id)}>Archive</MenuItem>
    </Popover>

    <Drawer
        anchor="right"
        open={openFilterFaculty}
        onClose={handleCloseFilterFaculty}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={handleCloseFilterFaculty}>
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
                onClick={handleOpenSidebarFaculty}
                endIcon={<Iconify icon={openSidebarFaculty ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              >
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {sortByFaculty === 'newest' ? 'Newest' : 'Oldest'}
              </Typography>
            </Button>
          </Typography>
          <Menu
            keepMounted
            anchorEl={openSidebarFaculty}
            open={Boolean(openSidebarFaculty)}
            onClose={handleCloseSidebarFaculty}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {SORT_BY_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === sortByFaculty}
                onClick={() => {
                  handleSortByChangeFaculty(option.value);
                  handleCloseSidebarFaculty();
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
              value={dateFromFaculty}
              onChange={handleDateFromChangeFaculty}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Date To:
            </Typography>
            <TextField
              id="dateTo"
              size="small"
              type="date"
              value={dateToFaculty}
              onChange={handleDateToChangeFaculty}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Location/Room:
            </Typography>
            <Select   
              style={{ maxHeight: '100px' }}
              id="location"
              size="small"
              value={locationFaculty}
              onChange={handleLocationChangeFaculty}
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
        
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <div key={item}>
                    <Checkbox
                      value={item}
                      checked={selectedFilterItemsFaculty.includes(item)}
                      onChange={handleItemArrayChangeFaculty}
                    />
                    {item}
                    <br />
                  </div>
                ))}

                <Checkbox
                  checked={showOtherItemsInputFaculty}
                  onChange={handleCheckboxChangeFaculty}
                /> Others:
                <div style={{ marginLeft: '42px' }}>
                {showOtherItemsInputFaculty && (
                         <input
                         type="text"
                         name="Others"
                         value={otherItemsFaculty}
                         onChange={(e) => setOtherItemsFaculty(e.target.value)} // Directly update otherItems state
                       />
                  )}
                </div>
              
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
            onClick={handleClearAllFaculty}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>

{/* FACULTY Archive Dialog */}
<Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Archive Document</DialogTitle>
        <DialogContent>
          Do you want to or archive {documentToDelete} ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          {/* <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button> */}
          <Button onClick={() => updateStatusInFirebaseArchiveFaculty(documentToDelete)} style={{ color: 'orange' }}>Archive</Button>
        </DialogActions>
    </Dialog>

        </Container>
      )}
  {/* End of Faculty usertype view for tables, edit dialog and filters */}
  
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
          onClick={() => fetchAllDocuments(
            selectedOptionTechnician, 
            sortBy, 
            dateFrom, 
            dateTo, 
            location, 
            selectedFilterItems, 
            otherItems
          )}
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
      <CircularProgressWithLabel />
    ) : (
      <TableContainer component={Paper} style={{ maxHeight: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{backgroundColor: '#5c5c5c', color:'#FFFFFF'}}>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllTechnician}
                color="primary"
              />
              </TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Document ID</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Date</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Timestamp</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Location/Room</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Borrower</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Items</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>File Status</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Action</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Menu</TableCell>

            </TableRow>
          </TableHead>
          
          <TableBody>
            {displayedDataTechnician.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{backgroundColor: '#fff'}}> 
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelection(item.id)}
                    />
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>{item.id}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>{item.userDate}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>
                {item.timestamp ? item.timestamp.toDate().toLocaleString() : ''}
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>{item.LocationRoom}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>{item.Borrower}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>
                    {item.ItemsString && item.ItemsString}
                    {item.otherItems && item.ItemsString && ', '}
                    {item.otherItems && (
                      <>
                        <div>Others: {item.otherItems}</div>
                      </>
                    )}
                  </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>
                  <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff'}}>
                  {item.status === "PENDING (Technician)" && (
                    <Button onClick={() => handleManageDialogOpen(item.id)}> 
                      Manage
                    </Button>
                  )}
                </TableCell>
                
                <TableCell  style={{ textAlign: 'center',backgroundColor: '#fff'}}>
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
      <DialogTitle>Archive Document</DialogTitle>
      <DialogContent>
        Do you want to archive {documentToDelete} ?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button> 
        <Button onClick={() => updateStatusInFirebaseArchive(documentToDelete)} style={{ color: 'orange' }}>Archive</Button>
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
        
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <div key={item}>
                    <Checkbox
                      value={item}
                      checked={selectedFilterItems.includes(item)}
                      onChange={handleItemArrayChange}
                    />
                    {item}
                    <br />
                  </div>
                ))}

                <Checkbox
                  checked={showOtherItemsInput}
                  onChange={handleCheckboxChange}
                /> Others:
                <div style={{ marginLeft: '42px' }}>
                {showOtherItemsInput && (
                         <input
                         type="text"
                         name="Others"
                         value={otherItems}
                         onChange={(e) => setOtherItems(e.target.value)} // Directly update otherItems state
                       />
                  )}
                </div>
              
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
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>


    </Container>
  )}
  {/* End of Technician usertype view for tables  & Filter */}




 {/* Start of Dean usertype view for Search bar (top side) */}
 {isDean && ( 
  <Container  maxWidth='xl' >
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h2" style={{ color: '#ff5500' }}>
        Borrower's Form
      </Typography>
      <p>Selected Option: {selectedOptionDean}</p>
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
      <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={handleOpenFilterDean}>
        Filters&nbsp;
      </Button>
        <Button
          onClick={() => DeanfetchAllDocuments(
            selectedOptionDean, 
            sortByDean, 
            dateFromDean, 
            dateToDean, 
            locationDean, 
            selectedFilterItemsDean, 
            otherItemsDean)}
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
      <CircularProgressWithLabel />
    ) : (
      <TableContainer component={Paper} style={{ maxHeight: 500 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{backgroundColor: '#5c5c5c', color:'#FFFFFF'}}>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllDean}
                color="primary"
              />
              </TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Document ID</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Date</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Timestamp</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Location/Room</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Borrower</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Items</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>File Status</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Action</TableCell>
              <TableCell style={{ textAlign: 'center',backgroundColor: '#5c5c5c', color:'#FFFFFF' }}>Menu</TableCell>

            </TableRow>
          </TableHead>
          
          <TableBody>
            {displayedDataDean.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{backgroundColor: '#fff'}}> 
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelection(item.id)}
                    />
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>{item.id}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>{item.userDate}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>
                  {item.timestamp && item.timestamp.toDate().toLocaleString()}
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>{item.LocationRoom}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>{item.Borrower}</TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>
                    {item.ItemsString && item.ItemsString}
                    {item.otherItems && item.ItemsString && ', '}
                    {item.otherItems && (
                      <>
                        <div>Others: {item.otherItems}</div>
                      </>
                    )}
                  </TableCell>
                {/* <TableCell style={{ color: getStatusColor(item.status) }}>{item.status}</TableCell> */}
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>
                  <Label color={getStatusColor(item.status)}>{(item.status)}</Label>
                </TableCell>
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>
                {item.status === "PENDING (Dean)" && (
                  <Button onClick={() => handleDeanManageDialogOpen(item.id)}> 
                    Manage
                  </Button>
                )}
                </TableCell>
              
                <TableCell style={{ textAlign: 'center',backgroundColor: '#fff' }}>
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
      <DialogTitle>Archive Document</DialogTitle>
      <DialogContent>
        Do you want to archive {documentToDelete} ?
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
         <Button onClick={handleConfirmDeleteWithoutArchive} color="error">Delete</Button> 
         <Button onClick={() => updateStatusInFirebaseArchiveDean(documentToDelete)} style={{ color: 'orange' }}>Archive</Button>
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

    
  <Drawer
        anchor="right"
        open={openFilterDean}
        onClose={handleCloseFilterDean}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={handleCloseFilterDean}>
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
                onClick={handleOpenSidebarDean}
                endIcon={<Iconify icon={openSidebarDean ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
              >
              <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {sortByDean === 'newest' ? 'Newest' : 'Oldest'}
              </Typography>
            </Button>
          </Typography>
          <Menu
            keepMounted
            anchorEl={openSidebarDean}
            open={Boolean(openSidebarDean)}
            onClose={handleCloseSidebarDean}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {SORT_BY_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === sortByDean}
                onClick={() => {
                  handleSortByChangeDean(option.value);
                  handleCloseSidebarDean();
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
              value={dateFromDean}
              onChange={handleDateFromChangeDean}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Date To:
            </Typography>
            <TextField
              id="dateTo"
              size="small"
              type="date"
              value={dateToDean}
              onChange={handleDateToChangeDean}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              Location/Room:
            </Typography>
            <Select   
              style={{ maxHeight: '100px' }}
              id="location"
              size="small"
              value={locationDean}
              onChange={handleLocationChangeDean}
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
        
                {FILTER_CATEGORY_OPTIONS.map((item) => (
                  <div key={item}>
                    <Checkbox
                      value={item}
                      checked={selectedFilterItemsDean.includes(item)}
                      onChange={handleItemArrayChangeDean}
                    />
                    {item}
                    <br />
                  </div>
                ))}

                <Checkbox
                  checked={showOtherItemsInputDean}
                  onChange={handleCheckboxChangeDean}
                /> Others:
                <div style={{ marginLeft: '42px' }}>
                {showOtherItemsInputDean && (
                         <input
                         type="text"
                         name="Others"
                         value={otherItemsDean}
                         onChange={(e) => setOtherItemsDean(e.target.value)} // Directly update otherItems state
                       />
                  )}
                </div>
              
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
            onClick={handleClearAllDean}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>

    </Container>
  )}
  {/* End of Dean usertype view for tables & Filter */}



  {/* Start of public container for all user */}
    <Container> 
      {/* This is the dialog for the Edit button */}
      <Dialog open={editOpen} onClose={handleEditClose} PaperProps={{ style: { minWidth: '40%', paddingLeft: '5px', paddingRight: '15px' } }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div  style={{ flexBasis: '10px', maxWidth: '10px', flexGrow: 0, paddingTop: '20px'}}>
            <IconButton
                    style={{
                      backgroundColor: '#ffffff',
                      alignSelf: 'left',
                      alignItems: 'center',
                      size: '30px',
                      color: '#ff5500',
                    }}
                    onClick={handleEditClose}
                    sx={{ marginRight: '5px', marginLeft: '5px' }}
                  >
                    <ArrowBackIcon />
                </IconButton>
                </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
                <Typography variant="h3" sx={{ mb: 5 }} style={{ color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop: '10px' }}>
                  Borrower's Form
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

                              <Grid item xs={16} container alignItems="center"> 
                                <Checkbox
                                  checked={editData && !!editData.otherItems}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    if (!checked) {
                                      // Clear otherItems if unchecked
                                      setEditData({ ...editData, otherItems: '' });
                                    } else if (!editData.otherItems) { // Modify this line
                                      // Preserve otherItems value if checked and it's empty
                                      setEditData({ ...editData, otherItems: '-'});
                                    }
                                  }}
                                /> Others:

                                <div style={{marginLeft:'15px'}}>
                                  {editData && ( // Null check added
                                      <input
                                        type="text"
                                        style={{ fontSize: '18px' }}
                                        value={editData.otherItems || ''}
                                        onChange={(e) => setEditData({ ...editData, otherItems: e.target.value })}
                                      />
                                    )}
                                  </div>
                              </Grid>

                              <Grid item xs={8} spacing={1}>
                                <Typography variant="subtitle1">Designation:</Typography> 
                                  <TextField
                                    type="text"
                                    name="Designation"
                                    value={editData ? editData.userDesignation: ''}
                                    onChange={(e) => setEditData({ ...editData, userDesignation: e.target.value })}
                                    sx={{ width: '100%' }}
                                    />
                              </Grid>

                            <Grid item xs={8} spacing={1}>
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
                  </form>
                </DialogContent>
              </div>
            </div>
            <DialogActions style={{ justifyContent: 'flex-end', padding: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end' }}>
                <Button style={{ backgroundColor:'#33b249' }} variant="contained" onClick={handleEditSubmit} type="submit" sx={{ marginRight: '10px' }}>
                  Save
                </Button>
              </div>
            </DialogActions>   
          </Dialog>

    {/* Dialog for View button */}
      <Dialog open={viewOpen} onClose={handleViewClose} PaperProps={{ style: { minWidth: '40%', paddingLeft: '5px', paddingRight: '15px' } }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div  style={{ flexBasis: '10px', maxWidth: '10px', flexGrow: 0, paddingTop: '20px'}}>
              <IconButton
                  style={{
                    backgroundColor: '#ffffff',
                    alignSelf: 'left',
                    alignItems: 'center',
                    size: '30px',
                    color: '#ff5500',
                  }}
                  onClick={handleViewClose}
                  sx={{ marginRight: '5px', marginLeft: '5px' }}
                >
                  <ArrowBackIcon />
              </IconButton>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
            <Typography variant="h3" sx={{ mb: 5 }} style={{ color: '#ff5500', margin: 'auto', fontSize: '40px', fontWeight: 'bold', marginTop: '10px' }}>
              Borrower's Form
            </Typography>
            <DialogContent id="pdf-content" style={{border:'3px solid #e0e0e0'}}>
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

                    <Grid item xs={16} container alignItems="center"> 
                      <Checkbox
                        checked={!!viewItem?.otherItems}
                        disabled
                      /> Others:

                        <div style={{marginLeft:'15px'}}>
                          <input
                            type="text"
                            style={{fontSize:'18px'}}
                            value={viewItem ? viewItem.otherItems : ''}
                            disabled
                          />
                        </div>
                    </Grid>

                    <Grid item xs={8} spacing={1}>
                          <Typography variant="subtitle1">Designation:</Typography> 
                            <TextField
                              type="text"
                              name="Designation"
                              value={viewItem ? viewItem.userDesignation : ''}
                              disabled
                              sx={{ width: '100%' }}
                              />
                        </Grid>

                    <Grid item xs={8} spacing={1}>
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
            </DialogContent >
          </div>
        </div>

        <div style={{ display: 'flex', padding: '10px', justifyContent: 'flex-end', gap: '13px' }}>  {/* Combined styles */}
        <Button variant='outlined' style={{border: '3px solid #FF7F00'}}> 
          <IconButton onClick={handleExport} style={{color:'black'}}>
            <PrintIcon/> 
          </IconButton>
        </Button>
        </div>
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
            



{ /* TECHNICIAN Dialog for Confirmation Buttons */ }
       { /* Dialog for APPROVE Button */ }
      <Dialog open={techApproveConfirmationDialogOpen} onClose={() => setTechApproveConfirmationDialogOpen(false)} style={{justifyContent:'center'}}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent style={{ borderBottom:'3px solid #e0e0e0', paddingTop: '11px', marginLeft: '20px', marginRight: '20px'}}>
        Are you sure you want to <span style={{ color: 'green', fontWeight: 'bold' }}>APPROVE</span> "<span style={{ fontWeight: 'bold' }}>{selectedItemForManage}</span>" ?
      </DialogContent>
      <DialogActions> 
        <Button onClick={() => setTechApproveConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleApproveClick} variant='contained' style={{ color: '#ffffff', backgroundColor: '#2ECC71' }}>
          <CheckIcon/> APPROVE
        </Button>
      </DialogActions>  
      </Dialog>

      {/* Dialog for REJECT Button */}
      <Dialog open={techRejectConfirmationDialogOpen} onClose={() => setTechRejectConfirmationDialogOpen(false)} style={{justifyContent:'center'}}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent style={{ borderBottom:'3px solid #e0e0e0', paddingTop: '11px', marginLeft: '20px', marginRight: '20px'}}>
        Are you sure you want to <span style={{ color: 'red', fontWeight: 'bold' }}>REJECT</span> "<span style={{ fontWeight: 'bold' }}>{selectedItemForManage}</span>" ?
      </DialogContent>
      <DialogActions> 
        <Button onClick={() => setTechRejectConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleRejectClick} variant='contained' style={{ color: '#ffffff', backgroundColor: '#FF0000' }}>
          <CloseIcon /> REJECT
        </Button>
      </DialogActions> 
      </Dialog>

      {/* Dialog for ARCHIVE Button */}
      <Dialog open={techArchiveConfirmationDialogOpen} onClose={() => setTechArchiveConfirmationDialogOpen(false)} style={{justifyContent:'center'}}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent style={{ borderBottom:'3px solid #e0e0e0', paddingTop: '11px', marginLeft: '20px', marginRight: '20px'}}>
        Are you sure you want to <span style={{ color: '#ff5500', fontWeight: 'bold' }}>ARCHIVE</span> "<span style={{ fontWeight: 'bold' }}>{selectedItemForManage}</span>" ?
      </DialogContent>
      <DialogActions> 
        <Button onClick={() => setTechArchiveConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleArchiveClick} variant='outlined' style={{ borderColor: '#ff5500', color: '#ff5500', backgroundColor: 'white' }}>
          ARCHIVE
        </Button>
      </DialogActions> 
      </Dialog>

        
{ /* Dean Dialog for Confirmation Buttons */ }
       { /* Dialog for APPROVE Button */ }
      <Dialog open={deanApproveConfirmationDialogOpen} onClose={() => setDeanApproveConfirmationDialogOpen(false)} style={{justifyContent:'center'}}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent style={{ borderBottom:'3px solid #e0e0e0', paddingTop: '11px', marginLeft: '20px', marginRight: '20px'}}>
        Are you sure you want to <span style={{ color: 'green', fontWeight: 'bold' }}>APPROVE</span> "<span style={{ fontWeight: 'bold' }}>{deanselectedItemForManage}</span>" ?
      </DialogContent>
      <DialogActions> 
        <Button onClick={() => setDeanApproveConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDeanApproveClick} variant='contained' style={{ color: '#ffffff', backgroundColor: '#2ECC71' }}>
          <CheckIcon/> APPROVE
        </Button>
      </DialogActions>  
      </Dialog>

      {/* Dialog for REJECT Button */}
      <Dialog open={deanRejectConfirmationDialogOpen} onClose={() => setDeanRejectConfirmationDialogOpen(false)} style={{justifyContent:'center'}}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent style={{ borderBottom:'3px solid #e0e0e0', paddingTop: '11px', marginLeft: '20px', marginRight: '20px'}}>
        Are you sure you want to <span style={{ color: 'red', fontWeight: 'bold' }}>REJECT</span> "<span style={{ fontWeight: 'bold' }}>{deanselectedItemForManage}</span>" ?
      </DialogContent>
      <DialogActions> 
        <Button onClick={() => setDeanRejectConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDeanRejectClick} variant='contained' style={{ color: '#ffffff', backgroundColor: '#FF0000' }}>
          <CloseIcon /> REJECT
        </Button>
      </DialogActions> 
      </Dialog>

      {/* Dialog for ARCHIVE Button */}
      <Dialog open={deanArchiveConfirmationDialogOpen} onClose={() => setDeanArchiveConfirmationDialogOpen(false)} style={{justifyContent:'center'}}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent style={{ borderBottom:'3px solid #e0e0e0', paddingTop: '11px', marginLeft: '20px', marginRight: '20px'}}>
        Are you sure you want to <span style={{ color: '#ff5500', fontWeight: 'bold' }}>ARCHIVE</span> "<span style={{ fontWeight: 'bold' }}>{deanselectedItemForManage}</span>" ?
      </DialogContent>
      <DialogActions> 
        <Button onClick={() => setDeanArchiveConfirmationDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleDeanArchiveClick} variant='outlined' style={{ borderColor: '#ff5500', color: '#ff5500', backgroundColor: 'white' }}>
          ARCHIVE
        </Button>
      </DialogActions> 
      </Dialog>





 {/* DIALOGS for Manage Button */}

  {/* Technician Dialog for Manage Button */}
      <Dialog open={techManageDialogOpen} onClose={() => setTechManageDialogOpen(false)}>
        <DialogTitle>Manage Document</DialogTitle>
        <DialogContent>
          Select what you want to do with "<span style={{ fontWeight: 'bold' }}>{selectedItemForManage}</span>"
        </DialogContent>
        <DialogActions> 
        
          <Button onClick={() => handleArchiveButtonClick(selectedItemForManage)} variant='outlined' style={{ borderColor: '#ff5500', color: '#ff5500', backgroundColor: 'white' }}>
            ARCHIVE
          </Button>
              <Button onClick={() => handleRejectButtonClick(selectedItemForManage)} variant='contained' style={{ color: '#ffffff', backgroundColor: '#FF4136' }}>
                <CloseIcon/> REJECT
              </Button>

              <Button onClick={() => handleApproveButtonClick(selectedItemForManage)} variant='contained' style={{ color: '#ffffff', backgroundColor: '#2ECC71' }}>
                <CheckIcon/> APPROVE
              </Button>
          </DialogActions>
        </Dialog>

  {/* Dean Dialog for Manage Button */}
      <Dialog open={deanManageDialogOpen} onClose={() => setDeanManageDialogOpen(false)}>
        <DialogTitle>Manage Document</DialogTitle>
          <DialogContent>
            Select what you want to do with "<span style={{ fontWeight: 'bold' }}>{deanselectedItemForManage}</span>"
          </DialogContent>
        <DialogActions> 
        
          <Button onClick={() => handleDeanArchiveButtonClick(deanselectedItemForManage)} variant='outlined' style={{ borderColor: '#ff5500', color: '#ff5500', backgroundColor: 'white' }}>
            ARCHIVE
          </Button>
              <Button onClick={() => handleDeanRejectButtonClick(deanselectedItemForManage)} variant='contained' style={{ color: '#ffffff', backgroundColor: '#FF4136' }}>
                <CloseIcon/> REJECT
              </Button>

              <Button onClick={() => handleDeanApproveButtonClick(deanselectedItemForManage)} variant='contained' style={{ color: '#ffffff', backgroundColor: '#2ECC71' }}>
                <CheckIcon/> APPROVE
              </Button>
          </DialogActions>
        </Dialog>

    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="The Document was CREATED successfully!"
      />
    <Snackbar
        open={snackbarOpen1}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen1(false)}
        message="The Document was EDITED successfully!"
      />
      <Snackbar
        open={snackbarOpenDelete}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenDelete(false)}
        message="The Document was DELETED successfully!"
      />

      <Snackbar
        open={snackbarOpenArchive}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenArchive(false)}
        message="The Document was ARCHIVED successfully!"
      />

      <Snackbar
        open={snackbarOpenApproved}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenApproved(false)}
        message="The Document was APPROVED successfully!"
      />

      <Snackbar
        open={snackbarOpenRejected}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpenRejected(false)}
        message="The Document was REJECTED successfully!"
      />
      

  {/* Dialog for Edit Button */}
  <Dialog
    open={showEditMessageDialog}
    onClose={() => setShowEditMessageDialog(false)}
  >
    <DialogTitle>Cannot Edit</DialogTitle>
    <DialogContent>
        You can't edit this document because it's already APPROVED or PENDING (Dean).
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setShowEditMessageDialog(false)} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>

    </Container>
    </div>
    </>
  );}


