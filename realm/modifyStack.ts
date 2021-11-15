import { Dict } from '../types-data-structure';
import { TIMESTAMP_COLUMN_NAME } from './constants';
import { getStack } from './readStack';

export const pushOntoStack = (realm: Realm, stackName: string, snapshot: Dict<any>): void => {
    // 1. Get Stack
    const stack: StackRow & Realm.Object = getStack(realm, stackName);

    // 2. Append timestamp to snapshot
    const formatedSnapshot: StackSnapshotRow = {
        ...snapshot,
        [TIMESTAMP_COLUMN_NAME]: new Date(),
    };

    // 3. Add snapshot to front of stack
    realm.write(() => {
        stack.list.push(formatedSnapshot);
    });
};
