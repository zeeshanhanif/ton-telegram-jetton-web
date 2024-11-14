import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import { useJettonContract } from './hooks/useJettonContract';

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const { totalSupply, contractAddress, mintToken, myBalance } = useJettonContract();

  return (
    <div className='App'>
      <div className='Container'>
        <TonConnectButton />

        <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{value ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>

      <div className='Container'>
        <div className='Card'>
          <b>Jetton Minter Contract Address</b>
          <div className='Hint'>{contractAddress}</div>
        </div>

        <div className='Card'>
          <b>Jetton Total Supply</b>
          <div>{totalSupply ?? 'Loading...'}</div>
        </div>

        <a
          className={`Button ${connected ? 'Active' : 'Disabled'}`}
          onClick={() => {
            mintToken();
          }}
        >
          Mint Tokens
        </a>

        <div className='Card'>
          <b>My Address Address</b>
          <div className='Hint'>{"N/A"}</div>
        </div>

        <div className='Card'>
          <b>My Balance</b>
          <div className='Hint'>{myBalance}</div>
        </div>
      </div>
      
    </div>
  );
}

export default App
