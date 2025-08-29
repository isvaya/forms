import { useState } from 'react';
import { useCO2Data } from '../../data/useC02Data';
import type { CO2Data } from '../../types/types';
import { CountryCard } from '../CountryCard/CountryCard';
import { ColumnSelectorModal } from '../Modal/Modal';
import type { YearData } from '../../types/types';

export function CountriesList() {
  const data = useCO2Data() as CO2Data;
  const [year] = useState<number | 'latest'>('latest');
  const countries = Object.entries(data);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extraColumns, setExtraColumns] = useState<(keyof YearData)[]>([]);

  const availableColumns: (keyof YearData)[] = [
    'methane',
    'oil_co2',
    'temperature_change_from_co2',
    'total_ghg',
    'nitrous_oxide',
  ];

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Add Columns</button>

      <ColumnSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(cols) => {
          setExtraColumns(cols);
          setIsModalOpen(false);
        }}
        availableColumns={availableColumns}
      />

      {countries.map(([key, value]) => (
        <CountryCard
          key={key}
          name={key}
          info={value}
          selectedYear={year}
          extraColumns={extraColumns}
        />
      ))}
    </div>
  );
}
