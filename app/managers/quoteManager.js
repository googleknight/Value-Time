import { DEFAULT_QUOTE } from "../utils/constants.js";

export class QuoteManager {
  constructor() {
    this.quotes = [];
  }

  async loadQuotes() {
    try {
      const response = await fetch("app/quotes.json");
      const data = await response.json();
      this.quotes = Object.values(data).flatMap((category) => category.quotes);
    } catch (error) {
      console.error("Error loading quotes:", error);
      this.quotes = [];
    }
  }

  getRandomQuote() {
    return this.quotes.length > 0
      ? this.quotes[Math.floor(Math.random() * this.quotes.length)]
      : DEFAULT_QUOTE;
  }
}
