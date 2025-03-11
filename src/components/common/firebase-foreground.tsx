'use client'
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '../../firebase';
import { useEffect } from 'react';
import useFcmToken from '@/hooks/use-fcm-hooks';
import { useSaveToken } from '@/react-query/admin-queries';

export default function FcmTokenComp() {
    const { fcmToken, notificationPermissionStatus } = useFcmToken();
    const { mutate } = useSaveToken();

    useEffect(() => {
        if (fcmToken && notificationPermissionStatus === 'granted') {
            mutate(fcmToken);
        }
    }, [fcmToken, notificationPermissionStatus]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            if (notificationPermissionStatus === 'granted') {
                const messaging = getMessaging(firebaseApp);
                const unsubscribe = onMessage(messaging, (payload) => console.log('Foreground push notification received:', payload));
                return () => {
                    unsubscribe(); // Unsubscribe from the onMessage event on cleanup
                };
            }
        }
    }, [notificationPermissionStatus]);

    return null; // This component is primarily for handling foreground notifications
}