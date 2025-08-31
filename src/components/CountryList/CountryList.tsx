import './CountryList.css';
import { useState, useMemo, useCallback } from 'react';
import { useCO2Data } from '../../data/useC02Data';
import type { CO2Data, YearData, SortOption } from '../../types/types';
import { ColumnSelectorModal } from '../Modal/Modal';
import type { CountryData } from '../../types/types';
import React from 'react';

const CountryRow = React.memo(function CountryRow({
  name,
  info,
  year,
  highlightedCells,
  extraColumns,
}: {
  name: string;
  info: CountryData;
  year: number | 'latest';
  highlightedCells: Record<string, (keyof YearData)[]>;
  extraColumns: (keyof YearData)[];
}) {
  const currentYearData =
    year === 'latest'
      ? info.data.at(-1)
      : info.data.find((d: YearData) => d.year === year);

  return (
    <tr>
      <td>{name}</td>
      <td>{info.iso_code ?? 'N/A'}</td>
      <td
        className={highlightedCells[name]?.includes('year') ? 'highlight' : ''}
      >
        {currentYearData?.year ?? 'N/A'}
      </td>
      <td
        className={
          highlightedCells[name]?.includes('population') ? 'highlight' : ''
        }
      >
        {currentYearData?.population ?? 'N/A'}
      </td>
      <td
        className={highlightedCells[name]?.includes('co2') ? 'highlight' : ''}
      >
        {currentYearData?.co2 ?? 'N/A'}
      </td>
      <td
        className={
          highlightedCells[name]?.includes('co2_per_capita') ? 'highlight' : ''
        }
      >
        {currentYearData?.co2_per_capita ?? 'N/A'}
      </td>
      {extraColumns.map((col) => (
        <td
          key={col}
          className={highlightedCells[name]?.includes(col) ? 'highlight' : ''}
        >
          {currentYearData?.[col] ?? 'N/A'}
        </td>
      ))}
    </tr>
  );
});

export function CountriesList() {
  const data = useCO2Data() as CO2Data;
  const countries = Object.entries(data);

  const [year, setYear] = useState<number | 'latest'>('latest');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extraColumns, setExtraColumns] = useState<(keyof YearData)[]>([]);
  const [highlightedCells, setHighlightedCells] = useState<
    Record<string, (keyof YearData)[]>
  >({});

  const availableColumns: (keyof YearData)[] = [
    'methane',
    'oil_co2',
    'temperature_change_from_co2',
    'total_ghg',
    'nitrous_oxide',
  ];

  const allYears = useMemo(
    () => countries[0]?.[1].data.map((d) => d.year).reverse() ?? [],
    [countries]
  );

  const filteredCountries = useMemo(() => {
    let result = countries;

    if (search) {
      result = result.filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
      );
    }

    result = [...result].sort(([nameA, infoA], [nameB, infoB]) => {
      if (sortBy === 'name-asc') return nameA.localeCompare(nameB);
      if (sortBy === 'name-desc') return nameB.localeCompare(nameA);
      if (sortBy === 'population') {
        const yearA =
          year === 'latest'
            ? infoA.data.at(-1)
            : infoA.data.find((d) => d.year === year);
        const yearB =
          year === 'latest'
            ? infoB.data.at(-1)
            : infoB.data.find((d) => d.year === year);
        return (yearB?.population ?? 0) - (yearA?.population ?? 0);
      }
      return 0;
    });

    return result;
  }, [countries, search, sortBy, year]);

  const handleYearChange = useCallback(
    (newYear: number | 'latest') => {
      const prev =
        year === 'latest'
          ? (countries[0]?.[1].data.at(-1)?.year ?? null)
          : (year as number);

      setYear(newYear);

      const newHighlights: Record<string, (keyof YearData)[]> = {};
      countries.forEach(([name, info]) => {
        const currentYearData =
          newYear === 'latest'
            ? info.data.at(-1)
            : info.data.find((d: YearData) => d.year === newYear);

        const prevYearData =
          prev === null
            ? undefined
            : info.data.find((d: YearData) => d.year === prev);

        if (!currentYearData || !prevYearData) return;

        const changed: (keyof YearData)[] = [];
        (
          [
            'year',
            'population',
            'co2',
            'co2_per_capita',
            ...extraColumns,
          ] as (keyof YearData)[]
        ).forEach((field) => {
          if (currentYearData[field] !== prevYearData[field]) {
            changed.push(field);
          }
        });

        if (changed.length > 0) {
          newHighlights[name] = changed;
        }
      });

      setHighlightedCells(newHighlights);
      setTimeout(() => setHighlightedCells({}), 1000);
    },
    [year, countries, extraColumns]
  );

  return (
    <div>
      {/* Панель */}
      <div style={{ marginBottom: '16px' }}>
        <label>
          Year:
          <select
            value={year}
            onChange={(e) =>
              handleYearChange(
                e.target.value === 'latest' ? 'latest' : Number(e.target.value)
              )
            }
          >
            <option value="latest">Latest</option>
            {allYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '16px' }}>
          Search:
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label style={{ marginLeft: '16px' }}>
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="population">Population</option>
          </select>
        </label>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{ marginLeft: '16px' }}
        >
          Add Columns
        </button>
      </div>

      <ColumnSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(cols) => {
          setExtraColumns(cols);
          setIsModalOpen(false);
        }}
        availableColumns={availableColumns}
      />

      {/* Таблица */}
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>ISO</th>
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
          {filteredCountries.map(([name, info]) => (
            <CountryRow
              key={name}
              name={name}
              info={info}
              year={year}
              highlightedCells={highlightedCells}
              extraColumns={extraColumns}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
