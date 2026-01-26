# Race Data Migration Guide

## What Changed?

The race data has been reorganized from a single `data/races.json` file into multiple class-based files in `data/races/` directory.

### Before
```
data/
└── races.json  (all races in one file)
```

### After
```
data/
└── races/
    ├── f-hitech-gen2.json      # Modern F1 (1990s+)
    ├── f-classic-gen4.json     # Classic F1 (1980s-1990s)
    ├── f-vintage-gen1.json     # Vintage F1 (1950s-1970s)
    └── README.md
```

## Why This Change?

1. **Scalability**: Easier to manage as the collection grows
2. **Organization**: Races grouped by vehicle class
3. **Performance**: Can lazy-load specific classes if needed
4. **Maintainability**: Smaller files are easier to edit

## What You Need to Know

### For Adding New Races

Instead of editing `data/races.json`, you now:

1. Find the appropriate class file (e.g., `f-vintage-gen1.json`)
2. Add your race to that file's array
3. If adding a new class, create a new file and update `lib/raceData.ts`

### For Code Changes

The API remains the same! All existing code continues to work:

```typescript
// These still work exactly as before
import { getAllRaces, getRaceById } from '@/lib/raceData';

const races = getAllRaces();           // Returns all races
const race = getRaceById('senna-donington-93');  // Returns specific race
```

### New Utility Functions

We've added some helpful functions:

```typescript
import { getRacesByClass, getAllVehicleClasses } from '@/lib/raceData';

// Get all races in a specific class
const vintageRaces = getRacesByClass('F-Vintage_Gen1');

// Get list of all vehicle classes
const classes = getAllVehicleClasses();
// Returns: ['F-Classic_Gen4', 'F-Hitech_Gen2', 'F-Vintage_Gen1']
```

## File Naming Convention

Class files use kebab-case based on the AMS2 vehicle class name:

| AMS2 Class Name | File Name |
|----------------|-----------|
| F-Hitech_Gen2 | f-hitech-gen2.json |
| F-Classic_Gen4 | f-classic-gen4.json |
| F-Vintage_Gen1 | f-vintage-gen1.json |
| GT3_Gen1 | gt3-gen1.json |

## Adding a New Vehicle Class

1. Create a new JSON file in `data/races/` with the class name in kebab-case
2. Add your races as an array
3. Update `lib/raceData.ts`:

```typescript
// Add import at the top
import newClassRaces from '@/data/races/new-class.json';

// Add to the combined array
const racesData = [
  ...f1HitechRaces,
  ...f1ClassicRaces,
  ...f1VintageRaces,
  ...newClassRaces,  // Add here
];
```

4. Build and test:
```bash
npm run build
npm test
```

## Rollback (If Needed)

If you need to revert to the old structure:

1. Restore `data/races.json` from git history
2. Revert `lib/raceData.ts` to import from `@/data/races.json`
3. Delete the `data/races/` directory

## Questions?

See `data/races/README.md` for detailed documentation on the new structure.
