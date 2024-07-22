import { FaHotel, FaPaypal, FaMap } from "react-icons/fa";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { firstLetterCapital, inputDateFormat } from "../lib/utils";
import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ax, queryClient } from "../lib/client";
import { lambdas } from "../lib/constants";
import {
  Reservation,
  ReservationPayload,
  ReservationWithRoom,
  Room,
} from "../lib/dto";
import { Loading } from "../components/loading";
import { useUserStore } from "../store/user";

export const RoomView = () => {
  const { user } = useUserStore();
  const userId = user?.email;
  const { roomId } = useParams();
  const navigate = useNavigate();

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

  const reservationByUserQuery = useQuery<ReservationWithRoom[]>({
    queryKey: ["reservations", userId],
    enabled: !!userId,
  });

  const postFeedbackMutation = useMutation({
    mutationFn: (feedback: string) =>
      ax.post(lambdas.postFeedback, {
        userId,
        roomId,
        feedback,
      }),
  });

  const reservationByRoom = reservationByUserQuery.data?.find(
    (r) => r.roomDetails.id === roomId
  );

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

  const [feedback, setFeedback] = useState("");

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

  let ReservationWidget: ReactNode;

  if (reservationByRoom) {
    ReservationWidget = (
      <div className="bg-green-100 text-green-600 p-5 mb-5 rounded-lg shadow-sm text-sm space-y-2">
        <p>
          You have reservation for this room from{" "}
          <b>{dayjs(reservationByRoom.checkIn).format("MMM DD, YYYY")} </b> to{" "}
          <b>{dayjs(reservationByRoom.checkOut).format("MMM DD, YYYY")}</b>.
        </p>
        <p>
          Your booking reference code is{" "}
          <b>{reservationByRoom.ReferenceCode}</b>
        </p>
        {!room?.feedback?.find((f) => f.userId === userId) ? (
          <div>
            <label className="text-green-600 mb-1">Feedback: </label>
            <textarea
              className="w-full"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button
              className="primary"
              onClick={() =>
                postFeedbackMutation.mutate(feedback, {
                  onSuccess: () => queryClient.refetchQueries(),
                })
              }
            >
              Submit
            </button>
          </div>
        ) : (
          <p>You already submitted feedback</p>
        )}
      </div>
    );
  }

  return (
    <>
      {!!userId && room?.owner === user?.email && (
        <div className="mb-5">
          <button onClick={() => navigate(`/room/${roomId}/edit`)}>Edit</button>
        </div>
      )}
      {ReservationWidget}
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
            <div>
              <b>Feedbacks ({room?.feedback?.length})</b>
              <ul className="list-disc">
                {room?.feedback?.map((f) => (
                  <li>{f.feedback}</li>
                ))}
              </ul>
            </div>
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
          {user?.role !== "admin" && !reservationByRoom && (
            <button
              disabled={reservationMutation.isPending || !userId}
              type="submit"
              className="primary flex items-center gap-2"
              onClick={() =>
                userId &&
                reservationMutation.mutate(
                  {
                    checkIn: startDate.toDate(),
                    checkOut: endDate.toDate(),
                    paid: (room?.price || 0) * totalDays,
                    roomId,
                    userId,
                    guests,
                  },
                  {
                    onSuccess: () => queryClient.refetchQueries(),
                  }
                )
              }
            >
              {reservationMutation.isPending && <h2>Reserving...</h2>}
              {!reservationMutation.isPending && userId && (
                <>
                  <FaPaypal />
                  Reserve for ${(room?.price || 0) * totalDays}
                </>
              )}
              {!userId && "Login to reserve"}
            </button>
          )}
        </div>
      </section>
    </>
  );
};
