import { expect } from 'chai';
import { parseError, wrapFetch } from '../src';

describe('index', () => {
  it('exposes wrapFetch method', () => {
    expect(wrapFetch).to.be.a('function');
  });

  it('exposes parseError method', () => {
    expect(parseError).to.be.a('function');
  });
});
