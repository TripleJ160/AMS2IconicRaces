# Example: Adding a New Race

## Scenario: Adding a GT3 Race

Let's say you want to add a GT3 race. Here's the step-by-step process:

### Step 1: Create the GT3 Class File (if it doesn't exist)

Create `data/races/gt3-gen1.json`:

```json
[
  {
    "id": "spa-24h-2023",
    "title": "Spa 24 Hours Victory",
    "driver": "Example Driver",
    "team": "Example Team",
    "year": "2023",
    "tags": ["Endurance", "GT3", "Spa"],
    "description": "An epic 24-hour battle at Spa-Francorchamps...",
    "heroImage": "/images/spa-24h.png",
    "youtubeId": "example123",
    "raceContext": {
      "event": "2023 Spa 24 Hours",
      "circuit": "Spa-Francorchamps, Belgium",
      "laps": 500,
      "distance": "3500 km",
      "conditions": "Mixed conditions",
      "wikipediaUrl": "https://en.wikipedia.org/wiki/2023_24_Hours_of_Spa",
      "podiumResults": [
        { "position": 1, "driver": "Driver 1", "team": "Team 1", "vehicle": "BMW M4 GT3" },
        { "position": 2, "driver": "Driver 2", "team": "Team 2", "vehicle": "Audi R8 LMS" },
        { "position": 3, "driver": "Driver 3", "team": "Team 3", "vehicle": "Mercedes AMG GT3" }
      ],
      "keyMoments": [
        "Dramatic night stint in heavy rain",
        "Last-hour battle for the lead",
        "Perfect pit strategy execution"
      ],
      "significance": "One of the most competitive GT3 races in recent history..."
    },
    "ams2": {
      "trackId": 123456789,
      "trackName": "Spa_Francorchamps",
      "vehicleClassId": 987654321,
      "vehicleClassName": "GT3_Gen1",
      "vehicleId": 111222333,
      "vehicleName": "BMW M4 GT3",
      "date": "2023-07-29",
      "time": "16:00",
      "aiCount": 30,
      "raceLength": "60 laps",
      "weather": [
        { "slot": 1, "weatherId": -934211870, "weatherName": "Clear" },
        { "slot": 2, "weatherId": 270338437, "weatherName": "Light Rain" },
        { "slot": 3, "weatherId": 1461703858, "weatherName": "Rain" },
        { "slot": 4, "weatherId": -1293634875, "weatherName": "Overcast" }
      ]
    }
  }
]
```

### Step 2: Update lib/raceData.ts

Add the import and include it in the combined array:

```typescript
import { z } from 'zod';
import type { Race } from './types';

// Import race data by vehicle class
import f1HitechRaces from '@/data/races/f-hitech-gen2.json';
import f1ClassicRaces from '@/data/races/f-classic-gen4.json';
import f1VintageRaces from '@/data/races/f-vintage-gen1.json';
import gt3Races from '@/data/races/gt3-gen1.json';  // ← Add this

// Combine all race collections
const racesData = [
  ...f1HitechRaces,
  ...f1ClassicRaces,
  ...f1VintageRaces,
  ...gt3Races,  // ← Add this
];

// ... rest of the file remains the same
```

### Step 3: Add the Hero Image

Place your image in `public/images/spa-24h.png`

### Step 4: Test

```bash
# Build the project
npm run build

# Run tests
npm test

# Start dev server to verify
npm run dev
```

### Step 5: Verify in Browser

1. Navigate to homepage
2. You should see "GT3_Gen1" as a new filter chip
3. Click it to see your GT3 race
4. Click the race card to view details

## Adding to an Existing Class

If you're adding to an existing class (e.g., another vintage F1 race), just edit the appropriate file:

### Example: Adding to f-vintage-gen1.json

```json
[
  {
    "id": "clark-spa-63",
    "title": "The Impossible Lead",
    // ... existing race
  },
  {
    "id": "fangio-nurburgring-57",
    "title": "The Masterclass",
    // ... existing race
  },
  {
    "id": "moss-monaco-61",  // ← New race
    "title": "Monaco Masterclass",
    "driver": "Stirling Moss",
    "team": "Lotus",
    "year": "1961",
    // ... rest of race data
  }
]
```

No need to update `lib/raceData.ts` - it will automatically include the new race!

## Tips

1. **Use unique IDs**: Format as `driver-circuit-year` (e.g., `senna-monaco-92`)
2. **Validate JSON**: Use a JSON validator before committing
3. **Test locally**: Always run `npm run build` and `npm test` before pushing
4. **Image optimization**: Use WebP or optimized PNG/JPG for hero images
5. **YouTube IDs**: Get from the URL (e.g., `youtube.com/watch?v=ABC123` → `ABC123`)

## Common Mistakes to Avoid

❌ **Wrong vehicle class name in file vs data**
```json
// File: gt3-gen1.json
{
  "ams2": {
    "vehicleClassName": "GT3_Gen2"  // ← Wrong! Should be GT3_Gen1
  }
}
```

❌ **Forgetting to add import in raceData.ts**
```typescript
// You created gt3-gen1.json but forgot to import it
const racesData = [
  ...f1HitechRaces,
  ...f1ClassicRaces,
  ...f1VintageRaces,
  // Missing: ...gt3Races
];
```

❌ **Invalid JSON syntax**
```json
[
  {
    "id": "race-1",
    "title": "Race 1"
  },  // ← Extra comma before closing bracket
]
```

✅ **Correct JSON syntax**
```json
[
  {
    "id": "race-1",
    "title": "Race 1"
  }
]
```

## Need Help?

- Check `README.md` for full schema documentation
- Look at existing races for examples
- Run `npm run build` to catch errors early
