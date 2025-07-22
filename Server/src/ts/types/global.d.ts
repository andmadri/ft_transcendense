// src/types/global.d.ts
import '@tensorflow/tfjs'; // Just to pull in the types
declare global {
  const tf: typeof import('@tensorflow/tfjs');
}