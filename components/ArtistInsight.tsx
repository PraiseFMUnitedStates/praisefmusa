
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Track, User } from '../types';

interface ArtistInsightProps {
  track: Track | null;
  user: User | null;
}

const ArtistInsight: React.FC<ArtistInsightProps> = ({ track, user }) => {
  // Componente desativado conforme solicitação do usuário para retirar "Lyric Spotlight"
  return null;
};

export default ArtistInsight;
