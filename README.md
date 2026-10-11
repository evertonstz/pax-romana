Running instance: https://evertonstz.github.io/pax-romana

This project was initially created so I could study a little more about the [Web Bluetooth API standard](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API), so if you're interested in the Bluetooth implementation of this code, the folder `src/pax` and the hook `src/hooks/usePaxBluetoothServices/useBluetooth/useBluetooth.ts` are what you're looking for.

## Bluetooth on Linux (Chrome/Chromium, including Flatpak)

If clicking **Connect** does not open the device chooser, check in DevTools:

```js
({ secureContext: window.isSecureContext, bluetooth: typeof navigator.bluetooth })
```

- `secureContext` must be `true`. Use HTTPS, or for local development run
  `pnpm dev` and open `http://localhost:5173/pax-romana/` (use the port Vite prints).
  Plain HTTP on a LAN IP is not a secure context.
- Linux Chrome/Chromium users may need to change a browser flag before pairing
  works. If `bluetooth` is `"undefined"`, open
  `chrome://flags/#enable-experimental-web-platform-features`, set **Experimental
  Web Platform features** to **Enabled**, then fully restart the browser.
  This enables experimental features beyond Bluetooth; Flatseal permissions
  alone do not expose the Web Bluetooth API.
- For Chrome Flatpak, check `flatpak info --show-permissions com.google.Chrome`.
  The **System Bus Policy** should include `org.bluez=talk`. In Flatseal, allow
  `org.bluez` under **System Bus → Talks**, or grant it explicitly:

  ```sh
  flatpak override --user --system-talk-name=org.bluez com.google.Chrome
  ```

  Fully close and reopen Chrome after changing flags or permissions. Use the
  appropriate app ID for another Chromium-based Flatpak.
- Once the API is available, ensure the host Bluetooth adapter is on and the PAX
  is in pairing mode (blue light). If the sandbox still prevents discovery, try a
  native Chrome/Chromium installation to isolate a Flatpak-specific issue.

References: [Web Bluetooth implementation status](https://github.com/whatwg/bluetooth/blob/main/implementation-status.md)
and [Chrome Flatpak Bluetooth permissions](https://github.com/flathub/com.google.Chrome/issues/18).

### Vite WebSocket errors

Vite's development WebSocket provides hot reload; its failure does not remove
`navigator.bluetooth`. First try the exact local URL printed by `pnpm dev` and
reload the page. If serving Vite through a reverse proxy, the proxy must forward
WebSocket upgrades as well as HTTP under `/pax-romana/`. Configure `server.hmr`
for that proxy's actual public host/port only if necessary; do not assume its
WebSocket port is always 5173.
