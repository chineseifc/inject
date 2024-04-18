import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';
import { bscTestnet } from 'viem/chains';

export const Connect = () => {
  const { connectAsync } = useConnect();
  const { address } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const [connecting, setConnecting] = useState(false); // 添加了连接状态的状态变量
  const [disconnecting, setDisconnecting] = useState(false); // 添加了断开连接状态的状态变量
  const [errors, setErrors] = useState<string | undefined>(undefined);

  const handleConnect = async () => {
    try {
      setErrors('');
      setConnecting(true); // 开始连接操作
      if (!address) {
        await connectAsync({ chainId: bscTestnet.id, connector: injected() });       
        setDisconnecting(false); // 设置断开连接状态为 false
      } else {
        await disconnectAsync();
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
          disabled={connecting || disconnecting} // 根据连接或断开连接状态来禁用按钮
          onClick={handleConnect}
        >
          {connecting ? "Connecting..." : "Connect"} {/* 根据连接状态显示相应的文本 */}
        </button>
      )}
      {address && (
        <button 
        //   disabled={connecting || disconnecting} // 根据连接或断开连接状态来禁用按钮
          onClick={handleConnect}
        >
          {disconnecting ? "Disconnecting..." : "Disconnect"} {/* 根据断开连接状态显示相应的文本 */}
        </button>
      )}
      {errors && <p>{errors}</p>}
    </>
  );
};
