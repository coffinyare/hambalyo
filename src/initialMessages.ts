import type { GreetingMessage } from './types';

export const INITIAL_MESSAGES: GreetingMessage[] = [
  {
    id: '8a32a67e-e567-4d4b-9721-a5bf9fcd18e1',
    guest_name: 'Farah Ahmed',
    relationship: 'waalid',
    message_text: 'Hambalyo arooskiina! Waxaan idiin rajaynayaa guur khayr qaba iyo barwaaqo aan dhamaanin noloshaada oo dhan.',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    is_approved: true,
  },
  {
    id: '7b6f6345-4de4-4824-b1c4-54c3755b768e',
    guest_name: 'Abdullahi & Sahra',
    relationship: 'ehel',
    message_text: 'May your love grow stronger with each passing year. A beautiful couple for a beautiful future together.',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    is_approved: true,
  },
  {
    id: 'c2d46e12-8877-4b8c-a1de-508b98b9fcf8',
    guest_name: 'Hassan Nur',
    relationship: 'saaxib',
    message_text: 'Farxad iyo rayn-rayn! Today is just the beginning of a magnificent journey. Enjoy every second of it!',
    created_at: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
    is_approved: true,
  },
  {
    id: 'ff454318-7b98-4c92-bd24-742a7da30ef9',
    guest_name: 'Idil Yusuf',
    relationship: 'saaxib',
    message_text: 'Waxaan idiin dilayaa duco iyo hambalyo kal iyo laab ah. Samira, you look breathtaking today!',
    created_at: new Date(Date.now() - 35 * 60000).toISOString(), // 35 mins ago
    is_approved: true,
  },
  {
    id: 'e1b76e10-c4e8-466d-97e3-0dcd511ee1c4',
    guest_name: 'Hooyo Fadumo',
    relationship: 'waalid',
    message_text: 'Guurkiina ha noqdo kii lagu nagaado. Reerka aad dhisaysaan Allah ha ka dhigo mid barakaysan.',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
    is_approved: true,
  },
  {
    id: '5e1c4e70-a3fe-4a81-9b16-cdce5fcd8904',
    guest_name: 'Mohamed Ali',
    relationship: 'ehel',
    message_text: 'Congratulations to the most perfect match. Khalid, you found a gem. Wishing you both a lifetime of bliss.',
    created_at: new Date(Date.now() - 55 * 60000).toISOString(), // 55 mins ago
    is_approved: true,
  },
];
