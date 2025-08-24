import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type FormData = {
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
  addSubmission: (data: FormData) => void;
};

export const useFormStore = create<FormState>()(
  devtools((set) => ({
    submissions: [],
    addSubmission: (data) =>
      set((state) => ({
        submissions: [...state.submissions, data],
      })),
  }))
);
