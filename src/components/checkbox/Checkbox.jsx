import useCheckboxHook from './CheckboxHook'
import { styled, theme } from '@/stitches.config'
import { PropTypes } from 'prop-types'

const Container = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

const Input = styled('input', {
  accentColor: 'blue',
})

const Label = styled('label', {
  fontFamily: 'sans-serif',
  fontSize: theme.fontSizes.base,
  marginLeft: theme.space.xs,
})

export const Checkbox = ({ id, label, abbr, storeAction, value, disabled }) => {
  const { isChecked, onChange } = useCheckboxHook({
    storeAction,
    value,
  })
  return (
    <Container>
      <Input
        type="checkbox"
        id={id}
        onChange={onChange}
        value={abbr}
        checked={isChecked}
        disabled={disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </Container>
  )
}
Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  abbr: PropTypes.string.isRequired,
  storeAction: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
}
