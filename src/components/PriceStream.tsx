import { usePrice } from "@/app/providers/PriceContextProvider";
import { HermesClient } from "@pythnetwork/hermes-client";
import { useEffect } from "react";

export const usePriceStream = (priceIds: string[]) => {
    const { setPrices } = usePrice();

    useEffect(() => {
        const connection = new HermesClient("https://hermes.pyth.network", {});

        // Create an async function to handle the connection and stream
        const fetchPriceUpdates = async () => {
            const eventSource = await connection.getPriceUpdatesStream(priceIds);

            eventSource.onmessage = (event: MessageEvent) => {
                const priceUpdate = JSON.parse(event.data).parsed; // Assuming the data is in JSON format
                console.log("Received price update:", priceUpdate);
                
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                
                setPrices((prevPrices) => {
                    const updatedPrices = { ...prevPrices };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    priceUpdate.forEach((item) => {
                        updatedPrices[item.id] = item.price.price; // Extracts the specific price value
                    });
                    
                    return updatedPrices;
                });
            };

            eventSource.onerror = (error: Event) => {
                console.error("Error receiving updates:", error);
                eventSource.close();
            };

            // Return the event source for cleanup
            return eventSource;
        };

        // Call the async function
        const eventSourcePromise = fetchPriceUpdates();

        // Cleanup function to close the connection when the component unmounts
        return () => {
            eventSourcePromise.then(eventSource => {
                if (eventSource) {
                    console.log("Closing event source.");
                    eventSource.close();
                }
            });
        };
    }, [priceIds, setPrices]); // Re-run effect if priceIds change
};
