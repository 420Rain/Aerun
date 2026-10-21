# Aerun

Aerun is an environment-aware running companion concept for recreational runners in Metro Manila. This Expo Go compatible pitch prototype compares illustrative running conditions and schematic route options, with a fictional local community feed. The primary colors are black and aqua (`#8AFFFF`).

## Run the prototype

Install the project dependencies with `npm install`, then start Expo with `npx expo start`. Open the QR code in Expo Go on your phone. The development server is not started automatically.

## Explore

- **Today:** compare four demo time windows and view sample PM2.5 and weather conditions.
- **Routes:** select one of two schematic route concepts and compare invented sample ranges.
- **Activity:** view a sample run and the currently selected route and time context.
- **Community:** browse fictional demo runs, filter the feed, give Kudos, comment, and join local sample challenges.
- **Profile:** try local preference controls and review demo follower counts, shared posts, and joined challenges. Switches do not send notifications.

Use **Share run** on Activity to preview and publish a sample activity into the Community feed for the current session. Captions, reactions, comments, filters, and challenge progress stay local and reset when the app restarts.

## Demo data and limitations

Environmental values are in [`src/data/mockData.ts`](src/data/mockData.ts); fictional runner posts and challenges are in [`src/data/socialMockData.ts`](src/data/socialMockData.ts). The selected time, route, feed filter, reactions, comments, posts, and challenge progress are shared across screens for the current app session. No location permission, GPS, backend, API, account, database, live air-quality feed, live map, notification, external sharing, or analytics service is used. The route illustration is not for navigation. PM2.5 and weather values are illustrative mock data, not measurements, research findings, health advice, inhaled-dose estimates, or safety guarantees. Activity values are sample data and do not imply environmental causes for pace changes. All runner identities and follower counts are fictional.
