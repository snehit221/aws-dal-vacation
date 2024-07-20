import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface AuthFormProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  isSignup?: boolean;
}

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: string;
}

const roles = ["admin", "customer"];

const AuthForm: React.FC<AuthFormProps> = ({
  title,
  onSubmit,
  isSignup = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const PasswordVisible = () => {
    setShowPassword(!showPassword);
  };
  const ConfirmPasswordVisible = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="relative mx-auto w-full max-w-7xl items-center px-5 md:px-12 lg:px-20">
      <div className="md:w-84 mx-auto w-full max-w-xl rounded-3xl border-2 bg-gray-50 p-4 shadow-xl sm:p-4 md:max-w-md md:px-6 md:py-4">
        <div className="flex flex-col">
          <div className="items-center justify-center">
            <h2 className="text-3xl text-black">{title}</h2>
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
            {isSignup && (
              <>
                <div>
                  <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                    First Name
                  </label>
                  <input
                    className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", {
                      required: "First Name cannot be empty",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "First Name must contain only letters",
                      },
                      maxLength: {
                        value: 15,
                        message: "Must be 15 characters or less",
                      },
                    })}
                  />
                  {errors.firstName && (
                    <h2 className="mt-[-2px] text-right text-red-500">
                      {errors.firstName.message}
                    </h2>
                  )}
                </div>
                <div>
                  <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                    Last Name
                  </label>
                  <input
                    className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", {
                      required: "Last Name cannot be empty",
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Last Name must contain only letters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Must be 20 characters or less",
                      },
                    })}
                  />
                  {errors.lastName && (
                    <h2 className="mt-[-2px] text-right text-red-500">
                      {errors.lastName.message}
                    </h2>
                  )}
                </div>
              </>
            )}
            {isSignup && (
              <div>
                <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                  Email id
                </label>
                <input
                  className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <h2 className="mt-[-2px] text-right text-red-500">
                    {errors.email.message}
                  </h2>
                )}
              </div>
            )}
            <div>
              <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must not be less than 8 characters",
                    },
                    pattern: {
                      value:
                        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                    },
                  })}
                  className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={PasswordVisible}
                  className="absolute right-3 top-1/2 transform border-transparent -translate-y-1/2 bg-transparent"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <h2 className="mt-[-2px] text-right text-red-500">
                  {errors.password.message}
                </h2>
              )}
            </div>
            {isSignup && (
              <div className="relative mt-4">
                <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                  Confirm password
                </label>
                <input
                  className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={ConfirmPasswordVisible}
                  className="absolute right-3 top-3/4 transform border-transparent -translate-y-1/2 bg-transparent"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
                {errors.confirmPassword && (
                  <h2 className="mt-[-2px] text-right text-red-500">
                    {errors.confirmPassword.message}
                  </h2>
                )}
              </div>
            )}
            {/* {isSignup && (
              <div>
                <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                  Confirm password
                </label>
                div
                <input
                  className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <h2 className="mt-[-2px] text-right text-red-500">
                    {errors.confirmPassword.message}
                  </h2>
                )}
              </div>
            )} */}
            {isSignup && (
              <div>
                <label className="text-12 mb-2 ml-1 mt-4 block font-medium text-slate-800">
                  Select Role
                </label>
                <select
                  className="block w-full appearance-none rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-black placeholder:text-gray-400 focus:border-green-500 sm:text-sm"
                  {...register("role", {
                    required: "Please select a role",
                  })}
                >
                  <option value="">Select a role</option>
                  {roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <h2 className="mt-[-2px] text-right text-red-500">
                    {errors.role.message}
                  </h2>
                )}
              </div>
            )}

            <div className="col-span-full mt-10">
              <button
                className="nline-flex text-md mb-4 w-full items-center justify-center rounded-xl border-2 border-black bg-slate-900 px-6 py-2.5 text-center text-white hover:bg-slate-700"
                type="submit"
              >
                {isSignup ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
