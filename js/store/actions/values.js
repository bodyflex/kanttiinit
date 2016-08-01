import moment from 'moment';
import _ from 'lodash';

export const SET_VALUE_CURRENT_VIEW = 'SET_VALUE_CURRENT_VIEW';
export const SET_VALUE_DAY_OFFSET = 'SET_VALUE_DAY_OFFSET';

export function updateNow() {
  const date = new Date();
  return {
    type: 'SET_VALUE_NOW',
    payload: {
      date,
      days: _.times(7, i => moment(date).add(i, 'days').format('YYYY-MM-DD'))
    }
  };
}

export function setCurrentView(view) {
  return (dispatch, getState) => dispatch({
    type: SET_VALUE_CURRENT_VIEW,
    payload: {
      currentView: view,
      views: getState().value.views + 1
    }
  });
}

export function setKeyboardVisible(keyboardVisible) {
  return {
    type: 'SET_VALUE_KEYBOARD_VISIBLE',
    payload: {keyboardVisible}
  };
}

export function setDayOffset(dayOffset) {
  return {
    type: SET_VALUE_DAY_OFFSET,
    payload: {dayOffset}
  };
}

export function setInitializing(initializing) {
  return {
    type: 'SET_VALUE_INITIALIZING',
    payload: {initializing}
  };
}
