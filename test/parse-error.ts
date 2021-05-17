import { expect } from 'chai';
import { parseError } from '../src';

describe('parseError', () => {
  let err: Error;

  before(() => {
    err = new Error(JSON.stringify({
      status: 401,
      statusText: 'Unauthorized',
    }));
  });

  it('gets status and statusText from thrown error', () => {
    const e = parseError(err);
    
    expect(e.status).to.equal(401);
    expect(e.statusText).to.equal('Unauthorized');
  });
});
