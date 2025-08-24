import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import UncontrolledForm from './FormUncontrolled';

vi.mock('../../store/useFormStore', () => ({
  useFormStore: vi.fn((fn) =>
    fn({
      addSubmission: vi.fn(),
      countries: ['USA', 'Germany', 'France'],
    })
  ),
}));

vi.mock('../../utils/validatePasswordStrength', () => ({
  validatePasswordStrength: vi.fn(() => []),
  getPasswordStrength: vi.fn(() => 'strong'),
}));

vi.mock('../Country/AutocompleteCountry', () => ({
  default: (props: { value: string; onChange: (v: string) => void }) => (
    <input
      aria-label="Country"
      value={props.value}
      onChange={(e) => props.onChange((e.target as HTMLInputElement).value)}
    />
  ),
}));

import * as StoreModule from '../../store/useFormStore';
import * as PasswordModule from '../../utils/validatePasswordStrength';

describe('UncontrolledForm', () => {
  it('displays all form fields', () => {
    render(<UncontrolledForm onClose={() => {}} />);

    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Age:/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password:$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm password:$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Accept Terms:/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Upload image:/i, { selector: 'input' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it('shows errors on empty submit', async () => {
    render(<UncontrolledForm onClose={() => {}} />);
    await userEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/The name must start/i)).toBeInTheDocument();
    expect(screen.getByText(/Incorrect email/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose gender/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You must agree to the terms and conditions/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Upload image/i, { selector: 'p' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Enter country/i)).toBeInTheDocument();
  });

  it('a valid form calls addSubmission and onClose', async () => {
    const onClose = vi.fn();
    const addSubmission = vi.fn();

    const mockedUseFormStore = StoreModule.useFormStore as MockedFunction<
      typeof StoreModule.useFormStore
    >;
    mockedUseFormStore.mockImplementation((fn) =>
      fn({ addSubmission, countries: ['USA'] })
    );

    render(<UncontrolledForm onClose={onClose} />);

    await userEvent.type(screen.getByLabelText(/Name:/i), 'John');
    await userEvent.type(
      screen.getByRole('spinbutton', { name: /Age:/i }),
      '30'
    );
    await userEvent.type(screen.getByLabelText(/Email:/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^Password:/i), 'Abc123$4');
    await userEvent.type(
      screen.getByLabelText(/Confirm password:/i),
      'Abc123$4'
    );
    await userEvent.selectOptions(screen.getByLabelText(/Gender:/i), 'male');
    await userEvent.click(screen.getByLabelText(/Accept Terms:/i));

    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    await userEvent.upload(
      screen.getByLabelText(/Upload image:/i, { selector: 'input' }),
      file
    );

    await userEvent.type(screen.getByLabelText(/Country/i), 'USA');
    await userEvent.click(screen.getByText(/Submit/i));

    expect(addSubmission).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('displays an error if validatePasswordStrength returns a problem', async () => {
    const mockedValidate =
      PasswordModule.validatePasswordStrength as MockedFunction<
        typeof PasswordModule.validatePasswordStrength
      >;
    mockedValidate.mockReturnValue(['Weak password']);

    render(<UncontrolledForm onClose={() => {}} />);

    await userEvent.type(screen.getByLabelText(/^Password:/i), '123');
    await userEvent.type(screen.getByLabelText(/Confirm password:/i), '123');
    await userEvent.click(screen.getByText(/Submit/i));

    expect(screen.getByText(/Weak password/i)).toBeInTheDocument();
  });
});
