# grocerylist-seniordesignproject
Create a budgeting app that generates a shopping list that maximises cost savings based on user preference.

# Commands
* pnpm install // install dependencies
* pnpm build // build application
* pnpm start:frontend // start frontend
* pnpm start:backend // start backend
* pnpm start:all // start all
* pnpm dev:frontend // start frontend dev
* pnpm dev:backend // start backend dev
* pnpm pm2:frontend:start // start frontend pm2 instance
* pnpm pm2:frontend:stop // stop frontend pm2 instance
* pnpm pm2:frontend:restart // restart frontend pm2 instance
* pnpm lint // run linter
* pnpm lint:fix // fix linter errors if possible
* pnpm test:kroger // run kroger specific test

# EC2 Specific:
* nginx reverse proxies port 80 to port 8080 (frontend)

# Backend Environment
* KROGER_CLIENT_ID
* KROGER_CLIENT_SECRET
* port
* JWT_SECRET
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY
* AWS_REGION