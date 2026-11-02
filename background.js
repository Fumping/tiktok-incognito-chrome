const ESSENTIAL_COOKIES = new Set([
  "tt_chain_token",
  "ttwid",
  "msToken",
  "s_v_web_id",
  "tt_csrf_token",
  "cookie-consent",
]);
const TIKTOK_DOMAIN = /(^|\.)(tiktok|tiktokv|tiktokw|tiktokcdn|tiktokcdn-eu|tiktokcdn-us|ttwstatic|byteoversea)\.[a-z.]+$/;
const ORIGINS = [
  "https://www.tiktok.com",
  "https://tiktok.com",
  "https://m.tiktok.com",
  "https://vm.tiktok.com",
  "https://vt.tiktok.com",
];

const getSettings = () => chrome.storage.sync.get({ consent: "hide" });
const isTikTok = (cookie) => TIKTOK_DOMAIN.test(cookie.domain.replace(/^\./, ""));
const cookieUrl = (cookie) =>
  `http${cookie.secure ? "s" : ""}://${cookie.domain.replace(/^\./, "")}${cookie.path}`;

function removeCookie(cookie) {
  return chrome.cookies.remove({
    url: cookieUrl(cookie),
    name: cookie.name,
    storeId: cookie.storeId,
  });
}

function makeSessionOnly(cookie) {
  return chrome.cookies.set({
    url: cookieUrl(cookie),
    name: cookie.name,
    value: cookie.value,
    path: cookie.path,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    storeId: cookie.storeId,
    ...(cookie.hostOnly ? {} : { domain: cookie.domain }),
  });
}

chrome.cookies.onChanged.addListener(async ({ removed, cookie }) => {
  if (removed || !isTikTok(cookie)) return;
  const { consent } = await getSettings();
  if (consent !== "accept" && !ESSENTIAL_COOKIES.has(cookie.name)) removeCookie(cookie);
  else if (!cookie.session) makeSessionOnly(cookie).catch(() => removeCookie(cookie));
});

async function wipe() {
  await chrome.browsingData.remove(
    { origins: ORIGINS },
    {
      cookies: true,
      localStorage: true,
      indexedDB: true,
      cacheStorage: true,
      serviceWorkers: true,
      fileSystems: true,
    }
  );
  const cookies = await chrome.cookies.getAll({});
  await Promise.all(cookies.filter(isTikTok).map(removeCookie));
}

async function tiktokTabOpen() {
  const tabs = await chrome.tabs.query({ url: "*://*.tiktok.com/*" });
  return tabs.length > 0;
}

async function wipeIfClosed() {
  if (!(await tiktokTabOpen())) wipe();
}

chrome.runtime.onStartup.addListener(wipe);
chrome.runtime.onInstalled.addListener(wipe);
chrome.tabs.onRemoved.addListener(wipeIfClosed);
chrome.tabs.onUpdated.addListener((_id, info) => {
  if (info.url) wipeIfClosed();
});
