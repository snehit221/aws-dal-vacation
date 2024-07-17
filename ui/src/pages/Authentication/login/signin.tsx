import axios from "axios";
import AuthForm from "../signup/authForm";
import { lambdas } from "../../../lib/constants";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  password: string;
}

export const Signin = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(lambdas.signIn, values);
      console.log(response.data);
      localStorage.setItem("username", values.username);
      navigate("/auth/security-answer");
    } catch {
      console.log("Error", Error);
    }
    console.log(values);
  };
  return <AuthForm title="SIGN IN FORM" onSubmit={onSubmit} />;
};

export default Signin;
