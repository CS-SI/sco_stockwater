import { csv } from 'd3'
import { formatValue } from './value'
import { getAttributesFilepath } from './config'
const getDataFormalized = async (path, unit) => {
  const raw = await csv(path).catch(err => console.error(err))
  const formalized = formatValue(raw, unit)
  return formalized
}

export { getDataFormalized }
