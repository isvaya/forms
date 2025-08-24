import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import HookForm from './FormHook';

vi.mock('../../store/useFormStore', () => ({
  useFormStore: vi.fn((fn) =>
    fn({
      addSubmission: vi.fn(),
      countries: ['USA', 'Germany', 'France'],
    })
  ),
}));

vi.mock('../Country/AutocompleteCountry', () => ({
  default: (props: {
    id?: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      id={props.id}
      aria-label="Country"
      value={props.value ?? ''}
      onChange={(e) => props.onChange((e.target as HTMLInputElement).value)}
    />
  ),
}));

vi.mock('../../utils/passwordStrength', () => ({
  default: ({ password }: { password: string }) => (
    <div data-testid="password-strength">strength:{password.length}</div>
  ),
}));

import * as StoreModule from '../../store/useFormStore';

describe('HookForm', () => {
  it('displays all form fields', () => {
    render(<HookForm onClose={() => {}} />);

    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /Age:/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password:$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repeat password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Accept Terms:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload image:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country:/i)).toBeInTheDocument();
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

    render(<HookForm onClose={onClose} />);

    await userEvent.type(screen.getByLabelText(/Name:/i), 'John');
    await userEvent.type(
      screen.getByRole('spinbutton', { name: /Age:/i }),
      '30'
    );
    await userEvent.type(screen.getByLabelText(/Email:/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/^Password:$/i), 'Abc123$4');
    await userEvent.type(
      screen.getByLabelText(/Repeat password:/i),
      'Abc123$4'
    );
    await userEvent.selectOptions(screen.getByLabelText(/Gender:/i), 'male');
    await userEvent.click(screen.getByLabelText(/Accept Terms:/i));

    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    await userEvent.upload(screen.getByLabelText(/Upload image:/i), file);

    await userEvent.type(screen.getByLabelText(/Country:/i), 'USA');

    await userEvent.click(screen.getByText(/Submit/i));

    expect(addSubmission).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('shows an error when passwords do not match', async () => {
    render(<HookForm onClose={() => {}} />);

    await userEvent.type(screen.getByLabelText(/^Password:$/i), '123456');
    await userEvent.type(screen.getByLabelText(/Repeat password:/i), '654321');
    await userEvent.click(screen.getByText(/Submit/i));

    expect(
      await screen.findByText(/Passwords must match/i)
    ).toBeInTheDocument();
  });
});
