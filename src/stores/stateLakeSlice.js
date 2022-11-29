import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  active: [],
  indexToRemoveFromChartData: '',
}

export const stateLakeSlice = createSlice({
  name: 'stateLake',
  initialState,
  reducers: {
    addLake: (state, action) => {
      const { id } = action.payload
      if (!state.active.includes(id)) {
        state.active.push(id)
      }
    },
    removeLake: (state, action) => {
      const { id } = action.payload
      if (state.active.includes(id)) {
        state.active = state.active.filter(lake => lake !== id)
        state.indexToRemoveFromChartData = state.active.indexOf(id)
      }
    },
    updateActivelakes: (state, action) => {
      const { id } = action.payload
      if (!state.active.includes(id)) {
        state.active.push(id)
      }
    },
    clearActiveLakes: state => {
      state.active = []
    },
  },
})

export const { addLake, removeLake, clearActiveLakes, updateActivelakes } =
  stateLakeSlice.actions

export default stateLakeSlice.reducer
