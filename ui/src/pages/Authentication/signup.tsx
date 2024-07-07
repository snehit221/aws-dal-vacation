import axios from "axios";
import AuthForm from "./authForm";
import { lambdas } from "../../lib/constants";
import { useNavigate } from "react-router-dom";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

export const Signup = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(lambdas.signUp, values);
      console.log(response.data);
      navigate("/auth/second-factor");
    } catch {
      console.log("Error", Error);
    }
    console.log(values);
  };
  return <AuthForm title="REGISTRATION FORM" onSubmit={onSubmit} isSignup />;
};

export default Signup;
