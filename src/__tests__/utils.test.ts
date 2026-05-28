import { createPageUrl } from '../utils';

describe('createPageUrl', () => {
  it('replaces spaces with dashes', () => {
    expect(createPageUrl('My Page Name')).toBe('/My-Page-Name');
  });
});
