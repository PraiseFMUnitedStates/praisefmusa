
import React from 'react';
import { RAW_SCHEDULE, HOSTS, LOGO_URL } from '../constants';
import { View, Show } from '../types';
import { mapToShow } from '../utils';

interface MoreFromSectionProps {
  onNavigate: (view: View, show?: Show) => void;
}

const FEATURED_ITEMS = [
    RAW_SCHEDULE.find(s => s.name === "Morning Show"),
    RAW_SCHEDULE.find(s => s.name === "Sunday Morning With Christ"),
    RAW_SCHEDULE.find(s => s.name === "Future Artists"),
    RAW_SCHEDULE.find(s => s.name === "Praise FM POP"),
    RAW_SCHEDULE.find(s => s.name === "Praise FM Classics"),
    RAW_SCHEDULE.find(s => s.name === "Living The Message"),
].filter(Boolean);

const MoreFromSection: React.FC<MoreFromSectionProps> = ({ onNavigate }) => {
    
    return (
        <section className="bg-white py-12 md:py-24 border-t border-r1-gray">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                   <div className="h-8 md:h-14">
                      <img src={LOGO_URL} alt="Praise FM USA" className="h-full w-auto object-contain" />
                   </div>
                   <h2 className="text-2xl md:text-6xl font-black text-black tracking-tighter mb-0 uppercase leading-none">
                      More <span className="text-gray-200">From Us</span>
                   </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-10">
                    {FEATURED_ITEMS.map((item, idx) => {
                        if (!item) return null;
                        const presenter = HOSTS[item.name] || "Praise FM";
                        const show = mapToShow(item);
                        
                        return (
                            <div 
                                key={`${item.name}-${idx}`} 
                                className="group flex flex-col animate-fade-in"
                                onClick={() => onNavigate('programme-detail', show)}
                            >
                                <div className="aspect-[16/9] overflow-hidden bg-r1-gray mb-4 md:mb-6 shadow-sm border-b-2 md:border-b-4 border-transparent transition-all group-hover:border-praise-orange cursor-pointer">
                                    <img 
                                        src={item.img} 
                                        alt={item.name} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-praise-orange mb-2 md:mb-3">Highlight</span>

                                <h3 
                                  className="text-base md:text-xl sw-program-title l:sw-justify-self-start leading-tight mb-1 md:mb-2 font-bold cursor-pointer group-hover:underline uppercase tracking-tight"
                                >
                                    {item.name} <span className="text-praise-orange">›</span>
                                </h3>

                                <p className="text-[9px] md:text-[10px] font-normal uppercase tracking-widest text-gray-400 mb-3 md:mb-4">
                                    with {presenter}
                                </p>
                                
                                <p className="text-[11px] md:text-xs font-normal text-gray-500 line-clamp-2 leading-relaxed mb-4 md:mb-6 tracking-tight">
                                    {item.desc}
                                </p>
                                
                                <div className="mt-auto flex flex-col gap-2">
                                  <div 
                                    className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-black self-start border-b border-black pb-1 hover:text-praise-orange hover:border-praise-orange transition-all cursor-pointer"
                                  >
                                      View Guide
                                  </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MoreFromSection;
