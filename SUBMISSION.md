# the-block

## How to Run
- Using VS 2026 Community to open the-block\backend\backend.slnx
- Run "theblock-apis" and you will have "https://localhost:7275"
- Using VSCode to open "the-block\frontend-theblock"
- Open "New Terminal" then run "npm run dev" and you will have "http://localhost:5173/"

## Time Spent

I have spent around 12 hours on the backend, Front end, + Unit Testing

## Assumptions and Scope
- Profile management (Sign up, Sign In, JWT Token). I will do more about the access token + refresh token + authorization
- Vehicle browsing + Bidding.

## Stack

- **Frontend:**
- Vite+React
- **Backend:**
- Net Core 8.0 API + EF Core + MSTest
- **Database:**
- SQLite + import data from vehicles.json

## What I Built

- allow the user to register and sign in to place a bid on any available vehicle or buy now.
- allow filtering + pagination vehicles page

## Notable Decisions

Nothing special, just use SQLite since I don't want to provision any cloud DB for this small project.

## Testing

- Back-end: Unit Test, using MSTest + MOQ
- Front-End: manually, but I would like to have some Unit Test + Automation test for the Front End as well.

## What I'd Do With More Time
- Apply strictly Access Token + Refresh Token flow and using OAUTH2
- Front-end unit test + Automation test for the whole website
- Apply real-time countdown time for bidding vehicle
- Split back-end API to microservices (ProfilesAPI, VehiclesAPI, BiddingAPI) so we can scale out easily
- Use MemCache + Redis Cache to have better performance
- Build a dashboard page so we can have some statistical info about the bidding site.
- Enhance Vehicles page + Vehicle Details page so the user can have a better experience (e.g. search, go around easily..)
- Use either CosmosDB or PostgreSQL so we can scale out later

