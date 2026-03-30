// Re-export the base fixture from Playwright
// Override or extend test/expect here if needed
import { test as base, expect } from '@playwright/test';

export const test = base;
export { expect };
