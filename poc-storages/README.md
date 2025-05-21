# Storage Comparison POC

This project demonstrates the differences between **LocalStorage**, **SessionStorage**, **Cookies**, and **IndexedDB**. It includes examples of how to use each API, their use cases, and trade-offs.

## **Storage Options**

### 1. LocalStorage
- **Description:** Stores data in the browser with no expiration time.
- **Max Size:** 5MB per origin.
- **Use Cases:** 
  - Save user preferences or settings.
  - Data that doesn't require frequent updates (e.g., theme settings).
- **Trade-offs:**
  - Simple API but synchronous, which can block the main thread.
  - Not secure for sensitive information.

### 2. SessionStorage
- **Description:** Similar to LocalStorage but cleared when the page session ends (e.g., browser tab is closed).
- **Max Size:** 5MB per origin.
- **Use Cases:** 
  - Data that should persist only during the session (e.g., form drafts).
- **Trade-offs:**
  - Like LocalStorage, it's synchronous and not suitable for sensitive data.

### 3. Cookies
- **Description:** Stores small pieces of data sent between client and server with each HTTP request.
- **Max Size:** ~4KB per cookie.
- **Use Cases:** 
  - Authentication tokens.
  - Data shared between client and server.
- **Trade-offs:**
  - Limited storage size.
  - Additional overhead in network requests.
  - Security risks if not marked as `HttpOnly` or `Secure`.

### 4. IndexedDB
- **Description:** A low-level API for client-side storage of significant amounts of structured data.
- **Max Size:** Varies by browser, usually much larger than LocalStorage.
- **Use Cases:** 
  - Complex web apps (e.g., offline-capable apps).
  - Storing large datasets.
- **Trade-offs:**
  - Asynchronous API can be harder to work with.
  - More complex setup compared to LocalStorage/SessionStorage.

## **Getting Started**

1. Clone the repository.
2. Open `index.html` in a browser.
3. Check the developer console to see examples of storage in action.

## **Conclusion**

This POC illustrates when to use each storage option based on your application's requirements, balancing ease of use, security, and performance.
