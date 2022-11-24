import { AppConfig, DataTypes, ObservationTypes } from '../config'
const getAttributesFilepath = dataName => {
  return AppConfig.attributes[DataTypes[dataName]].filePath
}

const getAttributesUnit = dataName => {
  return AppConfig.attributes[DataTypes[dataName]].unit
}

const getObservationTypesAbbr = obsName => {
  return AppConfig.observationTypes[ObservationTypes[obsName]].abbr
}

const getDurationAbbr = durationName => {
  return AppConfig.duration[durationName].abbr
}

const concatDataTypeObsDepthByYear = (dataType, obsDepth) => {
  const dataName = dataType.toLowerCase().replace(/_(.)/g, (match, group1) => {
    return group1.toUpperCase()
  })
  const obsName = obsDepth.toLowerCase().replace(/^(.)/, (match, group1) => {
    return group1.toUpperCase()
  })
  return `${dataName}${obsName}ByYear`
}
export {
  getAttributesFilepath,
  getAttributesUnit,
  getObservationTypesAbbr,
  getDurationAbbr,
  concatDataTypeObsDepthByYear,
}
