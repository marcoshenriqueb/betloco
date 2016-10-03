import {combineReducers} from "redux";
import searchReducer from "./searchReducer";

const allReducers = combineReducers({
  eventsSearch: searchReducer
});

export default allReducers;
