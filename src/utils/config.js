import { AppConfig, DataTypes, ObservationTypes } from '../config'

const getAttributesFilepath = dataName => {
  return AppConfig.attributes[DataTypes[dataName]].filePath
}

const getAttributesUnit = dataName => {
  const { unit } = AppConfig.attributes[DataTypes[dataName]]
  return unit
}

const getObservationTypesAbbr = obsName => {
  return AppConfig.observationTypes[ObservationTypes[obsName]].abbr
}

const getDurationAbbr = durationName => {
  return AppConfig.duration[durationName].abbr
}

export {
  getAttributesFilepath,
  getAttributesUnit,
  getObservationTypesAbbr,
  getDurationAbbr,
}
