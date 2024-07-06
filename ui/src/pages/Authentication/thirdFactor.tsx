import axios from "axios";
import { useForm } from "react-hook-form";
import { lambdas } from "../../lib/constants";

interface FormData {
  username: string;
  key: string;
}

const ThirdFactor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(lambdas.storeSecurityKey, data);
      console.log(response.data);
    } catch {
      console.log("Error", Error);
    }
    console.log(data);
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl items-center px-5 md:px-12 lg:px-20">
      <div className="md:w-84 mx-auto w-full max-w-xl rounded-3xl border-2 bg-gray-50 p-4 shadow-xl sm:p-4 md:max-w-md md:px-6 md:py-4">
        <div className="flex flex-col">
          <div className="items-center justify-center">
            <h2 className="text-3xl text-black uppercase">enter cipher key</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Username
              </label>
              <input
                className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username cannot be empty",
                  minLength: {
                    value: 4,
                    message: "Username must be at least 4 characters",
                  },
                  maxLength: {
                    value: 15,
                    message: "Must be 15 characters or less",
                  },
                })}
              />
              {errors.username && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.username.message}
                </h2>
              )}
            </div>
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Key
              </label>
              <input
                className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                type="text"
                placeholder="Enter key"
                {...register("key", {
                  required: "Key is required",
                  minLength: {
                    value: 1,
                    message: "Key must be at least 1 characters",
                  },
                  maxLength: {
                    value: 2,
                    message: "Must be 2 characters or less",
                  },
                })}
              />
              {errors.key && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.key.message}
                </h2>
              )}
            </div>
            <div className="col-span-full mt-10">
              <button
                className="inline-flex text-md mb-4 w-full items-center justify-center rounded-xl border-2 border-black bg-slate-900 px-6 py-2.5 text-center text-white hover:bg-slate-700"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThirdFactor;
