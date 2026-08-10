export const wedding = {
  theme: 'Vanilla Love Story',
  date: {
    iso: '2026-12-19',
    display: '19.12.26',
    timestamp: '2026-12-19T12:00:00+01:00',
  },
  couple: {
    partnerOne: {
      firstName: 'Nwaamaka',
      fullName: 'Nwaamaka Annastecia Ogba',
      invitationName: 'Nwaamaka Annastecia',
    },
    partnerTwo: {
      firstName: 'Nnaemeka',
      fullName: 'Nnaemeka Henry Ngene',
      invitationName: 'Nnaemeka Henry',
    },
    monogram: 'N&N',
  },
  families: [
    {
      names: 'Mr. & Mrs. Jude Ogba',
      location: 'Anaocha Local Government Area, Anambra State',
    },
    {
      names: 'Chief & Mrs. Benjamin Ngene',
      location: 'Nkanu Local Government Area, Enugu State',
    },
  ],
  ceremony: {
    title: 'Wedding Mass',
    time: '12:00 PM',
    shortTime: '12 PM',
    timestamp: '2026-12-19T12:00:00+01:00',
    venue: 'Christ the King Chaplaincy',
    address: 'GRA, Enugu',
    directions: 'https://www.google.com/maps/search/?api=1&query=Christ+the+King+Chaplaincy+GRA+Enugu',
  },
  reception: {
    title: 'Reception',
    time: '2:00 PM',
    shortTime: '2 PM',
    timestamp: '2026-12-19T14:00:00+01:00',
    venue: 'Kobbs Civic Event Centre',
    address: 'Polo Park Mall, Enugu',
    directions: 'https://www.google.com/maps/search/?api=1&query=Kobbs+Civic+Event+Centre+Polo+Park+Mall+Enugu',
  },
  colours: [
    { name: 'Gold', className: 'gold' },
    { name: 'Dusty Pink', className: 'pink' },
    { name: 'Olive Green', className: 'olive' },
    { name: 'Peach', className: 'peach' },
    { name: 'Dark Blue', className: 'blue' },
  ],
  quote: 'Every love story is beautiful, but ours is my favorite.',
  verse: 'He has made everything beautiful in its time.',
  verseReference: 'Ecclesiastes 3:11',
  contact: {
    display: '+234 813 551 4042',
    phone: '+2348135514042',
    whatsapp: '2348135514042',
  },
  hashtags: ['#NNLoveStory', '#VanillaLoveStory2026', '#TheCountdownToIDo'],
} as const

