const getSeriePath = (lakeId, lakeName, dataType, obs, duration) => {
  const baseDir = '/sco_stockwater/series/'
  const delimiter = '_'
  return `${baseDir}${lakeId}/${lakeId}${delimiter}${lakeName}${delimiter}${dataType}${delimiter}${obs}${duration}.csv`
}

const getTimeseriesPath = (lakeId, lakeName) => {
  const baseDir = '/sco_stockwater/series/'
  const delimiter = '_'
  const timeseries = 'ZSV_timeseries'
  return `${baseDir}${lakeId}/${lakeId}${delimiter}${lakeName}${delimiter}${timeseries}.csv`
}

export default { getSeriePath, getTimeseriesPath }
