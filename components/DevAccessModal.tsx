import React, { useState } from 'react';
import { XIcon, DatabaseZapIcon, BadgeDollarSignIcon, Layers3dIcon } from './icons';
import SystemStatus from './SystemStatus';

interface DevAccessModalProps {
    onClose: () => void;
}

const AdsManagement: React.FC = () => {
    const [adsEnabled, setAdsEnabled] = useState(false);
    const [adScript, setAdScript] = useState('<!-- Masukkan script iklan Anda di sini (misal: AdSense) -->');

    return (
         <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
                <BadgeDollarSignIcon className="w-5 h-5 mr-3 text-yellow-400"/>
                Ads Management
            </h3>
            <div className="p-4 bg-black/30 rounded-lg space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/20 rounded-md">
                    <label htmlFor="ads-toggle" className="font-semibold text-white">Aktifkan Iklan (Mode Dev)</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                            type="checkbox" 
                            name="ads-toggle" 
                            id="ads-toggle"
                            checked={adsEnabled}
                            onChange={() => setAdsEnabled(!adsEnabled)}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-400 appearance-none cursor-pointer"
                        />
                        <label htmlFor="ads-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>
                 <p className="text-xs text-gray-400 px-1">
                    Script iklan hanya akan dimuat jika toggle ini aktif.
                </p>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Kode Script Iklan</label>
                    <textarea 
                        value={adScript}
                        onChange={(e) => setAdScript(e.target.value)}
                        rows={5}
                        className="w-full p-2 bg-black/40 border border-[var(--border-color)] rounded-md font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cyan)]"
                        placeholder="<!-- Paste your ad script here -->"
                    />
                </div>
            </div>
        </div>
    )
}


const DevAccessModal: React.FC<DevAccessModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'health' | 'ads'>('health');

    const TabButton = ({ tab, label, active }: { tab: 'health' | 'ads', label: string, active: boolean }) => (
        <button
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-bold transition-all duration-300 border-b-2 ${
            active 
              ? 'border-[var(--color-accent-cyan)] text-[var(--color-accent-cyan)]' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-3xl">
                 <div className="holographic-card p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold flex items-center text-shadow-cyan">
                           <Layers3dIcon className="w-7 h-7 mr-3" />
                           Developer Control Panel
                        </h2>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors"><XIcon className="w-6 h-6"/></button>
                    </div>

                    <div className="border-b border-[var(--border-color)] border-opacity-50 mb-4">
                        <TabButton tab="health" label="System Health" active={activeTab === 'health'} />
                        <TabButton tab="ads" label="Ads Management" active={activeTab === 'ads'} />
                    </div>

                    <div className="py-4">
                        {activeTab === 'health' && <SystemStatus />}
                        {activeTab === 'ads' && <AdsManagement />}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DevAccessModal;