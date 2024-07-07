import axios from "axios";
import { useForm } from "react-hook-form";
import { lambdas } from "../../lib/constants";
import { useNavigate } from "react-router-dom";

const questions = [
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "What was the name of your first pet?",
  "In what city were you born?",
  "What is your mother's maiden name?",
];

interface FormData {
  username: string;
  // firstName?: string;
  // lastName?: string;
  // email: string;
  // password: string;
  // confirmPassword?: string;
  question?: string;
  answer?: string;
}

const SecondFactor = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(lambdas.setSecurityQuestion, data);
      console.log(response.data);
      navigate("/auth/third-factor");
    } catch {
      console.log("Error", Error);
    }
    console.log(data);
  };

  return (
    <div className="relative mx-auto mt-16 w-full max-w-7xl items-center px-5 md:px-12 lg:px-20">
      <div className="md:w-84 mx-auto w-full max-w-xl rounded-3xl border-2 bg-gray-50 p-4 shadow-xl sm:p-4 md:max-w-md md:px-6 md:py-4">
        <div className="flex flex-col">
          <div className="items-center justify-center"></div>
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
                Security Question
              </label>
              <select
                className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                {...register("question", {
                  required: "Please select a security question",
                })}
              >
                <option value="">Select a security question</option>
                {questions.map((question, index) => (
                  <option key={index} value={question}>
                    {question}
                  </option>
                ))}
              </select>
              {errors.question && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.question.message}
                </h2>
              )}
            </div>
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Answer
              </label>
              <input
                className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                type="text"
                placeholder="Answer"
                {...register("answer", {
                  required: "Answer cannot be empty",
                  maxLength: {
                    value: 50,
                    message: "Must be 50 characters or less",
                  },
                })}
              />
              {errors.answer && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.answer.message}
                </h2>
              )}
            </div>
            {/* </>
            )} */}
            <div className="col-span-full mt-10">
              <button
                className="inline-flex text-md mb-4 w-full items-center justify-center rounded-xl border-2 border-black bg-slate-900 px-6 py-2.5 text-center text-white hover:bg-slate-700"
                type="submit"
              >
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecondFactor;
