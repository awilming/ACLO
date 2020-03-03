import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function UpcomingEvents() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{color: 'white', fontSize: 25}} >This screen is still in development
        </Text>
      </ScrollView>
    </View>
  )
}

UpcomingEvents.navigationOptions = {
  title: 'Upcoming events',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});