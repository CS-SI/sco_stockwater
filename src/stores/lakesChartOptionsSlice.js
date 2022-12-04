import { current, createSlice } from '@reduxjs/toolkit'
const initialState = {}

export const lakesChartOptionsSlice = createSlice({
  name: 'lakesChartOptions',
  initialState,
  reducers: {
    addLakeChartOptions: (state, action) => {
      const { id } = action.payload
      state[id] = {
        visible: true,
        selected: false,
        infoVisible: false
      }
    },
    toggleLakeChartVisibility: (state, action) => {
      const { id } = action.payload
      state[id].visible = !state[id].visible
    },
    toggleLakeChartSelection: (state, action) => {
      const { id } = action.payload
      if (!state[id]) return
      Object.entries(state).map(el => {
        if (el[0] !== id && el[1].selected) {
          el[1].selected = false
        }
      })
      state[id].selected = !state[id].selected
    },
    toggleLakeChartInfoVisibility: (state, action) => {
      const { id } = action.payload
      Object.entries(state).map(el => {
        if (el[0] !== id && el[1].infoVisible) {
          el[1].infoVisible = false
        }
      })
      state[id].infoVisible = !state[id].infoVisible
    },
    removeLakeChartOptions: (state, action) => {
      const { id } = action.payload
      state[id].selected = !state[id].selected

      delete state[id]
    },
    resetLakechartOptions: () => {
      return initialState
    }
  }
})

export const {
  addLakeChartOptions,
  toggleLakeChartVisibility,
  toggleLakeChartSelection,
  toggleLakeChartInfoVisibility,
  removeLakeChartOptions,
  resetLakechartOptions
} = lakesChartOptionsSlice.actions

export default lakesChartOptionsSlice.reducer
