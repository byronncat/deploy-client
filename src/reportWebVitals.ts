import { onLCP, onFID, onCLS, onINP, onTTFB, onFCP } from 'web-vitals';

if (process.env.REACT_APP_WEB_VITALS_LOG === 'true') {
  onLCP(console.log);
  onFID(console.log);
  onCLS(console.log);
  onINP(console.log);
  onTTFB(console.log);
  onFCP(console.log);
}
