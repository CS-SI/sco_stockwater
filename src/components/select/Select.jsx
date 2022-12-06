import useSelectHook from './SelectHook'
import { PropTypes } from 'prop-types'
import { styled, theme } from '@/stitches.config'
const StyledSelect = styled('select', {
  fontFamily: 'sans-serif',
  fontSize: theme.fontSizes.base,
  width: '100%',
})

export const Select = ({ id, value, children, setAttributeValue }) => {
  const { onChange } = useSelectHook(setAttributeValue)

  return (
    <StyledSelect id={id} onChange={onChange} value={value}>
      {children}
    </StyledSelect>
  )
}
Select.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node.isRequired,
  setAttributeValue: PropTypes.func.isRequired,
}
