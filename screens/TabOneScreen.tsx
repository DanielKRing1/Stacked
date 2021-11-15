import * as React from 'react';
import { Button, Picker, ScrollView, StyleSheet, TextInput } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import re from 'realm';
import DynamicRealm from 'dynamic-realm';
import styled from 'styled-components/native';
import { Column, Row } from '../components';
import { useState } from 'react';
import { Dict } from '../types-data-structure';
import { useList } from '../hooks';
import { useRealm } from '../contexts/RealmContext';
import { getStack } from '../realm/readStack';
import { createStack } from '../realm/createRealm';
import { ClickListenerContext } from '../contexts';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
    const testKey = 'my property';

    const { realm, loadRealm } = useRealm();

    const [stackName, setStackName] = useState('');
    type StackProperty = {
        propertyName: string;
        type: string;
    };
    const { list, setList, reset, push, pop, replace, rm } = useList<StackProperty>([]);

    const createSchema = (name: string, properties: Dict<any>): Realm.ObjectSchema => {
        const realmSchema: Realm.ObjectSchema = {
            name,
            properties,
            // properties: {
            //     name: 'string',
            //     data: 'string',
            // },
        };

        return realmSchema;
    };

    const handleSaveSchema = async () => {
        const properties: Dict<string> = {};
        list.forEach((entry: StackProperty) => (properties[entry.propertyName] = entry.type));
        const newRealm: Realm = await createStack(realm!, stackName, properties);

        // TODO Expose setRealm from RealmContext
        // Set realm instead of loading realm

        loadRealm();
    };

    // let r;

    // const DYNAMIC_SCHEMA_NAME = 'DynamicSchemas';
    // const test = async () => {
    //     const DynamicSchema_S = {
    //         name: DYNAMIC_SCHEMA_NAME,
    //         primaryKey: 'name',
    //         properties: {
    //             name: 'string',
    //             schema: 'string',
    //             metadata: 'string',
    //         },
    //     };

    //     const DYNAMIC_REALM_NAME = 'DynamicRealms';
    //     const DynamicRealm_S = {
    //         name: DYNAMIC_REALM_NAME,
    //         primaryKey: 'realmPath',
    //         properties: {
    //             realmPath: 'string',
    //             schemaNames: 'string[]',
    //             schemaVersion: { type: 'int', default: 0 },
    //         },
    //     };

    //     console.log('TEST OUTPUT');
    //     console.log(re);
    //     r = new re({ schema: [DynamicRealm_S, DynamicSchema_S] });
    //     console.log('test realm');
    //     console.log(r);
    //     console.log('test realm done');

    //     // r.write(() => {
    //     //     const newObj = r.create(DYNAMIC_SCHEMA_NAME, { name: `my name ${Math.random()}`, schema: 'my schema', metadata: 'my metadata' });

    //     //     console.log('test created object');
    //     //     console.log(newObj);
    //     //     console.log(newObj.keys);
    //     //     console.log(newObj.toJSON());
    //     // });

    //     console.log('test all objects');
    //     try {
    //         const a = r.objects(DYNAMIC_SCHEMA_NAME);
    //         console.log(r.schema);
    //         console.log(a);
    //         console.log(a.length);
    //         console.log(a[0]);
    //         console.log(Object.keys(r));
    //         console.log(Object.entries(r));
    //         console.log(r);
    //         console.log(r.objects);
    //         console.log('success');
    //     } catch (err) {
    //         console.log('failure');
    //         console.log(err);
    //     }
    // };

    // test();
    // console.log('done');

    //     TEST OUTPUT
    // test realm
    // Object {}
    // test realm done
    // done

    //     TEST OUTPUT
    // test realm
    // Object {}
    // test realm done
    // test created object
    // Object {}
    // test all objects
    // done

    console.log(DynamicRealm.getSchemaNames());

    const { addClickListener, rmClickListener } = React.useContext(ClickListenerContext);

    React.useEffect(() => {
        console.log('adding');
        addClickListener('abc', () => console.log('hihi'));
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* {!!realm && getStack(realm, 'My Stack 1').list.map((obj) => <Text>{JSON.stringify(obj)}</Text>)} */}
                <Text style={styles.title}>Tab One</Text>
                <View style={styles.separator} lightColor='#eee' darkColor='rgba(255,255,255,0.1)' />
                <EditScreenInfo path='/screens/TabOneScreen.tsx' />

                <MetadataView>
                    <Column>
                        {DynamicRealm.getRealmNames().map((realmName) => (
                            <StyledRealmName key={realmName}>{realmName}</StyledRealmName>
                        ))}

                        {DynamicRealm.getSchemaNames().map((schemaName) => (
                            <StyledSchemaName key={schemaName}>{schemaName}</StyledSchemaName>
                        ))}

                        {!!DynamicRealm.getSchemaNames() && DynamicRealm.getSchemaNames().length > 0 && (
                            <StyledSchemaProperties>{JSON.stringify(DynamicRealm.getProperties(DynamicRealm.getSchemaNames()[0]))}</StyledSchemaProperties>
                        )}
                    </Column>
                </MetadataView>

                <InputView>
                    <Column>
                        <TextInput placeholder={'New stack name...'} value={stackName} onChangeText={setStackName} />
                        {list.map((entry, i) => (
                            <Row key={`${entry}-${i}`}>
                                <Row>
                                    <Text>Property name: </Text>
                                    <TextInput
                                        placeholder={'New property name...'}
                                        value={entry.propertyName}
                                        onChangeText={(itemValue) => replace(i, { propertyName: itemValue, type: entry.type })}
                                    />
                                </Row>
                                <Picker
                                    selectedValue={entry.type}
                                    style={{ height: 50, width: 150 }}
                                    onValueChange={(itemValue, itemIndex) => replace(i, { propertyName: entry.propertyName, type: itemValue })}
                                >
                                    <Picker.Item label='int' value='int' />
                                    <Picker.Item label='string' value='string' />
                                </Picker>
                            </Row>
                        ))}
                        <Button title={'Add new property'} onPress={() => push({ propertyName: '', type: 'int' })} />
                    </Column>
                    <Button title={'Create new stack'} onPress={handleSaveSchema} />
                </InputView>
            </ScrollView>
        </View>
    );
}

const MetadataView = styled.ScrollView``;
const InputView = styled.ScrollView``;
const StyledRealmName = styled.Text`
    background-color: papayawhip;
`;
const StyledSchemaName = styled.Text`
    background-color: papayawhip;
`;
const StyledSchemaProperties = styled.Text`
    background-color: papayawhip;
`;

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
