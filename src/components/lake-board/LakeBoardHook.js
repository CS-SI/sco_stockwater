import { useSelector } from 'react-redux'
import { toggleActiveYears } from '../../stores/lakesSlice'
import { clearActiveLakes } from '../../stores/stateLakeSlice'
import { useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { DurationTypes, ModeTypes } from '../../config'
import { resetLakechartOptions } from '../../stores/lakesChartOptionsSlice'
import { resetYearschartOptions } from '../../stores/yearsChartOptionsSlice'
import { resetModeVolume } from '../../stores/dataSlice'

export default function useLakeBoardHook() {
	const [obsDepth, setObsDepth] = useState()
	const [lastMode, setLastMode] = useState(null)
	const [activeLakesInfo, setActiveLakesInfo] = useState([])
	const [showInfo, setShowInfo] = useState(false)
	const { YEAR, VOLUME, dataType, DAY, PERIOD } = useSelector(
		state => state.form
	)
	const { active } = useSelector(state => state.stateLake)
	const { data } = useSelector(state => state.data)
	const { yearsChartOptions, lakesChartOptions } = useSelector(state => state)
	const { information } = useSelector(state => state.information)
	const dispatch = useDispatch()

	useEffect(() => {
		if (DAY) {
			setObsDepth(DurationTypes.DAY)
		}
		if (PERIOD) {
			setObsDepth(DurationTypes.PERIOD)
		}
	}, [DAY, PERIOD])

	useEffect(() => {
		const isInfoCliked = Object.entries(lakesChartOptions)
			.filter(([id, { infoVisible }]) => infoVisible)
			.map(([id]) => id)
		if (isInfoCliked.length > 0) {
			setShowInfo(true)
		} else {
			setShowInfo(false)
		}
	}, [lakesChartOptions])

	useEffect(() => {
		if (active.length === 0 && activeLakesInfo.length > 0) {
			setActiveLakesInfo([])
		}
	}, [active])

	useEffect(() => {
		if (lastMode === ModeTypes.YEAR && VOLUME) {
			setActiveLakesInfo([])
		}
	}, [VOLUME, YEAR])

	useEffect(() => {
		if (YEAR && Object.keys(yearsChartOptions) && active.length > 0) {
			const yearsId = Object.keys(yearsChartOptions).map(el => {
				return {
					id: el,
					name: el,
				}
			})
			setActiveLakesInfo(yearsId)
			setLastMode(ModeTypes.YEAR)
		}
	}, [YEAR, yearsChartOptions, active])

	useEffect(() => {
		if (!VOLUME && !YEAR && active.length === 0) return
		const info = Object.entries(information).filter(([id]) => {
			return active.includes(id)
		})
		const allLakesActiveIdName = info
			.map(([id, { name }]) => ({ id, name }))
			.filter(el => active.includes(el.id))

		const allLakesSortedLikeActive = []
		for (const id of active) {
			const lake = allLakesActiveIdName.find(el => el.id === id)
			if (lake) {
				allLakesSortedLikeActive.push(lake)
			}
		}
		setActiveLakesInfo(allLakesSortedLikeActive)

		// setActiveLakesInfo(allLakesActiveIdName)
		setLastMode(null)
	}, [VOLUME, YEAR, active, information])

	useEffect(() => {
		if (!data[active.at(-1)] || YEAR || VOLUME) return
		if (Object.entries(data[active.at(-1)]).length > 0) return
		// const info = Object.entries(information).filter(([id]) => {
		// 	return active.includes(id)
		// })
		// const lakesIdName = info
		// 	.map(([id, { name }]) => ({ id, name }))
		// 	.filter(el => el.id === active.at(-1))[0]
		// const activeLakesInfoId = activeLakesInfo.map(el => el.id)
		// const newIdName = Object.values(lakesIdName).filter(
		// 	el => el.id !== activeLakesInfoId.includes(el.id)
		// )
		if (
			yearsChartOptions &&
			activeLakesInfo
				.map(el => el.id)
				.includes(Object.keys(yearsChartOptions)[0])
		) {
			const info = Object.entries(information).filter(([id]) => {
				return active.includes(id)
			})
			const allLakesActiveIdName = info
				.map(([id, { name }]) => ({ id, name }))
				.filter(el => active.includes(el.id))
			setActiveLakesInfo(allLakesActiveIdName)
			setLastMode(null)
		}

		if (
			!activeLakesInfo.includes(lakesIdName.id) &&
			lastMode === ModeTypes.VOLUME
		) {
			setActiveLakesInfo([...activeLakesInfo, lakesIdName])
		}
		setLastMode(ModeTypes.VOLUME)
	}, [VOLUME, data, active, yearsChartOptions])

	useEffect(() => {
		if (YEAR || VOLUME) return
		if (data[active.at(-1)]?.[dataType]?.[obsDepth]) {
			if (
				yearsChartOptions &&
				activeLakesInfo
					.map(el => el.id)
					.includes(Object.keys(yearsChartOptions)[0])
			) {
				const allLakesActiveIdName = []
				for (const [id, { name }] of Object.entries(information)) {
					if (active.includes(id)) {
						allLakesActiveIdName.push({ id, name })
					}
				}
				const allLakesSortedLikeActive = []
				for (const id of active) {
					const lake = allLakesActiveIdName.find(el => el.id === id)
					if (lake) {
						allLakesSortedLikeActive.push(lake)
					}
				}
				setActiveLakesInfo(allLakesSortedLikeActive)
				setLastMode(null)
			}
			if (
				!lastMode &&
				active.at(-1) !== activeLakesInfo.map(el => el.id).at(-1)
			) {
				const info = Object.entries(information).filter(([id]) => {
					return active.includes(id)
				})
				const lakesIdName = info
					.map(([id, { name }]) => ({ id, name }))
					.filter(el => el.id === active.at(-1))[0]
				const activeLakesInfoId = activeLakesInfo?.map(el => el.id)
				// const allLakesSortedLikeActive = []
				// for (const id of active) {
				// 	const lake = allLakesActiveIdName.find(el => el.id === id)
				// 	if (lake) {
				// 		allLakesSortedLikeActive.push(lake)
				// 	}
				// }
				if (!activeLakesInfoId.includes(lakesIdName.id)) {
					setActiveLakesInfo([...activeLakesInfo, lakesIdName])
					setLastMode(null)
				}
			}
			if (lastMode === DurationTypes.YEAR) {
				const info = Object.entries(information).filter(([id]) => {
					return active.includes(id)
				})
				const allLakesActiveIdName = info
					.map(([id, { name }]) => ({ id, name }))
					.filter(el => active.includes(el.id))
				setActiveLakesInfo(allLakesActiveIdName)
			}

			if (!lastMode && activeLakesInfo.length > active.length) {
				const activeLakesInfoFiltered = activeLakesInfo.filter(lake =>
					active.includes(lake.id)
				)
				setActiveLakesInfo(activeLakesInfoFiltered)
			}
			setLastMode(null)
		}
	}, [YEAR, VOLUME, active, data, information])

	const clearSelection = useCallback(() => {
		dispatch(clearActiveLakes())
		dispatch(resetLakechartOptions())
		dispatch(resetYearschartOptions())
		dispatch(resetModeVolume())
	}, [dispatch, YEAR])

	return {
		clearSelection,
		VOLUME,
		activeLakesInfo,
		showInfo,
	}
}
