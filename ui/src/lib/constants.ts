export const lambdas = {
  listRooms: import.meta.env.VITE_LIST_ROOMS_LAMBDA,
  getRoom: import.meta.env.VITE_GET_ROOM_LAMBDA,
  signUp: import.meta.env.VITE_SIGNUP_LAMBDA,
  signIn: import.meta.env.VITE_SIGNIN_LAMBDA,
  confirmUser: import.meta.env.VITE_CONFIRM_USER_LAMBDA,
  storeUserData: import.meta.env.VITE_STORE_USER_DATA,
  setSecurityQuestion: import.meta.env.VITE_SET_SECURITY_QUESTION,
  storeSecurityKey: import.meta.env.VITE_STORE_KEY
};
