/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const hre = require('hardhat')

async function main() {
  
  const DuckHunter = await hre.ethers.getContractFactory('DuckHunter')

  const drop = [
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    1000,
    1000,
    1000,
    1,
    false,
  ]

  const drop2 = [
    'test2',
    'test2',
    'test2',
    'test2',
    'test2',
    'test2',
    'test2',
    1000,
    1000,
    1000,
    1,
    false,
  ]
  
  const duckHunter = await DuckHunter.deploy()

  await duckHunter.deployed()

  console.log('DuckHunter deployed to:', duckHunter.address)

  /*const addDropTx1 = await duckHunter.addDrop(drop)
  const addDropTx2 = await duckHunter.addDrop(drop)

  await addDropTx1.wait()
  await addDropTx2.wait()

  const updateDropTx = await duckHunter.updateDrop(0, drop2)

  await updateDropTx.wait()

  const approveDropTx = await duckHunter.approveDrop(0)

  await approveDropTx.wait()

  console.log(await duckHunter.getDrops())*/

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
