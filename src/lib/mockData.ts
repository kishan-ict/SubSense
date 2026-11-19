import { Transaction } from "@/types";

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  // 1. Netflix (Regular Monthly Streaming)
  {
    id: "tx-001",
    date: "2026-08-15",
    rawDescription: "NETFLIX.COM PAYMENT 402-935-7733 CA",
    cleanMerchant: "Netflix",
    amount: 15.49,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-002",
    date: "2026-09-15",
    rawDescription: "NETFLIX.COM 866-579-7172 CA",
    cleanMerchant: "Netflix",
    amount: 15.49,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-003",
    date: "2026-10-15",
    rawDescription: "NETFLIX.COM DIGITAL SUBSCRIPTION",
    cleanMerchant: "Netflix",
    amount: 15.49,
    type: "debit",
    currency: "USD",
  },

  // 2. Spotify (Hidden Price Hike! from $10.99 to $11.99)
  {
    id: "tx-004",
    date: "2026-08-03",
    rawDescription: "SPOTIFY USA 150 GREENWICH ST NY",
    cleanMerchant: "Spotify",
    amount: 10.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-005",
    date: "2026-09-03",
    rawDescription: "SPOTIFY P109384 RECURRING",
    cleanMerchant: "Spotify",
    amount: 10.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-006",
    date: "2026-10-03",
    rawDescription: "SPOTIFY USA PREMIUM MONTHLY",
    cleanMerchant: "Spotify",
    amount: 11.99,
    type: "debit",
    currency: "USD",
  },

  // 3. YouTube Premium (Active Streaming)
  {
    id: "tx-007",
    date: "2026-08-20",
    rawDescription: "GOOGLE *YOUTUBE PREMIUM G.CO/HELPPAY# CA",
    cleanMerchant: "YouTube Premium",
    amount: 13.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-008",
    date: "2026-09-20",
    rawDescription: "GOOGLE *YouTube Premium RECURRING",
    cleanMerchant: "YouTube Premium",
    amount: 13.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-009",
    date: "2026-10-20",
    rawDescription: "GOOGLE *YOUTUBE PREMIUM G.CO/HELPPAY# CA",
    cleanMerchant: "YouTube Premium",
    amount: 13.99,
    type: "debit",
    currency: "USD",
  },

  // 4. Google One (Cloud Storage - Duplicate candidate with Dropbox)
  {
    id: "tx-010",
    date: "2026-08-11",
    rawDescription: "GOOGLE *STORAGE 100GB MOUNTAIN VIEW CA",
    cleanMerchant: "Google One",
    amount: 2.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-011",
    date: "2026-09-11",
    rawDescription: "GOOGLE ONE 100GB STORAGE MOUNTAIN VIEW",
    cleanMerchant: "Google One",
    amount: 2.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-012",
    date: "2026-10-11",
    rawDescription: "GOOGLE *STORAGE 100GB MOUNTAIN VIEW CA",
    cleanMerchant: "Google One",
    amount: 2.99,
    type: "debit",
    currency: "USD",
  },

  // 5. Dropbox Plus (Duplicate Cloud Storage candidate!)
  {
    id: "tx-013",
    date: "2026-08-28",
    rawDescription: "DROPBOX*8XY798 SAN FRANCISCO CA",
    cleanMerchant: "Dropbox",
    amount: 11.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-014",
    date: "2026-09-28",
    rawDescription: "DROPBOX*8XY798 RECURRING SAN FRANCISCO",
    cleanMerchant: "Dropbox",
    amount: 11.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-015",
    date: "2026-10-28",
    rawDescription: "DROPBOX*8XY798 2TB MONTHLY SAN FRANCISCO",
    cleanMerchant: "Dropbox",
    amount: 11.99,
    type: "debit",
    currency: "USD",
  },

  // 6. Adobe Creative Cloud (Significant Software Cost)
  {
    id: "tx-016",
    date: "2026-08-05",
    rawDescription: "ADOBE *CREATIVE CLOUD 408-536-6000 CA",
    cleanMerchant: "Adobe Creative Cloud",
    amount: 54.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-017",
    date: "2026-09-05",
    rawDescription: "ADOBE *CREATIVE CLOUD SAN JOSE CA",
    cleanMerchant: "Adobe Creative Cloud",
    amount: 54.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-018",
    date: "2026-10-05",
    rawDescription: "ADOBE *CREATIVE CLOUD SUBSCRIPTION CA",
    cleanMerchant: "Adobe Creative Cloud",
    amount: 54.99,
    type: "debit",
    currency: "USD",
  },

  // 7. Microsoft 365 (Productivity)
  {
    id: "tx-019",
    date: "2026-08-18",
    rawDescription: "MICROSOFT*365 FAMILY REDMOND WA",
    cleanMerchant: "Microsoft 365",
    amount: 9.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-020",
    date: "2026-09-18",
    rawDescription: "MSFT *OFFICE 365 RECURRING REDMOND WA",
    cleanMerchant: "Microsoft 365",
    amount: 9.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-021",
    date: "2026-10-18",
    rawDescription: "MICROSOFT*365 FAMILY REDMOND WA",
    cleanMerchant: "Microsoft 365",
    amount: 9.99,
    type: "debit",
    currency: "USD",
  },

  // 8. Equinox / Planet Fitness (Fitness Gym)
  {
    id: "tx-022",
    date: "2026-08-01",
    rawDescription: "PLANET FITNESS CLUB 0291 CLUB DUES",
    cleanMerchant: "Planet Fitness",
    amount: 24.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-023",
    date: "2026-09-01",
    rawDescription: "PLANET FITNESS CLUB 0291 CLUB DUES",
    cleanMerchant: "Planet Fitness",
    amount: 24.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-024",
    date: "2026-10-01",
    rawDescription: "PLANET FITNESS CLUB 0291 CLUB DUES",
    cleanMerchant: "Planet Fitness",
    amount: 24.99,
    type: "debit",
    currency: "USD",
  },

  // 9. GoDaddy (Annual Domain Renewal - Notice 1 year recurrence or annual tag)
  {
    id: "tx-025",
    date: "2025-10-12",
    rawDescription: "GODADDY.COM DOMAIN RENEWAL TEMPE AZ",
    cleanMerchant: "GoDaddy Domains",
    amount: 21.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-026",
    date: "2026-10-12",
    rawDescription: "GODADDY.COM ANNUAL DOMAIN PRIVACY & REG",
    cleanMerchant: "GoDaddy Domains",
    amount: 21.99,
    type: "debit",
    currency: "USD",
  },

  // 10. Amazon Prime (Hidden subscription)
  {
    id: "tx-027",
    date: "2026-08-14",
    rawDescription: "AMAZON DIGITAL SVCS*PRIME SEATTLE WA",
    cleanMerchant: "Amazon Prime",
    amount: 14.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-028",
    date: "2026-09-14",
    rawDescription: "AMZN PRIME MEMBER 888-802-3080 WA",
    cleanMerchant: "Amazon Prime",
    amount: 14.99,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-029",
    date: "2026-10-14",
    rawDescription: "AMAZON DIGITAL SVCS*PRIME SEATTLE WA",
    cleanMerchant: "Amazon Prime",
    amount: 14.99,
    type: "debit",
    currency: "USD",
  },

  // 11. Uncertain Recurring Payment (Only 2 occurrences with slight variance)
  {
    id: "tx-030",
    date: "2026-09-08",
    rawDescription: "SUBSTACK*NEWSLETTER WRITER NYC NY",
    cleanMerchant: "Substack Newsletter",
    amount: 5.00,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-031",
    date: "2026-10-08",
    rawDescription: "SUBSTACK*TECH DIGEST NYC NY",
    cleanMerchant: "Substack Newsletter",
    amount: 5.00,
    type: "debit",
    currency: "USD",
  },

  // 12. Ordinary Shopping & One-time Purchases (Must NOT be flagged as subscriptions)
  {
    id: "tx-032",
    date: "2026-08-10",
    rawDescription: "WHOLE FOODS MARKET AUSTIN TX",
    cleanMerchant: "Whole Foods Market",
    amount: 87.42,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-033",
    date: "2026-08-25",
    rawDescription: "TARGET T-0842 BROOKLYN NY",
    cleanMerchant: "Target",
    amount: 43.19,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-034",
    date: "2026-09-12",
    rawDescription: "UBER TRIP HELP.UBER.COM CA",
    cleanMerchant: "Uber",
    amount: 26.80,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-035",
    date: "2026-09-19",
    rawDescription: "STARBUCKS STORE #1402 SEATTLE WA",
    cleanMerchant: "Starbucks",
    amount: 6.45,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-036",
    date: "2026-10-02",
    rawDescription: "CON EDISON UTILITY BILL NYC NY",
    cleanMerchant: "Con Edison",
    amount: 112.50,
    type: "debit",
    currency: "USD",
  },
  {
    id: "tx-037",
    date: "2026-10-19",
    rawDescription: "APPLE STORE 5TH AVE RETAIL PURCHASE",
    cleanMerchant: "Apple Store",
    amount: 199.00,
    type: "debit",
    currency: "USD",
  },
  // 13. Refund / Credit (Must NOT be treated as a subscription charge!)
  {
    id: "tx-038",
    date: "2026-09-22",
    rawDescription: "TARGET T-0842 RETURN REFUND BROOKLYN NY",
    cleanMerchant: "Target Refund",
    amount: 43.19,
    type: "credit",
    currency: "USD",
  },
];

export const SAMPLE_CSV_CONTENT = `Date,Description,Amount,Type
2026-08-15,"NETFLIX.COM PAYMENT 402-935-7733 CA",-15.49,Debit
2026-09-15,"NETFLIX.COM 866-579-7172 CA",-15.49,Debit
2026-10-15,"NETFLIX.COM DIGITAL SUBSCRIPTION",-15.49,Debit
2026-08-03,"SPOTIFY USA 150 GREENWICH ST NY",-10.99,Debit
2026-09-03,"SPOTIFY P109384 RECURRING",-10.99,Debit
2026-10-03,"SPOTIFY USA PREMIUM MONTHLY",-11.99,Debit
2026-08-20,"GOOGLE *YOUTUBE PREMIUM G.CO/HELPPAY# CA",-13.99,Debit
2026-09-20,"GOOGLE *YouTube Premium RECURRING",-13.99,Debit
2026-10-20,"GOOGLE *YOUTUBE PREMIUM G.CO/HELPPAY# CA",-13.99,Debit
2026-08-11,"GOOGLE *STORAGE 100GB MOUNTAIN VIEW CA",-2.99,Debit
2026-09-11,"GOOGLE ONE 100GB STORAGE MOUNTAIN VIEW",-2.99,Debit
2026-10-11,"GOOGLE *STORAGE 100GB MOUNTAIN VIEW CA",-2.99,Debit
2026-08-28,"DROPBOX*8XY798 SAN FRANCISCO CA",-11.99,Debit
2026-09-28,"DROPBOX*8XY798 RECURRING SAN FRANCISCO",-11.99,Debit
2026-10-28,"DROPBOX*8XY798 2TB MONTHLY SAN FRANCISCO",-11.99,Debit
2026-08-05,"ADOBE *CREATIVE CLOUD 408-536-6000 CA",-54.99,Debit
2026-09-05,"ADOBE *CREATIVE CLOUD SAN JOSE CA",-54.99,Debit
2026-10-05,"ADOBE *CREATIVE CLOUD SUBSCRIPTION CA",-54.99,Debit
2026-08-18,"MICROSOFT*365 FAMILY REDMOND WA",-9.99,Debit
2026-09-18,"MSFT *OFFICE 365 RECURRING REDMOND WA",-9.99,Debit
2026-10-18,"MICROSOFT*365 FAMILY REDMOND WA",-9.99,Debit
2026-08-01,"PLANET FITNESS CLUB 0291 CLUB DUES",-24.99,Debit
2026-09-01,"PLANET FITNESS CLUB 0291 CLUB DUES",-24.99,Debit
2026-10-01,"PLANET FITNESS CLUB 0291 CLUB DUES",-24.99,Debit
2025-10-12,"GODADDY.COM DOMAIN RENEWAL TEMPE AZ",-21.99,Debit
2026-10-12,"GODADDY.COM ANNUAL DOMAIN PRIVACY & REG",-21.99,Debit
2026-08-14,"AMAZON DIGITAL SVCS*PRIME SEATTLE WA",-14.99,Debit
2026-09-14,"AMZN PRIME MEMBER 888-802-3080 WA",-14.99,Debit
2026-10-14,"AMAZON DIGITAL SVCS*PRIME SEATTLE WA",-14.99,Debit
2026-09-08,"SUBSTACK*NEWSLETTER WRITER NYC NY",-5.00,Debit
2026-10-08,"SUBSTACK*TECH DIGEST NYC NY",-5.00,Debit
2026-08-10,"WHOLE FOODS MARKET AUSTIN TX",-87.42,Debit
2026-08-25,"TARGET T-0842 BROOKLYN NY",-43.19,Debit
2026-09-12,"UBER TRIP HELP.UBER.COM CA",-26.80,Debit
2026-09-19,"STARBUCKS STORE #1402 SEATTLE WA",-6.45,Debit
2026-10-02,"CON EDISON UTILITY BILL NYC NY",-112.50,Debit
2026-10-19,"APPLE STORE 5TH AVE RETAIL PURCHASE",-199.00,Debit
2026-09-22,"TARGET T-0842 RETURN REFUND BROOKLYN NY",43.19,Credit`;
