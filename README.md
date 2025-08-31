## Performance Profiling (initial)

### Actions tested
- Switching year
- Searching by country name
- Sorting by population
- Adding/removing extra columns

### Results
- **Commit duration**: ~23 ms
  ![Commit](docs/commit.png)
- **Render duration (top components)**:
  - CountriesList: ~121 ms
  ![CountriesList](docs/render.png)
- **Interactions**: year change, search input, sort select
- **Flame Graph**:  
  ![Flame](docs/flame.png)

- **Ranked Chart**:  
  In start:
  ![In start](docs/ranked.png)
  
  In finish:
  ![In finish](docs/ranked2.png)

### Conclusion
The basic implementation works, but there are unnecessary redraws (for example, rerendering the entire table on any action).
Further we will optimize using `React.memo`, `useMemo`, `useCallback`.
