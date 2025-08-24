export const validatePasswordStrength = (password: string) => {
  const rules = [
    { regex: /[0-9]/, message: 'There must be a number' },
    { regex: /[A-Z]/, message: 'Must be capitalized letter' },
    { regex: /[a-z]/, message: 'Must be a lowercase letter' },
    { regex: /[^a-zA-Z0-9]/, message: 'There must be a special character' },
  ];
  return rules.filter((r) => !r.regex.test(password)).map((r) => r.message);
};

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export const getPasswordStrength = (password: string): PasswordStrength => {
  const missing = validatePasswordStrength(password).length;
  if (password.length < 8 || missing >= 3) return 'weak';
  if (missing === 1 || missing === 2) return 'medium';
  return 'strong';
};
