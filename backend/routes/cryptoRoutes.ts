import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

interface CryptoPricesRequestQuery {
    ids?: string;
}

interface ErrorResponse {
    message: string;
}

router.get('/prices', async (req: Request<express.ParamsDictionary, unknown, unknown, CryptoPricesRequestQuery>, res: Response) => {
    const { ids } = req.query;  
    if (!ids) {
        return res.status(400).json({ message: 'Please provide cryptocurrency IDs' } as ErrorResponse);
    }

    try {
        // Call CoinGecko API with dynamic crypto IDs
        const response = await axios.get<Record<string, Record<string, number>>>(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        res.status(200).json(response.data);  // Send the API response to the frontend
    } catch (error) {
        console.error('Error fetching CoinGecko data:', error);
        res.status(500).json({ message: 'Error fetching data from CoinGecko API' } as ErrorResponse);
    }
});

export default router;