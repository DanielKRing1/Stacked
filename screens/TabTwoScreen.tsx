import * as React from 'react';
import { Button, ScrollView, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Column, Row } from '../components';
import { Dict } from '../types-data-structure';
import { useDict } from '../hooks';
import { getStack, getStackNames, getStackProperties } from '../realm/readStack';
import { useRealm } from '../contexts/RealmContext';
import { pushOntoStack } from '../realm/modifyStack';
import { TIMESTAMP_COLUMN_NAME } from '../realm/constants';
import { SearchBar } from '../components';

export default function TabTwoScreen() {
    const [selectedStack, setSelectedStack] = useState<string>();

    const { dict, add, reset } = useDict({});
    const { realm, loadRealm } = useRealm();

    const handleSelectStack = (schemaName: string) => {
        reset();
        add(TIMESTAMP_COLUMN_NAME, new Date());

        setSelectedStack(schemaName);
    };

    const addToStack = async () => {
        pushOntoStack(realm!, selectedStack!, dict);
        // reset();
    };

    // console.log(realm);

    if (!!selectedStack) console.log(getStackProperties(selectedStack));
    console.log(dict);

    console.log(!!selectedStack);
    console.log(!!realm);
    if (!!selectedStack && !!realm) {
        console.log(getStack(realm, selectedStack).list);
        console.log('logged');
    }

    const [searchValue, setSearchValue] = useState<string>('');

    return (
        <View style={styles.container}>
            <SearchBar
                placeholder={'Choose a stack...'}
                inputValue={searchValue}
                setInputValue={setSearchValue}
                LeftComponent={() => <Text>Left</Text>}
                DropdownComponent={() => <Text>Dropdown</Text>}
                RightComponent={() => <Text>Right</Text>}
            />

            <ScrollView>
                <Text style={styles.title}>Tab Two</Text>
                <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
                <EditScreenInfo path='/screens/TabTwoScreen.tsx' />

                {/* Stack rows */}
                {!!selectedStack && !!realm && getStack(realm, selectedStack).list.map((row) => <Card key={JSON.stringify(row)} data={row} />)}

                <Column>
                    <Text>Select a stack...</Text>
                    <Text>Stacks:</Text>

                    {/* Stack names */}
                    {/* {getStackNames().map((schemaName) => (
                        <StyledSchemaName key={schemaName} onPress={() => handleSelectStack(schemaName)}>
                            <Text>{schemaName}</Text>
                        </StyledSchemaName>
                    ))} */}
                    {getStackNames().map((schemaName) => (
                        <StyledSchemaName key={schemaName} onPress={() => handleSelectStack(schemaName)}>
                            <Text>{schemaName}</Text>
                        </StyledSchemaName>
                    ))}

                    {/* Add new entry to stack */}
                    <Column>
                        {!!selectedStack &&
                            Object.entries(getStackProperties(selectedStack)).map(([propertyName, propertyType]) => (
                                <Row key={propertyName}>
                                    <Text>{propertyName}: </Text>
                                    <TextInput
                                        placeholder={'Enter value...'}
                                        value={!!dict[propertyName] ? `${dict[propertyName]}` : undefined}
                                        onChangeText={(value: any) => add(propertyName, propertyType === 'int' ? Number.parseFloat(value) : value)}
                                        keyboardType={propertyType == 'int' ? 'numeric' : 'default'}
                                    />
                                </Row>
                            ))}
                        <Button title='Add' onPress={addToStack} />
                    </Column>
                </Column>
            </ScrollView>
        </View>
    );
}

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
