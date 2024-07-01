import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Room } from "../lib/dto";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ax } from "../lib/client";
import { lambdas } from "../lib/constants";
import { Loading } from "../components/loading";
import { FaTimes } from "react-icons/fa";

type EditRoomForm = Omit<Room, "id">;

export const EditRoom = () => {
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

  if (isFetching) {
    return <Loading />;
  }

  if (isError || !room) {
    return <>Error...</>;
  }

  return <Edit {...room} />;
};

const Edit = (props: EditRoomForm) => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const form = useForm<EditRoomForm>({
    defaultValues: props,
  });

  const amenities = form.watch("amenities") || [];

  const editRoomMutation = useMutation({
    mutationFn: (data: EditRoomForm) => ax.post(lambdas.editRoom, data),
    onSuccess: () => {
      toast.success(`Room edit success`);
      navigate(`/room/${roomId}`);
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: () => ax.post(lambdas.deleteRoom, { id: roomId }),
    onSuccess: () => {
      toast.success(`Room delete success`);
      navigate("/");
    },
  });

  const onSubmit = form.handleSubmit((data) => editRoomMutation.mutate(data));

  return (
    <>
      <h2 className="font-semibold text-2xl">Edit Room</h2>
      <div className="mt-5 flex gap-10 flex-wrap">
        <div>
          <label className="mb-2" htmlFor="max">
            Maximum Guests:{" "}
          </label>
          <input
            id="max"
            type="number"
            placeholder="2"
            {...form.register("maxGuests")}
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="price">
            Price($):{" "}
          </label>
          <input
            id="price"
            type="number"
            min={0}
            placeholder="100"
            {...form.register("price")}
          />
        </div>
        <div className="w-full">
          <label className="mb-2" htmlFor="amenities">
            Amenities:{" "}
          </label>
          <div className="mb-3 space-x-2">
            {amenities.map((value) => (
              <span key={value} className="badge items-center gap-1">
                {value}{" "}
                <FaTimes
                  onClick={() => {
                    form.setValue(
                      "amenities",
                      amenities.filter((am) => am !== value)
                    );
                  }}
                />
              </span>
            ))}
          </div>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">+</span>
            </div>
            <input
              name="amenity"
              type="text"
              className="pl-7"
              placeholder="TV/Wifi/1 BED"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  form.setValue("amenities", [
                    ...amenities,
                    e.currentTarget?.value,
                  ]);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 space-x-5">
        <button
          className="primary"
          disabled={editRoomMutation.isPending}
          onClick={onSubmit}
        >
          Edit{editRoomMutation.isPending && "ing..."}
        </button>
        <button
          className="danger"
          disabled={deleteRoomMutation.isPending}
          onClick={() => deleteRoomMutation.mutate()}
        >
          Delete{deleteRoomMutation.isPending && "ing..."}
        </button>
      </div>
    </>
  );
};
