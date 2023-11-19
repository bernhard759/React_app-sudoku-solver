import styled from 'styled-components'

export const DefaultCheckbox = styled.input.attrs({ type: "checkbox" })`
accent-color: hsl(272, 76%, 52%);
transform: scale(1.5);
margin: 1em;

&:disabled {
    background-color: hsl(272, 76%, 80%);
}
`
