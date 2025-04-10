// Types for cryptocurrency data
// In frontend types:
export interface Crypto {
  _id: string;
  coinId: string;
  name: string;
  symbol: string;
  image?: string;  
  currentPrice?: number;  
  marketCap?: number;  
  marketCapRank?: number;  
  priceChangePercentage24h: number;
  lastUpdated: string;
}
  
  export interface CryptoDetail extends Crypto {
    description: { en: string };
    marketData: {
      ath: { usd: number };
      athChangePercentage: { usd: number };
      athDate: { usd: string };
      marketCapRank: number;
      totalVolume: { usd: number };
      high24h: { usd: number };
      low24h: { usd: number };
    };
    links: {
      homepage: string[];
      blockchainSite: string[];
      officialForumUrl: string[];
      chatUrl: string[];
      announcementUrl: string[];
      twitterScreenName: string;
      telegramChannelIdentifier: string;
      subredditUrl: string;
      reposUrl: { github: string[] };
    };
  }
  
  export interface HistoricalData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  }
  
  export interface PriceData {
    [key: string]: {
      usd: number;
      usd_market_cap?: number;
      usd_24h_vol?: number;
      usd_24h_change?: number;
    };
  }