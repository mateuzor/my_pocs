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
  - Cookies are always sent with every HTTP request to matching paths and domains, which can increase bandwidth usage.
  - Cookies are visible and modifiable via JavaScript unless marked with `HttpOnly`.

### Cookie Attributes:

- **`domain`** – Determines which subdomains can access the cookie.

  ```js
  document.cookie = "token=abc; domain=example.com";
  // Available to example.com and all its subdomains like sub.example.com
  ```

- **`secure`** – Ensures the cookie is sent only over HTTPS connections.

  ```js
  document.cookie = "session=123; secure";
  // Only sent if the site is accessed via HTTPS
  ```

- **`HttpOnly`** – Prevents access to the cookie via JavaScript (`document.cookie`).

  > Note: This flag can only be set via HTTP headers from the server.

  ```http
  Set-Cookie: session=secure_value; HttpOnly
  ```

- **`SameSite`** – Controls whether the cookie is sent with cross-site requests.

  ```js
  document.cookie = "promo=1; SameSite=Strict";
  // Not sent when navigating from external origins (CSRF protection)
  ```

- **`path`** – Restricts the cookie to specific URL paths.

  ```js
  document.cookie = "lang=en; path=/docs";
  // Only sent to requests that start with /docs
  ```

- **Description:** Stores small pieces of data sent between client and server with each HTTP request.

- **Max Size:** \~4KB per cookie.

### Examples:

| Cookie Path | Requested URL     | Cookie Sent? |
| ----------- | ----------------- | ------------ |
| `/`         | `/dashboard`      | ✅ Yes       |
| `/admin/`   | `/admin/settings` | ✅ Yes       |
| `/admin/`   | `/public`         | ❌ No        |

By default (if omitted), the path is set to the current document location where the cookie was created.

### How cookies are stored and transmitted:

- Stored in a flat text file or SQLite DB depending on browser implementation.

- Automatically appended to every matching HTTP request in the `Cookie:` header.

- This makes them useful for login sessions, but also a liability if overused or misconfigured.

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
