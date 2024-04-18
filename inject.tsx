import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';
import { bscTestnet } from 'viem/chains';

export const Connect = () => {
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [errors, setErrors] = useState<string | undefined>(undefined);

  const handleConnect = async () => {
    try {
      setErrors('');
      setConnecting(true); // 开始连接操作
      if (address) {
        await disconnectAsync();
        setDisconnecting(false); // 设置断开连接状态为 false
      } else {
        await connectAsync({ chainId: bscTestnet.id, connector: injected() });
        setConnecting(false); // 设置连接状态为 false
      }
    } catch (err) {
      console.log(err);
      setConnecting(false);
      setErrors("Connection failed. Please try again.");
    }
  };

  return (
    <>
      {!address && (
        <button 
          disabled={connecting || disconnecting}
          onClick={handleConnect}
        >
          {connecting ? "Connecting..." : "Connect"}
        </button>
      )}
      {address && (
        <button 
          disabled={connecting || disconnecting}
          onClick={async () => {
            try {
              setErrors('');
              setDisconnecting(true); // 开始断开连接操作
              await disconnectAsync();
              setDisconnecting(false); // 设置断开连接状态为 false
            } catch (err) {
              console.log(err);
              setDisconnecting(false);
              setErrors("Disconnection failed. Please try again.");
            }
          }}
        >
          {disconnecting ? "Disconnecting..." : "Disconnect"}
        </button>
      )}
      {errors && <p>{errors}</p>}
    </>
  );
};
