import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent } from 'react-native';

import { useClickListener } from '../contexts';

export const useOnClickOutsideComponent = (listenerId: string) => {
    console.log('heree0.125');

    const [clickedInside, setClickedInside] = useState(false);
    console.log('heree0.25');

    const [clickedInsideCount, setClickedInsideCount] = useState(0);

    console.log('heree0.5');

    const ref = useRef();
    const ctxt = useClickListener();
    if (!ctxt) console.log('nope');
    if (!ctxt) throw new Error('ClickListener is undefined');
    const { addClickListener, rmClickListener } = ctxt;

    console.log('heree1');

    const handleClick = useCallback(
        (e: GestureResponderEvent) => {
            // Clicked inside
            if (ref && ref.current && ref.current.contains(e.target)) {
                setClickedInside(true);
                setClickedInsideCount(clickedInsideCount + 1);

                console.log(clickedInside);
            }
            // Clicked outside
            else {
                reset();
                console.log('clicked outside');
            }
        },
        [clickedInsideCount]
    );

    console.log('heree2');

    useEffect(() => {
        console.log('heree5');

        addClickListener(listenerId, handleClick);

        console.log('heree6');

        return () => rmClickListener(listenerId);
    }, [addClickListener, handleClick, listenerId, ref, rmClickListener]);

    console.log('heree3');

    const reset = () => {
        setClickedInside(false);
        setClickedInsideCount(0);
    };

    console.log('heree4');

    return {
        ref,
        clickedInside,
        clickedInsideCount,
        reset,
    };
};
