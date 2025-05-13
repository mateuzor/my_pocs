# Service Worker PoC

## Description

This project demonstrates how to use a **Service Worker** to create a web application with offline functionality. It uses cache to store necessary files, ensuring that the application continues to work even without an internet connection.

### What is a Service Worker?

A **Service Worker** is a script that runs in the background by the browser, independent of a web page. It can be used to intercept and manipulate network requests, store resources in cache, and create offline experiences.

## How to Use

1. Download and extract the contents of this project.
2. Open the terminal and start a local server using **npx http-server**
3. Access `http://localhost:8000` (or the corresponding port).
4. Open the browser console to verify the Service Worker registration.
5. Disconnect from the internet and reload the page to verify offline functionality.

## Pros and Cons

### Pros

- Enables offline functionality for web applications.
- Improves performance by reducing network requests.
- Supports push notifications and background synchronization.

### Cons

- May increase code complexity.
- Depends on browser support.
- May have cache synchronization issues if not managed correctly.
