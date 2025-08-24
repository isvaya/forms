import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formSchema } from './formYup';
import { validatePasswordStrength } from '../utils/validatePasswordStrength';
import type { Mock } from 'vitest';

(validatePasswordStrength as Mock).mockReturnValue([]);

vi.mock('../utils/validatePasswordStrength', () => ({
  validatePasswordStrength: vi.fn(() => []),
}));

describe('formSchema', () => {
  const validData = {
    name: 'John',
    age: 25,
    email: 'test@example.com',
    password: 'StrongPass123!',
    confirmPassword: 'StrongPass123!',
    gender: 'male',
    terms: true,
    country: 'USA',
    image: {
      length: 1,
      0: { type: 'image/png', size: 1024 * 1024 },
      item: () => ({ type: 'image/png', size: 1024 * 1024 }),
    } as unknown as FileList,
  };

  beforeEach(() => {
    (validatePasswordStrength as unknown as vi.Mock).mockReturnValue([]);
  });

  it('should require name', async () => {
    await expect(
      formSchema.validate({ ...validData, name: '' })
    ).rejects.toThrow('Enter name');
  });

  it('should require name to start with capital letter', async () => {
    await expect(
      formSchema.validate({ ...validData, name: 'john' })
    ).rejects.toThrow('The name must start with a capital letter');
  });

  it('should require age', async () => {
    await expect(
      formSchema.validate({ ...validData, age: undefined as unknown as number })
    ).rejects.toThrow('Enter age');
  });

  it('should reject negative age', async () => {
    await expect(
      formSchema.validate({ ...validData, age: -1 })
    ).rejects.toThrow('Age cannot be negative');
  });

  it('should reject non-number age', async () => {
    await expect(
      formSchema.validate({ ...validData, age: 'abc' as unknown as number })
    ).rejects.toThrow('Age must be a number');
  });

  it('should require email', async () => {
    await expect(
      formSchema.validate({ ...validData, email: '' })
    ).rejects.toThrow('Enter email');
  });

  it('should reject invalid email', async () => {
    await expect(
      formSchema.validate({ ...validData, email: 'invalid' })
    ).rejects.toThrow('Incorrect email');
  });

  it('should reject short password', async () => {
    await expect(
      formSchema.validate({
        ...validData,
        password: 'Ab1!',
        confirmPassword: 'Ab1!',
      })
    ).rejects.toThrow('Minimum 8 characters');
  });

  it('should require number in password', async () => {
    await expect(
      formSchema.validate({
        ...validData,
        password: 'NoNumber!',
        confirmPassword: 'NoNumber!',
      })
    ).rejects.toThrow('There must be a number');
  });

  it('should require uppercase letter in password', async () => {
    await expect(
      formSchema.validate({
        ...validData,
        password: 'nouppercase1!',
        confirmPassword: 'nouppercase1!',
      })
    ).rejects.toThrow('Must be capitalized');
  });

  it('should require lowercase letter in password', async () => {
    await expect(
      formSchema.validate({
        ...validData,
        password: 'NOLOWERCASE1!',
        confirmPassword: 'NOLOWERCASE1!',
      })
    ).rejects.toThrow('Must be a lowercase letter');
  });

  it('should require special character in password', async () => {
    await expect(
      formSchema.validate({
        ...validData,
        password: 'NoSpecial1',
        confirmPassword: 'NoSpecial1',
      })
    ).rejects.toThrow('There must be a special character');
  });

  it('should use custom password strength validation', async () => {
    (validatePasswordStrength as unknown as vi.Mock).mockReturnValue(['Weak']);
    await expect(
      formSchema.validate({
        ...validData,
        password: 'WeakPass1!',
        confirmPassword: 'WeakPass1!',
      })
    ).rejects.toThrow('Password is too weak');
  });

  it('should require confirmPassword', async () => {
    await expect(
      formSchema.validate({ ...validData, confirmPassword: '' })
    ).rejects.toThrow('Repeat password');
  });

  it('should reject mismatched confirmPassword', async () => {
    await expect(
      formSchema.validate({ ...validData, confirmPassword: 'Different123!' })
    ).rejects.toThrow('Passwords must match');
  });

  it('should require gender', async () => {
    await expect(
      formSchema.validate({ ...validData, gender: '' })
    ).rejects.toThrow('Select gender');
  });

  it('should require terms acceptance', async () => {
    await expect(
      formSchema.validate({ ...validData, terms: false })
    ).rejects.toThrow('You must agree to the terms and conditions');
  });

  it('should require country', async () => {
    await expect(
      formSchema.validate({ ...validData, country: '' })
    ).rejects.toThrow('Select country');
  });

  it('should require image', async () => {
    await expect(
      formSchema.validate({ ...validData, image: undefined })
    ).rejects.toThrow('Upload image');
  });

  it('should reject non-PNG/JPEG files', async () => {
    const badImage = {
      length: 1,
      0: { type: 'application/pdf', size: 1024 },
      item: () => ({ type: 'application/pdf', size: 1024 }),
    } as unknown as FileList;

    await expect(
      formSchema.validate({ ...validData, image: badImage })
    ).rejects.toThrow('Only PNG and JPEG are accepted');
  });

  it('should reject large files', async () => {
    const bigImage = {
      length: 1,
      0: { type: 'image/png', size: 3 * 1024 * 1024 },
      item: () => ({ type: 'image/png', size: 3 * 1024 * 1024 }),
    } as unknown as FileList;

    await expect(
      formSchema.validate({ ...validData, image: bigImage })
    ).rejects.toThrow('File is too big (max 2MB)');
  });
});
