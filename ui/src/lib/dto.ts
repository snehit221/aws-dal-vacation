export type User = {
  //
};

export enum RoomType {
  NORMAL = "Normal Room",
  RECREATIONAL = "Recreational Room",
}

export enum RoomSubType {
  SUITE = "Suite",
  SINGLE = "Single",
  DELUXE = "Deluxe",
}

export type Room = {
  id: string;
  number: string;
  image: string;
  price: number;
  type: RoomType;
  subtype: RoomSubType;
  available: boolean;
  hotel: string;
  maxGuests: number;
  location: string;
  amenities: string[];
};

export type Reservation = {
  referenceCode: string;
  checkIn: Date;
  checkOut: Date;
  paid: number;
};
