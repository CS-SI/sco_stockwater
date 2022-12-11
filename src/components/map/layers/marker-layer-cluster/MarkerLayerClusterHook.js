import { useState } from 'react'
import { useMapEvents } from 'react-leaflet'
export default function useMarkerLayerClusterHook(data) {
  const coordinates = data.features.map(feature => {
    const { LONG_WW, LAT_WW } = feature.properties
    return [LAT_WW, LONG_WW]
  })
  const DAM_NAME = data.features.map(feat => {
    const { DAM_NAME } = feat.properties
    return DAM_NAME
  })

  const [zoomLevel, setZoomLevel] = useState(null)
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom())
    },
  })

  return { coordinates, zoomLevel, DAM_NAME }
}
