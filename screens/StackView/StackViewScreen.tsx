import React, { FC, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';
import styled from 'styled-components/native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';

import { Column, Row } from '../../components';
import { useDict } from '../../hooks';
import { getStack, getStackNames, getStackProperties } from '../../realm/readStack';
import { useRealm } from '../../contexts/RealmContext';
import { pushOntoStack } from '../../realm/modifyStack';
import { TIMESTAMP_COLUMN_NAME } from '../../realm/constants';
import { SearchBar } from '../../components';

import { TrieTree } from '../../utils/trieTree';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTrieTree } from '../../hooks/useTrieTree';

export default function TabTwoScreen() {
    const [searchText, setSearchText] = useState<string>('');
    const { trieTree: searchEngine, reset: updateSearchEngine } = useTrieTree();

    const [focusedStack, setFocusedStack] = useState<string>('');
    const { dict: selectedPool, add: addToSelectedPool, reset: resetSelectedPool } = useDict({});

    const { dict: focusedSnapshot, add: buildFocusedSnapshot, reset: resetFocusedSnapshot } = useDict({});
    const { realm, loadRealm } = useRealm();

    useEffect(() => {
        updateSearchEngine(getStackNames());
    }, [realm]);

    const handleAddStackToSelectedPool = () => {
        if (!getStackNames().includes(searchText)) return;

        // 1. Reset search text
        setSearchText('');

        // 2. Add to pool
        addToSelectedPool(searchText, searchText);
        // 3. Focus
        handleFocusStack(searchText);
    };

    const handleFocusStack = (stackName: string) => {
        // 1. Manage new focused stack properties
        resetFocusedSnapshot();
        buildFocusedSnapshot(TIMESTAMP_COLUMN_NAME, new Date());

        // 2. Set focused stack
        setFocusedStack(stackName);
    };

    const handleAddSnapshotToFocusedStack = async () => {
        // 1. Push onto stack
        pushOntoStack(realm!, focusedStack!, focusedSnapshot);

        // 2. Reset snapshot
        resetFocusedSnapshot();
    };

    // console.log(!!realm);
    // if (!!selectedStack && !!realm) {
    //     console.log(getStack(realm, selectedStack).list);
    //     console.log('logged');
    // }

    const stackNameSearchSuggestions: string[] = searchEngine.get(searchText);

    console.log('TrieTree:');
    console.log(searchEngine.root);
    console.log(getStackNames());

    return (
        <View style={styles.container}>
            {!getStackNames().includes(searchText) && <Text>{searchText} is not a stack</Text>}
            <SearchBar
                placeholder={'Choose a stack...'}
                inputValue={searchText}
                setInputValue={setSearchText}
                LeftComponent={() => <Text>Left</Text>}
                DropdownComponent={
                    stackNameSearchSuggestions.length > 0
                        ? () => <Dropdown textOptions={stackNameSearchSuggestions} onSelect={(selectedStackName: string) => setSearchText(selectedStackName)} />
                        : undefined
                }
                RightComponent={() => <Button title={'Go'} onPress={handleAddStackToSelectedPool} />}
            />

            {/* SELECTED STACK POOL USEFUL UI */}
            <Column>
                <Text>Focused Stack</Text>
                <Text>{focusedStack}</Text>

                <Text>Selected Stack Pool</Text>
                {Object.keys(selectedPool).map((stackName) => (
                    <StyledSchemaName key={stackName} onPress={() => handleFocusStack(stackName)}>
                        <Text>{stackName}</Text>
                    </StyledSchemaName>
                ))}
            </Column>

            <ScrollView>
                <Text style={styles.title}>Tab Two</Text>
                <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
                <EditScreenInfo path='/screens/TabTwoScreen.tsx' />

                {/* Stack rows */}
                {!!focusedStack && !!realm && getStack(realm, focusedStack).list.map((row) => <Card key={JSON.stringify(row)} data={row} />)}

                <Column>
                    <Text>Select a stack...</Text>
                    <Text>Stacks:</Text>

                    {/* Stack names */}
                    {/* {getStackNames().map((schemaName) => (
                        <StyledSchemaName key={schemaName} onPress={() => handleSelectStack(schemaName)}>
                            <Text>{schemaName}</Text>
                        </StyledSchemaName>
                    ))} */}
                    {/* {get<StyledSchemaName key={stackName} onPress={() => handleAddStackToSelectedPool(stackName)}>
                            <Text>{stackName}</Text>
                        </StyledSchemaName>
                    ))}StackNames().map((stackName) => ( */}

                    {/* Add new entry to stack */}
                    <Column>
                        {!!focusedStack &&
                            Object.entries(getStackProperties(focusedStack)).map(([propertyName, propertyType]) => (
                                <Row key={propertyName}>
                                    <Text>{propertyName}: </Text>
                                    <TextInput
                                        placeholder={'Enter value...'}
                                        value={!!focusedSnapshot[propertyName] ? `${focusedSnapshot[propertyName]}` : undefined}
                                        onChangeText={(value: any) => buildFocusedSnapshot(propertyName, propertyType === 'int' ? Number.parseFloat(value) : value)}
                                        keyboardType={propertyType == 'int' ? 'numeric' : 'default'}
                                    />
                                </Row>
                            ))}
                        <Button title='Add' onPress={handleAddSnapshotToFocusedStack} />
                    </Column>
                </Column>
            </ScrollView>
        </View>
    );
}

type DropdownProps = {
    textOptions: string[];
    onSelect: (option: string) => void;
};
const Dropdown: FC<DropdownProps> = (props) => {
    const { textOptions, onSelect } = props;

    return (
        <View>
            {textOptions.map((textOption: string) => (
                <DropdownRow text={textOption} onPress={() => onSelect(textOption)} />
            ))}
        </View>
    );
};

type DropdownRowProps = {
    text: string;
    onPress: () => void;
};
const DropdownRow: FC<DropdownRowProps> = (props) => {
    const { text, onPress } = props;

    return (
        <TouchableOpacity onPress={onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    );
};

const StyledSchemaName = styled.TouchableOpacity`
    background-color: papayawhip;
`;

type CardProps = {
    data: Realm.Object;
};
const Card: FC<CardProps> = (props) => {
    const { data } = props;

    return (
        <View>
            {data.keys().map((key) => (
                <Text key={key}>
                    {key}: {`${data![key]}`}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
