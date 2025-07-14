import { useEffect, useState } from 'react';

export default function Home() {
  const [networkInfo, setNetworkInfo] = useState({});
  const [imageSrc, setImageSrc] = useState('/high-res.jpg');

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    function updateNetworkInfo() {
      if (!connection) {
        setNetworkInfo({ unsupported: true });
        return;
      }

      const { effectiveType, downlink, saveData } = connection;
      setNetworkInfo({ effectiveType, downlink, saveData });

      if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
        setImageSrc('/low-res.jpg');
      } else {
        setImageSrc('/high-res.jpg');
      }
    }

    updateNetworkInfo();
    connection?.addEventListener('change', updateNetworkInfo);

    return () => {
      connection?.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">📶 Smart Content Loader</h1>

      {networkInfo.unsupported ? (
        <p className="text-red-500">Network Information API is not supported in this browser.</p>
      ) : (
        <div className="text-center mb-6">
          <p><strong>Effective Type:</strong> {networkInfo.effectiveType}</p>
          <p><strong>Downlink:</strong> {networkInfo.downlink} Mbps</p>
          <p><strong>Save Data:</strong> {networkInfo.saveData ? 'Enabled' : 'Disabled'}</p>
        </div>
      )}

      <img
        src={imageSrc}
        alt="Adaptive content"
        className="w-full max-w-md rounded shadow-lg transition duration-300"
      />
    </div>
  );
}