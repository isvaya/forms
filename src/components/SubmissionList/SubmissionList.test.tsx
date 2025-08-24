import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import SubmissionsList from './SubmissionsList';
import { useFormStore } from '../../store/useFormStore';

type Submission = {
  id: string;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  image?: string;
};

type StoreState = {
  submissions: Submission[];
  highlightedId: string | null;
};

vi.mock('../../store/useFormStore', () => ({
  useFormStore: vi.fn(),
}));

function mockUseFormStore(state: StoreState) {
  (useFormStore as unknown as Mock).mockImplementation(
    (selector: (s: StoreState) => unknown) => selector(state)
  );
}

describe('SubmissionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders message if there are no submissions', () => {
    mockUseFormStore({ submissions: [], highlightedId: null });

    render(<SubmissionsList />);
    expect(screen.getByText(/No submissions yet/i)).toBeInTheDocument();
  });

  it('renders a list of submissions', () => {
    mockUseFormStore({
      submissions: [
        {
          id: '1',
          name: 'Tanya',
          age: 29,
          email: 'tanya@example.com',
          gender: 'Female',
          country: 'Uzbekistan',
        },
      ],
      highlightedId: null,
    });

    render(<SubmissionsList />);

    expect(screen.getByText('Tanya')).toBeInTheDocument();

    const ageParagraph = screen.getByText(/Age:/i).closest('p');
    expect(ageParagraph).toHaveTextContent('Age: 29');

    const emailParagraph = screen.getByText(/Email:/i).closest('p');
    expect(emailParagraph).toHaveTextContent('Email: tanya@example.com');

    const genderParagraph = screen.getByText(/Gender:/i).closest('p');
    expect(genderParagraph).toHaveTextContent('Gender: Female');

    const countryParagraph = screen.getByText(/Country:/i).closest('p');
    expect(countryParagraph).toHaveTextContent('Country: Uzbekistan');
  });

  it('adds the highlight class to the selected element', () => {
    mockUseFormStore({
      submissions: [
        {
          id: '1',
          name: 'Egor',
          age: 22,
          email: 'egor@example.com',
          gender: 'Male',
          country: 'Ukraine',
        },
      ],
      highlightedId: '1',
    });

    render(<SubmissionsList />);
    const card = screen.getByText('Egor').closest('.card');
    expect(card).toHaveClass('highlight');
  });

  it('renders an image if it exists', () => {
    mockUseFormStore({
      submissions: [
        {
          id: '1',
          name: 'Petya',
          age: 30,
          email: 'petya@example.com',
          gender: 'Male',
          country: 'USA',
          image: 'test.png',
        },
      ],
      highlightedId: null,
    });

    render(<SubmissionsList />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test.png');
    expect(img).toHaveAttribute('alt', 'Petya');
  });
});
