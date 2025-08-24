import { getPasswordStrength } from './validatePasswordStrength';

type Props = { password: string };

export default function PasswordStrength({ password }: Props) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  const colors = {
    weak: 'red',
    medium: 'orange',
    strong: 'green',
  };

  return (
    <div style={{ marginTop: '4px' }}>
      <div
        style={{
          height: '6px',
          borderRadius: '4px',
          backgroundColor: colors[strength],
          width:
            strength === 'weak'
              ? '33%'
              : strength === 'medium'
                ? '66%'
                : '100%',
          transition: 'all 0.3s',
        }}
      />
      <p
        style={{
          fontSize: '12px',
          color: colors[strength],
          margin: '4px 0 0',
        }}
      >
        {strength.toUpperCase()}
      </p>
    </div>
  );
}
