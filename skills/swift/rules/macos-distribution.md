---
title: Sign with Hardened Runtime, Notarize, and Staple for Direct Distribution
impact: HIGH
impactDescription: Gatekeeper accepts downloads outside the Mac App Store
tags: macos, notarization, codesign, notarytool, distribution
---

## Sign with Hardened Runtime, Notarize, and Staple for Direct Distribution

**Impact: HIGH (Gatekeeper accepts downloads outside the Mac App Store)**

Apps downloaded outside the Mac App Store must be signed with a Developer ID Application certificate, use the hardened runtime, be notarized by Apple, and have the ticket stapled. Skipping any step produces a Gatekeeper block that looks like a broken download. App Store distribution uses a different certificate chain; do not mix the two.

**Incorrect (unsigned or ad-hoc zip):**

```bash
# Zip the .app and upload it. Gatekeeper rejects the download.
ditto -c -k --sequesterRsrc --keepParent MyApp.app MyApp.zip
```

**Correct (sign nested code, zip, notarize, staple, re-zip, assess):**

```bash
# Sign nested frameworks/helpers first (inside-out), then the .app.
# Prefer explicit paths over codesign --deep.
codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Example Corp (TEAMID)" \
  MyApp.app/Contents/Frameworks/MyFramework.framework

codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Example Corp (TEAMID)" \
  MyApp.app

# Zip the signed app, then submit for notarization.
ditto -c -k --keepParent MyApp.app MyApp.zip
xcrun notarytool submit MyApp.zip --keychain-profile "AC_NOTARY" --wait

# Staple the ticket onto the .app, then package again for download.
xcrun stapler staple MyApp.app
ditto -c -k --keepParent MyApp.app MyApp-notarized.zip
spctl --assess --type execute -v MyApp.app
```

Enable the hardened runtime in the Xcode target (Signing & Capabilities) and add only the entitlements your app needs. Ship an update mechanism so users can receive fixes after the first install. For Mac App Store builds, archive and upload through App Store Connect instead of Developer ID notarization.

Reference: [Notarizing macOS software before distribution](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution), [Hardened Runtime](https://developer.apple.com/documentation/security/hardened_runtime)
