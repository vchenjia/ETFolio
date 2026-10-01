import { type Request, type Response } from 'express';
import { getStock, parseAggregateParams } from '../services/marketDataService.js';

interface ETFSearchQuery {
    stocksTicker?: string;
    multiplier?: string;
    timespan?: string;
    from?: string;
    to?: string;
}

export async function search(req: Request<{}, {}, {}, ETFSearchQuery>, res: Response) {
    const params = parseAggregateParams(req.query);
    const stockData = await getStock(params);
    res.status(200).json({ message: "Data generated succesfully", stockData });
};
