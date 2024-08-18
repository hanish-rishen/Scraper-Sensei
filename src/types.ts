export interface ScrapedData {
    title: string;
    text: string;
  }
  
  export interface Analysis {
    titleSentiment: string;
    textSentiment: string;
    category: string;
    analysis: string;
  }
  
  export interface ScrapeResult {
    scrapedData: ScrapedData;
    analysis: Analysis;
  }