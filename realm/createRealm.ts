import DynamicRealm from 'dynamic-realm';

import { Dict } from '../types-data-structure';
import { getSnapshotSchemaName, TIMESTAMP_COLUMN_NAME, getStackSchemaName, STACK_LIST_ROW_PK, STACK_REALM_PATH } from './constants';

type StackSchemas = {
    snapshotSchema: Realm.ObjectSchema;
    stackSchema: Realm.ObjectSchema;
};
const genStackSchemas = (stackName: string, snapshotProperties: Dict<any>): StackSchemas => {
    // 1. Create snapshot schema, adding timestamp
    const snapshotSchema: Realm.ObjectSchema = {
        name: getSnapshotSchemaName(stackName),
        properties: {
            ...snapshotProperties,
            [TIMESTAMP_COLUMN_NAME]: 'date',
        },
    };

    // 2. Create stack schema, linking the snapshot schema
    const stackSchema: Realm.ObjectSchema = {
        name: getStackSchemaName(stackName),
        primaryKey: 'name',
        properties: {
            name: 'string',
            list: `${getSnapshotSchemaName(stackName)}[]`,
        },
    };

    return {
        snapshotSchema,
        stackSchema,
    };
};

export const createStack = async (realm: Realm, stackName: string, snapshotProperties: Dict<any>): Promise<Realm> => {
    realm.close();

    const { snapshotSchema, stackSchema } = genStackSchemas(stackName, snapshotProperties);

    // 1. Save Snapshot schema to DynamicRealm
    DynamicRealm.saveSchema({ realmPath: STACK_REALM_PATH, schema: snapshotSchema });

    // 2. Save Stack schema to DynamicRealm
    DynamicRealm.saveSchema({ realmPath: STACK_REALM_PATH, schema: stackSchema });

    // 3. Create stack row in Stack schema
    const newRealm: Realm = await DynamicRealm.loadRealm(STACK_REALM_PATH);
    newRealm.write(() => {
        newRealm.create(stackSchema.name, {
            name: STACK_LIST_ROW_PK,
            list: [],
        });
    });

    return newRealm;
};
