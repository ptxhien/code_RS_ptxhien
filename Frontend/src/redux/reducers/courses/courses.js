import * as Types from "../../constants/actionType";

const initialState = {
  isLoading: false,
  isRecommended: false,
  shouldShowException: true,
  data: [],
  online: {},
  offline: {},
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.COURSE_LOADING: {
      return {
        ...state,
        isLoading: true,
        isRecommended: false,
      };
    }
    case Types.RECOMMENDATION: {
      const { data } = action.payload; 
      return {
        ...state,
        isLoading: false,
        isRecommended: true,
        shouldShowException: false,
        online: data.courses_online,
        offline: data.courses_offline,        
        data: [],
      };
    }
    case Types.GET_COURSES: {
      const { data } = action.payload;
      return {
        data,
        isLoading: false,
        shouldShowException: false,
      };
    }
    case Types.RECOMMENDATION_FAIL: {
      return initialState;
    }
    default:
      return state;
  }
};

export default coursesReducer;
