import fetch from 'isomorphic-unfetch';
import { expect } from 'chai';
import { wrapFetch, WrappedFetchApi } from '../src';

describe('wrapFetch', () => {
  let wrapped: WrappedFetchApi;

  before(() => {
    wrapped = wrapFetch(fetch, 'http://localhost:3000');
  });

  it('exposes DELETE method', () => {
    expect(wrapped.del).to.be.a('function');
  });

  it('exposes GET method', () => {
    expect(wrapped.get).to.be.a('function');
  });

  it('exposes PATCH method', () => {
    expect(wrapped.patch).to.be.a('function');
  });

  it('exposes POST method', () => {
    expect(wrapped.post).to.be.a('function');
  });

  it('exposes PUT method', () => {
    expect(wrapped.put).to.be.a('function');
  });
});
