import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type FormData = {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  terms: boolean;
  country: string;
  image?: string;
};

type FormState = {
  submissions: FormData[];
  highlightedId: string | null;
  addSubmission: (data: Omit<FormData, 'id'>) => void;
  countries: string[];
};

export const useFormStore = create<FormState>()(
  devtools((set) => ({
    submissions: [],
    highlightedId: null,
    addSubmission: (data) => {
      const id = crypto.randomUUID();
      set((state) => ({
        submissions: [...state.submissions, { ...data, id }],
        highlightedId: id,
      }));

      setTimeout(() => set({ highlightedId: null }), 2000);
    },
    countries: [
      'United States',
      'Canada',
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Russia',
      'China',
      'Japan',
      'Uzbekistan',
      'Kazakhstan',
      'India',
      'Australia',
      'Brazil',
    ],
  }))
);
