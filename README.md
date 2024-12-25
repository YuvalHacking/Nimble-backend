# Nimble Backend

This is the backend portion of the Nimble Invoice Management Portal. It provides the GraphQL API for querying and managing invoice data, data creation, data analysis, and filtering operations.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Design Choices](#design-choices)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)

## Features

- **GraphQL API**:
  - Provides endpoints to query and mutate invoice data, including customer, invoice, and status information.
  - Includes filtering options to filter invoices by date range, status, and customer.

  ## API Routes

The backend exposes the following GraphQL endpoints:

### Queries
- **`getAmountsByStatus(endDate: String, startDate: String, supplierIds: [String!]): [ChartData!]!`**: Fetch total amounts by status within a date range and supplier filter.
- **`getCustomerAnalysis(endDate: String, startDate: String, statusId: Int, supplierIds: [String!]): [ChartData!]!`**: Customer analysis for a date range, status, and supplier filter.
- **`getMonthlyTotals(endDate: String, startDate: String, statusId: Int, supplierIds: [String!]): [ChartData!]!`**: Monthly total amounts by status and supplier filter.
- **`getOverdueTrend(endDate: String, startDate: String, supplierIds: [String!]): [ChartData!]!`**: Overdue invoice trend tracking within a date range and suppliers.
- **`getWeeklyMetrics: WeeklyMetricsDto!`**: Weekly metrics like earnings, invoice counts, and overdue counts.
- **`invoiceStatuses: [InvoiceStatus!]!`**: List of invoice statuses.
- **`suppliers: [Supplier!]!`**: List of suppliers.

### Mutations
- **`uploadCSV(file: Upload!): Boolean!`**: Upload a CSV file to update invoice data.
  
- **PostgreSQL Database**:
  - Stores and manages invoice data in a PostgreSQL database.
  - Tables include invoices, suppliers, invoice statuses and currencies.
  
## Technologies Used

- **Backend Framework**: NestJS 
- **Database**: PostgreSQL 
- **API**: GraphQL
- **ORM**: TypeORM 
- **Validation**: class-validator

## Design Choices

- **GraphQL Integration**: The backend exposes a GraphQL API to enable the querying of invoices and suppliers data. GraphQL is used for retrieving customer-specific data, invoice status, and analytics on invoice trends.
- **PostgreSQL**: PostgreSQL is used as the relational database to store invoice data, ensuring reliability and ease of query optimization.
- **Modular Architecture**: NestJS promotes a modular structure, enabling easy extension of the system as new features or services are added.
- **Data Validation**: class-validator ensures the integrity and validation of data, with decorators applied in DTOs to verify incoming data for GraphQL mutations.

## Project Structure
```
Nimble-backend
├── .env 
├── .eslintrc.js 
├── .gitignore 
├── .prettierrc 
├── docker-compose.yml ----------------------------- Docker Compose setup
├── nest-cli.json
├── package-lock.json
├── package.json ------------------------------------ Node.js dependencies
├── README.md 
├── schema.gql -------------------------------------- GraphQL schema file
├── tsconfig.build.json 
├── tsconfig.json
├── common/ ---------------------------------------- Shared utilities and constants
│   ├── constants.ts
│   ├── dtos/ 
│   │   └── chart.dto.ts 
│   ├── middlewares/ ------------------------------ Middleware components
│   │   └── logging.middleware.ts 
│   ├── types/ ------------------------------------- TypeScript types
│   │   └── input.interface.ts
│   └── utils/ ------------------------------------- Utility functions
│       ├── date.utils.ts 
│       ├── queryFilters.utils.ts 
│       └── validation.utils.ts
├── config/ ---------------------------------------- Configuration files
│   ├── constants.ts 
│   ├── database.config.ts 
│   └── graphql.config.ts
├── data/ ------------------------------------------ Data files for testing
│   ├── large(100).csv 
│   └── small(10).csv
├── modules/ --------------------------------------- Application modules
│   ├── currency/ --------------------------------- Currency module
│   │   ├── currency.entity.ts
│   │   ├── currency.module.ts
│   │   ├── services/
│   │   │   ├── currency-seeder.service.ts
│   │   │   └── currency.service.ts
│   ├── invoice/ ---------------------------------- Invoice module
│   │   ├── invoice.module.ts 
│   │   ├── invoice.resolver.ts
│   │   ├── models/ 
│   │   │   └── invoice.entity.ts 
│   │   ├── dtos/
│   │   │   ├── amounts-by-status.dto.ts 
│   │   │   ├── create-invoice.dto.ts 
│   │   │   ├── monthly-totals.dto.ts
│   │   │   ├── overdue-trend.dto.ts 
│   │   │   └── weekly-metrics.dto.ts 
│   │   └── services/ 
│   │       ├── analytics.service.ts 
│   │       ├── file.service.ts
│   │       └── invoice.service.ts
│   ├── invoice-status/ --------------------------- Invoice status module
│   │   ├── invoice-status.entity.ts
│   │   ├── invoice-status.module.ts 
│   │   ├── invoice-status.resolver.ts 
│   │   └── services/ 
│   │       ├── invoice-status-seeder.service.ts 
│   │       └── invoice-status.service.ts
│   └── supplier/ ---------------------------------- Supplier module
│       ├── supplier.module.ts
│       ├── supplier.resolver.ts 
│       ├── models/ 
│       │   └── supplier.entity.ts 
│       ├── dtos/ 
│       │   ├── create-supplier.dto.ts 
│       │   └── supplier-analysis.dto.ts 
│       └── services/
│           ├── analytics.service.ts 
│           └── supplier.service.ts

```

## Prerequisites

Before you can run the backend application, make sure you have the following installed on your system:

- **Node.js**: Version 20 or higher.
- **npm**: Node's package manager, which comes bundled with Node.js.
- **Docker**: Docker installed and **running**
- **pgAdmin** (optional but recommended)

## Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/YuvalHacking/Nimble-backend
    cd Nimble-backend
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```
  
## Usage

1. **Run the PostgreSQL image**:
    ```sh
    docker-compose up
    ```

2. **Start the server**:
    ```sh
    npm run start
    ```

3. Open the application in your browser or API client at `http://localhost:5000/graphql`.
