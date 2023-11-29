
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils'; // Import 'act' for async testing
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Login }  from "../sections/auth/login/Login"; // Import your LoginForm component

// Mock the Firebase Authentication functions
jest.mock('firebase/auth');

describe('Login', () => {
  it('should log in with valid credentials', async () => {
    // Mock signInWithEmailAndPassword to resolve
    signInWithEmailAndPassword.mockResolvedValue({});

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId('submitBtn');

    fireEvent.change(emailInput, { target: { value: 'cruz.nico.c.7226@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Nicocruz03!' } });

    act(() => {
      fireEvent.click(loginButton);
    });

    // Assert that signInWithEmailAndPassword was called
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), 'cruz.nico.c.7226@gmail.com', 'Nicocruz03!');
  });


});
