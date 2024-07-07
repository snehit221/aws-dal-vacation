import axios from "axios";
import AuthForm from "./authForm";
import { lambdas } from "../../lib/constants";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Signin = () => {
  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(lambdas.signIn, values);
      console.log(response.data);
    } catch {
      console.log("Error", Error);
    }
    console.log(values);
  };
  return <AuthForm title="SIGN IN FORM" onSubmit={onSubmit} />;
};

export default Signin;
