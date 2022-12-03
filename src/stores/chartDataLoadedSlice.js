import { createSlice } from '@reduxjs/toolkit'
import { DurationTypes } from '../config'
const initialState = {
  lakesLoaded: {}
}

export const chartDataLoadedSlice = createSlice({
  name: 'chartDataLoaded',
  initialState,
  reducers: {
    addLakeLoaded: (state, action) => {
      const { id, dataType, obsDepth } = action.payload
      state.lakesLoaded[id] = {
        [dataType]: {
          [DurationTypes[obsDepth]]: true
        }
      }
    },
    resetLakeLoaded: state => {
      state.lakesLoaded = {}
    }
  }
})

export const { addLakeLoaded, resetLakeLoaded } = chartDataLoadedSlice.actions

export default chartDataLoadedSlice.reducer
