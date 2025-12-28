
import React from 'react';
import { CloseIcon, MusicIcon, HeartFilledIcon } from './Icons';

interface OfflinePromptProps {
  onClose: () => void;
  onGoToDownloads: () => void;
  onListenLive?: () => void;
  mode?: 'offline' | 'not-live';
}

const OfflinePrompt: React.FC<OfflinePromptProps> = ({ 
  onClose, 
  onGoToDownloads, 
  onListenLive,
  mode = 'offline' 
}) => {
  const isNotLive = mode === 'not-live';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up relative border-t-8 border-praise-orange">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-normal text-2xl">
               !
             </div>
             <h2 className="text-3xl md:text-4xl font-normal text-black tracking-tighter uppercase leading-none">
               {isNotLive ? 'Not On Air' : 'Signal Lost'}
             </h2>
          </div>

          <p className="text-gray-500 text-lg md:text-xl font-normal leading-relaxed mb-10">
            {isNotLive 
              ? "This program is outside of the current broadcast schedule. Join us live when this host returns to the airwaves!"
              : "It looks like you're offline. Don't let the signal stop the spirit — you can still listen to your saved worship anthems."}
          </p>

          <div className="bg-gray-50 p-6 mb-10 border-l-4 border-black">
             <h4 className="text-xs font-normal uppercase tracking-[0.2em] text-gray-400 mb-3">
               {isNotLive ? 'What to do next' : 'Offline Benefits'}
             </h4>
             <ul className="space-y-3">
                {isNotLive ? (
                  <>
                    <li>
                       <button 
                        onClick={onListenLive}
                        className="flex items-center gap-3 w-full text-left hover:text-praise-orange transition-colors group"
                       >
                          <div className="w-5 h-5 flex items-center justify-center text-praise-orange font-normal group-hover:translate-x-1 transition-transform">›</div>
                          <span className="text-sm font-normal text-gray-800 group-hover:text-praise-orange">Listen to the Current Live Show</span>
                       </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                       <MusicIcon className="w-5 h-5 text-praise-orange flex-shrink-0" />
                       <span className="text-sm font-normal text-gray-800">Uninterrupted Playback</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <HeartFilledIcon className="w-5 h-5 text-praise-orange flex-shrink-0" />
                       <span className="text-sm font-normal text-gray-800">Access My Sounds Anywhere</span>
                    </li>
                  </>
                )}
             </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <button 
               onClick={onGoToDownloads}
               className="flex-1 bg-black text-white font-normal uppercase text-xs tracking-[0.3em] py-5 px-8 hover:bg-praise-orange transition-all shadow-xl"
             >
               {isNotLive ? 'Back to Home' : 'Go to My Sounds'}
             </button>
             <button 
               onClick={onClose}
               className="flex-1 border-2 border-gray-100 text-gray-400 font-normal uppercase text-xs tracking-[0.3em] py-5 px-8 hover:border-black hover:text-black transition-all"
             >
               Dismiss
             </button>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
           <p className="text-[10px] font-normal text-gray-400 uppercase tracking-widest text-center">
              Praise FM USA • {isNotLive ? 'Broadcast Update' : 'Offline Mode'}
           </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePrompt;
