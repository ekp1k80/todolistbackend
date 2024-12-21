
# Project Deployment Guide

## 1. Prepare the Environment

Ensure the following software is installed on your server:

- **Node.js**
- **npm**
- **PostgreSQL** or **MongoDB**

## 2. Set Up Environment Variables

Create a `.env` file in the root of your project with the following required variables:

```env
POSTGRES_DATABASE_URL=postgres://postgres:fede311299@localhost:5432/todoDB
MONGODB_DATABASE_URL=mongodb://localhost:27017/todoDB
AUTH0_SECRET='a long, randomly-generated string stored in env'
AUTH0_BASEURL='http://localhost:3000'
AUTH0_CLIENT_ID='EXAMPLE'
ISSUER_BASE_URL='EXAMPLE'
# DB_TYPE=postgres
DB_TYPE=mongoose
```

## 3. Install PM2 Globally for Process Management

PM2 is a Node.js process manager to ensure your app runs smoothly.

Run the following command to install PM2 globally:

```bash
npm install -g pm2
```

## 4. Install Project Dependencies

Install all the necessary dependencies for the project:

```bash
npm install
```

## 5. Set Up the Database

### PostgreSQL

1. Create the database (`todoDB`) using a client like pgAdmin or via the command-line interface (CLI).
2. Ensure the database credentials in your `.env` file match your PostgreSQL setup.
3. Run Sequelize migrations if necessary.

### MongoDB

1. Create the `todoDB` database if it doesn’t already exist.
2. Ensure that your MongoDB instance is running and accessible via the URI specified in your `.env` file.

## 6. Build the Project and Migrate Tables/Collections

To build the project and migrate the tables (for PostgreSQL) or collections (for MongoDB), follow these steps:

1. Compile TypeScript files to JavaScript:

```bash
npm run build
```

2. Run migrations:

```bash
npm run migrate
```

## 7. Run the Project

Start the application using PM2:

```bash
pm2 start dist/src/index.js --name todo-app
```

## 8. Set Up Reverse Proxy

To make the app accessible from the web, use a web server like **Nginx** or **Apache** to proxy HTTP requests to your app running on a specific port (e.g., `localhost:3000`).

### Example Nginx Configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 9. Monitor and Maintain

Use **PM2** to monitor logs and restart the server if necessary:

- To view logs:

```bash
pm2 logs todo-app
```

- To restart the app:

```bash
pm2 restart todo-app
```

## 10. Optional - Seed Data

If you need to seed data, run the following command. The project will prevent duplicate seed entries.

```bash
npm run seed
```

