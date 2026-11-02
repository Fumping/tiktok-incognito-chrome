chrome.storage.sync.get({ consent: "hide" }, ({ consent }) => {
  if (consent === "hide") return;

  const answer = () => {
    const buttons = document
      .querySelector("tiktok-cookie-banner")
      ?.shadowRoot?.querySelectorAll("button");
    if (!buttons || buttons.length < 2) return false;
    buttons[consent === "accept" ? buttons.length - 1 : 0].click();
    return true;
  };

  const started = Date.now();
  const timer = setInterval(() => {
    if (answer() || Date.now() - started > 30000) clearInterval(timer);
  }, 300);
});
