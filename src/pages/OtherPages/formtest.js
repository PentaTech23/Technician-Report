// import React from "react";


// import {
// 	render,
// 	fireEvent,
// 	waitForElementToBeRemoved,
// 	screen,
// 	waitFor,
// } from "@testing-library/react";

// import SFRinput from "./SFRinput";

// // // Mocking the localStorage getItem and setItem functions
// // beforeEach(() => {
// // 	const localStorageMock = {
// // 		getItem: jest.fn(),
// // 		setItem: jest.fn(),
// // 	};
// // });

// // test("renders Board component", () => {
// //   const ControlNum = screen.getByTestId('ControlNum');
// //   const FullName = screen.getByPlaceholderText('FullName');
// //   const Requisitioner = screen.getByPlaceholderText('Requisitioner');
// //   const LocationRoom = screen.getByPlaceholderText('LocationRoom');
// //   const Remarks = screen.getByPlaceholderText('Remarks');
// //   const submitBtn = screen.getByTestId("submitBtn");


// // 	expect(ControlNum).toBeInTheDocument();
// // 	expect(FullName).toBeInTheDocument();
// // 	expect(Requisitioner).toBeInTheDocument();
// // 	expect(LocationRoom).toBeInTheDocument();
// // 	expect(Remarks).toBeInTheDocument();
// // 	expect(submitBtn).toBeInTheDocument();
// // });

// // test("adds a new card to todo lane", () => {
// // 	const { getByTestId, getByText } = render(<SFRinput />);
// // 	const submitBtn = getByTestId("submitBtn");

// // 	fireEvent.click(submitBtn);

// // 	const saveButton = getByText("Save");

// // 	expect(saveButton).toBeInTheDocument();

// // 	// Test the functionality of adding a new card to todo lane
// // });

// // test("adds and deletes a card from any lane", async () => {
// // 	const { getByTestId } = render(<SFRinput />);
// // 	const submitBtn = getByTestId("submitBtn");

// // 	// Add a card
// // 	fireEvent.click(submitBtn);

// // 	// Enter the card title
// // 	const cardTitleInput = screen.getByPlaceholderText("Enter title");
// // 	fireEvent.change(cardTitleInput, { target: { value: "New Task" } });

// // 	// Click the save button
// // 	const saveButton = screen.getByText("Create");
// // 	fireEvent.click(saveButton);

// // 	// Wait for the card to be rendered
// // 	const addedCardTitle = "New Task";

// // 	// Delete the card
// // 	const deleteButton = screen.getByTestId("deleteButton");
// // 	fireEvent.click(deleteButton);

// // 	// Wait for the card to be removed from the DOM
// // 	await new Promise((resolve) => setTimeout(resolve, 100)); // Delay for a short period of time

// // 	// Assert that the card is removed from the DOM
// // 	expect(screen.queryByText(addedCardTitle)).toBeNull();
// // });

// // test("edits the title of a card in any lane", async () => {
// // 	const { getByTestId, getByPlaceholderText, getByText } = render(<SFRinput />);
// // 	const saveButton = getByTestId("saveButton");

// // 	// Add a card
// // 	fireEvent.click(saveButton);

// // 	// Wait for the card to be rendered
// // 	const initialCardTitle = "New Task";
// // 	const cardTitleInput = getByPlaceholderText("Enter title");
// // 	fireEvent.change(cardTitleInput, { target: { value: initialCardTitle } });

// // 	// Click the save button
// // 	const saveButton = getByText("Create");
// // 	fireEvent.click(saveButton);

// // 	// Wait for the card to be rendered
// // 	await waitFor(() => getByText(initialCardTitle), { timeout: 10000 }); // Increase the timeout to 10 seconds

// // 	const editButton = screen.getByTestId("edit-button");
// // 	fireEvent.click(editButton);

// // 	const editedCardTitle = "Edited Task";
// // 	const editedCardTitleInput = getByPlaceholderText("Enter title");
// // 	fireEvent.change(editedCardTitleInput, {
// // 		target: { value: editedCardTitle },
// // 	});

// // 	// Click the save button
// // 	const saveEditedButton = getByText("Save");
// // 	fireEvent.click(saveEditedButton);

// // 	// Wait for the edited card to be rendered
// // 	await waitFor(() => getByText(editedCardTitle), { timeout: 10000 }); // Increase the timeout to 10 seconds

// // 	// Assert that the edited card title is displayed
// // 	expect(getByText(editedCardTitle)).toBeInTheDocument();
// // });


// test('SFRinput component renders without errors', () => {
//     render(<SFRinput />);
//     expect(screen.getByPlaceholderText('ControlNum'));
//         expect(screen.getByPlaceholderText('FullName'));
//         expect(screen.getByPlaceholderText('Requisitioner'));
//         expect(screen.getByPlaceholderText('Location/Room'));
//         expect(screen.getByPlaceholderText('Remarks'));
//   });

//   test('SFRinput form submission', () => {
//     render(<SFRinput />);
//     const submitButton = screen.getByTestId('submitBtn');
  
//     // Mock a form submission by firing a click event on the submit button
//     fireEvent.click(submitButton);
  
//     // Add assertions to check the expected behavior after form submission
//   });
  
//   test('SFRinput form delete', () => {
//     render(<SFRinput />);
//     const deleteButton = screen.getByTestId('deleteButton');
  
//     // Mock a form submission by firing a click event on the submit button
//     fireEvent.click(deleteButton);
  
//     // Add assertions to check the expected behavior after form submission
//   });

//   test('SFRinput form archive', () => {
//     render(<SFRinput />);
//     const archiveButton = screen.getByTestId('archiveButton');
  
//     // Mock a form submission by firing a click event on the submit button
//     fireEvent.click(archiveButton);
  
//     // Add assertions to check the expected behavior after form submission
//   });

//   test('SFRinput form edit', () => {
//     render(<SFRinput />);
//     const editBtn = screen.getByTestId('editBtn');
  
//     // Mock a form submission by firing a click event on the submit button
//     fireEvent.click(editBtn);
  
//     // Add assertions to check the expected behavior after form submission
//   });
  
  // Import necessary libraries for testing
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { act as firebaseAct } from 'react-dom/test-utils';
import { db } from './db';  // Assuming you have the Firebase configuration file

// Import the components to be tested
import Form from '../Dashboard/Form';
import SFRinput from './SFRinput';

// Mock the Firebase database methods
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock the Firebase storage methods
jest.mock('firebase/storage', () => ({
  ...jest.requireActual('firebase/storage'),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock the initializeApp function from Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

describe('Form Component', () => {
  test('renders Form component', async () => {
    render(<Form />);
    
    // Assuming there's an input with the name attribute "name"
    const nameInput = screen.getByLabelText('Name:');
    expect(nameInput).toBeInTheDocument();
  });

  // Add more tests as needed for different functionalities of the Form component
});

describe('SFRinput Component', () => {
  test('renders SFRinput component', async () => {
    render(<SFRinput />);
    
    // Assuming there's an input with the name attribute "ControlNum"
    const controlNumInput = screen.getByLabelText('ControlNum');
    expect(controlNumInput).toBeInTheDocument();
  });

  // Add more tests as needed for different functionalities of the SFRinput component
});
