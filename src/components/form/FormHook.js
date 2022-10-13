/* eslint-disable no-undef */
import { AppConfig } from '@/config'
import { useSelector, useDispatch } from 'react-redux'
import { saveAs } from 'file-saver'
import { useCallback } from 'react'
import { handleResetZoom } from '../../stores/chartSlice'
import { toggleActiveYears } from '../../stores/lakesSlice'
import { toggleYear } from '../../stores/formSlice'
export default function useFormHook({ canvas }) {
	const form = useSelector(state => state.form)
	const { active } = useSelector(state => state.stateLake)
	const { information } = useSelector(state => state.information)

	const dispatch = useDispatch()
	const filenameLakes = active
		.map(id => {
			return information[id].name
		})
		.join('_')
	const dataTypesValues = AppConfig.attributes
	const observationTypesValues = AppConfig.observationTypes
	const durationValues = AppConfig.duration
	const chartTypesValues = AppConfig.chartTypes
	const modeTypesValues = AppConfig.modeTypes

	const downloadChartImage = useCallback(
		e => {
			e.preventDefault()
			if (!canvas) return
			const dataURL = canvas.toDataURL('image/png')
			if (dataURL) {
				try {
					saveAs(
						dataURL,
						`${filenameLakes}_${form.dataType.toLowerCase()}_chart.png`
					)
				} catch (error) {
					console.error(error)
				}
			}
		},
		[canvas, filenameLakes]
	)

	const resetZoomChart = useCallback(e => {
		e.preventDefault()
		dispatch(handleResetZoom({ zoom: true }))
	}, [])

	const handleYearMode = useCallback(() => {
		dispatch(toggleYear())
		dispatch(toggleActiveYears())
	}, [])

	return {
		handleYearMode,
		resetZoomChart,
		dataTypesValues,
		modeTypesValues,
		observationTypesValues,
		durationValues,
		form,
		chartTypesValues,
		downloadChartImage,
	}
}
