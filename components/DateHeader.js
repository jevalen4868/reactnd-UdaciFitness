import React from 'react'
import { Text } from 'react-native'
import { purple } from "../utils/colors";

export const DateHeader = ({ date }) => (
  <Text style={{ color: purple, fontSize: 25 }}>
    {date}
  </Text>
)