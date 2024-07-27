import './App.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useMainContract } from './hooks/useMainContract';
import { useTonConnect } from './hooks/useTonConnect';

const walletAddress = 'kQASVWZJJQ-tx0JUlgfEWCGf3cxQN67kU_LpVl6oBOjW0ejC';

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect();

  console.log('useMainContract :>> ', {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
  });

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className="Card">
          <b>Our contract Address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + '...'}</div>
          <b>Our contract Balance</b>
          <div className="Hint">{contract_balance}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{counter_value ?? 'Loading...'}</div>
        </div>
      </div>

      {connected && (
        <>
          <a
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </a>
          <br />
          <a
            onClick={() => {
              sendDeposit();
            }}
          >
            sendDeposit
          </a>
          <br />
          <a
            onClick={() => {
              sendWithdrawalRequest();
            }}
          >
            sendWithdrawalRequest
          </a>
        </>
      )}
    </div>
  );
}

export default App;
