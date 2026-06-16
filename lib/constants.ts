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

export const HUNTING_STYLES = [
  { value: 'spot_and_stalk', label: 'Spot & Stalk' },
  { value: 'blind', label: 'Blind' },
  { value: 'tree_stand', label: 'Tree Stand' },
  { value: 'driven', label: 'Driven' },
  { value: 'hounds', label: 'Hounds' },
] as const

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const

// 24 selectable options for Price Includes / Excludes (Individual Hunt Listing spec)
export const PRICE_INCLUDES_OPTIONS = [
  { value: 'observer', label: 'Observer' },
  { value: 'meals', label: 'Meals' },
  { value: 'lodging', label: 'Lodging' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'rifle_rental', label: 'Rifle Rental' },
  { value: 'ammo', label: 'Ammo' },
  { value: 'tags_licenses', label: 'Tags / Licenses' },
  { value: 'airport_transfer', label: 'Airport Transfer' },
  { value: 'airfare', label: 'Airfare' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'taxes_vat', label: 'Taxes / VAT' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'gratuities', label: 'Gratuities' },
  { value: 'transportation_during_hunt', label: 'Transportation During Hunt' },
  { value: 'fully_guided', label: 'Fully Guided' },
  { value: 'semi_guided', label: 'Semi Guided' },
  { value: 'self_guided', label: 'Self Guided' },
  { value: 'trophy_prep', label: 'Trophy Prep' },
  { value: 'taxidermist_delivery', label: 'Delivery of Trophies to Taxidermist' },
  { value: 'field_dressing', label: 'Field Dressing' },
  { value: 'wifi', label: 'WiFi' },
] as const

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'ach', label: 'ACH / Bank Transfer' },
  { value: 'wire', label: 'Wire Transfer' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'crypto', label: 'Crypto' },
] as const

// 27 pre-written questions outfitters can opt into (Individual Hunt Listing spec)
export const QA_QUESTIONS = [
  { key: 'shot_opportunity', question: 'What is the shot opportunity percentage on this hunt?' },
  { key: 'weather_packing', question: 'What will the weather be like and how do I need to pack?' },
  { key: 'travel_logistics', question: 'Where will I fly into? How do I get to the lodge/hunting area?' },
  { key: 'tag_license_process', question: 'What is the process for obtaining a tag or license?' },
  { key: 'terrain', question: 'What is the terrain like?' },
  { key: 'predator_baiting', question: 'For predator hunts, is baiting included or an extra charge?' },
  { key: 'charter_flight', question: 'Is a charter flight required to get to the hunting area? Cost?' },
  { key: 'taxes_vat_amount', question: 'How much are Taxes/VAT?' },
  { key: 'meat_trophy_prep', question: 'How are meat and trophy prep handled after the harvest?' },
  { key: 'additional_animals', question: 'Are additional animals available to hunt?' },
  { key: 'additional_hunters', question: 'Can I bring additional hunters/observers? Cost?' },
  { key: 'additional_days', question: 'Can I add additional days to my hunt?' },
  { key: 'non_hunting_activities', question: 'What non-hunting activities are available?' },
  { key: 'trade_animals', question: 'Can I trade animals from this package with animals from the pricelist?' },
  { key: 'animal_size_age', question: 'What size and/or age of animals are we targeting?' },
  { key: 'avg_shot_distance', question: 'What is the average shot distance?' },
  { key: 'other_hunters_camp', question: 'Will other hunters be in camp?' },
  { key: 'own_room', question: 'Do I get my own room?' },
  { key: 'wounded_animal_policy', question: 'What is the policy if an animal is wounded?' },
  { key: 'rifle_rental_cost', question: 'Can I rent a rifle and what is the cost?' },
  { key: 'blinds_stands_in_place', question: 'Are blinds and stands already in place?' },
  { key: 'language_interpreter', question: 'What is the language spoken and is an interpreter available if needed?' },
  { key: 'accommodations', question: 'What are the accommodations like?' },
  { key: 'meals_quality', question: 'What are the meals like?' },
  { key: 'unsuccessful_hunt', question: 'What if I am unsuccessful in harvesting my animal?' },
  { key: 'handicap_accessible', question: 'Is the hunt able to be done by handicap persons?' },
] as const

export type HuntingStyleValue = typeof HUNTING_STYLES[number]['value']
export type DifficultyValue = typeof DIFFICULTY_LEVELS[number]['value']
export type PriceIncludesValue = typeof PRICE_INCLUDES_OPTIONS[number]['value']
export type PaymentMethodValue = typeof PAYMENT_METHODS[number]['value']
export type QaQuestionKey = typeof QA_QUESTIONS[number]['key']
