const saved = document.getElementById("saved");

chrome.storage.sync.get({ consent: "hide" }, ({ consent }) => {
  document.querySelector(`input[value="${consent}"]`).checked = true;
});

document.addEventListener("change", async (event) => {
  await chrome.storage.sync.set({ consent: event.target.value });
  saved.textContent = "Saved. Reload TikTok to apply.";
});
