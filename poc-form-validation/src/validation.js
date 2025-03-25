const form = document.getElementById("registration-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Removes previous errors
  clearErrors();

  let isValid = true;

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");
  const age = document.getElementById("age");

  // Name
  if (!name.value.trim()) {
    setError(name, "Name is required.");
    isValid = false;
  }

  // Email
  if (!email.value.trim()) {
    setError(email, "Email is required.");
    isValid = false;
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
    setError(email, "Invalid email format.");
    isValid = false;
  }

  // Password
  if (!password.value.trim()) {
    setError(password, "Password is required.");
    isValid = false;
  } else if (password.value.length < 6) {
    setError(password, "Password must be at least 6 characters.");
    isValid = false;
  }

  // Password confirmation
  if (!confirm.value.trim()) {
    setError(confirm, "Please confirm your password.");
    isValid = false;
  } else if (confirm.value !== password.value) {
    setError(confirm, "Passwords do not match.");
    isValid = false;
  }

  // Age
  if (!age.value.trim()) {
    setError(age, "Age is required.");
    isValid = false;
  } else if (parseInt(age.value, 10) < 18) {
    setError(age, "You must be at least 18 years old.");
    isValid = false;
  }

  if (isValid) {
    alert("Form submitted successfully!");
    form.reset();
  }
});

function setError(input, message) {
  const errorElement = input.parentElement.querySelector("small.error");
  errorElement.textContent = message;
}

function clearErrors() {
  document.querySelectorAll("small.error").forEach((el) => {
    el.textContent = "";
  });
}
