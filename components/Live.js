import React, { Component } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import { Foundation } from '@expo/vector-icons'
import { Location, Permissions } from 'expo'
import { calculateDirection } from '../utils/helpers'
import { purple, white } from "../utils/colors";
import { isIos } from "../utils/helpers";

const UNDETERMINED = 'undetermined'
const GRANTED = 'granted'
const DENIED = 'denied'

export default class Live extends Component {

  state = {
    coords: '',
    status: '',
    direction: '',
  }

  componentDidMount() {
    Permissions.getAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === GRANTED) {
          return this.setLocation()
        }

        this.setState(() => ({ status }))
      })
      .catch((error) => {
        console.warn('Error getting location permission: ', error)

        this.setState(() => ({
          status: UNDETERMINED
        }))
      })
  }

  askPermission = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === GRANTED) {
          return this.setLocation()
        }

        this.setState(() => {
          status
        })
      })
      .catch((error) => {
        console.warn('error asking location permission', error)
      })
  }

  setLocation = () => {
    Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 1,
        distanceInterval: 1,
      },
      ({ coords }) => {
        const newDirection = calculateDirection(coords.heading)
        const { direction } = this.state
        this.setState(() => ({
          coords,
          status: GRANTED,
          direction: newDirection,
        }))
      }
    )
  }

  render() {
    const { status, coords, direction } = this.state
    if (status === null) {
      return <ActivityIndicator style={{ marginTop: 30 }}/>
    }

    if (status === DENIED) {
      return <View style={ss.center}>
        <Foundation
          name='alert'
          size={50}
        />
        <Text>
          You denied your location.
          You can fix this by visiting your settings and enabling location services for this
          app.
        </Text>

      </View>
    }

    if (status === UNDETERMINED) {
      return <View style={ss.center}>
        <Foundation
          name='alert'
          size={50}
        />
        <Text>
          You need to enable location services for this app.
        </Text>
        <TouchableOpacity
          onPress={this.askPermission}
          style={isIos ? ss.iosBtn : ss.androidBtn}
        >
          <Text style={ss.btnText}>
            Enable
          </Text>
        </TouchableOpacity>
      </View>
    }

    return <View style={ss.container}>
      <View style={ss.directionContainer}>
        <Text style={ss.header}>You're heading </Text>
        <Text style={ss.direction}>{direction}</Text>
      </View>
      <View style={ss.metricContainer}>
        <View style={ss.metric}>
          <Text style={[ss.header, { color: white }]}>
            Altitude
          </Text>
          <Text style={[ss.subHeader, { color: white }]}>
            {Math.round(coords.altitude * 3.2808)} Feet
          </Text>
        </View>
        <View style={ss.metric}>
          <Text style={[ss.header, { color: white }]}>
            Speed
          </Text>
          <Text style={[ss.subHeader, { color: white }]}>
            {(coords.speed * 2.2369).toFixed(1)} MPH
          </Text>
        </View>
      </View>
    </View>
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iosBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: white,
    fontSize: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
})