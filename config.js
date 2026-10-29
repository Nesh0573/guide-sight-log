// Edit this file only. Headers must match the Google Sheet column names (spacing/colons/case ignored).
// Field = [sheet header, label shown in app, type (text|area|select), options]
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyuKPDE94LtVoHsT-IIYUIQaG08WnDEHNrvHk9VyxH5XXewwixbyDY9Kgm5GmQr579uJA/exec',
  MAX_DAYS: 20,
  // 5th item: {r:1 = required, h: hint text}. Same wording as the Google Form.
  trip: [ // asked once per safari
    ['Guides Name', "Guide's name", 'text', 0, {r:1}],
    ['Vehicle/Unit', 'Vehicle / Unit', 'text', 0, {r:1}],
    ['Guest Names', 'Guest names', 'text', 0, {r:1, h:'eg. Mr & Mrs Smith'}],
    ['Guide Signature', 'Guide signature', 'text', 0, {r:1, h:'Type full name to confirm'}]
  ],
  day: [ // asked for every day
    ['Camp/Lodge', 'Camp / Lodge', 'text', 0, {r:1}],
    ['Area/Conservancy/Park', 'Area / Conservancy / Park', 'text', 0, {r:1}],
    ['Weather', 'Weather', 'select', ['Sunny','Cloudy','Rainy','Windy','Other…']],
    ['Drive Type', 'Drive type', 'select', ['Morning','Afternoon','Night','Full Day','Half Day'], {r:1}],
    ['Lion', 'Lion', 'area', 0, {h:'If seen: location, count, behaviour code. Leave blank if not seen'}],
    ['Leopard', 'Leopard', 'area'], ['Elephant', 'Elephant', 'area'], ['Buffalo', 'Buffalo', 'area'], ['Rhino', 'Rhino', 'area'],
    ['Animals observed', 'Other key mammals', 'area', 0, {r:1, h:'If seen: name, location, count, behaviour. Blank if not seen'}],
    ['Antelope observed', 'Antelope observed', 'area', 0, {h:'If seen: species, location, count, behaviour. Blank if not seen'}],
    ["Indicate the species, resident or migratory, location. Write None sighted' if applicable", 'Rare bird sightings', 'area', 0, {h:'Species, resident or migratory, location. Write "None sighted" if applicable'}],
    ['Trees', 'Trees sightings', 'area', 0, {r:1, h:'Name and description. At least 2 different tree species for every safari'}],
    ['Insects', 'Insects sightings', 'area', 0, {r:1, h:'Name and description. At least 2 different insect species for every safari'}],
    ['Rare/Unusual Sighting', 'Rare / unusual sighting', 'area'],
    ['Predator Interaction Observed', 'Predator interaction observed', 'area'],
    ['Guest Interest/Comments', 'Guest interest / comments', 'area'],
    ['Conservation Concern/Incident', 'Conservation concern / incident', 'area', 0, {h:'Leave blank if NONE'}],
    ['Any other observation', 'Any other observation', 'area'],
    ['Overall Guest Satisfaction', 'Overall guest satisfaction', 'select', ['Poor','Fair','Good','Excellent'], {r:1}]
  ]
};
