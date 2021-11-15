export const STACK_REALM_PATH = 'stack-realm.path';

export const STACK_LIST_ROW_PK = 'STACK_LIST_ROW';
export const TIMESTAMP_COLUMN_NAME = 'timestamp';

const STACK_SCHEMA_SUFFIX: string = 'STACK';
const SNAPSHOT_SCHEMA_SUFFIX: string = 'SNAPSHOT';
export const SCHEMA_SUFFIX_DELIMITER: string = '_';
export const getStackSchemaName = (stackName: string) => `${stackName}${SCHEMA_SUFFIX_DELIMITER}${STACK_SCHEMA_SUFFIX}`;
export const getSnapshotSchemaName = (stackName: string) => `${stackName}${SCHEMA_SUFFIX_DELIMITER}${SNAPSHOT_SCHEMA_SUFFIX}`;
