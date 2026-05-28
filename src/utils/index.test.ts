import { describe, it, expect } from 'vitest';
import * as utils from './index';

describe('utils/index', () => {
  it('should have exported members', () => {
    expect(Object.keys(utils).length).toBeGreaterThan(0);
  });
});
