import { describe, it, vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

vi.mock('./components/UncontrolledForm/FormUncontrolled', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      <p>Uncontrolled Form</p>
      <button onClick={onClose}>Close Uncontrolled</button>
    </div>
  ),
}));

vi.mock('./components/HookForm/FormHook', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div>
      <p>Hook Form</p>
      <button onClick={onClose}>Close Hook</button>
    </div>
  ),
}));

vi.mock('./components/SubmissionList/SubmissionsList', () => ({
  default: () => <div data-testid="submissions">Submissions List</div>,
}));

describe('App', () => {
  it('renders buttons and title', () => {
    render(<App />);
    expect(screen.getByText('Uncontrolled')).toBeInTheDocument();
    expect(screen.getByText('React Hook')).toBeInTheDocument();
    expect(screen.getByText('Form Submissions')).toBeInTheDocument();
    expect(screen.getByTestId('submissions')).toBeInTheDocument();
  });

  it('opens and closes UncontrolledForm', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Uncontrolled'));

    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Uncontrolled'));

    expect(screen.queryByText('Uncontrolled Form')).not.toBeInTheDocument();
  });

  it('opens and closes HookForm', () => {
    render(<App />);
    fireEvent.click(screen.getByText('React Hook'));

    expect(screen.getByText('Hook Form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Hook'));

    expect(screen.queryByText('Hook Form')).not.toBeInTheDocument();
  });
});
