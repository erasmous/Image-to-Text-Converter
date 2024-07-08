import { render, screen } from '@testing-library/react';
import App from './App';
import ImageToTextConverter from './ImageToTextConverter';

describe('ImageToTextConverter', () => {
  test('renders without crashing', () => {
    render(<ImageToTextConverter />);
    expect(screen.getByText(/Image to Text Converter/i)).toBeInTheDocument();
  });
});
