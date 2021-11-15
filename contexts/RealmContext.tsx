import React, { FC, useContext, useEffect, useState } from 'react';
import DynamicRealm from 'dynamic-realm';
import realm from 'realm';

import { STACK_REALM_PATH } from '../realm/constants';
import { outsideProviderError, undefinedRealmError } from '../errors/ContextError';

type RealmContext = {
    realm: Realm | undefined;
    loadRealm: () => Promise<void>;
};
const RealmContext = React.createContext<RealmContext | undefined>(undefined);

export const RealmProvider: FC<any> = (props) => {
    const { children } = props;

    // 1. Init DynamicRealm
    useEffect(() => {
        const init = async () => {
            await DynamicRealm.init({});
        };

        init();
    }, []);

    // 2. Create realm variables + modifiers
    const [realm, setRealm] = useState<Realm>();
    const loadRealm = async () => {
        if (!!realm) await realm.close();
        console.log('a');
        const newRealm: Realm = await DynamicRealm.loadRealm(STACK_REALM_PATH);
        // newRealm.write(() => {
        //     newRealm.deleteAll();
        // });
        console.log('b');
        setRealm(newRealm);
        console.log('c');
    };

    // 3. Return ContextProvider
    const value = {
        realm,
        loadRealm,
    };
    return <RealmContext.Provider value={value}>{children}</RealmContext.Provider>;
};

// Export hook for accessing realm and modifier
export const useRealm = () => {
    const context = useContext(RealmContext);

    if (!context) throw outsideProviderError('useRealm', 'RealmContext');
    return context;
};
