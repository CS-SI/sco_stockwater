/* eslint-disable no-undef */
import { AppConfig } from '@/config'
import { useSelector, useDispatch } from 'react-redux'
import { DataTypes, DurationTypes, ObservationTypes } from '../../config'
import { useEffect, useState, useCallback, useRef } from 'react'
import { handleResetZoom } from '../../stores/chartSlice'
import {
	getChartStartDateCurrentMonth,
	getChartFirstDateNextMonth,
} from '../../utils/date'
import {
	handleDataSetsBooleanOption,
	handleDataSetsBorderWidthOption,
} from '../../utils/chart'

export default function useChartHook() {
	const [chartData, setChartData] = useState([])
	const [dataSets, setDataSets] = useState([])
	const [dateMin, setDateMin] = useState()
	const [dateMax, setDateMax] = useState()

	const [obsTypes, setObsTypes] = useState([])
	const [lastDataType, setLastDataType] = useState('')
	const [lastObstypes, setLastObstypes] = useState([])
	const [obsDepth, setObsDepth] = useState()
	const [lastObsDepth, setLastObsDepth] = useState('')
	const [lastchartData, setLastchartData] = useState([])
	const [scales, setScales] = useState()
	const [options, setOptions] = useState()
	const [datesOfYear, setDatesOfYear] = useState({})
	const form = useSelector(state => state.form)
	const chart = useSelector(state => state.chart)
	const { lakesChartOptions } = useSelector(state => state)
	const { yearsChartOptions } = useSelector(state => state)
	const { zoomReset } = chart
	const {
		dataType,
		OPTIC,
		RADAR,
		DAY,
		PERIOD,
		REFERENCE,
		YEAR,
		VOLUME,
		charType,
	} = form

	const { label, unit } = AppConfig.attributes[dataType]
	const { active, indexToRemoveFromChartData } = useSelector(
		state => state.stateLake
	)
	const { information } = useSelector(state => state)
	const { data, mode } = useSelector(state => state.data)

	const chartRef = useRef()
	const dispatch = useDispatch()
	useEffect(() => {
		if (data.length === 0) return
		if (OPTIC) {
			setObsTypes([ObservationTypes.OPTIC])
		}
		if (RADAR) {
			setObsTypes([ObservationTypes.RADAR])
		}
		if (REFERENCE) {
			setObsTypes([ObservationTypes.REFERENCE])
		}
		if (OPTIC && RADAR) {
			setObsTypes([ObservationTypes.OPTIC, ObservationTypes.RADAR])
		}
		if (OPTIC && REFERENCE) {
			setObsTypes([ObservationTypes.OPTIC, ObservationTypes.REFERENCE])
		}
		if (RADAR && REFERENCE) {
			setObsTypes([ObservationTypes.RADAR, ObservationTypes.REFERENCE])
		}
		if (OPTIC && RADAR && REFERENCE) {
			setObsTypes([
				ObservationTypes.OPTIC,
				ObservationTypes.RADAR,
				ObservationTypes.REFERENCE,
			])
		}
		if (!OPTIC && !RADAR && !REFERENCE) {
			setObsTypes([])
			setChartData([])
		}
		if (!DAY && !PERIOD) {
			setChartData([])
		}
		if (YEAR && chartData.length > 1) {
			setChartData([])
		}
		if (DAY) {
			setObsDepth(DurationTypes.DAY)
		}
		if (PERIOD) {
			setObsDepth(DurationTypes.PERIOD)
		}
		if (active.length === 0) {
			setChartData([])
			setDataSets([])
		}
		if (VOLUME && active.length === 0) {
			setDataSets([])
		}
	}, [DAY, OPTIC, PERIOD, RADAR, REFERENCE, YEAR, VOLUME, active])

	useEffect(() => {
		if (dataType === lastDataType) return
		if (
			dataType !== lastDataType ||
			JSON.stringify(obsTypes) !== JSON.stringify(lastObstypes)
		) {
			setChartData([])
		}
	}, [dataType, lastDataType, obsTypes, lastObstypes])

	useEffect(() => {
		if (zoomReset) {
			chartRef.current.resetZoom()
			dispatch(handleResetZoom({ zoom: false }))
		}
	}, [zoomReset])
	useEffect(() => {
		if (indexToRemoveFromChartData !== -1) {
			const newChartData = [...chartData]
			newChartData.splice(indexToRemoveFromChartData, 1)
			setChartData(newChartData)
		}
	}, [indexToRemoveFromChartData])

	useEffect(() => {
		if (
			active.length > 0 &&
			data[active.at(-1)]?.[dataType]?.[obsDepth]?.year
		) {
			if (YEAR) {
				const dataYear = Object.values(
					data[active.at(-1)][dataType][obsDepth].year
				)
				const dataYearActualized = handleObsTypeYearMode(
					dataYear,
					OPTIC,
					RADAR,
					REFERENCE
				)
				setChartData(dataYearActualized)

				setLastDataType(dataType)
				setLastObstypes(obsTypes)
				setLastObsDepth(obsDepth)
			}
		}
	}, [YEAR, active, data, dataType, obsDepth, OPTIC, RADAR, REFERENCE])

	useEffect(() => {
		if (YEAR) return
		if (active.length > 0 && data[active.at(-1)]?.[dataType][obsDepth]) {
			let dataTmp = []

			if (
				(lastDataType && lastObsDepth && dataType !== lastDataType) ||
				obsTypes !== lastObstypes
			) {
				for (const id of active) {
					if (!VOLUME) {
						const dataRaw = data[id][dataType][obsDepth]?.raw
						console.log('dataRaw', dataRaw)
						const dataActualized = handleObsType(
							dataRaw,
							OPTIC,
							RADAR,
							REFERENCE
						)
						dataTmp.push(dataActualized)
					}

					if (VOLUME) {
						const dataVolume = mode.volume[obsDepth]?.raw
						const dataVolumeActualized = handleObsType(
							dataVolume,
							OPTIC,
							RADAR,
							REFERENCE
						)

						dataTmp.push(dataVolumeActualized)
					}
				}
				setChartData(dataTmp)
			} else {
				const id = active.at(-1)
				if (!VOLUME) {
					const dataRaw = data[id][dataType][obsDepth].raw
					const dataActualized = handleObsType(dataRaw, OPTIC, RADAR, REFERENCE)

					dataTmp.push(dataActualized)
				}

				if (VOLUME) {
					const dataVolume = mode.volume[obsDepth].raw
					const dataVolumeActualized = handleObsType(
						dataVolume,
						OPTIC,
						RADAR,
						REFERENCE
					)
					dataTmp.push(dataVolumeActualized)
				}
				if (JSON.stringify(dataTmp) !== JSON.stringify(chartData)) {
					if (YEAR || chartData.length === 1) {
						setChartData(dataTmp)
					} else {
						setChartData([...chartData, ...dataTmp])
					}
				}
			}
			setLastDataType(dataType)
			setLastObstypes(obsTypes)
			setLastObsDepth(obsDepth)
		}
	}, [VOLUME, active, data, dataType, obsDepth, obsTypes])

	const handleObsType = useCallback(
		(data, optic, radar, reference) => {
			let dataTmp = []
			if (optic && radar && reference) {
				dataTmp.push([data])
			}
			if (optic && !radar && !reference) {
				dataTmp.push([data.slice(0, 1)])
			}

			if (optic && !radar && reference) {
				console.log('=>', data)
				if (data?.[2].length === 0) {
					dataTmp.push([data.slice(0, 1)])
				}

				dataTmp.push([[data.slice(0, 1)[0], [data.at(-1)][0]]])
			}

			if (!optic && radar && !reference) {
				dataTmp.push([data.slice(1, 2)])
			}

			if (!optic && radar && reference) {
				dataTmp.push([data.slice(1, data.length)])
			}

			if (optic && radar && !reference) {
				dataTmp.push([data.slice(0, 2)])
			}

			if (!optic && !radar && reference) {
				if (data.length < 3) return
				dataTmp.push([[data.at(-1)]])
			}
			return dataTmp[0]
		},
		[data]
	)

	const handleObsTypeYearMode = useCallback(
		(data, optic, radar, reference) => {
			let dataTmp = []
			if (optic && radar && reference) {
				dataTmp.push(data)
			}

			if (optic && !radar && !reference) {
				dataTmp.push(data.map(obs => obs.slice(0, 1)))
			}

			if (optic && !radar && reference) {
				if (data?.[0].length === 2) {
					dataTmp.push(data.map(obs => obs.slice(0, 1)))
				}
				if (data?.[0].length === 3) {
					dataTmp.push(data.map(obs => [obs.slice(0, 1)[0], obs.at(-1)]))
				}
			}

			if (!optic && radar && !reference) {
				dataTmp.push(data.map(obs => obs.slice(1, 2)))
			}

			if (!optic && radar && reference) {
				dataTmp.push(data.map(obs => obs.slice(1, 3)))
			}

			if (optic && radar && !reference) {
				dataTmp.push(data.map(obs => obs.slice(0, 2)))
			}

			if (!optic && !radar && reference) {
				if (data?.[0].length === 2) return
				dataTmp.push(data.map(obs => obs.at(-1)))
			}
			return dataTmp
		},
		[data]
	)

	const setDataLines = useCallback(
		(item, obsType, index, lakeName, indexColor) => {
			if (!item) return
			const { borderWidth } = chart.style.default
			let { tension, pointRadius } = AppConfig.attributes[dataType]
			let backgroundColor
			let borderColor
			let pointBackgroundColor

			if (['OPTIC', 'RADAR', 'REFERENCE'].includes(obsType)) {
				backgroundColor =
					chart[dataType].style[obsType][indexColor].pointBackgroundColor
				borderColor = chart[dataType].style[obsType][indexColor].borderColor
				pointBackgroundColor =
					chart[dataType].style[obsType][indexColor].pointBackgroundColor
			}
			if (charType === 'LINE') {
				pointRadius = 0
			}
			let xAxisID
			if (YEAR) {
				xAxisID = `x${index}`
			}
			if (YEAR && obsType === 'OPTIC') {
				backgroundColor = chart.YEAR.style[xAxisID].OPTIC.backgroundColor
				borderColor = chart.YEAR.style[xAxisID].OPTIC.borderColor
				pointBackgroundColor =
					chart.YEAR.style[xAxisID].OPTIC.pointBackgroundColor
			}
			if (YEAR && obsType === 'RADAR') {
				backgroundColor = chart.YEAR.style[xAxisID].RADAR.backgroundColor
				borderColor = chart.YEAR.style[xAxisID].RADAR.borderColor
				pointBackgroundColor =
					chart.YEAR.style[xAxisID].RADAR.pointBackgroundColor
			}
			if (YEAR && obsType === 'REFERENCE') {
				backgroundColor = chart.YEAR.style[xAxisID].REFERENCE.backgroundColor
				borderColor = chart.YEAR.style[xAxisID].REFERENCE.borderColor
				pointBackgroundColor =
					chart.YEAR.style[xAxisID].REFERENCE.pointBackgroundColor
			}

			if (!YEAR) {
				xAxisID = 'x'
			}
			const isHidden = () => {
				if (VOLUME && lakeName !== undefined) {
					return true
				}
				if (VOLUME && lakeName === undefined) {
					return false
				}
				if (!YEAR && !VOLUME) {
					return !Object.values(lakesChartOptions)[indexColor]?.visible
				}
				if (YEAR && !VOLUME) {
					return !Object.values(yearsChartOptions)[indexColor].visible
				}
			}
			return {
				backgroundColor,
				borderColor,
				pointBackgroundColor,
				borderWidth,
				data: item,
				index,
				label: `${obsType}`,
				lakeName: `${lakeName}`,
				pointRadius,
				tension,
				xAxisID,
				hidden: isHidden(),
			}
		},
		[
			chart,
			charType,
			dataType,
			obsTypes,
			unit,
			YEAR,
			lakesChartOptions,
			yearsChartOptions,
		]
	)

	useEffect(() => {
		if (
			!Object.values(data).length &&
			chartData.length === 0 &&
			JSON.stringify(chartData[0]) === lastchartData
		)
			return
		const arr = []
		const allDates = []
		let allDatesSorted = []
		if (!YEAR) {
			chartData?.forEach((key, index) => {
				key?.forEach(item => {
					item?.forEach((itm, idx) => {
						const data = setDataLines(
							itm,
							obsTypes[idx],
							idx,
							VOLUME
								? active.map(id => information.information[id].name)[index - 1]
								: active.map(id => information.information[id].name)[index],
							index
						)
						const itemDates = itm?.map(el => el.date)
						if (itemDates) allDates.push(...itemDates)
						arr.push(data)
					})
				})
			})
			allDatesSorted = allDates.sort((a, b) => new Date(a) - new Date(b))
			const firstDateGraph = getChartStartDateCurrentMonth(allDatesSorted[0])
			setDateMin(firstDateGraph)
			const lastDateGraph = getChartFirstDateNextMonth(allDatesSorted.at(-1))
			setDateMax(lastDateGraph)
		}
		if (
			YEAR &&
			Object.keys(yearsChartOptions).length === chartData[0]?.length
		) {
			const arrDate = []
			chartData.forEach(year => {
				Object.values(year).forEach((obs, index) => {
					obs.forEach((itm, idx) => {
						const data = setDataLines(
							itm[0],
							obsTypes[idx],
							index,
							information.information[active.at(-1)].name,
							index
						)
						const dateBegin = itm[0][0].date
						const dateEnd = itm[0].at(-1).date
						arrDate.push(dateBegin, dateEnd)
						arr.push(data)
					})
				})
			})
			const years = arrDate.map(date => new Date(date).getFullYear())

			const normalizeDateSorted = arrDate
				.map(el => el.replace(/\d{4}/, '2022'))
				.sort((a, b) => new Date(a) - new Date(b))

			const obj = {}
			const objAllDatesByYear = () => {
				years.map(year => {
					return (obj[year] = {
						start: normalizeDateSorted[0].replace(/\d{4}/, year),
						end: normalizeDateSorted.at(-1).replace(/\d{4}/, year),
					})
				})
			}
			objAllDatesByYear()

			setDatesOfYear(obj)
		}

		if (JSON.stringify([...arr]) !== JSON.stringify(dataSets)) {
			setDataSets([...arr])
		}

		arr.length = 0
		setLastchartData(JSON.stringify(chartData[0]))
	}, [YEAR, chartData, charType, lastchartData, setDataLines])

	const makesScalesForyear = useCallback((isDisplay, startDate, endDate) => {
		const obj = {
			type: 'time',
			parsing: false,
			display: isDisplay,
			min: startDate,
			max: endDate,
			time: {
				displayFormats: {
					month: 'MMM yyyy',
					day: 'dd MMM',
				},
				tooltipFormat: 'dd MMM yyyy',
			},
		}
		return obj
	}, [])

	useEffect(() => {
		if (Object.entries(datesOfYear).length === 0) return
		const scalesYearsTmp = {}
		Object.entries(datesOfYear).forEach((year, index) => {
			const yearScales = makesScalesForyear(
				index === 0 ? true : false,
				getChartStartDateCurrentMonth(year[1].start),
				getChartFirstDateNextMonth(year[1].end)
			)
			scalesYearsTmp[`x${index}`] = yearScales
		})

		const y = { beginAtZero: true }
		scalesYearsTmp.y = y
		setScales(scalesYearsTmp)
	}, [datesOfYear])

	useEffect(() => {
		if (!YEAR) {
			setScales({
				x: {
					type: 'time',
					min: dateMin,
					max: dateMax,
					parsing: false,
					time: {
						displayFormats: {
							month: 'MMM yyyy',
							day: 'dd MMM',
						},
						tooltipFormat: 'dd MMM yyyy',
					},
				},
				y: {
					beginAtZero: true,
				},
			})
		}
	}, [dateMin, dateMax])

	useEffect(() => {
		if (active.length === 0) return
		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				intersect: false,
				mode: 'nearest',
			},
			plugins: {
				title: {
					display: true,
					text: `${label}  (${unit})`,
					position: 'top',
					font: {
						size: 16,
					},
					padding: {
						top: 10,
						bottom: 10,
					},
				},
				tooltip: {
					callbacks: {
						title(context) {
							const { label } = context[0]
							return label
						},
						afterTitle(context) {
							if (VOLUME) return
							const { lakeName } = context[0].dataset
							return `${lakeName}`
						},
						beforeBody(context) {
							const { label } = context[0].dataset
							return `Observation: ${label}`
						},
						label(context) {
							const { formattedValue } = context
							if (!VOLUME) {
								return ` ${label}: ${formattedValue} ${unit}`
							}
							if (VOLUME) {
								return ` Total ${label}: ${formattedValue} ${unit}`
							}
						},
						afterLabel(context) {
							if (!VOLUME) return
							if (VOLUME) {
								const { date } = context.raw
								const { index } = context.dataset
								const allValue = active.map(id => {
									return data[id][DataTypes.VOLUME]?.[obsDepth].full[index]
										.filter(item => item.date === date)
										.map(item => item.value)
								})
								const allActiveLakesName = active.map(id => {
									return information.information[id].name
								})
								return allValue.map((val, index) => {
									const name = allActiveLakesName[index]
									const value = val[0].toFixed(3)
									return ` ${name}: ${value} ${unit}`
								})
							}
						},
					},
				},
				legend: {
					display: false,
					// position: "top",
					// labels: { font: { size: 14 } },
				},
				zoom: {
					pan: {
						enabled: true,
						modifierKey: 'ctrl',
						// onPanStart: chart => {
						//   chart.event.changedPointers[0].target.style.cursor = "grab"
						// },
					},
					zoom: {
						wheel: {
							enabled: true,
						},
						drag: {
							enabled: true,
							backgroundColor: 'rgba(0,204,255,0.15)',
							borderColor: 'rgba(0,204,255,1.00)',
							borderWidth: 1,
						},
						pinch: {
							enabled: true,
						},
						mode: 'xy',
					},
					limits: {
						y: { min: 0, max: 'original' },
						x: { min: 'original', max: 'original' },
					},
				},
			},
			scales,
			y: {
				beginAtZero: true,
			},
			parsing: {
				xAxisKey: 'date',
				yAxisKey: 'value',
			},
			animation: false,
		}
		setOptions(chartOptions)
	}, [scales, label, unit, VOLUME, data, active])

	useEffect(() => {
		if (!lakesChartOptions[active.at(-1)]) return
		if (YEAR || dataSets.length !== active.length * obsTypes.length) return
		const activeLakes = active.map(id => {
			return lakesChartOptions[id]
		})

		const toggleChartVisibilty = handleDataSetsBooleanOption(
			dataSets,
			activeLakes,
			'visible',
			'hidden',
			obsTypes.length
		)
		setDataSets(toggleChartVisibilty)
	}, [lakesChartOptions])

	useEffect(() => {
		if (!lakesChartOptions[active.at(-1)]) return
		if (YEAR || dataSets.length !== active.length * obsTypes.length) return
		const activeLakes = active.map(id => {
			return lakesChartOptions[id]
		})
		const toggleBoldGraph = handleDataSetsBorderWidthOption(
			dataSets,
			activeLakes,
			'selected',
			'borderWidth',
			obsTypes.length,
			chart
		)
		setDataSets(toggleBoldGraph)
	}, [lakesChartOptions])

	useEffect(() => {
		if (!data[active.at(-1)] || !YEAR || dataSets.length === 0) return
		if (
			!YEAR ||
			dataSets.length !==
				Object.values(yearsChartOptions).length *
					data[active.at(-1)][dataType][obsDepth].year[
						Object.keys(yearsChartOptions)[0]
					].length
		)
			return
		const dataLength =
			data[active.at(-1)][dataType][obsDepth].year[
				Object.keys(yearsChartOptions)[0]
			].length
		const activeYears = Object.values(yearsChartOptions)
		const toggleYearChartVisibilty = handleDataSetsBooleanOption(
			dataSets,
			activeYears,
			'visible',
			'hidden',
			dataLength
		)
		setDataSets(toggleYearChartVisibilty)
	}, [yearsChartOptions, data, dataType, obsDepth])

	useEffect(() => {
		if (!data[active.at(-1)] || !YEAR || dataSets.length === 0) return
		if (
			!YEAR ||
			dataSets.length !==
				Object.values(yearsChartOptions).length *
					data[active.at(-1)]?.[dataType][obsDepth]?.year[
						Object.keys(yearsChartOptions)[0]
					].length
		)
			return
		const dataLength =
			data[active.at(-1)][dataType][obsDepth].year[
				Object.keys(yearsChartOptions)[0]
			].length
		const activeYears = Object.values(yearsChartOptions)
		const toggleYearBoldGraph = handleDataSetsBorderWidthOption(
			dataSets,
			activeYears,
			'selected',
			'borderWidth',
			dataLength,
			chart
		)
		setDataSets(toggleYearBoldGraph)
	}, [yearsChartOptions])

	const dataChart = {
		datasets: dataSets,
	}

	return {
		dataChart,
		options,
		form,
		charType,
		chartRef,
	}
}
