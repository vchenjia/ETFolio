import { restClient, GetStocksAggregatesTimespanEnum } from "@massive.com/client-js";
import { getRedis } from "../config/redis.js";

let rest: ReturnType<typeof restClient> | undefined;

export function getClient() {
    if (!rest) {
        const apiKey = process.env.MASSIVE_API_KEY;
        if (!apiKey) { throw new Error('Missing API Key') };
        rest = restClient(apiKey, 'https://api.massive.com');
    }
    return rest;
}

export interface AggregateParams {
    stocksTicker: string;
    multiplier?: number;
    timespan?: GetStocksAggregatesTimespanEnum;
    from?: string;
    to?: string;
    // adjusted?: boolean;
    // sort?: GetStocksAggregatesSortEnum;
    // limit?: number;
}

function getFormattedDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const DEFAULT_AGGREGATE_PARAMS = {
    multiplier: 1,
    timespan: GetStocksAggregatesTimespanEnum.Day,
    from: getFormattedDate(1),
    to: getFormattedDate(),
};


export function getCacheKey(params: Required<AggregateParams>) {
    const { stocksTicker, multiplier, timespan, from, to } = params;
    return `stock:${stocksTicker}:${multiplier}:${timespan}:${from}:${to}`
}


export async function getStock(params: AggregateParams) {
    const rest = getClient();
    const newParams = { ...DEFAULT_AGGREGATE_PARAMS, ...params };
    const cacheKey = getCacheKey(newParams);
    const cached = await getRedis().get(cacheKey); 
    if (cached) { 
        return JSON.parse(cached);
    }
    const response = await rest.getStocksAggregates(newParams);
    await getRedis().set(cacheKey, JSON.stringify(response), 'EX', 300)
    return response;
}


