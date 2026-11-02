# TikTok Incognito

A Chrome extension for watching TikTok links without an account and without TikTok keeping track of you.

## What it does

The cookie banner, the login popup and TikTok's captcha popup are hidden as soon as they appear. When TikTok opens one of these popups it also makes the rest of the page unclickable, so the extension undoes that and you can keep using the page.

Requests to TikTok's analytics and monitoring servers (`mcs*`, `mon*`, `libraweb*`, `log*`, `analytics.tiktok.com`), TikTok's report endpoints, beacons and a few third-party trackers (Google Analytics, Tag Manager, DoubleClick, Facebook) are blocked.

TikTok won't play videos without a handful of cookies. The extension keeps those (`tt_chain_token`, `ttwid`, `msToken`, `s_v_web_id`, `tt_csrf_token` and `cookie-consent`) and deletes every other TikTok cookie the moment it is set. The cookies it keeps are turned into session cookies, so they never get an expiry date.

When you close your last TikTok tab, or navigate away from TikTok, everything TikTok stored is wiped: cookies, local storage, IndexedDB, cache and service workers. The same happens when Chrome starts.

## Settings

Click the extension icon to choose how the cookie banner is handled. The banner stays hidden in all three modes.

"Only hide it" is the default. TikTok gets no answer and only the essential cookies are kept.

"Decline optional cookies" clicks decline for you. Only the essential cookies are kept.

"Accept all cookies" clicks allow all for you and keeps every TikTok cookie until you close the tab. Trackers are still blocked.

Reload the TikTok tab after changing the setting.

## Install

1. Open `chrome://extensions`.
2. Turn on Developer mode (top right).
3. Click Load unpacked and select the `tiktok-incognito` folder.

After changing any of the files, click the reload icon on the extension card in `chrome://extensions`.
