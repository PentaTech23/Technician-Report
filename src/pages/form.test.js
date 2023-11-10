import React from 'react';
import {act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getDocs, collection, query, addDoc,ori, getFirestore, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import SFRinput from './SFRinput'

test('SFRinput component renders without errors', () => {
    render(<SFRinput />);
    expect(screen.getByPlaceholderText('ControlNum'));
        expect(screen.getByPlaceholderText('FullName'));
        expect(screen.getByPlaceholderText('Requisitioner'));
        expect(screen.getByPlaceholderText('Location/Room'));
        expect(screen.getByPlaceholderText('Remarks'));

  });

  test('SFRinput form submission', () => {
    render(<SFRinput />);
    const submitButton = screen.getByTestId('submitBtn');
    expect(screen.getByPlaceholderText('ControlNum'));
    expect(screen.getByPlaceholderText('FullName'));
    expect(screen.getByPlaceholderText('Requisitioner'));
    expect(screen.getByPlaceholderText('Location/Room'));
    expect(screen.getByPlaceholderText('Remarks'));
  
    // Mock a form submission by firing a click event on the submit button
    fireEvent.click(submitButton);
  
    // Add assertions to check the expected behavior after form submission
  });
  
  test('SFRinput form delete', () => {
    render(<SFRinput />);
    const deleteButton = screen.getByTestId('deleteButton');
    expect(screen.getByPlaceholderText('ControlNum'));
    expect(screen.getByPlaceholderText('FullName'));
    expect(screen.getByPlaceholderText('Requisitioner'));
    expect(screen.getByPlaceholderText('Location/Room'));
    expect(screen.getByPlaceholderText('Remarks'));
    // Mock a form submission by firing a click event on the submit button
    fireEvent.click(deleteButton);
  
    // Add assertions to check the expected behavior after form submission
  });

  test('SFRinput form archive', () => {
    render(<SFRinput />);
    const archiveButton = screen.getByTestId('archiveButton');
    expect(screen.getByPlaceholderText('ControlNum'));
    expect(screen.getByPlaceholderText('FullName'));
    expect(screen.getByPlaceholderText('Requisitioner'));
    expect(screen.getByPlaceholderText('Location/Room'));
    expect(screen.getByPlaceholderText('Remarks'));
  
    // Mock a form submission by firing a click event on the submit button
    fireEvent.click(archiveButton);
  
    // Add assertions to check the expected behavior after form submission
  });

  test('SFRinput form edit', () => {
    render(<SFRinput />);
    const editBtn = screen.getByTestId('editBtn');
    expect(screen.getByPlaceholderText('ControlNum'));
    expect(screen.getByPlaceholderText('FullName'));
    expect(screen.getByPlaceholderText('Requisitioner'));
    expect(screen.getByPlaceholderText('Location/Room'));
    expect(screen.getByPlaceholderText('Remarks'));
  
    // Mock a form submission by firing a click event on the submit button
    fireEvent.click(editBtn);
  
    // Add assertions to check the expected behavior after form submission
  });
  