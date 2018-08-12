import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { getMetricMetaInfo, timeToString } from "../utils/helpers";
import { UdaciSlider } from "./UdaciSlider";
import { UdaciSteppers } from "./UdaciSteppers";
import { DateHeader } from "./DateHeader";
import { Ionicons } from '@expo/vector-icons'
import { TextButton } from "./TextButton";
import { removeEntry, submitEntry } from "../utils/api";

const SubmitBtn = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}>
    <Text>Submit</Text>
  </TouchableOpacity>
)


export default class AddEntry extends Component {

  initialState = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  state = this.initialState

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)
    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }))
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    // todo update redux

    this.setState(() => ({
      ...this.initialState,
    }))

    // Navigate to home

    submitEntry({ key, entry })

    // Clear local notification
  }

  reset = () => {
    const key = timeToString()

    //udate redux

    // Route to home

    removeEntry(key)
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name='ios-happy-outline'
                    size={100}
          />
          <Text>You already logged your info for today.</Text>
          <TextButton
            onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader
          date={(new Date()).toLocaleDateString()}
        />
        {
          Object.keys(metaInfo).map((key) => {
            const { getIcon, type, ...rest } = metaInfo[key]
            const value = this.state[key]

            return (
              <View key={key}>
                {
                  getIcon()
                }
                {
                  type === 'slider'
                    ?
                    <UdaciSlider
                      value={value}
                      onChange={(value) => this.slide(key, value)}
                      {...rest}
                    />
                    :
                    <UdaciSteppers
                      value={value}
                      onIncrement={() => this.increment(key)}
                      onDecrement={() => this.decrement(key)}
                    />
                }
              </View>
            )
          })
        }
        <SubmitBtn
          onPress={this.submit}
        />
      </View>
    )
  }
}