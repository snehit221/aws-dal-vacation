import axios from "axios";
import AuthForm from "./authForm";
import { lambdas } from "../../../lib/constants";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const Signup = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(lambdas.signUp, values);

      if (response.status === 200) {
        toast.success(response.data.message || "Sign up successful");

        localStorage.setItem("username", values.username);
        localStorage.setItem("email", values.email);
        localStorage.setItem("firstName", values.firstName);
        localStorage.setItem("lastName", values.lastName);

        navigate("/auth/second-factor");
      } else {
        toast.error(
          `${response.status} ${response.data.message}` || "Sign up failed"
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              toast.error(error.response.data);
              break;
            case 409:
              toast.error(error.response.data);
              break;
            case 500:
              toast.error(error.response.data);
              break;
            default:
              toast.error(
                `${error.response.status} ${error.response.statusText}`
              );
          }
        } else if (error.request) {
          toast.error("No response received from server.");
        } else {
          toast.error("Request setup failed.");
        }
      } else {
        console.log("Non-Axios error");
        toast.error("An unexpected error occurred.");
      }
    }

    console.log(values);
  };

  return (
    <>
      <ToastContainer />
      <AuthForm title="REGISTRATION FORM" onSubmit={onSubmit} isSignup />
    </>
  );
};

export default Signup;
