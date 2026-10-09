// Platform detection helper.
import { Capacitor } from '@capacitor/core';

export function isNative() {
  try {
    return Capacitor.isNativePlatform();
  } catch (e) {
    return false;
  }
}

export function isAndroid() {
  try {
    return Capacitor.getPlatform() === 'android';
  } catch (e) {
    return false;
  }
}
