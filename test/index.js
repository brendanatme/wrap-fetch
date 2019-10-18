/**
 * TODO: test
 */ 
import fetch from 'isomorphic-unfetch';
import { wrapFetch } from '../src';
import { expect } from 'chai';

describe('wrapFetch', () => {
  let wrapped;

  before(() => {
    wrapped = wrapFetch(fetch, 'http://localhost:3000');
  });

  it('exposes GET method', () => {
    expect(wrapped.get).to.be.a('function');
  });

  it('exposes POST method', () => {
    expect(wrapped.post).to.be.a('function');
  });
});
