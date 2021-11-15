type StackSnapshotRow = Dict<number | string | Date> & {
    [TIMESTAMP_COLUMN_NAME]: Date;
};
type StackRow = {
    name: string;
    list: Realm.List<StackSnapshotRow>;
};
