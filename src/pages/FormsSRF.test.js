import React from 'react';
import { render, screen } from '@testing-library/react';
import FormsSRF from './FormsSRF'; // Import your component

test('FormsSRF snapshot', () => {
    const { asFragment } = render(<FormsSRF />);
    expect(asFragment()).toMatchSnapshot();
  });