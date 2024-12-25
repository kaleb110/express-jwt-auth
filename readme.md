# Express Auth with JWT and Drizzle ORM

This project is a boilerplate for setting up authentication in an Express application using JWT (JSON Web Tokens) and Drizzle ORM with Typescript.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- A postgres database

### Features

- User authentication with JWT
- Token refresh mechanism
- OAuth integration
- Email verification using nodemailer
- drizzle to set user auth status

### Project Structure

- `src/main.ts` - Contains the main application entry
- `src/auth/` - Contains the authentication functions
- `src/db/` - Contains the database schemas
- `src/router/` - Contains the route definitions
- `src/middleware/` - Contains the middleware functions

### Installation

1. Clone the repository:
  ```sh
  git clone https://github.com/kaleb110/express-jwt-auth
  cd express-jwt-auth
  ```

2. Install dependencies:
  ```sh
  npm install
  # or
  yarn install
  ```

3. Create a `.env` file in the root directory and add the following environment variables:
  ```env
  NODE_ENV=development
  DATABASE_URL=your_neon_database_url
  PORT=5000
  BASE_URL=http://localhost:3000
  BASE_URL_PROD=production_base_url
  JWT_SECRET_KEY=your_jwt_secret
  TOKEN_EXPIRATION=15m
  REFRESH_TOKEN_EXPIRATION=7d
  CLIENT_ID=your_oauth_client_id
  CLIENT_SECRET=your_oauth_client_secret
  REFRESH_TOKEN=refrsh_token_generated_from_oauth-playground
  EMAIL_USER=your_email_address
  ```

### Running the Application

1. Start the development server:
  ```sh
  npm run dev
  # or
  yarn dev
  ```

2. The application will be running at `http://localhost:5000`.


