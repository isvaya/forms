import { useState } from 'react';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  options: string[];
};

export default function Autocomplete({ value, onChange, options }: Props) {
  const [showList, setShowList] = useState(false);

  const safeValue = value || '';

  const filtered = options.filter((c) =>
    c.toLowerCase().includes(safeValue.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={safeValue}
        onChange={(e) => {
          onChange(e.target.value);
          setShowList(true);
        }}
        onBlur={() => setTimeout(() => setShowList(false), 100)}
      />
      {showList && filtered.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid gray',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            width: '100%',
            zIndex: 10,
          }}
        >
          {filtered.map((c) => (
            <li
              key={c}
              style={{ padding: '4px', cursor: 'pointer' }}
              onClick={() => {
                onChange(c);
                setShowList(false);
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
