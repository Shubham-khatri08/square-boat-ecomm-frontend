import { USER_LOGIN_SUCCESS, USER_LOGOUT } from "../actions/userActions";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS: {
      return { userInfo: action.payload };
    }
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};
