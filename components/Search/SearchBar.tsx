import React, { FC } from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import { useOnClickOutsideComponent } from '../../hooks';

import { Column, Row } from '../Flex';

type SearchBarProps = {
    placeholder: string;
    inputValue: string;
    setInputValue: (newValue: string) => void;
    LeftComponent: FC;
    DropdownComponent: FC;
    RightComponent: FC;
};
export const SearchBar: FC<SearchBarProps> = (props) => {
    const { placeholder, inputValue, setInputValue, LeftComponent, DropdownComponent, RightComponent } = props;

    const { ref, clickedInside } = useOnClickOutsideComponent('search-bar-test-id');

    const shouldDisplayDropdown = !!clickedInside && !!DropdownComponent;

    return (
        <Row ref={ref}>
            <Text>Start</Text>
            <LeftComponent />

            <Column>
                <StyledTextInput bottomRounded={!shouldDisplayDropdown} placeholder={placeholder} value={inputValue} onChangeText={setInputValue} />

                {shouldDisplayDropdown && <DropdownComponent />}
            </Column>

            <RightComponent />
            <Text>End</Text>
        </Row>
    );
};

type StyledTextInputProps = {
    bottomRounded: boolean;
};
const StyledTextInput = styled.TextInput<StyledTextInputProps>`
    padding: 0px 10px;

    border-width: 1px;
    border-radius: 10px;
    ${({ bottomRounded }: StyledTextInputProps) => (bottomRounded ? `` : `border-bottom-left-radius: 0px;`)}
    ${({ bottomRounded }: StyledTextInputProps) => (bottomRounded ? `` : `border-bottom-right-radius: 0px;`)}
    border-color: #d0d0d0;
`;
