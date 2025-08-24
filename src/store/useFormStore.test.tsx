import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useFormStore } from './useFormStore';

describe('useFormStore', () => {
  beforeEach(() => {
    const { getState, setState } = useFormStore;
    setState({ ...getState(), submissions: [], highlightedId: null });
    vi.clearAllMocks();
  });

  it('has an empty submissions list by default', () => {
    const state = useFormStore.getState();
    expect(state.submissions).toEqual([]);
    expect(state.highlightedId).toBeNull();
  });

  it('contains a list of countries', () => {
    const state = useFormStore.getState();
    expect(state.countries).toContain('Uzbekistan');
    expect(state.countries.length).toBeGreaterThan(5);
  });

  it('adds submission and sets highlightedId', () => {
    vi.spyOn(global.crypto, 'randomUUID').mockReturnValue('mock-id');

    act(() => {
      useFormStore.getState().addSubmission({
        name: 'Tanya',
        age: 29,
        email: 'tanya@example.com',
        password: '123456',
        gender: 'Female',
        terms: true,
        country: 'Uzbekistan',
      });
    });

    const state = useFormStore.getState();
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0]).toMatchObject({
      id: 'mock-id',
      name: 'Tanya',
      email: 'tanya@example.com',
    });
    expect(state.highlightedId).toBe('mock-id');
  });

  it('resets highlightedId after 2 seconds', () => {
    vi.useFakeTimers();
    vi.spyOn(global.crypto, 'randomUUID').mockReturnValue('mock-id');

    act(() => {
      useFormStore.getState().addSubmission({
        name: 'Petya',
        age: 30,
        email: 'petya@example.com',
        password: '123456',
        gender: 'Male',
        terms: true,
        country: 'USA',
      });
    });

    expect(useFormStore.getState().highlightedId).toBe('mock-id');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(useFormStore.getState().highlightedId).toBeNull();

    vi.useRealTimers();
  });
});
