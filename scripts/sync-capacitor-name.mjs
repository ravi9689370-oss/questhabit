import { APP_NAME } from '../src/config.js';
import { readFileSync, writeFileSync } from 'node:fs';

const capPath = new URL('../capacitor.config.json', import.meta.url);
const cap = JSON.parse(readFileSync(capPath, 'utf8'));
cap.appName = APP_NAME;
writeFileSync(capPath, JSON.stringify(cap, null, 2) + '\n');
console.log(`[sync] capacitor.config.json appName = "${APP_NAME}"`);
