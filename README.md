# Bank Dashboard

A PSD2-integrated dashboard application that fetches account and 
transaction data directly from Norwegian banks via BankID, with 
AI-powered categorization and interactive visualizations.

![Dashboard screenshot](./image.png)

## Why I Built This

My personal bank (Storebrand) lacks a proper analytics platform for 
transactions, and historical data disappears after 90 days in the 
bank's own systems. I built this app to own my financial data and 
gain better insight into my own spending patterns.

## Features

- **BankID authentication** via Enable Banking (OIDC)
- **Real-time data** from Norwegian banks through the PSD2 open 
  banking API
- **Extended history** — stores all transactions in a dedicated 
  PostgreSQL database beyond the bank's 90-day window
- **Hybrid categorization** — rule-based (keyword matching) with 
  AI fallback (OpenAI) for transactions that don't match predefined 
  categories
- **Interactive visualizations** — pie charts, line charts, and 
  tables showing spending over time
- **AI-powered search** — ask questions like "how much did I spend 
  on my Spain trip in June?" and get answers based on your own data

## Tech Stack

**Backend:** Python, FastAPI, PostgreSQL (Supabase)  
**Frontend:** React, TypeScript  
**Desktop:** Tauri (Rust)  
**Integrations:** Enable Banking API (OIDC), OpenAI API  

## About PSD2

PSD2 (Revised Payment Services Directive) is an EU directive from 2019 
that requires banks to expose customer transaction data through open 
APIs, provided the customer consents. Using these APIs directly requires 
formal approval from Finanstilsynet (the Norwegian Financial Supervisory 
Authority). This application therefore uses Enable Banking as an 
intermediary — an approved provider that handles secure BankID 
authentication and standardized access to Norwegian banks.

## Status

Under active development. Currently functions as a personal dashboard 
for my own account information.

**Planned:**
- [ ] Budget view with comparison against actual spending
- [ ] Weekly/monthly/yearly filtering
- [ ] Stocks and funds (pending broker API availability)
- [ ] Multi-bank support

## Note

This is a personal project built for my own account information. It is 
not intended for production use by others, and requires individual 
BankID access and Enable Banking configuration to run.
