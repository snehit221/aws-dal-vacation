export const lambdas = {
  listRooms: import.meta.env.VITE_LIST_ROOMS_LAMBDA,
  getRoom: import.meta.env.VITE_GET_ROOM_LAMBDA,
  addRoom: import.meta.env.VITE_ADD_ROOM_LAMBDA,
  uploadRoomImage: import.meta.env.VITE_UPLOAD_ROOM_IMAGE_LAMBDA,
  editRoom: import.meta.env.VITE_EDIT_ROOM_LAMBDA,
  deleteRoom: import.meta.env.VITE_DELETE_ROOM_LAMBDA,
  reserveRoom: import.meta.env.VITE_RESERVE_ROOM_LAMBDA,
  reservedDatesByRoom: import.meta.env.VITE_RESERVED_DATES_BY_ROOM_LAMBDA,
  listReservationsByRoom: import.meta.env.VITE_LIST_RESERVATIONS_BY_USER_LAMBDA,
  postFeedback: import.meta.env.VITE_POST_FEEDBACK_LAMBDA,
};
