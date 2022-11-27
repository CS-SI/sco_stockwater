import { AppConfig } from './../config'
export const getSeriePathByAttribute = (serie, attribute) => {
  return serie.filter(el => el.includes(attribute))
}

export const getSeriePathByObsTypeAndObsDepth = (serie, obsType, obsDepth) => {
  return serie.filter(el => el.includes(`${obsType}${obsDepth}`))
}

export const getSeriePath = (seriePath, form) => {
  const { dataType, DAY, PERIOD } = form
  const allSeriePaths = seriePath
    .filter(path => {
      return (
        path.includes(dataType.toLowerCase()) ||
        path.includes(AppConfig.observationTypes['REFERENCE'].abbr)
      )
    })
    .map(path => {
      const tmp = []
      if (
        DAY &&
        path.includes(
          `${AppConfig.observationTypes['RADAR'].abbr}${AppConfig.duration['DAY'].abbr}`
        )
      ) {
        tmp.push(path)
      }
      if (
        PERIOD &&
        path.includes(
          `${AppConfig.observationTypes['RADAR'].abbr}${AppConfig.duration['PERIOD'].abbr}`
        )
      ) {
        tmp.push(path)
      }
      if (
        DAY &&
        path.includes(
          `${AppConfig.observationTypes['OPTIC'].abbr}${AppConfig.duration['DAY'].abbr}`
        )
      ) {
        tmp.push(path)
      }
      if (
        PERIOD &&
        path.includes(
          `${AppConfig.observationTypes['OPTIC'].abbr}${AppConfig.duration['PERIOD'].abbr}`
        )
      ) {
        tmp.push(path)
      }
      if (path.includes(AppConfig.observationTypes['REFERENCE'].abbr)) {
        tmp.push(path)
      }
      return tmp
    })
  return allSeriePaths.filter(path => path.length > 0).flatMap(path => path)
}
