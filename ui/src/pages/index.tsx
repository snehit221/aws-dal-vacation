import { FaHome, FaLocationArrow, FaEye } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ax } from "../lib/client";
import { Room } from "../lib/dto";
import { Loading } from "../components/loading";
import { lambdas } from "../lib/constants";

export const Index = () => {
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => ax.get(lambdas.listRooms).then((res) => res.data as Room[]),
  });

  if (isFetching) {
    return <Loading />;
  }

  const rooms = data || [];

  return (
    <div>
      <h2 className="text-base font-semibold leading-7 text-indigo-600 flex items-center gap-2">
        <FaHome />
        Available Rooms
      </h2>

      <hr className="w-3/12 mt-2" />

      <div className="flex gap-10 mt-10 flex-wrap">
        {rooms.map((room) => (
          <div
            key={room?.id}
            className="flex flex-col bg-white border shadow-sm rounded-xl w-1/3"
          >
            <img
              className="w-full h-60 object-cover rounded-t-xl"
              src={room.image}
              alt="Image Description"
            />
            <div className="p-4 md:p-5">
              <div className="flex">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    #{room.number}
                  </h3>
                  <p className="text-sm leading-8 text-gray-400 flex items-center gap-2">
                    <FaLocationArrow className="text-xs" />
                    {room.hotel}, {room.location}
                  </p>
                </div>
                <h4 className="text-indigo-600 ml-auto font-semibold">
                  ${room.price}
                </h4>
              </div>
            </div>
            <button
              className="flex items-center gap-5 justify-center hover:text-indigo-500"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              <FaEye />
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
