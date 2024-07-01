import { FaHotel, FaPaypal, FaMap } from "react-icons/fa";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { firstLetterCapital, inputDateFormat } from "../lib/utils";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ax } from "../lib/client";
import { lambdas } from "../lib/constants";
import { Reservation, ReservationPayload, Room } from "../lib/dto";
import { Loading } from "../components/loading";

export const RoomView = () => {
  const { roomId } = useParams();

  const {
    data: room,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () =>
      ax.post(lambdas.getRoom, { id: roomId }).then((res) => res.data as Room),
  });

  const roomReservationsQuery = useQuery({
    queryKey: ["room", "reservations", roomId],
    queryFn: () =>
      ax.get(`${lambdas.reservedDatesByRoom}?roomId=${roomId}`).then(
        (res) =>
          res.data as {
            reservations: Pick<Reservation, "checkIn" | "checkOut">[];
          }
      ),
  });

  const [guests, setGuests] = useState(0);

  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(7, "day"));

  const totalDays = endDate.diff(startDate, "days");

  const reservationMutation = useMutation({
    mutationFn: (data: ReservationPayload) =>
      ax
        .post(`${lambdas.reserveRoom}`, data)
        .then((res) => res.data as Pick<Reservation, "referenceCode">),
    onSuccess: (data) =>
      toast.success(`Your reservation code is ${data.referenceCode}`),
  });

  if (isFetching || roomReservationsQuery.isFetching) {
    return <Loading />;
  }

  if (isError || !roomId) {
    return <>Error occurred...</>;
  }

  const overlapReservation = (
    roomReservationsQuery?.data?.reservations || []
  ).find((reservedDates) => {
    const reservedCheckIn = dayjs(reservedDates.checkIn);
    const reservedCheckOut = dayjs(reservedDates.checkOut);

    return (
      (startDate.isBefore(reservedCheckIn) &&
        endDate.isAfter(reservedCheckIn)) ||
      (startDate.isBefore(reservedCheckOut) &&
        endDate.isAfter(reservedCheckOut)) ||
      (startDate.isAfter(reservedCheckIn) &&
        endDate.isBefore(reservedCheckOut)) ||
      startDate.isSame(reservedCheckIn) ||
      endDate.isSame(reservedCheckOut) ||
      startDate.isSame(reservedCheckIn)
    );
  });

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
                    : toast.error(`maximum guests can be ${room?.maxGuests}`, {
                        id: "maxguests",
                      })
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
            {overlapReservation && (
              <span className="text-sm leading-6 text-red-600 block">
                Room already reserved from{" "}
                {dayjs(overlapReservation.checkIn).format("YYYY-MM-DD")} to{" "}
                {dayjs(overlapReservation.checkOut).format("YYYY-MM-DD")}
              </span>
            )}
          </div>
          <div className="mb-5 space-y-2">
            <b>Price: </b>
            <span>
              ${room?.price} per night, you selected {totalDays} nights
            </span>
          </div>
          <button
            disabled={reservationMutation.isPending}
            type="submit"
            className="primary flex items-center gap-2"
            onClick={() =>
              reservationMutation.mutate({
                checkIn: startDate.toDate(),
                checkOut: endDate.toDate(),
                paid: (room?.price || 0) * totalDays,
                roomId,
                // TODO
                userId: "1",
                guests,
              })
            }
          >
            {reservationMutation.isPending && <h2>Reserving...</h2>}
            {!reservationMutation.isPending && (
              <>
                <FaPaypal />
                Reserve for ${(room?.price || 0) * totalDays}
              </>
            )}
          </button>
        </div>
      </section>
    </>
  );
};
