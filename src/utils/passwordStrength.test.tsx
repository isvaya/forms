import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PasswordStrength from './passwordStrength';

describe('PasswordStrength component', () => {
  it('does not render anything if the password is empty', () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a weak password', () => {
    render(<PasswordStrength password="abc" />);
    expect(screen.getByText(/WEAK/i)).toBeInTheDocument();

    const bar = screen.getByText(/WEAK/i).previousSibling as HTMLElement;
    expect(bar).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
      width: '33%',
    });
  });

  it('renders medium password', () => {
    render(<PasswordStrength password="abcdefg1" />);
    expect(screen.getByText(/MEDIUM/i)).toBeInTheDocument();

    const bar = screen.getByText(/MEDIUM/i).previousSibling as HTMLElement;
    expect(bar).toHaveStyle({
      backgroundColor: 'rgb(255, 165, 0)',
      width: '66%',
    });
  });

  it('renders a strong password (strong)', () => {
    render(<PasswordStrength password="Abc123$xyz" />);
    expect(screen.getByText(/STRONG/i)).toBeInTheDocument();

    const bar = screen.getByText(/STRONG/i).previousSibling as HTMLElement;
    expect(bar).toHaveStyle({
      backgroundColor: 'rgb(0, 128, 0)',
      width: '100%',
    });
  });
});
