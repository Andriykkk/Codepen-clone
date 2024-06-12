const searchReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.search };
    case "SET_SEARCH_NULL":
      return { ...state, serch: null };
    default:
      return state;
  }
};

export default searchReducer;
