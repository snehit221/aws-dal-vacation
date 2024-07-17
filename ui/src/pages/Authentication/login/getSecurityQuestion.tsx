import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { lambdas } from "../../../lib/constants";

interface FormData {
  username: string;
  question: string;
  answer: string;
}

const GetSecurityQuestion = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      fetchQuestion(username);
    } else {
      console.error("Username not found in local storage");
    }
  }, []);

  const fetchQuestion = async (username: string) => {
    setLoading(true);
    try {
      const response = await axios.post(lambdas.getSecurityQuestion, {
        username,
      });
      const { question } = response.data.body;
      console.log(question);
      setValue("question", question);
      setQuestion(question);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching question", error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(lambdas.setSecurityQuestion, data);
      navigate("/auth/decrypt-cipher");
      console.log(response.data);
    } catch (error) {
      console.error("Error", error);
    }
    console.log(data);
  };

  return (
    <div className="relative mx-auto mt-16 w-full max-w-7xl items-center px-5 md:px-12 lg:px-20">
      <div className="md:w-84 mx-auto w-full max-w-xl rounded-3xl border-2 bg-gray-50 p-4 shadow-xl sm:p-4 md:max-w-md md:px-6 md:py-4">
        <div className="flex flex-col">
          <div className="items-center justify-center">
            <h2 className="text-3xl text-black">ENTER SECURITY QUESTION</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Security Question
              </label>
              {loading ? (
                <p>Loading question...</p>
              ) : (
                <div className="text-lg ml-2">{question}</div>
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

export default GetSecurityQuestion;
