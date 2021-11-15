import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent } from 'react-native';

import { useClickListener } from '../contexts';

export const useOnClickOutsideComponent = (listenerId: string) => {
    const [clickedInside, setClickedInside] = useState(false);
    const [clickedInsideCount, setClickedInsideCount] = useState(0);

    const ref = useRef();
    const ctxt = useClickListener();
    if (!ctxt) console.log('nope');
    if (!ctxt) throw new Error('ClickListener is undefined');
    const { addClickListener, rmClickListener } = ctxt;

    const handleClick = useCallback((e: GestureResponderEvent) => {
        // Clicked
        // console.log(e.target);
        console.log('check this');
        console.log(ref.current._children);
        if (ref && ref.current && ref.current._children && ref.current._children.includes(e.target)) {
            console.log('INSIIIIIIDE');
            setClickedInside(true);
            setClickedInsideCount(clickedInsideCount + 1);

            console.log(clickedInside);
        }
        // Clicked outside
        else {
            reset();
            console.log('clicked outside');
        }
    }, []);

    useEffect(() => {
        addClickListener(listenerId, handleClick);

        return () => rmClickListener(listenerId);
    }, [addClickListener, handleClick, listenerId, ref, rmClickListener]);

    const reset = () => {
        setClickedInside(false);
        setClickedInsideCount(0);
    };

    return {
        ref,
        clickedInside,
        clickedInsideCount,
        reset,
    };
};
