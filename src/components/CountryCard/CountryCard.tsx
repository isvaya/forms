import type { CountryData } from '../../types/types';

type Props = {
  name: string;
  info: CountryData;
  selectedYear: number | 'latest';
};

export function CountryCard({ name, info, selectedYear }: Props) {
  let yearData;

  if (selectedYear === 'latest') {
    yearData = info.data[info.data.length - 1];
  } else {
    yearData = info.data.find((d) => d.year === selectedYear);
  }

  return (
    <div style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
      <h3>{name}</h3>
      <p>ISO: {info.iso_code ?? 'N/A'}</p>
      <p>Population: {yearData?.population ?? 'N/A'}</p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>Year</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>
              Population
            </th>
            <th style={{ border: '1px solid black', padding: '4px' }}>CO2</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>
              CO2 per Capita
            </th>
          </tr>
        </thead>
        <tbody>
          {yearData ? (
            <tr>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {yearData.year}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {yearData.population ?? 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {yearData.co2 ?? 'N/A'}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {yearData.co2_per_capita ?? 'N/A'}
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                N/A
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
