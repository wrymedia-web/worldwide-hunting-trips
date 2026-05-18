export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
] as const

export const SPECIES_LIST = [
  // Big Game
  { name: 'Whitetail Deer', category: 'Big Game' },
  { name: 'Mule Deer', category: 'Big Game' },
  { name: 'Coues Deer', category: 'Big Game' },
  { name: 'Elk', category: 'Big Game' },
  { name: 'Moose', category: 'Big Game' },
  { name: 'Pronghorn Antelope', category: 'Big Game' },
  { name: 'Bighorn Sheep', category: 'Big Game' },
  { name: 'Dall Sheep', category: 'Big Game' },
  { name: 'Mountain Goat', category: 'Big Game' },
  { name: 'Bison', category: 'Big Game' },
  { name: 'Caribou', category: 'Big Game' },
  { name: 'Black Bear', category: 'Big Game' },
  { name: 'Brown Bear', category: 'Big Game' },
  { name: 'Grizzly Bear', category: 'Big Game' },
  // Predator
  { name: 'Mountain Lion', category: 'Predator' },
  { name: 'Coyote', category: 'Predator' },
  { name: 'Wolf', category: 'Predator' },
  // Exotic
  { name: 'Wild Boar', category: 'Exotic' },
  { name: 'Axis Deer', category: 'Exotic' },
  { name: 'Nilgai', category: 'Exotic' },
  { name: 'Aoudad Sheep', category: 'Exotic' },
  { name: 'Fallow Deer', category: 'Exotic' },
  // Bird
  { name: 'Turkey', category: 'Bird' },
  { name: 'Pheasant', category: 'Bird' },
  { name: 'Quail', category: 'Bird' },
  { name: 'Duck', category: 'Bird' },
  { name: 'Goose', category: 'Bird' },
  { name: 'Dove', category: 'Bird' },
] as const

export const WEAPON_TYPES = ['Rifle', 'Bow', 'Muzzleloader', 'Shotgun', 'Crossbow'] as const

export const GUIDED_TYPES = [
  { value: 'fully_guided', label: 'Fully Guided' },
  { value: 'semi_guided', label: 'Semi-Guided' },
  { value: 'self_guided', label: 'Self-Guided' },
] as const

export const PRICE_TYPES = [
  { value: 'per_person', label: 'Per Person' },
  { value: 'per_day', label: 'Per Day' },
  { value: 'flat_rate', label: 'Flat Rate' },
] as const

export const LAND_TYPES = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
  { value: 'both', label: 'Both' },
] as const

export const TROPHY_CLASSES = [
  { value: 'management', label: 'Management' },
  { value: 'mid_grade', label: 'Mid-Grade' },
  { value: 'trophy', label: 'Trophy' },
  { value: 'record_book', label: 'Record-Book' },
] as const
