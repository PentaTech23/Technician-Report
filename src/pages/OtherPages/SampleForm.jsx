import React, { useState, useEffect } from 'react';
import '@testing-library/jest-dom';
import { addDoc, collection, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from './db';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    contactNumber: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [editDocId, setEditDocId] = useState(null);

  useEffect(() => {
    // If in edit mode, fetch and set the data for the specified document
    const fetchEditData = async () => {
      if (editMode && editDocId) {
        const docRef = doc(db, 'Sample', editDocId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }
      }
    };

    fetchEditData();
  }, [editMode, editDocId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // Update data in Firestore if in edit mode
        await updateDataInFirestore(formData, editDocId);
        setEditMode(false);
        setEditDocId(null);
      } else {
        // Add data to Firestore if not in edit mode
        await addDataToFirestore(formData);
      }

      // Clear form after submission
      setFormData({
        name: '',
        email: '',
        gender: '',
        contactNumber: '',
      });

      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addDataToFirestore = async (data) => {
    const docRef = await addDoc(collection(db, 'Sample'), data);
    console.log('Document written with ID: ', docRef.id);
  };

  const updateDataInFirestore = async (data, docId) => {
    const docRef = doc(db, 'Sample', docId);
    await updateDoc(docRef, data);
    console.log('Document updated with ID: ', docId);
  };

  const handleEdit = (docId) => {
    setEditMode(true);
    setEditDocId(docId);
  };

  const handleDelete = async (docId) => {
    try {
      const docRef = doc(db, 'Sample', docId);
      await deleteDoc(docRef);
      console.log('Document deleted with ID: ', docId);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:
        <input
          type="text"
          placeholder="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
  
      <label htmlFor="email">Email:
        <input
          type="email"
          placeholder="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
  
      <label htmlFor="gender">Gender:
        <input
          type="text"
          placeholder="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </label>
      <br />
  
      <label htmlFor="contactNumber">Contact Number:
        <input
          type="tel"
          placeholder="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
        />
      </label>
      <br />

      <button data-testid="submitBtn" type="submit">
        {editMode ? 'Update' : 'Submit'}
      </button>

      {editMode && (
        <>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel Edit
          </button>

          {/* Add a "Delete" button */}
          <button type="button" onClick={() => handleDelete(editDocId)}>
            Delete
          </button>
        </>
      )}

      {/* Display a list of documents for editing */}
      <ul>
        {/* Replace 'YOUR_DOC_ID' with the actual document ID from Firestore */}
        <li onClick={() => handleEdit('ysAgPxg1UVaRsgglxW7T')}>
          Edit Document
        </li>
      </ul>
    </form>
  );
};

export default Form;
