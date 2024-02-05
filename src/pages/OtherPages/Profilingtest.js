
import React from 'react';
import {act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDocs, collection, query, addDoc,ori, getFirestore, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './db';
import IncomingCrud from './SampleForm'
const mockFirestoreAdd = jest.fn();
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  addDoc: jest.fn(), // Mock addDoc as a function
  updateDoc: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn()
}));


test('renders add document form', async() => {
    render(<IncomingCrud/>)
        expect(screen.getByPlaceholderText('name'));
        expect(screen.getByPlaceholderText('email'));
        expect(screen.getByPlaceholderText('gender'));
        expect(screen.getByPlaceholderText('contactNumber'));

})

test('add document functionality', async() => {
    jest.setTimeout(30000);
  render(<IncomingCrud />);
    const name = screen.getByPlaceholderText('name');
    const email = screen.getByPlaceholderText('email');
    const gender = screen.getByPlaceholderText('gender');
    const contactNumber = screen.getByPlaceholderText('contactNumber');

    act(() => {
        fireEvent.change(name, { target: { value: 'Test Name' } });
        fireEvent.change(email, { target: { value: 'Test email' } });
        fireEvent.change(gender, { target: { value: 'Test gender' } });
        fireEvent.change(contactNumber, { target: { value: 'Test Contact Number' } });

    });

    const form = screen.getByTestId('submitBtn');
    form.submit = jest.fn();
    act(() => {
        fireEvent.submit(form);
    });
    const incomingCollectionRef = collection('mockCollection');
    expect(addDoc).toHaveBeenCalledWith(incomingCollectionRef, {
      name: 'Test Name',
      email: 'Test email',
      gender: 'Test gender',
      contactNumber: 'Test Contact Number',

    });
  });
    

  // test('fetches Firestore data', async () => {
  //   render(<IncomingCrud />);
  //   const mockCollection = collection;
  //   const mockGetDocs = getDocs;
  
  //   mockGetDocs.mockImplementation(() => {
  //     return Promise.resolve({ docs:[{
  //       name: 'Test Name',
  //       email: 'Test email',
  //       gender: 'Test gender',
  //       contactNumber: 'Test Contact Number',
  //           }]
  //       });
  //   });
  //   // expect(mockCollection).toHaveBeenCalledWith(db, 'Sample');
  //   expect(mockGetDocs).toHaveBeenCalledWith(mockCollection(db, 'Sample'));
  //   jest.resetAllMocks();
  // });

  test('edit document form', async() => {
    render(<IncomingCrud/>)
        expect(screen.getByPlaceholderText('name'));
        expect(screen.getByPlaceholderText('email'));
        expect(screen.getByPlaceholderText('gender'));
        expect(screen.getByPlaceholderText('contactNumber'));
        
})
test('renders View document form', async() => {
  render(<IncomingCrud/>)
      expect(screen.getByPlaceholderText('name'));
      expect(screen.getByPlaceholderText('email'));
      expect(screen.getByPlaceholderText('gender'));
      expect(screen.getByPlaceholderText('contactNumber'));
      
})

test('Delete document form', async() => {
  render(<IncomingCrud/>)
      expect(screen.getByPlaceholderText('name'));
      expect(screen.getByPlaceholderText('email'));
      expect(screen.getByPlaceholderText('gender'));
      expect(screen.getByPlaceholderText('contactNumber'));
      
})

// test('update document functionality', async () => {
//   const mockUpdateDoc = updateDoc;

//   render(<IncomingCrud />);

//   const name = screen.getByPlaceholderText('name');
//   const email = screen.getByPlaceholderText('email');
//   const gender = screen.getByPlaceholderText('gender');
//   const contactNumber = screen.getByPlaceholderText('contactNumber');

//   fireEvent.change(name, { target: { value: 'New name' } });
//   fireEvent.change(email, { target: { value: 'New email' } });
//   fireEvent.change(gender, { target: { value: 'New gender' } });
//   fireEvent.change(contactNumber, { target: { value: 'New Contact Number' } });

//   const form = screen.getByTestId('submitBtn');
//   act(() => {
//     fireEvent.submit(form);
//   });

//   await waitFor(() => {
//     expect(mockUpdateDoc).toHaveBeenCalledWith(
//       doc(expect.any(Object), 'Sample', expect.any(String)),
//       {
//         name: 'New name',
//         email: 'New email',
//         gender: 'New gender',
//         contactNumber: 'New Contact Number',
//       }
//     );
//   });
// });
