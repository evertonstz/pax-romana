import {
  BluetoothNotSupportedException,
  BluetoothSecurityException,
} from './exceptions';

// Keep this synchronous: requestDevice must run within the user's click gesture.
export function checkBluetoothSupport(): void {
  if (!window.isSecureContext) {
    throw new BluetoothSecurityException(
      'Web Bluetooth requires HTTPS or localhost. Open this app over HTTPS ' +
        'or at http://localhost:5173/pax-romana/.',
    );
  }

  if (typeof navigator.bluetooth?.requestDevice !== 'function') {
    throw new BluetoothNotSupportedException(
      'Web Bluetooth is unavailable in this browser. On Linux Chrome/Chromium, ' +
        'enable chrome://flags/#enable-experimental-web-platform-features and ' +
        'restart the browser. For Flatpak, also allow org.bluez on the system bus ' +
        'in Flatseal. See the README for troubleshooting.',
    );
  }
}
