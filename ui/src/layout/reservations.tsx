import { FaTimes } from "react-icons/fa";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store/user";
import { ax } from "../lib/client";
import { lambdas } from "../lib/constants";
import { ReservationWithRoom } from "../lib/dto";
import { ReactNode } from "react";
import { Loading } from "../components/loading";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type ReservationProps = {
  open: boolean;
  setOpen(open: boolean): void;
};

export const Reservations = ({ open, setOpen }: ReservationProps) => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const reservationsByUserQuery = useQuery({
    queryKey: ["reservations", user?.email],
    queryFn: () =>
      ax
        .get(`${lambdas.listReservationsByRoom}?userId=${user?.email}`)
        .then((res) => (res.data?.reservations as ReservationWithRoom[]) || []),
    enabled: open && !!user?.email,
  });

  let Content: ReactNode;

  if (reservationsByUserQuery.isPending) {
    Content = <Loading />;
  } else if (reservationsByUserQuery.isError) {
    Content = <>Error occurred...</>;
  } else if (!reservationsByUserQuery.data.length) {
    Content = <span className="text-gray-400 text-sm">No reservations.</span>;
  } else {
    Content = (
      <div>
        {reservationsByUserQuery.data.map((reservation) => (
          <div
            key={reservation.referenceCode}
            className="flex gap-5 border-[1px] p-2 rounded-md"
          >
            <img
              src={reservation.roomDetails.image}
              className="w-4/12 object-cover rounded-sm shadow-md"
            />
            <div>
              <h2 className="text-sm font-semibold leading-6">
                {reservation.roomDetails.hotel} - Room #{" "}
                {reservation.roomDetails.number}
              </h2>
              <h3 className="text-sm font-semibold text-indigo-600">
                Reference code - <u>{reservation.ReferenceCode}</u>
              </h3>
              <div className="space-y-1 mt-2 text-xs font-light">
                <p>Paid: ${reservation.paid}</p>
                <p>
                  Check In: {dayjs(reservation.checkIn).format("YYYY-MM-DD")}
                </p>
                <p>
                  Check Out: {dayjs(reservation.checkOut).format("YYYY-MM-DD")}
                </p>
                <p>Guests: {reservation.guests}</p>
              </div>
            </div>
            <div className="ml-auto mt-auto">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate(`/room/${reservation.roomDetails.id}`);
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Dialog className="relative z-10" open={open} onClose={setOpen}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <FaTimes className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full  flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                    Your Reservations
                  </DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {Content}
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
