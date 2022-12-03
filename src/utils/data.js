import { csv } from 'd3'
import { extractField, formatValue, normalizeValue } from './value'
import {
  getAttributesFilepath,
  getAttributesUnit,
  getObservationTypesAbbr,
  getDurationAbbr
} from './config'
import { getSeriePath } from './seriePath'
import { DataTypes } from '../config'
import { getHighestValue } from './math'

const getDataRaw = async (seriePath, form) => {
  const allSeries = getSeriePath(seriePath, form)
  const data = []
  for (const series of allSeries) {
    const res = await csv(series).catch(err => console.error(err))
    data.push(res || [])
  }
  return data
}

const getReferenceSerieDataType = (ZSVseries, dataType) => {
  if (dataType === DataTypes.VOLUME || dataType === DataTypes.FILLING_RATE) {
    return extractField(ZSVseries, 'volume')
  }
  if (dataType === DataTypes.SURFACE) {
    return extractField(ZSVseries, 'area')
  }
}

const getDataFormalized = (dataRaw, dataType) => {
  const unit = getAttributesUnit(dataType)
  return formatValue(dataRaw, unit)
}

const makeFillingRateZSVdata = volumeZSV => {
  const rateRef = getHighestValue(volumeZSV)
  return normalizeValue(volumeZSV, rateRef)
}

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b)
}
export {
  getDataFormalized,
  getDataRaw,
  getReferenceSerieDataType,
  makeFillingRateZSVdata,
  isEqual
}
