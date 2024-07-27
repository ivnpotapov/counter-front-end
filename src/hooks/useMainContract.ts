import { useEffect, useState } from 'react';
import { MainContract } from '../contracts/MainContract';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, fromNano, OpenedContract, toNano } from 'ton-core';
import { useTonConnect } from './useTonConnect';

const contractAddress = 'EQB02rIlSnuPP4CN2NoZaSCVGG3yQklV8x9QjVQ7Pdq64epQ';

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;

    const contract = new MainContract(
      Address.parse(contractAddress) // replace with your address from tutorial 2 step 8
    );

    // @ts-expect-error ghj
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;

      setContractData(null);
      // @ts-expect-error ghj
      const val = await mainContract.getData();
      // @ts-expect-error ghj
      const { balance } = await mainContract.getBalance();

      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);

      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }

    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: fromNano(balance!),
    sendIncrement: () => {
      // @ts-expect-error ghj
      return mainContract?.sendIncrement(sender, toNano(0.05), 3);
    },
    sendDeposit: () => {
      // @ts-expect-error ghj
      return mainContract?.sendDeposit(sender, toNano(1));
    },
    sendWithdrawalRequest: () => {
      // @ts-expect-error ghj
      return mainContract?.sendWithdrawalRequest(sender, toNano(0.05), toNano(0.7));
    },
    ...contractData,
  };
}
