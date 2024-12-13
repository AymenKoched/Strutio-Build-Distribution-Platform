# Strutio - Filtering System

## Overview

Filtering System Strutio is a Next.js application that utilizes Prisma, PostgreSQL, and TailwindCSS to deliver a modern and efficient filtering system. This repository is designed with best practices, leveraging tools like Docker, ESLint, Prettier, and Husky for seamless development and deployment workflows.

## Features

- Built with Next.js for both frontend and backend.
- PostgreSQL database managed with Prisma.
- TailwindCSS for responsive and modern UI.
- Dockerized setup for consistent environments.
- Linting and formatting with ESLint and Prettier.
- Commit linting and pre-commit hooks with Husky and Commitizen.

## Prerequisites

Before setting up the project, ensure the following are installed:

- [Node.js](https://nodejs.org/en) (v18 or higher)
- [Yarn](https://yarnpkg.com/) (v3 or higher)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Setup Instructions

1. Clone the Repository

   ```bash
   git clone https://github.com/AymenKoched/Strutio-Build-Distribution-Platform.git
   cd filtering-system-strutio
   ```

2. Install Dependencies

   ```bash
   yarn install
   ```

3. Setup Environment Variables

   Create a .env file in the root directory by copying the .env.example file:

   ```bash
   cp .env.example .env
   ```

4. Create docker containers

   Spin up the Docker containers for the database and other services:

   ```bash
   yarn stack:up
   ```

5. Run Migrations

   Ensure your database is up-to-date with the latest schema:

   ```bash
   yarn prisma:migration
   ```

6. Start the Development Environment

   Run the application in development mode:

   ```bash
   yarn dev
   ```

7. Seed the database

   Send a POST request to the /api/seed endpoint using a tool like curl, Postman, or your browser (if supported). For example:

   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

## Additional Scripts

- Lint and Fix Code:
  ```bash
  yarn lint:fix
  ```
- Format Prisma Schema:
  ```bash
  yarn prisma:format
  ```
- Stop Docker Containers:
  ```bash
  yarn stack:down
  ```

## License

This project is licensed under the MIT License. See the LICENSE.md file for details.

## Contact

For questions or feedback, please reach out at [aymenkoched@gmail.com].
