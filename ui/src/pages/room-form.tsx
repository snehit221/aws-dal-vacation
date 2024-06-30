import { FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Room, RoomSubType, RoomType } from "../lib/dto";

export const RoomForm = () => {
  const form = useForm<Omit<Room, "id">>();

  return (
    <>
      <h2 className="font-semibold text-2xl">Add Room</h2>
      <div className="mt-5 flex gap-10 flex-wrap">
        <div className="w-full">
          <label htmlFor="img">Photo: </label>
          <input id="img" type="file" className="w-full p-5" />
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
          <select>
            {Object.values(RoomType).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2" htmlFor="subtype">
            Subtype:{" "}
          </label>
          <select>
            {Object.values(RoomSubType).map((t) => (
              <option key={t}>{t}</option>
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
          <div className="mb-3">
            {(form.watch("amenities") || []).map((value) => (
              <span className="badge items-center gap-1">
                {value} <FaTimes />
              </span>
            ))}
          </div>
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">+</span>
            </div>
            <input type="text" className="pl-7" placeholder="TV/Wifi/1 BED" />
          </div>
        </div>
      </div>
      <button className="primary mt-10">Add</button>
    </>
  );
};
