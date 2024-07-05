import { Room, RoomSubType, RoomType } from "../lib/dto";

export const rooms: Room[] = [
  {
    id: "1",
    available: false,
    image: "https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b",
    location: "Halifax",
    number: "101",
    hotel: "Mariott",
    price: 100,
    subtype: RoomSubType.DELUXE,
    type: RoomType.NORMAL,
    maxGuests: 3,
    amenities: ["1 BED", "Wifi", "TV"],
  },
  {
    id: "2",
    available: false,
    image: "https://images.unsplash.com/photo-1652620364162-4c0a3387a0f0",
    location: "Halifax",
    number: "102",
    hotel: "Mariott",
    price: 200,
    subtype: RoomSubType.DELUXE,
    maxGuests: 2,
    type: RoomType.NORMAL,
    amenities: ["2 BED", "Lunch", "Wifi"],
  },
];
