const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const UniswapOracle = artifacts.require('UniswapOracle');

contract('UniswapOracle', function () {
    before(async function () {
        this.uniswapOracle = await UniswapOracle.new();
    });

    it('weth -> dai', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.WETH, tokens.DAI, tokens.ETH);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('eth -> dai', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        expect(rate.rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('dai -> eth', async function () {
        const rate = await this.uniswapOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        expect(rate.rate).to.be.bignumber.lessThan(ether('0.001'));
    });
});