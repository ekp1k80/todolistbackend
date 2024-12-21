## How to Deploy This Project
Prepare the Environment:

Ensure Node.js, npm, and either PostgreSQL or MongoDB are installed on your server.
Set up a .env file with the required variables:

POSTGRES_DATABASE_URL=postgres://postgres:fede311299@localhost:5432/todoDB
MONGODB_DATABASE_URL=mongodb://localhost:27017/todoDB
AUTH0_SECRET='a long, randomly-generated string stored in env'
AUTH0_BASEURL='http://localhost:3000'
AUTH0_CLIENT_ID='EXAMPLE'
ISSUER_BASE_URL='EXAMPLE'
# DB_TYPE=postgres
DB_TYPE=mongoose

### Install PM2 globally for managing the Node.js process
npm install -g pm2

