const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const uniswapV2Factory = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const initcodeHash = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f';
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

const IdentityWrapper = artifacts.require('IdentityWrapper');
const WethWrapper = artifacts.require('WethWrapper');
const UniswapV2LikeOracle = artifacts.require('UniswapV2LikeOracle');
const UniswapOracle = artifacts.require('UniswapOracle');
const MooniswapOracle = artifacts.require('MooniswapOracle');
const OffchainOracle = artifacts.require('OffchainOracle');

contract('OffchainOracle', function () {
    before(async function () {
        this.uniswapV2LikeOracle = await UniswapV2LikeOracle.new(uniswapV2Factory, initcodeHash);
        this.uniswapOracle = await UniswapOracle.new();
        this.mooniswapOracle = await MooniswapOracle.new(oneInchLP1);

        this.identityWrapper = await IdentityWrapper.new();
        this.wethWrapper = await WethWrapper.new();

        this.offchainOracle = await OffchainOracle.new();
        this.offchainOracle.addOracle(this.uniswapV2LikeOracle.address);
        this.offchainOracle.addOracle(this.uniswapOracle.address);
        this.offchainOracle.addOracle(this.mooniswapOracle.address);

        this.offchainOracle.addWrapper(this.identityWrapper.address);
        this.offchainOracle.addWrapper(this.wethWrapper.address);

        this.offchainOracle.addConnector(tokens.NONE);
        this.offchainOracle.addConnector(tokens.ETH);
        this.offchainOracle.addConnector(tokens.WETH);
        this.offchainOracle.addConnector(tokens.USDC);
    });

    it('weth -> dai', async function () {
        const rate = await this.offchainOracle.getRate(tokens.WETH, tokens.DAI);
        console.log(rate.toString());
        expect(rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('eth -> dai', async function () {
        const rate = await this.offchainOracle.getRate(tokens.ETH, tokens.DAI);
        console.log(rate.toString());
        expect(rate).to.be.bignumber.greaterThan(ether('1000'));
    });

    it('usdc -> dai', async function () {
        const rate = await this.offchainOracle.getRate(tokens.USDC, tokens.DAI);
        console.log(rate.toString());
        expect(rate).to.be.bignumber.greaterThan(ether('980000000000'));
    });
});
