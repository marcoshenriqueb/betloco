import {combineReducers} from "redux";
import searchReducer from "./searchReducer";
import eventReducer from "./eventReducer";
import profilePositionReducer from "./profile/positionReducer";
import userReducer from "./profile/userReducer";
import navReducer from "./navReducer";

const allReducers = combineReducers({
  eventsSearch: searchReducer,
  _event: eventReducer,
  profilePosition: profilePositionReducer,
  profileUser: userReducer,
  nav: navReducer
});

export default allReducers;
