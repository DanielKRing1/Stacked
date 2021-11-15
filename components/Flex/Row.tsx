import * as React from 'react';
import styled from 'styled-components/native';

export function Row(props: any) {
    return <StyledView {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

const StyledView = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;
