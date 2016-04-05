'use strict';

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'redux-nimble';

import CourseDetails from './CourseDetails';
import Property from './Property';
import Button from '../../Button';
import {colors} from '../../../style';

const {
   View,
   Text,
   StyleSheet,
   Platform
} = React;

class Course extends React.Component {
   shouldComponentUpdate(props) {
      const currentCourse = this.props.course;
      if (currentCourse) {
         const nextCourse = props.course;
         return currentCourse.title !== nextCourse.title || currentCourse.isFavorite !== nextCourse.isFavorite;
      }
      return true;
   }
   render() {
      const {course, restaurant, style, favorites} = this.props;
      course.restaurant = restaurant;
      return (
         <Button
            highlightColor={colors.lightGrey}
            onPress={() => this.props.showModal(<CourseDetails course={course} />)}
            style={[course.isFavorite ? styles.favoriteCourse : {borderRadius: 2}]}>
            <View style={[styles.course, style]}>
               {course.isFavorite ? <Icon style={{marginRight: 6}} color='#fc5151' name='android-favorite' /> : null}
               <Text key={course.title} style={styles.courseTitle}>{course.title}</Text>
               {course.properties ? course.properties.map(p => <Property style={{marginLeft: 2}} key={p}>{p}</Property>) : null}
            </View>
         </Button>
      );
   }
}

export default connect(undefined, ['showModal'])(Course);

const styles = StyleSheet.create({
   course: {
      flexDirection: 'row',
      paddingTop: 6,
      paddingBottom: 6,
      alignItems: 'center',
      marginLeft: 8,
      marginRight: 8
   },
   favoriteCourse: {
      backgroundColor: '#f7eaea',
      borderRadius: 0
   },
   courseTitle: {
      flex: 1,
      fontSize: 12,
      color: colors.darkGrey
   }
});
