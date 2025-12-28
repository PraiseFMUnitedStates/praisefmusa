
import React from 'react';
import { Track } from '../types';

interface GeminiDiscoveryProps {
  track: Track | null;
}

const GeminiDiscovery: React.FC<GeminiDiscoveryProps> = ({ track }) => {
  // Component disabled per user request to remove "About the Artist" sections.
  return null;
};

export default GeminiDiscovery;
