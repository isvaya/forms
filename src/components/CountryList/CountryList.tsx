import { useState } from 'react';
import { useCO2Data } from '../../data/useC02Data';
import type { CO2Data } from '../../types/types';
import { CountryCard } from '../CountryCard/CountryCard';

export function CountriesList() {
  const data = useCO2Data() as CO2Data;
  const [year] = useState<number | 'latest'>('latest');
  const countries = Object.entries(data);

  return (
    <div>
      {countries.map(([key, value]) => (
        <CountryCard key={key} name={key} info={value} selectedYear={year} />
      ))}
    </div>
  );
}
