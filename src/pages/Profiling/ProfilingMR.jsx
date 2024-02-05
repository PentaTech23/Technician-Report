import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
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
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';

// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { ProductSort, ProductList, ProductCartWidget, ProductFilterSidebar } from '../../sections/@dashboard/products'
// mock
import { useAuthState, firebaseApp, db, mainCollectionRef, formsDocRef, MemorandumCollectionRef, archivesRef, archivesCollectionRef, storage } from '../../firebase';


import USERLIST from '../../_mock/user';

// ----------------------------------------------------------------------

// const firebaseConfig = {
//   apiKey: 'AIzaSyDHFEWRU949STT98iEDSYe9Rc-WxcL3fcc',
//   authDomain: 'wp4-technician-dms.firebaseapp.com',
//   projectId: 'wp4-technician-dms',
//   storageBucket: 'wp4-technician-dms.appspot.com',
//   messagingSenderId: '1065436189229',
//   appId: '1:1065436189229:web:88094d3d71b15a0ab29ea4',
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firestore db
// const db = getFirestore(firebaseApp);

// // Access main collection
// const mainCollectionRef = collection(db, 'WP4-TECHNICIAN-DMS');

// // Access FORMS document under main collection
// const formsDocRef = doc(mainCollectionRef, 'PROFILING');

// // Add to subcollection
// const MemorandumCollectionRef = collection(formsDocRef, 'MEMORANDUM-OF-RECEIPTS');

// // Access ARCHIVES document under main collection
// const archivesRef = doc(mainCollectionRef, 'ARCHIVES');

// const archivesCollectionRef = collection(archivesRef, 'ARCHIVES-FORMS');

// // Second declaration
// const storage = getStorage(firebaseApp);

// ----------------------------------------------------------------------

//  Clear the whole Form function
export default function FormsIRF() {
  // -------------------------testing for the dynamic input fields ---------------------------------------------
 
  // const fetchAllDocuments = async () => {
  //   setIsLoading(true);

  //   try {
  //     const querySnapshot = await getDocs(MemorandumCollectionRef);
  //     const dataFromFirestore = [];

  //     querySnapshot.forEach((doc) => {
  //       // Handle each document here
  //       const data = doc.data();
  //       data.id = doc.id; // Add the ID field
  //       dataFromFirestore.push(data);
  //     });

  //     setFetchedDataTechnician(dataFromFirestore);
  //   } catch (error) {
  //     console.error("Error fetching data from Firestore: ", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    fetchAllDocuments();
   }, []);

// Dean Show Query/table fetch from firestore

const DeanfetchAllDocuments = async () => {
  setIsLoading(true);

  try {
    const querySnapshot = await getDocs(
      query(MemorandumCollectionRef, where('status', '!=', 'PENDING (Technician)'))
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
  const fetchUserDocuments = async (userUID) => {
    setIsLoading(true);
  
    try {
      // Ensure userUID is a string before proceeding
      if (typeof userUID !== 'string') {
        console.error('Invalid userUID:', userUID);
        return;
      }
  
      const querySnapshotuid = await getDocs(
        query(MemorandumCollectionRef, where('uid', '==', userUID))
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

  useEffect(() => {
    // Ensure that user data is available before fetching documents
    if (user?.uid) {
      fetchUserDocuments(user.uid);
    }
  }, [user]); // Trigger the fetch when the user object changes
  
  const isFaculty = userType === 'faculty';
  const isTechnician = userType === 'technician';
  const isDean = userType === 'dean';

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING (Technician)':
        return 'orange';
        case 'PENDING (Dean)':
          return 'orange';
      case 'APPROVED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'black'; // Default color if status doesn't match any case
    }
  };
  
  // Start of Code
    // const [fetchedData, setFetchedData] = useState([]);
    const [fetchedDataTechnician, setFetchedDataTechnician] = useState([]);
    const [fetchedDataDean, setFetchedDataDean] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
  
  // -------------------------OFFICE FIELDS ---------------------------------------------
  const [inputFieldOffice, setInputFieldOffice] = useState([
    {
      Quantity: '',
      UnitofMeasure:'',
      Description: '',
      propertyNumber: '',
      dateAquired: '',
      unitCost: '',
      remarks: '',
    },
  ]);

  const handleAddFieldOffice = () => {
    setInputFieldOffice([
      ...inputFieldOffice, 
      {
        Quantity: '',
        UnitofMeasure:'',
        Description: '',
        propertyNumber: '',
        dateAquired: '',
        unitCost: '',
        remarks: '',
      },
    ]);
  };

  const handleRemoveFieldOffice = (index) => {
    const values = [...inputFieldOffice];
    values.splice(index, 1);
    setInputFieldOffice(values);
  };

  const handleChangeInputOffice = (index, event) => {
    console.log(index, event.target.name);
    const values = [...inputFieldOffice];
    values[index][event.target.name] = event.target.value;
    setInputFieldOffice(values);
  };

  // -------------------------EDIT OFFICE FIELDS ---------------------------------------------

  const handleEditAddFieldOffice = () => {
    const newField = {
      Quantity: '',
      UnitofMeasure:'',
      Description: '',
      propertyNumber: '',
      dateAquired: '',
      unitCost: '',
      remarks: '',
    };
  
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputFieldOffice: [...prevEditData.inputFieldOffice, newField],
    }));
  
    console.log('After adding field:', editData);
  };

  const handleEditRemoveFieldOffice = async (index) => {
    try {
      const docRef = doc(MemorandumCollectionRef, formData.id); // Use the document ID for updating
  
      // Create a copy of the editData
      const editDataCopy = { ...editData };
  
      // Remove the specific item from the inputField array in Firestore
      editDataCopy.inputFieldOffice.splice(index, 1);
  
      // Update Firestore document with the modified inputField
      await updateDoc(docRef, editDataCopy); // Update the document in Firestore
  
      // Update the local state (formData) with the modified inputField
      setFormData((prevData) => ({
        ...prevData,
        inputFieldOffice: editDataCopy.inputFieldOffice,
      }));
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleRemoveAllFieldOffice = () => {
    const values = [...inputFieldOffice];
        // Remove all fields by splicing from the end of the array to the beginning
    for (let i = values.length - 1; i >= 0; i-=1) {
      values.splice(i, 1);
    }
    // Update the inputField state with the modified array
    setInputFieldOffice(values);
  };

  const handleEditChangeInputOffice = (index, event, fieldName) => {
    setEditData((prevData) => {
      const newInputFieldOffice = [...prevData.inputFieldOffice];
      newInputFieldOffice[index][fieldName] = event.target.value;
      return {
        ...prevData,
        inputFieldOffice: newInputFieldOffice,
      };
    });
  };


    // -------------------------CICT FIELDS ---------------------------------------------
  const [inputFieldCict, setInputFieldCict] = useState([
    {
      Quantity: '',
      UnitofMeasure:'',
      Description: '',
      propertyNumber: '',
      dateAquired: '',
      unitCost: '',
      remarks: '',
    },
  ]);

  const handleAddFieldCict = () => {
    setInputFieldCict([
      ...inputFieldCict, 
      {
        Quantity: '',
        UnitofMeasure:'',
        Description: '',
        propertyNumber: '',
        dateAquired: '',
        unitCost: '',
        remarks: '',
      },
    ]);
  };

  const handleRemoveFieldCict = (index) => {
    const values = [...inputFieldCict];
    values.splice(index, 1);
    setInputFieldCict(values);
  };

  const handleChangeInputCict = (index, event) => {
    console.log(index, event.target.name);
    const values = [...inputFieldCict];
    values[index][event.target.name] = event.target.value;
    setInputFieldCict(values);
  };

   // -------------------------EDIT CICT FIELDS ---------------------------------------------

   const handleEditAddFieldCict = () => {
    const newField = {
      Quantity: '',
      UnitofMeasure:'',
      Description: '',
      propertyNumber: '',
      dateAquired: '',
      unitCost: '',
      remarks: '',
    };
  
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputFieldCict: [...prevEditData.inputFieldCict, newField],
    }));
  
    console.log('After adding field:', editData);
  };

  const handleEditRemoveFieldCict = async (index) => {
    try {
      const docRef = doc(MemorandumCollectionRef, formData.id); // Use the document ID for updating
  
      // Create a copy of the editData
      const editDataCopy = { ...editData };
  
      // Remove the specific item from the inputField array in Firestore
      editDataCopy.inputFieldCict.splice(index, 1);
  
      // Update Firestore document with the modified inputField
      await updateDoc(docRef, editDataCopy); // Update the document in Firestore
  
      // Update the local state (formData) with the modified inputField
      setFormData((prevData) => ({
        ...prevData,
        inputFieldCict: editDataCopy.inputFieldCict,
      }));
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleRemoveAllFieldCict = () => {
    const values = [...inputFieldCict];
        // Remove all fields by splicing from the end of the array to the beginning
    for (let i = values.length - 1; i >= 0; i-=1) {
      values.splice(i, 1);
    }
    // Update the inputField state with the modified array
    setInputFieldCict(values);
  };

  
  const handleEditChangeInputCict = (index, event, fieldName) => {
    setEditData((prevData) => {
      const newInputFieldCict = [...prevData.inputFieldCict];
      newInputFieldCict[index][fieldName] = event.target.value;
      return {
        ...prevData,
        inputFieldCict: newInputFieldCict,
      };
    });
  };


    // -------------------------OTHER FIELDS ---------------------------------------------
  const [inputFieldOther, setInputFieldOther] = useState([
    {
      Quantity: '',
      UnitofMeasure:'',
      Description: '',
      propertyNumber: '',
      dateAquired: '',
      unitCost: '',
      remarks: '',
    },
  ]);
  
  const handleAddFieldOther = () => {
    setInputFieldOther([
      ...inputFieldOther, 
      {
        Quantity: '',
        UnitofMeasure:'',
        Description: '',
        propertyNumber: '',
        dateAquired: '',
        unitCost: '',
        remarks: '',
      },
    ]);
  };

  const handleRemoveFieldOther = (index) => {
    const values = [...inputFieldOther];
    values.splice(index, 1);
    setInputFieldOther(values);
  };

  const handleChangeInputOther = (index, event) => {
    console.log(index, event.target.name);
    const values = [...inputFieldOther];
    values[index][event.target.name] = event.target.value;
    setInputFieldOther(values);
  };

   // -------------------------EDIT OTHER FIELDS ---------------------------------------------

   const handleEditAddFieldOther= () => {
    const newField = {
      Quantity: '',
      UnitofMeasure:'',
      Description: '',
      propertyNumber: '',
      dateAquired: '',
      unitCost: '',
      remarks: '',
    };
  
    setEditData((prevEditData) => ({
      ...prevEditData,
      inputFieldOther: [...prevEditData.inputFieldOther, newField],
    }));
  
    console.log('After adding field:', editData);
  };

  const handleEditRemoveFieldOther = async (index) => {
    try {
      const docRef = doc(MemorandumCollectionRef, formData.id); // Use the document ID for updating
  
      // Create a copy of the editData
      const editDataCopy = { ...editData };
  
      // Remove the specific item from the inputField array in Firestore
      editDataCopy.inputFieldOther.splice(index, 1);
  
      // Update Firestore document with the modified inputField
      await updateDoc(docRef, editDataCopy); // Update the document in Firestore
  
      // Update the local state (formData) with the modified inputField
      setFormData((prevData) => ({
        ...prevData,
        inputFieldOther: editDataCopy.inputFieldOther,
      }));
    } catch (error) {
      console.error('Error updating data in Firestore: ', error);
    }
  };

  const handleRemoveAllFieldOther = () => {
    const values = [...inputFieldOther];
        // Remove all fields by splicing from the end of the array to the beginning
    for (let i = values.length - 1; i >= 0; i-=1) {
      values.splice(i, 1);
    }
    // Update the inputField state with the modified array
    setInputFieldOther(values);
  };

  const handleEditChangeInputOther = (index, event, fieldName) => {
    setEditData((prevData) => {
      const newInputFieldOther= [...prevData.inputFieldOther];
      newInputFieldOther[index][fieldName] = event.target.value;
      return {
        ...prevData,
        inputFieldOther: newInputFieldOther,
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
    EntityName: '',
    SAIPARNum: '',
    CollegeCampusOffice: '',

    inputFieldOffice: [],
    inputFieldCict: [],
    inputFieldOther: [],

    AcknowledgedBy: '',
    PositionAcknowledgedBy: '',
    DateAcknowledgedBy:'',

    InspectedBy: '',
    PositionInspectedBy: '',
    DateInspectedBy: '',

    fileInput: '',
    fileURL: '',
  };


  const clearForm = () => {
    handleRemoveAllFieldOffice();
    handleRemoveAllFieldCict();
    handleRemoveAllFieldOther();
    setFormData(initialFormData);
  };

  const [formData, setFormData] = useState({
    EntityName: '',
    SAIPARNum: '',
    CollegeCampusOffice: '',
    
    inputFieldOffice: [],
    inputFieldCict: [],
    inputFieldOther: [],

    AcknowledgedBy: '',
    PositionAcknowledgedBy: '',
    DateAcknowledgedBy:'',

    InspectedBy: '',
    PositionInspectedBy: '',
    DateInspectedBy: '',
    fileURL: '',
  });


  // Show Query or the table, fetch data from firestore

  const fetchAllDocuments = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await getDocs(MemorandumCollectionRef);
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
    const docSnapshot = await getDoc(doc(MemorandumCollectionRef, newDocumentName));

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
      SAIPARNum,
      CollegeCampusOffice,
      
      // inputFieldOffice= [],
      // inputFieldCict= [],
      // inputFieldOther= [],
  
      AcknowledgedBy,
      PositionAcknowledgedBy,
      DateAcknowledgedBy,
  
      InspectedBy,
      PositionInspectedBy,
      DateInspectedBy,
      fileURL,
      } = formData;
  
    try {
      // Use the current document name when adding a new document
      const documentName = await incrementDocumentName();

      const docRef = doc(MemorandumCollectionRef, documentName);

      const docData = {
        EntityName,
        SAIPARNum,
        CollegeCampusOffice,
        
        inputFieldOffice,
        inputFieldCict,
        inputFieldOther,
    
        AcknowledgedBy,
        PositionAcknowledgedBy,
        DateAcknowledgedBy,
    
        InspectedBy,
        PositionInspectedBy,
        DateInspectedBy,

        fileURL: fileURL || '',
        archived: false, 
        originalLocation: 'MEMORANDUM-OF-RECEIPTS', 
        uid: user?.uid || '',
        status: "PENDING (Technician)",
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
    const fieldsToSearchIn = ['SAIPARNum', 'EntityName', 'CollegeCampusOffice', 'AcknowledgedBy', 'InspectedBy'];

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
        EntityName: data.EntityName ||'',
        SAIPARNum: data.SAIPARNum ||'',
        CollegeCampusOffice: data.CollegeCampusOffice ||'',
        
        inputFieldOffice: data.inputFieldOffice ||'',
        inputFieldCict: data.inputFieldCict ||'',
        inputFieldOther: data.inputFieldOther ||'',
    
        AcknowledgedBy: data.AcknowledgedBy ||'',
        PositionAcknowledgedBy: data.PositionAcknowledgedBy ||'',
        DateAcknowledgedBy: data.DateAcknowledgedBy ||'',
    
        InspectedBy: data.InspectedBy ||'',
        PositionInspectedBy: data.PositionInspectedBy ||'',
        DateInspectedBy: data.DateInspectedBy ||'',

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
      const docRef = doc(MemorandumCollectionRef, formData.id); // Use the document ID for updating

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

  // This one is still for Edit button but for the file upload part

  const handleFileEditUpload = async (file) => {
    const docRef = doc(MemorandumCollectionRef, formData.id); // Use the document ID for updating
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
        const sourceDocumentRef = doc(MemorandumCollectionRef, documentToDelete);
        const sourceDocumentData = (await getDoc(sourceDocumentRef)).data();

        await deleteDoc(doc(MemorandumCollectionRef, documentToDelete));

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
        const sourceDocumentRef = doc(MemorandumCollectionRef, documentToDelete);
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
        await deleteDoc(doc(MemorandumCollectionRef, documentToDelete));

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
        return deleteDoc(doc(MemorandumCollectionRef, itemId));
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
        <title> Memorandum of Receipts </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h2"  style={{ color: '#ff5500' }}>
            Memorandum of Receipts
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

       
          <Container>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <Button onClick={handleClickOpen} variant="contained" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
                New Document
              </Button>
            </div>
            </Container>
        

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
                MEMORANDUM OF RECEIPTS
              </Typography>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                <Typography variant="subtitle1">Name:</Typography>
                <br/>
                  <Grid container spacing={1}>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="EntityName"
                        variant="outlined"
                        label="Entity Name"
                        size="small"
                        value={formData.EntityName || ''}
                        onChange={(e) => setFormData({ ...formData, EntityName: e.target.value })}
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
                      value={formData.CollegeCampusOffice || ''}
                      onChange={(e) => setFormData({ ...formData, CollegeCampusOffice: e.target.value })}
                      sx={{ width: '100%', marginBottom: '10px' }}
                    /> 
                   
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        name="SAIPARNum"
                        variant="outlined"
                        label="SAIPAR Number"
                        size="small"
                        value={formData.SAIPARNum || ''}
                        onChange={(e) => setFormData({ ...formData, SAIPARNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                  </Grid>

                  <Typography variant="subtitle1">Acknowledged By:</Typography>
                <br/>
                  <Grid container spacing={1}>

                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="AcknowledgedBy"
                        variant="outlined"
                        label="Acknowledged By"
                        size="small"
                        value={formData.AcknowledgedBy || ''}
                        onChange={(e) => setFormData({ ...formData, AcknowledgedBy: e.target.value })}
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
                        value={formData.PositionAcknowledgedBy || ''}
                        onChange={(e) => setFormData({ ...formData, PositionAcknowledgedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="date"
                        name="DateAcknowledgedBy"
                        variant="outlined"
                        size="small"
                        value={formData.DateAcknowledgedBy || ''}
                        onChange={(e) => setFormData({ ...formData, DateAcknowledgedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                  </Grid>
                    <Typography variant="subtitle1">Inspected By:</Typography>
                <br/>
                  <Grid container spacing={1}>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="InspectedBy"
                        variant="outlined"
                        label="Inspected By"
                        size="small"
                        value={formData.InspectedBy || ''}
                        onChange={(e) => setFormData({ ...formData, InspectedBy: e.target.value })}
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
                        value={formData.PositionInspectedBy || ''}
                        onChange={(e) => setFormData({ ...formData, PositionInspectedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="date"
                        name="DateInspectedBy"
                        variant="outlined"
                        size="small"
                        value={formData.DateInspectedBy || ''}
                        onChange={(e) => setFormData({ ...formData, DateInspectedBy: e.target.value })}
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
                        Office Equipment
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleAddFieldOffice();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                    {inputFieldOffice.map((inputFieldOffice, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOffice.Quantity}
                              onChange={(event) => handleChangeInputOffice(index, event)}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOffice.unitOfMeasure}
                              onChange={(event) => handleChangeInputOffice(index, event)}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputFieldOffice.Description}
                              onChange={(event) => handleChangeInputOffice(index, event)}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOffice.propertyNumber}
                              onChange={(event) => handleChangeInputOffice(index, event)}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={inputFieldOffice.dateAquired}
                              onChange={(event) => handleChangeInputOffice(index, event)}
                            />
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOffice.unitCost}
                              onChange={(event) => handleChangeInputOffice(index, event)}
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={inputFieldOffice.remarks}
                              onChange={(event) => handleChangeInputOffice(index, event)}
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
                                handleRemoveFieldOffice(index);
                              }}
                              // variant="warning"

                            >
                              Remove
                            </Button>
                            {/* Content for the eighth column */}
                          </Grid>
                          <br />
                          
                        </Grid>
                        <br/>
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
                        CICT Equipment
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleAddFieldCict();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                    {inputFieldCict.map((inputFieldCict, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldCict.Quantity}
                              onChange={(event) => handleChangeInputCict(index, event)}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              // sx={{ width: '100px' }}
                              fullWidth
                              size="small"
                              value={inputFieldCict.unitOfMeasure}
                              onChange={(event) => handleChangeInputCict(index, event)}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              // sx={{ width: '265px' }}
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputFieldCict.Description}
                              onChange={(event) => handleChangeInputCict(index, event)}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              // sx={{ width: '183px' }}
                              size="small"
                              value={inputFieldCict.propertyNumber}
                              onChange={(event) => handleChangeInputCict(index, event)}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldCict.dateAquired}
                              onChange={(event) => handleChangeInputCict(index, event)}
                            />
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker"
                                style={{ width: '200px', height: '40px' }}
                                />
                              </DemoContainer>
                            </LocalizationProvider> */}
                            {/* Content for the fifth column */}
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              fullWidth
                              variant="outlined"
                              // sx={{ width: '100px' }}
                              size="small"
                              value={inputFieldCict.unitCost}
                              onChange={(event) => handleChangeInputCict(index, event)}
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={inputFieldCict.remarks}
                              onChange={(event) => handleChangeInputCict(index, event)}
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
                                handleRemoveFieldCict(index);
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
                        <br/>
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
                        Other Equipment
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleAddFieldOther();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                    {inputFieldOther.map((inputFieldOther, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputFieldOther.Quantity}
                              onChange={(event) => handleChangeInputOther(index, event)}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOther.unitOfMeasure}
                              onChange={(event) => handleChangeInputOther(index, event)}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputFieldOther.Description}
                              onChange={(event) => handleChangeInputOther(index, event)}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOther.propertyNumber}
                              onChange={(event) => handleChangeInputOther(index, event)}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={inputFieldOther.dateAquired}
                              onChange={(event) => handleChangeInputOther(index, event)}
                            />
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker"
                                style={{ width: '200px', height: '40px' }}
                                />
                              </DemoContainer>
                            </LocalizationProvider> */}
                            {/* Content for the fifth column */}
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={inputFieldOther.unitCost}
                              onChange={(event) => handleChangeInputOther(index, event)}
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={inputFieldOther.remarks}
                              onChange={(event) => handleChangeInputOther(index, event)}
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
                                handleRemoveFieldOther(index);
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
                        <br/>
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
              message="The Service Request Document was created successfully!"
            />
          </div>
        </Stack>
      </Container>

      <Container>
      {isDean && ( 
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
                  <TableCell>SAIPAR No.</TableCell>
                  <TableCell>College/Campus/Office</TableCell>
                  <TableCell>Entity Name</TableCell>
                  <TableCell>Acknowledged By</TableCell>
                  <TableCell>Inspected By</TableCell>
                  <TableCell>File Status</TableCell>
                  <TableCell>Action</TableCell>
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
                    <TableCell>{item.SAIPARNum}</TableCell>
                    <TableCell>{item.CollegeCampusOffice}</TableCell>
                    <TableCell>{item.EntityName}</TableCell>
                    <TableCell>{item.AcknowledgedBy}</TableCell>
                    <TableCell>{item.InspectedBy}</TableCell>
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
        </Container>
      )}

{isFaculty && ( 
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
                  <TableCell>SAIPAR No.</TableCell>
                  <TableCell>College/Campus/Office</TableCell>
                  <TableCell>Entity Name</TableCell>
                  <TableCell>Acknowledged By</TableCell>
                  <TableCell>Inspected By</TableCell>
                  <TableCell>File Status</TableCell>
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
                    <TableCell>{item.SAIPARNum}</TableCell>
                    <TableCell>{item.CollegeCampusOffice}</TableCell>
                    <TableCell>{item.EntityName}</TableCell>
                    <TableCell>{item.AcknowledgedBy}</TableCell>
                    <TableCell>{item.InspectedBy}</TableCell>
                    <TableCell style={{color: 'white' , backgroundColor: getStatusColor(item.status) }}>{item.status}</TableCell>
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
        </Container>
      )}

{isTechnician && ( 
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
                  <TableCell>SAIPAR No.</TableCell>
                  <TableCell>College/Campus/Office</TableCell>
                  <TableCell>Entity Name</TableCell>
                  <TableCell>Acknowledged By</TableCell>
                  <TableCell>Inspected By</TableCell>
                  <TableCell>File Status</TableCell>
                  <TableCell>Action</TableCell>
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
                    <TableCell>{item.SAIPARNum}</TableCell>
                    <TableCell>{item.CollegeCampusOffice}</TableCell>
                    <TableCell>{item.EntityName}</TableCell>
                    <TableCell>{item.AcknowledgedBy}</TableCell>
                    <TableCell>{item.InspectedBy}</TableCell>
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
        </Container>
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
                MEMORANDUM OF RECEIPTS
              </Typography>
              <DialogContent>
                <form onSubmit={handleEditSubmit}>
                <Typography variant="subtitle1">Name:</Typography>
                <br/>
                  <Grid container spacing={1} columns={12}>
                    <Grid item xs={4}>
                      <TextField
                        type="text"
                        name="EntityName"
                        variant="outlined"
                        label="Entity Name"
                        size="small"
                        value={editData ? editData.EntityName : ''}
                        onChange={(e) => setEditData({ ...editData, EntityName: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                      </Grid>
                      <Grid item xs={4} >
                       <TextField
                      type="text"
                      name="CollegeCampusOffice"
                      variant="outlined"
                      label="College/Campus/Office"
                      size="small"
                      value={editData ? editData.CollegeCampusOffice : ''}
                      onChange={(e) => setEditData({ ...editData, CollegeCampusOffice: e.target.value })}
                      sx={{ width: '100%', marginBottom: '10px' }}
                    /> 
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        name="SAIPARNum"
                        variant="outlined"
                        label="SAIPAR Number"
                        size="small"
                        value={editData ? editData.SAIPARNum : ''}
                        onChange={(e) => setEditData({ ...editData, SAIPARNum: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                  </Grid>


                  <Typography variant="subtitle1">Acknowledged By:</Typography>
                  <br/>
                  <Grid container spacing={1}>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="AcknowledgedBy"
                        variant="outlined"
                        label="Acknowledged By"
                        size="small"
                        value={editData ? editData.AcknowledgedBy : ''}
                        onChange={(e) => setEditData({ ...editData, AcknowledgedBy: e.target.value })}
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
                        value={editData ? editData.PositionAcknowledgedBy : ''}
                        onChange={(e) => setEditData({ ...editData, PositionAcknowledgedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="date"
                        name="DateAcknowledgedBy"
                        variant="outlined"
                        size="small"
                        value={editData ? editData.DateAcknowledgedBy : ''}
                        onChange={(e) => setEditData({ ...editData, DateAcknowledgedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                  </Grid>
                    <Typography variant="subtitle1">Inspected By:</Typography>
                    <br/>
                  <Grid container spacing={1}>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="text"
                        name="InspectedBy"
                        variant="outlined"
                        label="Inspected By"
                        size="small"
                        value={editData ? editData.InspectedBy : ''}
                        onChange={(e) => setEditData({ ...editData, InspectedBy: e.target.value })}
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
                        value={editData ? editData.PositionInspectedBy : ''}
                        onChange={(e) => setEditData({ ...editData, PositionInspectedBy: e.target.value })}
                        sx={{ width: '100%', marginBottom: '10px' }}
                      />
                    </Grid>
                    <Grid item xs={6} md={4}>
                      <TextField
                        type="date"
                        name="DateInspectedBy"
                        variant="outlined"
                        size="small"
                        value={editData ? editData.DateInspectedBy : ''}
                        onChange={(e) => setEditData({ ...editData, DateInspectedBy: e.target.value })}
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
                        Office Equipment
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleEditAddFieldOffice();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                  {editData && editData.inputFieldOffice.map((input, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.Quantity
                              : input?.Quantity}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'Quantity')}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.unitOfMeasure
                              : input?.unitOfMeasure}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'unitOfMeasure')}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.Description
                              : input?.Description}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'Description')}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.propertyNumber
                              : input?.propertyNumber}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'propertyNumber')}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.dateAquired
                              : input?.dateAquired}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'dateAquired')}
                            />
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.unitCost
                              : input?.unitCost}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'unitCost')}
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={
                                editData
                              ? editData.inputFieldOffice[index]?.remarks
                              : input?.remarks}
                              onChange={(event) => handleEditChangeInputOffice(index, event, 'remarks')}
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
                                handleEditRemoveFieldOffice(index);
                              }}
                              // variant="warning"

                            >
                              Remove
                            </Button>
                            {/* Content for the eighth column */}
                          </Grid>
                          <br />
                          
                        </Grid>
                        <br/>
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
                        CICT Equipment
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleEditAddFieldCict();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                  {editData && editData.inputFieldCict.map((input, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.Quantity
                              : input?.Quantity}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'Quantity')}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.unitOfMeasure
                              : input?.unitOfMeasure}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'unitOfMeasure')}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.Description
                              : input?.Description}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'Description')}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.propertyNumber
                              : input?.propertyNumber}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'propertyNumber')}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.dateAquired
                              : input?.dateAquired}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'dateAquired')}
                            />
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.unitCost
                              : input?.unitCost}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'unitCost')}
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={
                                editData
                              ? editData.inputFieldCict[index]?.remarks
                              : input?.remarks}
                              onChange={(event) => handleEditChangeInputCict(index, event, 'remarks')}
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
                                handleEditRemoveFieldCict(index);
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
                        <br/>
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
                        Other Equipment
                      </Typography>
                    </Grid>
                    <Grid>
                      <Button
                        onClick={() => {
                          handleEditAddFieldOther();
                        }}
                        variant="contained"
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                  <div>
                  {editData && editData.inputFieldOther.map((input, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                         {/* First Column */}
                         <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.Quantity
                              : input?.Quantity}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'Quantity')}
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.unitOfMeasure
                              : input?.unitOfMeasure}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'unitOfMeasure')}
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.Description
                              : input?.Description}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'Description')}
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.propertyNumber
                              : input?.propertyNumber}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'propertyNumber')}
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.dateAquired
                              : input?.dateAquired}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'dateAquired')}
                            />
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.unitCost
                              : input?.unitCost}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'unitCost')}
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={
                                editData
                              ? editData.inputFieldOther[index]?.remarks
                              : input?.remarks}
                              onChange={(event) => handleEditChangeInputOther(index, event, 'remarks')}
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
                                handleEditRemoveFieldOther(index);
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
                        <br/>
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
                MEMORANDUM OF RECEIPTS
              </Typography>
              <DialogContent>
              <Typography variant="subtitle1">Name:</Typography>
                <br/>
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
                <br/>
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
                <br/>
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
                        Office Equipment
                      </Typography>
                    </Grid>
                  </Grid>
                  <div>
                  {formData.inputFieldOffice.map((input, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.Quantity : input?.Quantity // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.unitOfMeasure : input?.unitOfMeasure // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.Description : input?.Description // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.propertyNumber : input?.propertyNumber // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.dateAquired : input?.dateAquired // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.unitCost : input?.unitCost // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={
                                viewItem ? viewItem.inputFieldOffice[index]
                                ?.remarks : input?.remarks // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the seventh column */}
                          </Grid>

                          {/* Eighth Column */}
                          
                          <br />
                          
                            <br />
                            <br />
                        </Grid>
                        <br/>
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
                        CICT Equipment
                      </Typography>
                    </Grid>
                    
                  </Grid>
                  <div>
                  {formData.inputFieldCict.map((input, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              // sx={{ width: '100px' }}
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.Quantity : input?.Quantity // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              // sx={{ width: '100px' }}
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.unitOfMeasure : input?.unitOfMeasure // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              // sx={{ width: '265px' }}
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.Description : input?.Description // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              // sx={{ width: '183px' }}
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.propertyNumber : input?.propertyNumber // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.dateAquired : input?.dateAquired // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker"
                                style={{ width: '200px', height: '40px' }}
                                />
                              </DemoContainer>
                            </LocalizationProvider> */}
                            {/* Content for the fifth column */}
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              fullWidth
                              variant="outlined"
                              // sx={{ width: '100px' }}
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.unitCost : input?.unitCost // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={
                                viewItem ? viewItem.inputFieldCict[index]
                                ?.remarks : input?.remarks // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the seventh column */}
                          </Grid>

                          {/* Eighth Column */}
                         
                          <br />
                          <div>
                            <br />
                            <br />
                          </div>
                        </Grid>
                        <br/>
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
                        Other Equipment
                      </Typography>
                    </Grid>
                  
                  </Grid>
                  <div>
                  {formData.inputFieldOther.map((input, index) => (
                      <div key={index}>
                        <Grid container spacing={1} columns={16} direction="row" justifyContent="space-between" alignItems="center">
                          {/* First Column */}
                          <Grid item xs={1.2}>
                            <TextField
                              type="text"
                              name="Quantity"
                              label="Quantity"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.Quantity : input?.Quantity // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                          </Grid>

                          {/* Second Column */}
                          <Grid item xs={1.8}>
                            <TextField
                              name="unitOfMeasure"
                              label="Unit/s"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.unitOfMeasure : input?.unitOfMeasure // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the second column */}
                          </Grid>

                          {/* Third Column */}
                          <Grid item xs={4}>
                            <TextField
                              name="Description"
                              label="Description"
                              multiline
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.Description : input?.Description // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the third column */}
                          </Grid>

                          {/* Fourth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="propertyNumber"
                              label="Property Number"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.propertyNumber : input?.propertyNumber // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the fourth column */}
                          </Grid>

                          {/* Fifth Column */}
                          <Grid item xs={2}>
                            <TextField
                              type="date"
                              name="dateAquired"
                              // label="Date Aquired"
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.dateAquired : input?.dateAquired // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs} >
                              <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Basic date picker"
                                style={{ width: '200px', height: '40px' }}
                                />
                              </DemoContainer>
                            </LocalizationProvider> */}
                            {/* Content for the fifth column */}
                          </Grid>

                          {/* Sixth Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="unitCost"
                              label="Unit Cost"
                              variant="outlined"
                              fullWidth
                              size="small"
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.unitCost : input?.unitCost // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />

                            {/* Content for the sixth column */}
                          </Grid>

                          {/* Seventh Column */}
                          <Grid item xs={2}>
                            <TextField
                              name="remarks"
                              label="Remarks"
                              variant="outlined"
                              size="small"
                              fullWidth
                              multiline
                              value={
                                viewItem ? viewItem.inputFieldOther[index]
                                ?.remarks : input?.remarks // Use optional chaining to handle potential undefined values
                              }
                              disabled
                            />
                            {/* Content for the seventh column */}
                          </Grid>

                          {/* Eighth Column */}
                         
                          <br />
                          <div>
                            <br />
                            <br />
                          </div>
                        
                        </Grid>
                        <br/>
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