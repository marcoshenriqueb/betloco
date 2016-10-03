import {combineReducers} from "redux";
import searchReducer from "./searchReducer";
import eventReducer from "./eventReducer";
import profilePositionReducer from "./profile/positionReducer";
import userReducer from "./profile/userReducer";
import navReducer from "./navReducer";
import marketReducer from "./marketReducer";
import orderReducer from "./orderReducer";

const allReducers = combineReducers({
  eventsSearch: searchReducer,
  _event: eventReducer,
  market: marketReducer,
  profilePosition: profilePositionReducer,
  profileUser: userReducer,
  nav: navReducer,
  order: orderReducer
});

export default allReducers;
