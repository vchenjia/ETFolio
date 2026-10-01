import { restClient, GetStocksAggregatesTimespanEnum } from "@massive.com/client-js";
import { getRedis } from "../config/redis.js";
import { ValidationError } from "../utils/errors.js";

let rest: ReturnType<typeof restClient> | undefined;

export function getClient() {
    if (!rest) {
        const apiKey = process.env.MASSIVE_API_KEY;
        if (!apiKey) { throw new Error('Missing API Key') };
        rest = restClient(apiKey, 'https://api.massive.com');
    }
    return rest;
}

function getFormattedDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export interface AggregateParams {
    stocksTicker: string;
    multiplier?: number | undefined;
    timespan?: GetStocksAggregatesTimespanEnum | undefined;
    from?: string | undefined;
    to?: string | undefined;
};

const DEFAULT_AGGREGATE_PARAMS = {
    multiplier: 1,
    timespan: GetStocksAggregatesTimespanEnum.Day,
    from: getFormattedDate(1),
    to: getFormattedDate(),
};

function parseOptionalNumber(value: string | undefined): number | undefined {
    if (value === undefined) return undefined;
    const n = Number(value);
    if (Number.isNaN(n)) {
        throw new ValidationError('multiplier must be a number');
    }
    return n;
}

export function parseAggregateParams(query: {
    stocksTicker?: string;
    multiplier?: string;
    timespan?: string;
    from?: string;
    to?: string;
}): AggregateParams {
    const { stocksTicker, multiplier, timespan, from, to } = query;
    if (!stocksTicker) { 
        throw new ValidationError('stocksTicker is required');
    }
    const TimeSpanValues = Object.values(GetStocksAggregatesTimespanEnum);
    if (timespan !== undefined && !TimeSpanValues.includes(timespan as GetStocksAggregatesTimespanEnum)) { 
        throw new ValidationError(`Invalid timespan: ${timespan}`);
    }

    return {
        stocksTicker,
        multiplier: parseOptionalNumber(multiplier),
        timespan: timespan as GetStocksAggregatesTimespanEnum | undefined,
        from,
        to,
    };
}

const STOCK_CACHE_TTL_SECONDS = 300

export function getCacheKey(params: Required<AggregateParams>) {
    const { stocksTicker, multiplier, timespan, from, to } = params;
    return `stock:${stocksTicker}:${multiplier}:${timespan}:${from}:${to}`
}

export async function getStock(params: AggregateParams) {
    const rest = getClient();
    const newParams = {
        stocksTicker: params.stocksTicker,
        multiplier: params.multiplier ?? DEFAULT_AGGREGATE_PARAMS.multiplier,
        timespan: params.timespan ?? DEFAULT_AGGREGATE_PARAMS.timespan,
        from: params.from ?? DEFAULT_AGGREGATE_PARAMS.from,
        to: params.to ?? DEFAULT_AGGREGATE_PARAMS.to,
    };
    const cacheKey = getCacheKey(newParams);
    const cached = await getRedis().get(cacheKey);
    if (cached !== null) {
        return JSON.parse(cached);
    }
    const response = await rest.getStocksAggregates(newParams);
    await getRedis().set(cacheKey, JSON.stringify(response), 'EX', STOCK_CACHE_TTL_SECONDS)
    return response;
}
