const { describe } = require('mocha')
const { assert, expect } = require('chai');

describe('test-block1', () => {
  it('test-block1 working', () => {
    assert.equal(0, 0);
  });
});

describe('test-block2-async', () => {
  it('test-block2 working', (done) => {
    setTimeout(() => {
      expect('async').to.equal('async');
      expect([]).to.be.a('array');
      done();
    }, 1e3);
  });
});