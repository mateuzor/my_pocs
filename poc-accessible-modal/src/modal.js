const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("open-modal");
const closeModalBtn = document.getElementById("close-modal");

// Function to open the modal
function openModal() {
  modal.style.display = "flex"; // Make modal visible
  modal.setAttribute("aria-hidden", "false"); // Mark modal as visible
  closeModalBtn.focus(); // Move focus inside modal
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none"; // Hide modal
  modal.setAttribute("aria-hidden", "true"); // Mark modal as hidden
  openModalBtn.focus(); // Return focus to the button
}

// Close modal when clicking outside the content
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Close modal on 'Escape' key press
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

// Event listeners
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
