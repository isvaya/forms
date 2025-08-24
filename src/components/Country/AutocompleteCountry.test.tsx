import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Autocomplete from './AutocompleteCountry';

describe('Autocomplete', () => {
  const options = ['Uzbekistan', 'Ukraine', 'USA'];

  it('renders input', () => {
    const handleChange = vi.fn();
    render(<Autocomplete options={options} onChange={handleChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('filters the list as you type', () => {
    const handleChange = vi.fn();
    render(<Autocomplete options={options} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'us' } });

    expect(screen.getByText('Uzbekistan')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('selects an item from a list by clicking', () => {
    const handleChange = vi.fn();
    render(<Autocomplete options={options} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'uk' } });

    const option = screen.getByText('Ukraine');
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith('Ukraine');
  });

  it('hides the list on blur', async () => {
    const handleChange = vi.fn();
    render(<Autocomplete options={options} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'u' } });

    expect(screen.getByText('Uzbekistan')).toBeInTheDocument();

    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByText('Uzbekistan')).not.toBeInTheDocument();
    });
  });

  it('does not show the list if there are no matches', () => {
    const handleChange = vi.fn();
    render(<Autocomplete options={options} onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'zzz' } });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
