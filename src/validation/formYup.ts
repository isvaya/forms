import * as yup from 'yup';
import { validatePasswordStrength } from '../utils/validatePasswordStrength';

export type FormValues = {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  terms: boolean;
  country: string;
  image?: FileList | undefined;
};

export const formSchema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup
    .string()
    .required('Enter name')
    .matches(/^[A-ZА-Я]/, 'The name must start with a capital letter'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .min(0, 'Age cannot be negative')
    .required('Enter age'),
  email: yup.string().email('Incorrect email').required('Enter email'),
  password: yup
    .string()
    .required('Enter password')
    .min(8, 'Minimum 8 characters')
    .matches(/[0-9]/, 'There must be a number')
    .matches(/[A-Z]/, 'Must be capitalized')
    .matches(/[a-z]/, 'Must be a lowercase letter')
    .matches(/[^a-zA-Z0-9]/, 'There must be a special character')
    .test('strength', 'Password is too weak', (value) => {
      if (!value) return false;
      return validatePasswordStrength(value).length === 0;
    }),
  confirmPassword: yup
    .string()
    .required('Repeat password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return value === this.parent.password;
    }),
  gender: yup.string().required('Select gender'),
  terms: yup
    .boolean()
    .required('You must agree to the terms and conditions')
    .oneOf([true], 'You must agree to the terms and conditions'),
  country: yup.string().required('Select country'),
  image: yup
    .mixed<FileList>()
    .required('Upload image')
    .test(
      'fileRequired',
      'Upload image',
      (value) => value != null && value.length > 0
    )
    .test('fileType', 'Only PNG and JPEG are accepted', (value) => {
      if (!value || value.length === 0) return true;
      return ['image/png', 'image/jpeg'].includes(value[0].type);
    })
    .test('fileSize', 'File is too big (max 2MB)', (value) => {
      if (!value || value.length === 0) return true;
      return value[0].size <= 2 * 1024 * 1024;
    }),
});
