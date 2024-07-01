import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Room, RoomSubType, RoomType } from "../lib/dto";
import { useMutation } from "@tanstack/react-query";
import { ax } from "../lib/client";
import { lambdas } from "../lib/constants";
import { useState } from "react";

type RoomForm = Omit<Room, "id">;

export const RoomForm = () => {
  const form = useForm<RoomForm>({
    defaultValues: {
      type: RoomType.NORMAL,
      subtype: RoomSubType.DELUXE,
    },
  });

  const [file, setFile] = useState<File | null>(null);

  const addRoomMutation = useMutation({
    mutationFn: (data: RoomForm) =>
      ax.post(lambdas.addRoom, data).then(async (res) => {
        const data = res.data;

        const id = data.id as string;

        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          await ax.post(`${lambdas.uploadRoomImage}?roomId=${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          throw new Error("File not uploaded");
        }
      }),
  });

  const amenities = form.watch("amenities") || [];

  const onSubmit = form.handleSubmit((data) => addRoomMutation.mutate(data));

  return (
    <>
      <h2 className="font-semibold text-2xl">Add Room</h2>
      <div className="mt-5 flex gap-10 flex-wrap">
        <div className="w-full">
          <label htmlFor="img">Photo: </label>
          <input
            id="img"
            type="file"
            accept="image/jpeg"
            className="w-full p-5"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];
              setFile(selectedFile || null);
            }}
          />
        </div>
        <div>
          <label className="mb-2" htmlFor="hotel">
            Hotel:{" "}
          </label>
          <input
            id="hotel"
            type="text"
            placeholder="Mariott"
            {...form.register("hotel")}
          />
        </div>

        <div>
          <label className="mb-2" htmlFor="number">
            Room number:{" "}
          </label>
          <input
            id="number"
            type="number"
            placeholder="101"
            {...form.register("number")}
          />
        </div>

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
          <label className="mb-2" htmlFor="location">
            Location:
          </label>
          <input
            id="location"
            placeholder="Halifax"
            {...form.register("location")}
          />
        </div>

        <div>
          <label className="mb-2" htmlFor="type">
            Type:{" "}
          </label>
          <select {...form.register("type")}>
            {Object.values(RoomType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2" htmlFor="subtype">
            Subtype:{" "}
          </label>
          <select {...form.register("subtype")}>
            {Object.values(RoomSubType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
      <button
        className="primary mt-10"
        disabled={addRoomMutation.isPending}
        onClick={onSubmit}
      >
        Add{addRoomMutation.isPending && "ing..."}
      </button>
    </>
  );
};
