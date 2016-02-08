'use strict';

import HttpCache from '../managers/HttpCache';
import storage from './storage';

export const changeView = view => ({
   type: 'CHANGE_VIEW',
   view
});

export const showModal = component => ({
   type: 'SHOW_MODAL',
   component
});

export const dismissModal = () => ({
   type: 'DISMISS_MODAL'
});

export const getAreas = () => {
   return dispatch => {
      dispatch({
         type: 'SET_AREAS_LOADING',
         loading: true
      });

      return HttpCache.get('areas', 'https://api.kanttiinit.fi/areas', {days: '1'})
      .then(areas => {
         dispatch({
            type: 'SET_AREAS_LOADING',
            loading: false
         });

         dispatch({
            type: 'SET_AREAS',
            areas
         });
      });
   };
};

// selected restaurant actions
export const setSelectedRestaurants = restaurants => ({
   type: 'SET_SELECTED_RESTAURANTS',
   restaurants
});

export const updateSelectedRestaurants = (restaurants, areSelected) => {
   return dispatch => {
      return storage.getList('selectedRestaurants')
      .then(selected => {
         if (areSelected)
            restaurants.forEach(r => selected.push(r.id));
         else
            selected = selected.filter(id => !restaurants.some(r => r.id === id));

         dispatch(setSelectedRestaurants(selected));
         return storage.setList('selectedRestaurants', selected);
      });
   };
};

// favorite actions
export const setFavorites = favorites => ({
   type: 'SET_FAVORITES',
   favorites
});

export const addFavorite = name => {
   return dispatch => {
      name = name.toLowerCase();
      return storage.getList('storedFavorites')
      .then(storedFavorites => {
         if (!storedFavorites.some(f => f.name === name)) {
            storedFavorites.push({name});
            dispatch(setFavorites(storedFavorites));
            return storage.setList('storedFavorites', storedFavorites);
         }
      });
   };
};

export const removeFavorite = name => {
   return dispatch => {
      return storage.getList('storedFavorites')
      .then(storedFavorites => {
         const favorites = storedFavorites.filter(f => f.name !== name);
         dispatch(setFavorites(favorites));
         return storage.setList('storedFavorites', favorites);
      });
   };
};
