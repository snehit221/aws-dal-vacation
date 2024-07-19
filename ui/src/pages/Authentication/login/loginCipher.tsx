import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { lambdas } from "../../../lib/constants";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/user";

interface FormData {
  word: string;
  decryptedWord: string;
}

const sampleWords = [
  "test",
  "hello",
  "world",
  "cipher",
  "security",
  "auth",
  "factor",
  "third",
  "encryption",
  "decryption",
];

const LoginCipher = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useUserStore();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [encryptedWord, setEncryptedWord] = useState<string>("");

  const generateEncryptedWord = () => {
    const randomWord =
      sampleWords[Math.floor(Math.random() * sampleWords.length)];
    // const key = 3; // Caesar cipher key
    const encrypted = randomWord;

    setEncryptedWord(encrypted);
    setValue("word", encrypted);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        throw new Error("Username not found in local storage");
      }

      const requestData = { ...data, username };

      const response = await axios.post(lambdas.decryptCipher, requestData);
      console.log(response.data);
      if (response.status === 200) {
        setAccessToken(localStorage.getItem("token") || "");
        navigate("/");
      } else {
        alert(response.data.body);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Authentication failed");
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-7xl items-center px-5 md:px-12 lg:px-20">
      <div className="mb-8">
        <span className="text-sm text-gray-600">
          Example: If the encrypted word is <b>"abcd"</b> and the key is{" "}
          <b>3</b>, then the decrypted word is <b>"xyza"</b> (a - 3 = x, b - 3 =
          y, c - 3 = z, d - 3 = a).
        </span>
      </div>
      <div className="md:w-84 mx-auto w-full max-w-xl rounded-3xl border-2 bg-gray-50 p-4 shadow-xl sm:p-4 md:max-w-md md:px-6 md:py-4">
        <div className="flex flex-col">
          <div className="items-center justify-center">
            <h2 className="text-3xl text-black">Third Factor Authentication</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Encrypted Word
              </label>
              <div className="flex">
                <input
                  className="flex-grow block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                  type="text"
                  placeholder="Generate Word"
                  value={encryptedWord}
                  readOnly
                />
                <button
                  type="button"
                  className="ml-2 inline-flex items-center justify-center rounded-xl border-2 border-black bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                  onClick={generateEncryptedWord}
                >
                  Generate
                </button>
              </div>
              {errors.word && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.word.message as React.ReactNode}
                </h2>
              )}
            </div>
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Decrypted Word
              </label>
              <input
                className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                type="text"
                placeholder="Decrypted Word"
                {...register("decryptedWord", {
                  required: "Decrypted word cannot be empty",
                  maxLength: {
                    value: 50,
                    message: "Must be 50 characters or less",
                  },
                })}
              />
              {errors.decryptedWord && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.decryptedWord.message as React.ReactNode}
                </h2>
              )}
            </div>
            <div className="col-span-full mt-10">
              <button
                className="inline-flex text-md mb-4 w-full items-center justify-center rounded-xl border-2 border-black bg-slate-900 px-6 py-2.5 text-center text-white hover:bg-slate-700"
                type="submit"
              >
                Authenticate
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginCipher;
