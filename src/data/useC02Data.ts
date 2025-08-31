let dataPromise: Promise<unknown> | null = null;
let cachedData: unknown | null = null;
let error: unknown = null;

function loadData(): Promise<unknown> {
  if (!dataPromise) {
    dataPromise = fetch('/owid-co2-data.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load JSON');
        }
        return res.json();
      })
      .then((json) => {
        cachedData = json;
        return json;
      })
      .catch((err) => {
        error = err;
        throw err;
      });
  }
  return dataPromise;
}

export function useCO2Data() {
  if (cachedData) {
    return cachedData;
  }
  if (error) {
    throw error;
  }
  throw loadData();
}
