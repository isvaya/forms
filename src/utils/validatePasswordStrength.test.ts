import { describe, it, expect } from 'vitest';
import {
  validatePasswordStrength,
  getPasswordStrength,
} from './validatePasswordStrength';

describe('validatePasswordStrength', () => {
  it('returns all errors for empty password', () => {
    const result = validatePasswordStrength('');
    expect(result).toContain('There must be a number');
    expect(result).toContain('Must be capitalized letter');
    expect(result).toContain('Must be a lowercase letter');
    expect(result).toContain('There must be a special character');
  });

  it('returns an error if there is no number', () => {
    const result = validatePasswordStrength('Abc$xyz');
    expect(result).toContain('There must be a number');
    expect(result).not.toContain('Must be capitalized letter');
    expect(result).not.toContain('Must be a lowercase letter');
    expect(result).not.toContain('There must be a special character');
  });

  it('returns an empty array for a complex password', () => {
    const result = validatePasswordStrength('Abc123$xyz');
    expect(result).toEqual([]);
  });
});

describe('getPasswordStrength', () => {
  it('weak password if shorter than 8 characters', () => {
    expect(getPasswordStrength('Ab1$')).toBe('weak');
  });

  it('weak password if 3 rules are missing', () => {
    expect(getPasswordStrength('abcdefgh')).toBe('weak');
  });

  it('average password if 1 or 2 rules are missing', () => {
    expect(getPasswordStrength('abcdefgh1')).toBe('medium');
    expect(getPasswordStrength('ABCDEFGH1')).toBe('medium');
  });

  it('strong password if all rules are met and length >= 8', () => {
    expect(getPasswordStrength('Abc123$xyz')).toBe('strong');
  });
});
