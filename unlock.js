const HIDDEN_MODAL = "#login-modal, .captcha-verify-container, #captcha_container";

function unlock() {
  if (!document.querySelector(HIDDEN_MODAL)) return;
  const app = document.getElementById("app");
  if (!app) return;
  if (app.inert) app.inert = false;
  app.removeAttribute("aria-hidden");
  if (app.style.pointerEvents === "none") app.style.pointerEvents = "";
}

new MutationObserver(unlock).observe(document.documentElement, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ["inert", "aria-hidden", "style"],
});
