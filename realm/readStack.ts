import DynamicRealm from 'dynamic-realm';

import { binarySearch } from '../utils/binarySearch';
import { TIMESTAMP_COLUMN_NAME, STACK_LIST_ROW_PK, STACK_REALM_PATH, SCHEMA_SUFFIX_DELIMITER, getSnapshotSchemaName, getStackSchemaName } from './constants';
import { MISSING_STACK_ROW_ERROR } from './errors';

export const getStackNames = (): string[] => {
    const schemaNames: Set<string> = new Set<string>();

    // 1. Get all schema names
    const allSchemaNames: string[] = DynamicRealm.getSchemaNames(STACK_REALM_PATH);

    // 2. Remove schema name suffix and add to set (removes duplicate StackList and StackSnapshot schema names)
    allSchemaNames.forEach((schemaName) => {
        // 2.1. Remove suffix
        const index: number = schemaName.lastIndexOf(SCHEMA_SUFFIX_DELIMITER);
        const vanillaSchemaName: string = schemaName.slice(0, index);

        // 2.2. Add to set
        schemaNames.add(vanillaSchemaName);
    });

    return [...schemaNames];
};

export const getStackProperties = (stackName: string): Realm.PropertiesTypes => {
    return DynamicRealm.getProperties(getSnapshotSchemaName(stackName));
};

export const getStack = (realm: Realm, stackName: string): StackRow & Realm.Object => {
    // console.log(realm);
    // console.log('oooooo');
    stackName = getStackSchemaName(stackName);
    const stack: (StackRow & Realm.Object) | undefined = realm.objectForPrimaryKey(stackName, STACK_LIST_ROW_PK);
    // console.log(realm.objects(stackName));
    // console.log(stack);
    if (!stack) throw MISSING_STACK_ROW_ERROR(stackName);

    return stack;
};

export const getClosestDate = (realm: Realm, stackName: string, searchDate: Date): number => {
    // 1. Get Stack
    const stack: StackRow & Realm.Object = getStack(realm, stackName);
    const list: Realm.List<StackSnapshotRow> = stack.list;

    // EDGE CASES

    // 2. No dates gte searchDate
    if (list.length > 0 && list[0][TIMESTAMP_COLUMN_NAME] < searchDate) return -1;

    // 3. All dates gte searchDate
    if (list.length > 0 && list[list.length - 1].date > searchDate) return list.length - 1;

    // 4. Binary search
    return getDateInStackGTE(searchDate, list);
};

function getDateInStackGTE(searchDate: Date, list: Realm.List<StackSnapshotRow>): number {
    const comparator = (midValue: StackSnapshotRow, searchDate: Date): -1 | 0 | 1 => {
        if (searchDate === midValue[TIMESTAMP_COLUMN_NAME]) return 0;
        else if (searchDate < midValue[TIMESTAMP_COLUMN_NAME]) return 1;
        else return -1;
    };

    return binarySearch<StackSnapshotRow>(searchDate, <any>list, comparator, 0, list.length - 1);
}
