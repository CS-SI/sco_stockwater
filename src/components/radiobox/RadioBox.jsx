import useRadioboxHook from './RadioboxHook'
import { styled, theme } from '@/stitches.config'
import { PropTypes } from 'prop-types'

const Label = styled('label', {
  fontFamily: 'sans-serif',
  fontSize: theme.fontSizes.base,
  marginLeft: theme.space.sm,
})
const Input = styled('input', {
  accentColor: 'blue',
})
export const Radiobox = ({ id, label, abbr, storeAction, value, disabled }) => {
  const { isChecked, onChange } = useRadioboxHook({
    storeAction,
    value,
  })
  return (
    <div>
      <Input
        type="radio"
        id={id}
        onChange={onChange}
        value={abbr}
        checked={isChecked}
        disabled={disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
Radiobox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  abbr: PropTypes.string.isRequired,
  storeAction: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
}
