/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

import DuckHunter from './../artifacts/contracts/DuckHunter.sol/DuckHunter.json'

const contractAddress = '0x8ef6BA8415450bF88BD8179E6334bF632e4e44E0'

const initialState = {
  connected: false,
  status: null,
  account: null, 
  contract:null
}

const initialDropState= {
  loading: false,
  list: []
}
const DropList = () => {
  const [info, setInfo] = useState(initialState)
  const [drops, setDrops] = useState(initialDropState)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  
  useEffect(() => {
    init()
    initOnChange()
  }, [])

  const init = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await requestMetamask('eth_requestAccounts')
      const networkId = await requestMetamask('net_version')

      if(Number(networkId) === 3 ){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          contractAddress,
          DuckHunter.abi,
          signer
        )

        setInfo((prevState) => ({
          ...prevState,
          account: account,
          contract: contract,
          connected: true
        }))
        
      } else {
        setInfo((prevState) => ({
          ...prevState,
          status: 'You need to be on Ropsten network'
        }))
      }
     
    } else {
      setInfo((prevState) => ({
        ...prevState,
        status: 'You need metamask installed'
      }))
    }
  }

  const initOnChange = () => {
    if(window.ethereum){
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }

  const requestMetamask = async (method) => {
    return await window.ethereum.request({ method })
  }

  const getDrops = async () => {
    try {
      setDrops((prevState) => ({
        ...prevState,
        loading:true
      }))
      const result = await info.contract.getDrops()
      console.log(result)
      setDrops((prevState) => ({
        ...prevState,
        loading:false,
        list: result
      }))
    } catch (error) {
      console.log(error)
    }
  }
  const onSubmit = async (data) =>{
    const newData = {
      imageUri: data.imageUri,
      name: data.name,
      description: data.description,
      social_1: data.social_1,
      social_2: data.social_2,
      website: data.website,
      price: data.price,
      supply: Number(data.supply),
      presale: Number(data.presale),
      sale: Number(data.sale),
      chain: Number(data.chain),
      approved: false
    }

    const newDrop = Object.values(newData)
    try {
      const transation = await info.contract.addDrop(newDrop)
      await transation.wait()
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <div className='header'>
        <h3>NFT DuckHunter</h3>
      </div>
      <div className='content'>
        <Tabs>
          <TabList>
            <Tab>Title 1</Tab>
            <Tab>Title 2</Tab>
          </TabList>
          <TabPanel>
            <button onClick={getDrops}>get drops</button>
            {drops.loading ? <p>Loading</p> : null}
            <div style={{ height: 50 }}></div>
            {drops.list.map((item, index) => (
              <div className='dropContainer' key={index}>
                <div>
                  <p className='dropText'>{item.name}</p>
                  <p className='dropText'>{item.description}</p>
                  <div style={{ height: 50 }}></div>
                  <img className='dropImage' src={item.imageUri} />
                </div>
                <div>
                  <p className='dropText'>LinkedIn: {item.social_1}</p>
                  <p className='dropText'>Descord: {item.social_2}</p>
                </div>
                <div>
                  <p className='dropText'>
                    Total Supply: {ethers.utils.formatEther(item.supply)}
                  </p>
                  <p className='dropText'>
                    Presale Date: {ethers.utils.formatEther(item.presale)}
                  </p>
                  <p className='dropText'>
                    Sale Date: {ethers.utils.formatEther(item.sale)}
                  </p>
                </div>
              </div>
            ))}
          </TabPanel>
          <TabPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>imageUri</label>
              <input {...register('imageUri')} />
              <br />
              <label>name</label>
              <input {...register('name')} />
              <br />
              <label>description</label>
              <input {...register('description')} />
              <br />
              <label>linkedin</label>
              <input {...register('social_1')} />
              <br />
              <label>discord</label>
              <input {...register('social_2')} />
              <br />
              <label>website</label>
              <input {...register('website')} />
              <br />
              <label>price</label>
              <input {...register('price')} />
              <br />
              <label>supply</label>
              <input {...register('supply')} />
              <br />
              <label>presale</label>
              <input {...register('presale')} />
              <br />
              <label>sale</label>
              <input {...register('sale')} />
              <br />
              <label>chain</label>
              <input {...register('chain')} />
              <br />
              <input type={'submit'} />
            </form>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

export default DropList
