export type SportCategory =
  | "fotball"
  | "løping"
  | "yoga"
  | "klatring"
  | "padel"
  | "sykling";

export interface Activity {
  id: string;
  title: string;
  host: string;
  hostInitials: string;
  hostColor: string;
  location: string;
  date: string;
  time: string;
  description: string;
  participantsCurrent: number;
  participantsMax: number;
  category: SportCategory;
  mapPin: { x: number; y: number };
}

export interface Friend {
  id: string;
  name: string;
  initials: string;
  color: string;
  mutualFriends: number;
  sport: string;
}

export const activities: Activity[] = [
  {
    id: "1",
    title: "Søndagsfotball på Frogner",
    host: "Lars Eriksen",
    hostInitials: "LE",
    hostColor: "#5FA8D3",
    location: "Frognerparken",
    date: "Søn 13. apr",
    time: "14:00",
    description:
      "Uformell 7er-fotball for alle nivåer. Ta med studenter og venner! Vi deler oss i lag på stedet.",
    participantsCurrent: 9,
    participantsMax: 14,
    category: "fotball",
    mapPin: { x: 36, y: 42 },
  },
  {
    id: "2",
    title: "Morgenjoggen langs Akerselva",
    host: "Marte Dahl",
    hostInitials: "MD",
    hostColor: "#F08A6E",
    location: "Grünerløkka",
    date: "Lør 12. apr",
    time: "07:30",
    description:
      "Lett joggetur på ca. 5 km langs elva. Passer perfekt for nybegynnere og de som ønsker en rolig start på dagen.",
    participantsCurrent: 5,
    participantsMax: 12,
    category: "løping",
    mapPin: { x: 61, y: 34 },
  },
  {
    id: "3",
    title: "Yoga i parken",
    host: "Sofie Berg",
    hostInitials: "SB",
    hostColor: "#F1B24A",
    location: "Sofienbergparken",
    date: "Lør 12. apr",
    time: "10:00",
    description:
      "Utendørs yoga for alle nivåer. Ta med matte og vann. Vi fokuserer på pust, balanse og tilstedeværelse.",
    participantsCurrent: 7,
    participantsMax: 15,
    category: "yoga",
    mapPin: { x: 68, y: 48 },
  },
  {
    id: "4",
    title: "Klatring på Kolsås",
    host: "Tobias Holm",
    hostInitials: "TH",
    hostColor: "#8E6BB1",
    location: "Kolsåstoppen",
    date: "Søn 13. apr",
    time: "09:00",
    description:
      "Klatring i fantastisk natur vest for Oslo. Erfaring kreves. Eget klatreutstyr medbringes.",
    participantsCurrent: 4,
    participantsMax: 8,
    category: "klatring",
    mapPin: { x: 19, y: 54 },
  },
  {
    id: "5",
    title: "Padel-turnering Aker Brygge",
    host: "Nina Strand",
    hostInitials: "NS",
    hostColor: "#5FA8D3",
    location: "Aker Brygge Padel",
    date: "Tor 10. apr",
    time: "18:00",
    description:
      "Enkelt padel-turnering med pokalseremoni etterpå. Alle velkomne, blandede nivåer og aldre.",
    participantsCurrent: 12,
    participantsMax: 16,
    category: "padel",
    mapPin: { x: 44, y: 69 },
  },
  {
    id: "6",
    title: "Langsykling Oslofjorden",
    host: "Anders Kvam",
    hostInitials: "AK",
    hostColor: "#7AA060",
    location: "Vippetangen",
    date: "Søn 13. apr",
    time: "08:00",
    description:
      "60 km rundtur rundt Oslofjorden. Treningstur for erfarne syklister. Tempoet tilpasses gruppen.",
    participantsCurrent: 6,
    participantsMax: 10,
    category: "sykling",
    mapPin: { x: 51, y: 77 },
  },
];

export const suggestedFriends: Friend[] = [
  {
    id: "1",
    name: "Kristin Vold",
    initials: "KV",
    color: "#F08A6E",
    mutualFriends: 4,
    sport: "Løping",
  },
  {
    id: "2",
    name: "Erik Haugen",
    initials: "EH",
    color: "#5FA8D3",
    mutualFriends: 2,
    sport: "Fotball",
  },
  {
    id: "3",
    name: "Anette Lie",
    initials: "AL",
    color: "#F1B24A",
    mutualFriends: 6,
    sport: "Yoga",
  },
  {
    id: "4",
    name: "Johan Moe",
    initials: "JM",
    color: "#8E6BB1",
    mutualFriends: 1,
    sport: "Klatring",
  },
];
