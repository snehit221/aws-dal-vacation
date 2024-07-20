import axios from "axios";
import AuthForm from "../signup/authForm";
import { lambdas } from "../../../lib/constants";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  username: string;
  password: string;
}

export const Signin = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(lambdas.signIn, values);

      if (response.status === 200) {
        localStorage.setItem("username", values.username);
        localStorage.setItem("token", response.data.idToken);
        toast.success("Sign in successful");
        navigate("/auth/security-answer");
      } else {
        toast.error(`Unexpected response: ${response.statusText}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              toast.error(error.response.data);
              break;
            case 401:
              toast.error(error.response.data);
              break;
            case 500:
              toast.error(error.response.data);
              break;
            default:
              toast.error(`Error: ${error.response.statusText}`);
          }
        } else if (error.request) {
          toast.error("No response received from server.");
        } else {
          toast.error("Request setup failed.");
        }
      } else {
        console.log("Non-Axios error:");
        toast.error("An unexpected error occurred.");
      }
    }

    console.log(values);
  };

  return (
    <>
      <ToastContainer />
      <AuthForm title="SIGN IN FORM" onSubmit={onSubmit} />
    </>
  );
};

export default Signin;
