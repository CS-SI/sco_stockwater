import { useMap, useMapEvents } from "react-leaflet"
import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addLake, updateActivelakes } from "@/stores/stateLakeSlice"
import { updateModeVolume } from "../../../../stores/dataSlice"
import { DataTypes, DurationTypes, ModeTypes } from "../../../../config"
import { addLakeChartOptions } from "../../../../stores/lakesChartOptionsSlice"

export default function usePolygonLayerHook() {
	const [color, setColor] = useState("blue")
	const [zoomLevel, setZoomLevel] = useState(null)
	const [containerHeight, setContainerHeight] = useState(null)
	const [coordId, setCoordId] = useState({
		id: "",
		coord: [],
	})
	const [obsDepth, setObsDepth] = useState(null)
	const { VOLUME, DAY, PERIOD } = useSelector((state) => state.form)
	const { active, loaded } = useSelector((state) => state.stateLake)
	const { information } = useSelector((state) => state.information)
	const { lakesChartOptions } = useSelector((state) => state)
	const map = useMap()
	const dispatch = useDispatch()
	const mapEvents = useMapEvents({
		zoomend: () => {
			setZoomLevel(mapEvents.getZoom())
		},
	})

	const resizeMap = useCallback(
		(value) => {
			const container = document.getElementsByClassName("leaflet-container")
			if (container) {
				map.invalidateSize(true)
				container[0].style.height = value
			}
		},
		[map]
	)

	const centerPolygon = useCallback(() => {
		// map.flyTo(coordId.coord)
		map.setView(coordId.coord, 11)
	}, [coordId.coord])

	useEffect(() => {
		if (active.length >= 2) return
		if (active.length === 1 && containerHeight !== "45%") {
			resizeMap("45%")
			setContainerHeight("45%")
		}
		if (active.length === 0 && containerHeight !== "100%") {
			resizeMap("100%")
			setContainerHeight("100%")
		}
	}, [active.length])

	useEffect(() => {
		if (containerHeight === "100%" && coordId.coord.length > 0) {
			map.invalidateSize(true)
			map.setView(coordId.coord, 3)
			map.flyTo(coordId.coord, 3)
		}
	}, [containerHeight])

	useEffect(() => {
		if (!coordId.id) return
		const container = document.getElementsByClassName("leaflet-container")
		if ((container[0].style.height = "45%")) {
			setColor("#CDF0EA")
			centerPolygon()
		}
	}, [coordId.id])

	useEffect(() => {
		if (DAY) {
			setObsDepth(DurationTypes.DAY)
		}
		if (PERIOD) {
			setObsDepth(DurationTypes.PERIOD)
		}
	}, [DAY, PERIOD])

	const centerSelectedPolygon = useCallback(() => {
		if (
			Object.entries(lakesChartOptions)
				.map(([id, { selected }]) => {
					return { id, selected }
				})
				.filter(({ selected }) => selected).length === 0
		)
			return

		const { lakeId } = Object.entries(lakesChartOptions)
			.map(([id, { selected }]) => {
				return { lakeId: id, selected }
			})
			.filter(({ selected }) => selected)[0]

		const { id, lakeCoord } = information[lakeId]
		setCoordId({
			id,
			coord: lakeCoord,
		})
	}, [lakesChartOptions])

	useEffect(() => {
		centerSelectedPolygon()
	}, [centerSelectedPolygon])

	const activeLake = useCallback(
		(id, coordWW) => {
			setCoordId({
				id,
				coord: coordWW,
			})
			dispatch(addLake({ id }))
		},
		[dispatch]
	)

	const updateLake = useCallback(
		(id) => {
			dispatch(updateModeVolume({ id }))
			dispatch(updateActivelakes({ id }))
			dispatch(addLakeChartOptions({ id }))
		},
		[dispatch]
	)
	// useEffect(() => {
	// 	if (!VOLUME) return
	// 	if (VOLUME && dataLakes[coordId.id]?.[DataTypes.VOLUME]) {
	// 		dispatch(updateTotalVolume({ lakeId: coordId.id, obsDepth }))
	// 	}
	// }, [dispatch, dataLakes[coordId.id]])

	return {
		activeLake,
		centerPolygon,
		id: coordId.id,
		color,
		zoomLevel,
		loaded,
		active,
		updateLake,
	}
}
