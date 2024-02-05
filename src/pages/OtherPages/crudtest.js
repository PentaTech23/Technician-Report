import React from 'react';
import {act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDocs, collection, query, addDoc,ori, getFirestore, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './db';
import FormsSFR from './SFRinput'

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
    render(<FormsSFR/>)
    // const buttonName = screen.getByTestId('newSFRform')
    // fireEvent.click(buttonName)
        expect(screen.getByPlaceholderText('ControlNum'));
        expect(screen.getByPlaceholderText('FullName'));
        expect(screen.getByPlaceholderText('Requisitioner'));
        expect(screen.getByPlaceholderText('LocationRoom'));
        expect(screen.getByPlaceholderText('Remarks'));
})

test('add document functionality', async() => {
    jest.setTimeout(30000);
  render(<FormsSFR />);
  // const buttonName = screen.getByTestId('newSFRform')
  // fireEvent.click(buttonName)
  const ControlNum = screen.getByTestId('ControlNum');
  const FullName = screen.getByPlaceholderText('FullName');
  const Requisitioner = screen.getByPlaceholderText('Requisitioner');
  const LocationRoom = screen.getByPlaceholderText('LocationRoom');
  const Remarks = screen.getByPlaceholderText('Remarks');


    act(() => {
      fireEvent.change(ControlNum, { target: { value: 'Test' } });
      fireEvent.change(FullName, { target: { value: 'Test' } });
      fireEvent.change(Requisitioner, { target: { value: 'Test' } });
      fireEvent.change(LocationRoom, { target: { value: 'Test' } });
      fireEvent.change(Remarks, { target: { value: 'Test' } });
    });

    const form = screen.getByTestId('submit');
    form.submit = jest.fn();
    act(() => {
        fireEvent.submit(form);
    });
    const incomingCollectionRef = collection('mockCollection');
    expect(addDoc).toHaveBeenCalledWith(incomingCollectionRef, {
      ControlNum: 'Test Name',
      FullName: 'Test Received By',
      Requisitioner: 'Test Office/Dept',
      LocationRoom: 'Test Contact Person',
      Remarks: 'Test Short Description',
    });
  });
    

  test('fetches Firestore data', async () => {
    render(<FormsSFR />);
    const mockCollection = collection;
    const mockGetDocs = getDocs;
  
    mockGetDocs.mockImplementation(() => {
      return Promise.resolve({ docs:[{
            documentName: 'Test Name',
            receivedBy: 'Test User',
            officeDept: 'Test Department',
            contactPerson: 'Test Person',
            shortDescription: 'Test Description',
            forwardTo: 'Forwarded To',
            }]
        });
    });
    expect(mockCollection).toHaveBeenCalledWith(db, 'SERVICE-REQUEST');
    expect(mockGetDocs).toHaveBeenCalledWith(mockCollection(db, 'SERVICE-REQUEST'));
    jest.resetAllMocks();
  });

  test('renders edit document form', async() => {
    render(<FormsSFR/>)
        expect(screen.getByPlaceholderText('Edit Document name'));
        expect(screen.getByPlaceholderText('Edit Received By'));
        expect(screen.getByPlaceholderText('Edit Office/Dept'));
        expect(screen.getByPlaceholderText('Edit Contact Person'));
        expect(screen.getByPlaceholderText('Edit Short Description'));
})

  test('update document functionality', async () => {
    const mockUpdateDoc = updateDoc;
  
    render(<FormsSFR />);
  
    const ControlNum = screen.getByTestId('ControlNum');
    const FullName = screen.getByPlaceholderText('FullName');
    const Requisitioner = screen.getByPlaceholderText('Requisitioner');
    const LocationRoom = screen.getByPlaceholderText('LocationRoom');
    const Remarks = screen.getByPlaceholderText('Remarks');
  

    fireEvent.change(ControlNum, { target: { value: 'New' } });
    fireEvent.change(FullName, { target: { value: 'New' } });
    fireEvent.change(Requisitioner, { target: { value: 'New' } });
    fireEvent.change(LocationRoom, { target: { value: 'New' } });
    fireEvent.change(Remarks, { target: { value: 'New' } });

    const form = screen.getByTestId('updateForm');
    act(() => {
      fireEvent.submit(form);
    });
  
    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalledWith(
        doc(expect.any(Object), 'SERVICE-REQUEST', expect.any(String)),
        {
          ControlNum: 'New',
    FullName: 'New',
    Requisitioner: 'New',
    LocationRoom: 'New',
    Remarks: 'New',
        }
      );
    });
  });


  test('delete a document', async () => {
    const mockCollection = collection;
    const mockDeleteDoc = deleteDoc;
  
    mockDeleteDoc.mockResolvedValue();
  
    render(<FormsSFR />);

    const deleteModal = screen.getByTestId('deleteModal');
    fireEvent.click(deleteModal);

    const deleteButton = screen.getByTestId('deleteButton');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalledWith(mockCollection(db, 'SERVICE-REQUEST/ControlNum'));
    });
  });


// import React from 'react';
// import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
// import { getDocs, collection, query, addDoc,ori, getFirestore, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
// import { db } from './db';
// import FormsSFR from './SFRinput';

// const mockFirestoreAdd = jest.fn();
// jest.mock('firebase/firestore', () => ({
//   ...jest.requireActual('firebase/firestore'), // Use the real firestore functions
//   collection: jest.fn(),
//   addDoc: mockFirestoreAdd, // Mock addDoc as a function
//   updateDoc: jest.fn(),
//   deleteDoc: jest.fn(),
//   getDocs: jest.fn()
// }));

// test('renders add document form', async () => {
//   render(<FormsSFR />);
//   // const buttonName = screen.getByTestId('newSFRform')
//   // fireEvent.click(buttonName)
//   expect(screen.getByPlaceholderText('ControlNum'));
//   expect(screen.getByPlaceholderText('FullName'));
//   expect(screen.getByPlaceholderText('Requisitioner'));
//   expect(screen.getByPlaceholderText('Location/Room'));
//   expect(screen.getByPlaceholderText('Remarks'));
// });

// test('add document functionality', async () => {
//   render(<FormsSFR />);
//   const ControlNum = screen.getByPlaceholderText('ControlNum');
//   const FullName = screen.getByPlaceholderText('FullName');
//   const Requisitioner = screen.getByPlaceholderText('Requisitioner');
//   const LocationRoom = screen.getByPlaceholderText('Location/Room');
//   const Remarks = screen.getByPlaceholderText('Remarks');

//   act(() => {
//     fireEvent.change(ControlNum, { target: { value: 'Test ControlNum' } });
//     fireEvent.change(FullName, { target: { value: 'Test FullName' } });
//     fireEvent.change(Requisitioner, { target: { value: 'Test Requisitioner' } });
//     fireEvent.change(LocationRoom, { target: { value: 'Test LocationRoom' } });
//     fireEvent.change(Remarks, { target: { value: 'Test Remarks' } });
//   });

//   const form = screen.getByTestId('submitBtn');
//   act(() => {
//     fireEvent.submit(form);
//   });

//   mockGetDocs.mockImplementation(() => {
//     return Promise.resolve({ docs:[{
//       ControlNum: 'Test ControlNum',
//       FullName: 'Test FullName',
//       Requisitioner: 'Test Requisitioner',
//       LocationRoom: 'Test LocationRoom',
//       Remarks: 'Test Remarks',
//           }]
//       });
//   });


// test('fetches Firestore data', async () => {
//   render(<FormsSFR />);
//   const mockCollection = collection;
//   const mockGetDocs = getDocs;

//   mockGetDocs.mockImplementation(() =>
//     Promise.resolve({
//       docs: [
//         {
//           data: () => ({
//             ControlNum: 'Test ControlNum',
//             FullName: 'Test FullName',
//             Requisitioner: 'Test Requisitioner',
//             LocationRoom: 'Test LocationRoom',
//             Remarks: 'Test Remarks',
//           }),
//         },
//       ],
//     })
//   );

//   expect(mockCollection).toHaveBeenCalledWith(db, 'SERVICE-REQUEST');
//   expect(mockGetDocs).toHaveBeenCalledWith(mockCollection(db, 'SERVICE-REQUEST'));
//   jest.clearAllMocks(); // Use clearAllMocks to reset all mocked functions
// });
// });