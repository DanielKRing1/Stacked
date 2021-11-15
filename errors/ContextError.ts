export const outsideProviderError = (hookName: string, contextName: string) => new Error(`${hookName} must be used within a ${contextName} provider`);
export const undefinedRealmError = () => new Error(`RealmContext's 'realm' value is undefined`);
