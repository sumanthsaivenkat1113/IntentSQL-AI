export type Sample = {
  id: string;
  prompt: string;
  category: "ambiguous" | "clear";
  tag: string;
};

export const SAMPLE_PROMPTS: Sample[] = [
  // Ambiguous
  { id: "a1", prompt: "Show me last month's best customers.", category: "ambiguous", tag: "Best customers" },
  { id: "a2", prompt: "What were our sales last month?", category: "ambiguous", tag: "Sales" },
  { id: "a3", prompt: "What are our most popular products?", category: "ambiguous", tag: "Products" },
  { id: "a4", prompt: "Which category is doing best?", category: "ambiguous", tag: "Category" },
  { id: "a5", prompt: "Which customers are most engaged?", category: "ambiguous", tag: "Engagement" },
  { id: "a6", prompt: "Which customers have problems?", category: "ambiguous", tag: "Support" },
  { id: "a7", prompt: "Show me at-risk customers.", category: "ambiguous", tag: "Retention" },
  { id: "a8", prompt: "Who are our most valuable customers?", category: "ambiguous", tag: "LTV" },

  // Clear
  { id: "c1", prompt: "How many new customers signed up last month?", category: "clear", tag: "Count" },
  { id: "c2", prompt: "What is the total revenue from completed orders in Q1 2025?", category: "clear", tag: "Revenue" },
  { id: "c3", prompt: "List all products with stock below 10.", category: "clear", tag: "Inventory" },
  { id: "c4", prompt: "Show me the top 5 products by units sold last quarter.", category: "clear", tag: "Ranking" },
  { id: "c5", prompt: "What is the average order value this year?", category: "clear", tag: "Avg order" },
  { id: "c6", prompt: "How many refunds were approved last month?", category: "clear", tag: "Refunds" },
  { id: "c7", prompt: "List all customers who signed up in the last 30 days.", category: "clear", tag: "Recency" },
  { id: "c8", prompt: "What is the total amount collected via UPI payments this month?", category: "clear", tag: "Payments" },
];