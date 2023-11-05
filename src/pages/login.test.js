
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import LoginForm from '../sections/auth/login/LoginForm';
import LoginForm from './LoginPage';

describe('LoginForm', () => {
  it('renders the login form', () => {
    render(<LoginForm />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('handles a successful login', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'cruz.nico.c.7226@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Nicocruz03!' } });
    fireEvent.click(loginButton);

    // Add expectations for a successful login
  });

  it('displays an error message for an invalid login', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'invalidpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    });
  });
});
