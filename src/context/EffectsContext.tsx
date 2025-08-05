'use client';
import { createContext, useContext } from 'react';

export const EffectsContext = createContext(true);

export const useEffects = () => useContext(EffectsContext);
