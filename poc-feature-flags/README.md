# POC - Feature Flags

This is a Proof of Concept (POC) demonstrating how to implement **feature flags** in a React application using React Context. Feature flags allow you to toggle features on or off dynamically, making it easier to test features, roll out updates gradually, and reduce deployment risk.

## Features

- ✅ Toggle UI components based on feature flags
- 🎯 Centralized state management with React Context
- 🔁 Instant UI updates on flag toggle
- 🧪 Ideal foundation for integrating remote flags via APIs or feature flag platforms

## How to Run

1. Clone this repository:

   ```bash
   git clone <url>
   cd poc-feature-flags
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open [http://localhost:3002](http://localhost:3002) in your browser.

## Usage

The app provides two toggle buttons:

- **Toggle New Banner**: shows/hides a green success message
- **Toggle Beta Feature**: shows/hides a blue info message

You can expand this logic to wrap any part of your app with conditional rendering based on flags.

## Technologies Used

- React 18
- Webpack 5
- Babel
- React Context API

## Future Enhancements

- Integrate remote flag providers (e.g. LaunchDarkly, Unleash, ConfigCat)
- Persist flags to localStorage or backend
- Add user-level flag targeting

---
