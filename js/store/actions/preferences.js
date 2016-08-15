import {fetchMenus} from './async';

export const SET_SELECTED_RESTAURANTS = 'SET_SELECTED_RESTAURANTS';
export const SET_FAVORITED_RESTAURANTS = 'SET_FAVORITED_RESTAURANTS';
export const SET_SELECTED_FAVORITE = 'SET_SELECTED_FAVORITE';
export const SET_LANG = 'SET_LANG';

export const setIsSelected = (value, include) => ({
  type: SET_SELECTED_FAVORITE,
  payload: {value, include}
});

export const setSelectedRestaurants = (values, include) => (dispatch, getState) => {
  dispatch({
    type: SET_SELECTED_RESTAURANTS,
    payload: {values, include}
  });
  dispatch(fetchMenus(getState().preferences.lang));
};

export const setFavoritedRestaurants = (values, include) => ({
  type: SET_FAVORITED_RESTAURANTS,
  payload: {values, include}
});

export const setLang = lang => ({
  type: SET_LANG,
  payload: lang
});
