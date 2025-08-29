import type { CountryData, YearData } from '../../types/types';
import './CountryCard.css';

type Props = {
  name: string;
  info: CountryData;
  selectedYear: number | 'latest';
  extraColumns: (keyof YearData)[];
};

export function CountryCard({ name, info, selectedYear, extraColumns }: Props) {
  let yearData: YearData | undefined;

  if (selectedYear === 'latest') {
    yearData = info.data[info.data.length - 1];
  } else {
    yearData = info.data.find((d) => d.year === selectedYear);
  }

  return (
    <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
      <h3>{name}</h3>
      <p>ISO: {info.iso_code ?? 'N/A'}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Population</th>
            <th>CO2</th>
            <th>CO2 per Capita</th>
            {extraColumns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {yearData ? (
            <tr>
              <td>{yearData.year}</td>
              <td>{yearData.population ?? 'N/A'}</td>
              <td>{yearData.co2 ?? 'N/A'}</td>
              <td>{yearData.co2_per_capita ?? 'N/A'}</td>
              {extraColumns.map((col) => (
                <td key={col}>{yearData?.[col] ?? 'N/A'}</td>
              ))}
            </tr>
          ) : (
            <tr>
              <td
                colSpan={4 + extraColumns.length}
                style={{ textAlign: 'center' }}
              >
                N/A
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
