# grocerylist-seniordesignproject
Create a budgeting app that generates a shopping list that maximises cost savings based on user preference.

Notes for prod vs dev:
* EC2 server proxies port 80 (http) to port 8080 for frontend and port 5000 for backend (when using /api)
* To run backend locally, change 0.0.0.0 to localhost in backend/src/index.ts
* To connect local frontend to local backend, you may need to add localhost:5000 to the url of api calls in page.js, because they were changed to work with the reverse proxy on EC2
    * i.e instead of `/api/kroger?zipCode=47906&searchTerm=${encodeURIComponent(query)}`
    * do `http//:localhost:5000/api/kroger?zipCode=47906&searchTerm=${encodeURIComponent(query)}`
* This also means that when testing api endpoints running on EC2, you do not need to specify the port. Similar to how http:3.85.63.15 proxies to http:3.85.63.15:8080 in the browser, http:3.85.63.15/api proxies to http:3.85.63.15:5000/api in something like postman

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
* PORT