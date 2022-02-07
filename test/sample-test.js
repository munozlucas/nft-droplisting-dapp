/* eslint-disable no-undef */
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Greeter', function () {
  it('Should return the new greeting once it\'s changed', async function () {
    const DuckHunter = await ethers.getContractFactory('DuckHunter')
    const duckHunter = await DuckHunter.deploy()
    await duckHunter.deployed()

    expect(await duckHunter.greet()).to.equal('Hello, world!')

    const setGreetingTx = await duckHunter.setGreeting('Hola, mundo!')

    // wait until the transaction is mined
    await setGreetingTx.wait()

    expect(await duckHunter.greet()).to.equal('Hola, mundo!')
  })
})
