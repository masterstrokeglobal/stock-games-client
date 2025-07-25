import { useEffect, useState } from 'react';

const useIsSafari = () => {
    const [isSafari, setIsSafari] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            const ua = navigator.userAgent;
            // Check for Safari (not Chrome or Android)
            const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(ua);
            setIsSafari(isSafariBrowser);
        }
    }, []);

    return isSafari;
};

export default useIsSafari;