import React from 'react'
import { View, Slider, Text } from 'react-native'

export const UdaciSlider = ({max, unit, step, value, onChange}) => (
  <View>
    <Slider
      step={step}
      value={value}
      maximumValue={max}
      minimumValue={0}
      onValueChange={onChange}
    />
    <View>
      <Text>{value}</Text>
      <Text>{unit}</Text>
    </View>
  </View>
)
