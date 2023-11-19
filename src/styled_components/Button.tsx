import styled from 'styled-components'

export const DefaultButton = styled.button`
background-color: hsl(272, 76%, 52%);
border-radius: 1em;
border: none;
padding-block: 0.5em;
padding-inline: 1em;
color: white;
font-size: 1.15rem;
position: relative;
box-shadow: 1px 1px 0 2px rgba(0,0,0,0.25);
cursor: pointer;

&:hover {
    background-color: hsl(272, 76%, 60%);
}

&:active {
    top: 1px;
    left: 1px;
    box-shadow: 1px 1px 0 0px rgba(0,0,0,0.25);
}

&:disabled {
    background-color: hsl(272, 76%, 80%);
    cursor: default;
}
`
