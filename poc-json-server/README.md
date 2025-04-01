# 🚀 POC 6: Fake API with JSON Server + Frontend

This POC demonstrates using [JSON Server](https://github.com/typicode/json-server) to mock a REST API and consume it with vanilla JavaScript.

## Features
- List users
- Add new users
- Delete users
- Fully functional local API

## Setup

```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

Then open `src/index.html` in a browser.

## Endpoints
- GET    /users
- POST   /users
- DELETE /users/:id

## Enjoy!
