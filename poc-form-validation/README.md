# 🚀 Advanced Form with Client-Side Validation (No Dependencies)

This project demonstrates how to build a **fully functional and user-friendly form** using only **HTML, CSS, and JavaScript**, without relying on external libraries or frameworks.

## 📌 Features

✅ **Client-side validation using vanilla JavaScript**  
✅ **Custom error messages and field validation**  
✅ **Regex validation (email)**  
✅ **Password match and length checks**  
✅ **Required fields and age validation (18+)**  
✅ **Lightweight and dependency-free**

---

## 📁 Project Structure

```
/poc-form-validation
│── /src
│   │── index.html       # The HTML structure of the form
│   │── validation.js    # JavaScript logic for validation
│   │── styles.css       # CSS for form styling and error feedback
│── README.md            # Documentation
```

---

## 🚀 How to Run the Project

Simply open `index.html` in your browser—**no build tools or server required!**

---

## 🧠 Validations Implemented

| Field    | Rules                                   |
| -------- | --------------------------------------- |
| Name     | Required                                |
| Email    | Required, Valid format (Regex)          |
| Password | Required, Minimum 6 characters          |
| Confirm  | Required, Must match the password field |
| Age      | Required, Must be 18 or older           |

---

## 🛠 How It Works

### HTML Example

```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input type="email" id="email" required />
  <small class="error"></small>
</div>
```

- Each input field is followed by a `<small class="error">` element to display validation messages.
- The form uses `novalidate` to bypass browser validation and handle it manually.

### JavaScript Core Logic

```js
form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  if (!email.value.trim()) {
    setError(email, "Email is required.");
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
    setError(email, "Invalid email format.");
  }
  // ... other validations
});
```

✅ Prevents form submission until all fields are valid  
✅ Shows contextual error messages near each field

### Error Handling Functions

```js
function setError(input, message) {
  const errorElement = input.parentElement.querySelector("small.error");
  errorElement.textContent = message;
}

function clearErrors() {
  document
    .querySelectorAll("small.error")
    .forEach((el) => (el.textContent = ""));
}
```

---

## 🎯 Next Steps

1️⃣ Add validation in real-time (`oninput`, `onblur`)  
2️⃣ Improve accessibility with `aria-invalid`, `aria-describedby`  
3️⃣ Add input masks (for phone, date, etc.)  
4️⃣ Connect with backend (e.g. POST to an API)

---

🚀 **Project created to explore robust form validation using only JavaScript!**
