# Discord Quiz Starter

A basic realtime quiz web app for Discord game nights.

It includes:

- start screen
- host room creation
- player room join
- lobby
- host-only start button
- category board with 100 to 500 point questions
- hidden question selection
- question reveal
- player buzzer
- first-buzz highlight
- host lock / unlock buzzer
- host correct / wrong buttons
- live scoreboard

## Tech

- Vue 3
- TypeScript
- Vite
- Socket.IO
- Node.js / Express

## Run locally

Install everything:

```bash
npm install
npm --prefix client install
npm --prefix server install
```

Start frontend and backend together:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Server runs on:

```text
http://localhost:3001
```

## How to test with friends locally

On the same network, replace `localhost` with your local IP address.

Example:

```text
http://192.168.0.42:5173
```

If testing online, deploy the frontend and backend separately, then set the frontend env variable:

```bash
VITE_SERVER_URL=https://your-backend-url.com
```

## Where to edit questions

Edit:

```text
server/src/data/questions.ts
```

The template questions are placeholders. Replace them with your own categories, point values, question text and answer text.

## Basic game flow

1. Host creates room.
2. Players join with room code.
3. Host presses Start Game.
4. Board appears for everyone.
5. Host selects a hidden question.
6. Host reveals the question.
7. Players buzz in.
8. First buzzer is highlighted.
9. Host marks correct or wrong.
10. Host can unlock buzzer again if the answer was wrong or the player took too long.

## Notes

This is intentionally not overdesigned. Add styling, database persistence, jokers, timers, sounds, Discord bot commands or a question editor later.
