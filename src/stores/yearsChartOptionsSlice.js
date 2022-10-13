import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const yearsChartOptionsSlice = createSlice({
	name: 'yearsChartOptions',
	initialState,
	reducers: {
		addYearsChartOptions: (state, action) => {
			const { years } = action.payload
			for (const year of years) {
				state[year] = {
					visible: true,
					selected: false,
				}
			}
		},
		toggleYearChartVisibility: (state, action) => {
			const { year } = action.payload
			state[year].visible = !state[year].visible
		},
		toggleYearChartSelection: (state, action) => {
			const { year } = action.payload
			state[year].selected = !state[year].selected
		},
		resetYearschartOptions: () => {
			return initialState
		},
	},
})

export const {
	addYearsChartOptions,
	toggleYearChartVisibility,
	toggleYearChartSelection,
	resetYearschartOptions,
} = yearsChartOptionsSlice.actions

export default yearsChartOptionsSlice.reducer
