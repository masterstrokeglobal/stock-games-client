const stocksToTrack = ["Alibaba"];

const stocksToTrackLowerCase = stocksToTrack.map(stock => stock.toLowerCase());

const stockTracker: Record<string, {
    lastSeen: Date,
    count: number,
    firstSeen?: Date,
    lastData?: any[]
}> = {};

const allSeenShares: Record<string, {
    count: number,
    lastSeen: Date,
    lastData?: any[]
}> = {};

// ✅ Collect all received stock names (for logging)
const allReceivedStockNames: string[] = [];

// Initialize tracking
stocksToTrack.forEach(stock => {
    stockTracker[stock] = { lastSeen: new Date(0), count: 0 };
});

// Handle incoming data
function processWebsocketData(data: any[][]): void {
    const now = new Date();

    data.forEach(stockArray => {
        if (stockArray && stockArray.length > 0) {
            const stockName = stockArray[0];

            // ✅ Collect the stock name
            allReceivedStockNames.push(stockName);

            if (!allSeenShares[stockName]) {
                allSeenShares[stockName] = {
                    count: 0,
                    lastSeen: now
                };
                console.log(`New share discovered in stream: ${stockName}`);
            }

            allSeenShares[stockName].count++;
            allSeenShares[stockName].lastSeen = now;
            allSeenShares[stockName].lastData = stockArray;

            const stockNameLower = stockName.toLowerCase();
            const indexInTracking = stocksToTrackLowerCase.indexOf(stockNameLower);

            if (indexInTracking >= 0) {
                const originalStockName = stocksToTrack[indexInTracking];
                const trackInfo = stockTracker[originalStockName];
                trackInfo.lastSeen = now;
                trackInfo.count++;
                trackInfo.lastData = stockArray;

                if (!trackInfo.firstSeen) {
                    trackInfo.firstSeen = now;
                }

                console.log(`Received data for tracked stock ${originalStockName} at ${now.toISOString()}`);
            }
        }
    });
}

// Final report
function generateFinalReport(): void {
    const now = new Date();
    const startTime = new Date(now.getTime() - 60 * 1000);

    console.log("\n=== FINAL STOCK TRACKING REPORT ===");
    console.log(`Tracking period: ${startTime.toISOString()} to ${now.toISOString()}`);

    let seenCount = 0;
    let missingCount = 0;

    console.log("\nTRACKED STOCKS RECEIVED DURING TRACKING PERIOD:");

    const sortedStocks = Object.keys(stockTracker).sort((a, b) => {
        return stockTracker[b].count - stockTracker[a].count;
    });

    sortedStocks.forEach(stock => {
        const trackInfo = stockTracker[stock];

        if (trackInfo.count > 0) {
            seenCount++;
            console.log(`✓ ${stock} - seen ${trackInfo.count} times (first: ${trackInfo.firstSeen?.toISOString()}, last: ${trackInfo.lastSeen.toISOString()})`);
            if (trackInfo.lastData) {
                const dataStr = `   Last values: Open=${trackInfo.lastData[2]}, High=${trackInfo.lastData[5]}, Low=${trackInfo.lastData[6]}, Close=${trackInfo.lastData[8]}`;
                console.log(dataStr);
            }
        } else {
            missingCount++;
            console.log(`✗ ${stock} - never seen in stream`);
        }
    });

    console.log("\nSUMMARY OF TRACKED STOCKS:");
    console.log(`- ${seenCount} tracked stocks received during the tracking period`);
    console.log(`- ${missingCount} tracked stocks missing from the stream`);
    console.log(`- ${stocksToTrack.length} total stocks being tracked`);

    // All shares seen
    console.log("\n=== ALL SHARES SEEN IN STREAM ===");
    const allSharesSorted = Object.keys(allSeenShares).sort((a, b) => {
        return allSeenShares[b].count - allSeenShares[a].count;
    });

    console.log(`Total unique shares seen: ${allSharesSorted.length}`);
    
    console.log("\nFREQUENCY LIST (most frequent first):");
    allSharesSorted.forEach(share => {
        const info = allSeenShares[share];
        console.log(`- ${share}: seen ${info.count} times (last seen: ${info.lastSeen.toISOString()})`);
        const isTracked = stocksToTrackLowerCase.includes(share.toLowerCase());
        if (!isTracked) {
            console.log(`  [NOTE: This share is not in your tracking list]`);
        }
    });

    // ✅ Log all stock names that came in
    const uniqueReceivedStocks = Array.from(new Set(allReceivedStockNames));
    console.log("\n=== ALL STOCK NAMES RECEIVED ===");
    console.log(JSON.stringify(allReceivedStockNames, null, 2));
    console.log(`\nTotal received entries: ${allReceivedStockNames.length}`);

    console.log("\n=== UNIQUE STOCK NAMES RECEIVED ===");
    console.log(JSON.stringify(uniqueReceivedStocks, null, 2));
    console.log(`\nTotal unique stock names received: ${uniqueReceivedStocks.length}`);
}

// Parse WebSocket line
function parseWebSocketMessage(message: string): any[][] | null {
    try {
        const match = message.match(/> RECEIVED: (\[\[.*\]\])/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        return null;
    } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        return null;
    }
}

// Run for 1 minute
function startOneMinuteTracking(): void {
    const startTime = new Date();
    console.log(`[${startTime.toISOString()}] Connecting to WebSocket at ws://78.46.93.146:8089`);
    console.log("Will track for exactly one minute...");

    const ws = new WebSocket("ws://78.46.93.146:8089");

    const timer = setTimeout(() => {
        console.log("\n[ONE MINUTE ELAPSED - STOPPING TRACKING]");
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
        generateFinalReport();
    }, 60000 * 5);

    ws.onopen = () => {
        const connectedTime = new Date();
        console.log(`[${connectedTime.toISOString()}] WebSocket connection established`);
        console.log("Starting to track stocks...");
    };

    ws.onmessage = (event) => {
        try {
            const rawData = event.data;
            console.log(`Raw data received: ${rawData}`);
            const parsedData = JSON.parse(rawData);
            if (Array.isArray(parsedData)) {
                processWebsocketData(parsedData);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
        console.log(`WebSocket connection closed: Code ${event.code} - ${event.reason || "No reason provided"}`);
        const currentTime = new Date();
        const elapsedTime = (currentTime.getTime() - startTime.getTime()) / 1000;
        if (elapsedTime < 60) {
            console.log(`Connection closed after ${elapsedTime.toFixed(1)} seconds (before one minute elapsed)`);
            clearTimeout(timer);
            generateFinalReport();
        }
    };
}

// Start tracking
startOneMinuteTracking();
