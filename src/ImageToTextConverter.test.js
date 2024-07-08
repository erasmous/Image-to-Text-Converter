// src/ImageToTextConverter.test.js
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ImageToTextConverter from './ImageToTextConverter';

// Mock Tesseract.js
jest.mock('tesseract.js', () => ({
  recognize: jest.fn(() => Promise.resolve({ data: { text: 'Mocked extracted text' } })),
}));

describe('ImageToTextConverter', () => {
  test('renders without crashing', () => {
    render(<ImageToTextConverter />);
    expect(screen.getByText(/Image to Text Converter/i)).toBeInTheDocument();
  });

  test('uploads and processes an image', async () => {
    render(<ImageToTextConverter />);

    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Upload an image/i);

    fireEvent.change(input, { target: { files: [file] } });

    expect(input.files[0]).toBe(file);

    fireEvent.click(screen.getByText(/Convert to Text/i));

    await waitFor(() => {
      expect(screen.getByText(/Extracted Text:/i)).toBeInTheDocument();
    });
  });

  test('handles paste event', async () => {
    render(<ImageToTextConverter />);

    const dataTransfer = new DataTransfer();
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    dataTransfer.items.add(file);

    fireEvent.paste(window, { clipboardData: dataTransfer });

    fireEvent.click(screen.getByText(/Convert to Text/i));

    await waitFor(() => {
      expect(screen.getByText(/Extracted Text:/i)).toBeInTheDocument();
    });
  });

  test('clears the state', async () => {
    render(<ImageToTextConverter />);

    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Upload an image/i);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByText(/Convert to Text/i));

    await waitFor(() => {
      expect(screen.getByText(/Mocked extracted text/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Clear/i));

    expect(screen.queryByText(/Mocked extracted text/i)).not.toBeInTheDocument();
  });

  test('selects language', () => {
    render(<ImageToTextConverter />);

    const select = screen.getByLabelText(/Language/i);
    fireEvent.change(select, { target: { value: 'fra' } });

    expect(select.value).toBe('fra');
  });
});
