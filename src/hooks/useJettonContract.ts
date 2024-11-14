import { useEffect, useState } from 'react';
import { JettonMinter } from '../contracts/JettonMinter';
import { JettonWallet } from '../contracts/JettonWallet';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract, toNano } from '@ton/core';

export function useJettonContract() {
  const client = useTonClient();
  const [totalSupply, setTotalSupply] = useState<null | string>();
  const [myBalance, setMyBalance] = useState<null | string>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const jettonMinter = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new JettonMinter(
      Address.parse('EQAZYVwAID7YliVDlc1SZg_2rbhIcOgjdUwA5HHGMgmTnC3X') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<JettonMinter>;
  }, [client]);

  const jettonWallet = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new JettonWallet(
      Address.parse('0QD-dqOn-nz1Rf-VpCDWWpvrttkgytFj-qVZb4E6g_z9aloF') // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<JettonWallet>;
  }, [client]);

  
  useEffect(() => {
    async function getTotalSupplyAmount() {
      if (!jettonMinter) return;
      setTotalSupply(null);
      const _totalSupply = await jettonMinter.getTotalSupply();
      setTotalSupply(_totalSupply.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getTotalSupplyAmount();
    }
    getTotalSupplyAmount();
  }, [jettonMinter]);

  useEffect(() => {
    async function getMyBalance() {
      if (!jettonMinter) return;
      setMyBalance(null);
      const _myBalance = await jettonWallet?.getJettonBalance();
      setMyBalance(_myBalance?.toString());
      await sleep(5000); // sleep 5 seconds and poll value again
      getMyBalance();
    }
    getMyBalance();
  }, [jettonWallet]);

  return {
    totalSupply: totalSupply,
    contractAddress: jettonMinter?.address.toString(),
    myAddress: sender.address,
    mintToken: () => {
      let mintAddress:Address = Address.parse('0QD-dqOn-nz1Rf-VpCDWWpvrttkgytFj-qVZb4E6g_z9aloF')
      return jettonMinter?.sendMint(sender, mintAddress,toNano("5"),toNano('0.05'), toNano('0.1'));
    },
    myBalance: myBalance,
  };
}
