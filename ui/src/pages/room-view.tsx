import { FaHotel, FaPaypal, FaMap } from "react-icons/fa";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { rooms } from "../lib/data";
import { firstLetterCapital, inputDateFormat } from "../lib/utils";
import { useState } from "react";

export const RoomView = () => {
  const { roomId } = useParams();

  const room = rooms.find((r) => r.id === roomId);

  const [guests, setGuests] = useState(0);

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(7, "day"));

  const totalDays = endDate.diff(startDate, "days");

  return (
    <>
      <span className="font-medium text-gray-500 hover:text-gray-600 mb-2 flex gap-3 items-center">
        <FaHotel />
        {firstLetterCapital(room?.type)} - {firstLetterCapital(room?.subtype)}
      </span>
      <img
        src={room?.image}
        className="h-[356px] w-full object-cover rounded-md shadow-md"
      />

      <section className="flex mt-5 gap-10 justify-center">
        <div className="w-1/2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {room?.hotel} - #{room?.number}
          </h1>
          <div className="space-y-2">
            <p className="text-gray-900 flex items-center gap-2">
              <FaMap />
              {room?.location}
            </p>
            {(room?.amenities?.length || 0) > 0 && (
              <>
                <h2 className="font-semibold">Amenities: </h2>
                <ul>
                  {room?.amenities.map((amenity) => (
                    <li key={amenity}>{amenity}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="">
          <div className="mb-5 w-fit">
            <div className="font-semibold">Guests: </div>
            <div className="flex items-center justify-center gap-5 mt-3">
              <button onClick={() => guests - 1 >= 0 && setGuests(guests - 1)}>
                -
              </button>
              <div className="w-5 text-center">{guests}</div>
              <button
                onClick={() =>
                  guests + 1 <= (room?.maxGuests || Infinity)
                    ? setGuests(guests + 1)
                    : alert(`maximum guests can be ${room?.maxGuests}`)
                }
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-5 space-y-2">
            <div className="font-semibold">Dates: </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate.format(inputDateFormat)}
                onChange={(e) => setStartDate(dayjs(e.target.value))}
              />
              <input
                type="date"
                min={startDate.format(inputDateFormat)}
                value={endDate.format(inputDateFormat)}
                onChange={(e) => setEndDate(dayjs(e.target.value))}
              />
            </div>
          </div>
          <div className="mb-5 space-y-2">
            <b>Price: </b>
            <span>
              ${room?.price} per night, you selected {totalDays} nights
            </span>
          </div>
          <button type="submit" className="primary flex items-center gap-2">
            <FaPaypal />
            Reserve for ${(room?.price || 0) * totalDays}
          </button>
        </div>
      </section>
    </>
  );
};
