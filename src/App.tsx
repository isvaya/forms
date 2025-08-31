import './App.css';
import { Suspense } from 'react';
import { CountriesList } from './components/CountryList/CountryList';

function App() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <CountriesList />
    </Suspense>
  );
}

export default App;
