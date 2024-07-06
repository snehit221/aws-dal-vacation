import axios from "axios";
import AuthForm from "./authForm";
import { lambdas } from "../../lib/constants";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // confirmPassword: string;
}

export const Signup = () => {
  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(lambdas.signUp, values);
      console.log(response.data);
    } catch {
      console.log("Error", Error);
    }
    console.log(values);
  };
  return <AuthForm title="REGISTRATION FORM" onSubmit={onSubmit} isSignup />;
};

export default Signup;
