# Race Data Organization

This directory contains race data organized by AMS2 vehicle class.

## Structure

Each JSON file represents a vehicle class and contains an array of race objects:

```
data/races/
├── f-hitech-gen2.json      # Modern F1 (1990s+)
├── f-classic-gen4.json     # Classic F1 (1980s-1990s)
├── f-vintage-gen1.json     # Vintage F1 (1950s-1970s)
└── README.md
```

## Adding New Races

### To an Existing Class

1. Open the appropriate class file (e.g., `f-vintage-gen1.json`)
2. Add your race object to the array
3. Ensure the `vehicleClassName` matches the filename

### To a New Class

1. Create a new JSON file named after the vehicle class (kebab-case)
   - Example: `gt3-gen1.json` for GT3 cars
2. Add your races as an array
3. Update `lib/raceData.ts` to import the new file:
   ```typescript
   import gt3Races from '@/data/races/gt3-gen1.json';
   ```
4. Add to the `allRacesData` array:
   ```typescript
   const allRacesData = [
     ...f1HitechRaces,
     ...f1ClassicRaces,
     ...f1VintageRaces,
     ...gt3Races,  // Add here
   ];
   ```

## Race Object Schema

Each race must follow this structure:

```json
{
  "id": "unique-race-id",
  "title": "Race Title",
  "driver": "Driver Name",
  "team": "Team Name",
  "year": "YYYY",
  "tags": ["Tag1", "Tag2"],
  "description": "Race description...",
  "heroImage": "/images/race-image.png",
  "youtubeId": "YouTube video ID",
  "raceContext": {
    "event": "Event name",
    "circuit": "Circuit name",
    "laps": 50,
    "distance": "300 km",
    "conditions": "Weather conditions",
    "wikipediaUrl": "https://...",
    "podiumResults": [
      { "position": 1, "driver": "...", "team": "...", "vehicle": "..." }
    ],
    "keyMoments": ["Moment 1", "Moment 2"],
    "significance": "Why this race matters..."
  },
  "ams2": {
    "trackId": 123456,
    "trackName": "Track_Name",
    "vehicleClassId": 123456,
    "vehicleClassName": "Vehicle_Class_Name",
    "vehicleId": 123456,
    "vehicleName": "Vehicle Name",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "aiCount": 20,
    "raceLength": "20 laps",
    "weather": [
      { "slot": 1, "weatherId": 123456, "weatherName": "Clear" }
    ]
  }
}
```

## Vehicle Class Naming Convention

File names should match the AMS2 vehicle class name in kebab-case:

- `F-Hitech_Gen2` → `f-hitech-gen2.json`
- `F-Classic_Gen4` → `f-classic-gen4.json`
- `F-Vintage_Gen1` → `f-vintage-gen1.json`
- `GT3_Gen1` → `gt3-gen1.json`

## Tips

- Keep files under 50 races for maintainability
- If a class grows too large, consider splitting by era/decade
- Always validate JSON syntax before committing
- Use consistent formatting (2-space indentation)
- Ensure all required fields are present
