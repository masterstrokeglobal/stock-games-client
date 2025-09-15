"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useEnhancedUserBonusStatus } from "@/react-query/enhanced-bonus-queries";
import { useAuthStore } from "@/context/auth-context";

// Lightweight notifier: shows a toast when new bonus assignments appear.
// Uses localStorage to avoid duplicate notifications per user.
const STORAGE_KEY_PREFIX = "seen-bonus-assignment-ids:";

const BonusNotifier = () => {
    const { isLoggedIn, userDetails } = useAuthStore();
    const userId = userDetails?.id?.toString();
    const storageKey = `${STORAGE_KEY_PREFIX}${userId ?? "guest"}`;

    const { data: enhancedStatus } = useEnhancedUserBonusStatus();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!isLoggedIn || !userId) return;

        // Initialize seen set once
        if (!initializedRef.current) {
            initializedRef.current = true;
            const existing = localStorage.getItem(storageKey);
            if (!existing) localStorage.setItem(storageKey, JSON.stringify([]));
        }
    }, [isLoggedIn, userId, storageKey]);

    useEffect(() => {
        if (!isLoggedIn || !userId) return;

        try {
            const seenRaw = localStorage.getItem(storageKey) || "[]";
            const seen: Array<number | string> = JSON.parse(seenRaw);

            const newAssignments: Array<{ id: number | string; name?: string; bonusName?: string; triggerEvent?: string; directCredit?: boolean; initialBonusAmount?: number }>
                = enhancedStatus?.activeAssignments || [];

            const unseen = newAssignments.filter(a => !seen.includes(a.id));

            if (unseen.length > 0) {
                unseen.forEach((a) => {
                    const displayName = a.bonusName || (a as any).name || "Bonus";
                    const prefix = a.directCredit ? "💰 Direct Credit" : "🎁 New Bonus";
                    const amount = a.initialBonusAmount ? ` +₹${Number(a.initialBonusAmount).toLocaleString()}` : "";
                    const trigger = a.triggerEvent ? ` • ${a.triggerEvent.replace(/_/g, " ")}` : "";
                    toast.success(`${prefix}: ${displayName}${amount}${trigger}`);
                });

                const updated = [...seen, ...unseen.map(u => u.id)];
                localStorage.setItem(storageKey, JSON.stringify(updated.slice(-200)));
            }
        } catch {
            // ignore
        }
    }, [enhancedStatus, isLoggedIn, userId, storageKey]);

    return null;
};

export default BonusNotifier;


