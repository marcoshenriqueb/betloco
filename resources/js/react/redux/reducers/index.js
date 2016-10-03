import {combineReducers} from "redux";
import searchReducer from "./searchReducer";
import eventReducer from "./eventReducer";

const allReducers = combineReducers({
  eventsSearch: searchReducer,
  _event: eventReducer
});

export default allReducers;
