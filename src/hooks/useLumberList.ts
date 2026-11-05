import { useCallback, useMemo, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { BoardEntry, computeTotals } from '../game/lumber';
import { HAPTICS_ENABLED, THUD_MS } from '../constants/config';

export type BoardDraft = {
  thicknessIn: number;
  widthIn: number;
  lengthFt: number;
  qty: number;
  speciesId: string;
};

export function useLumberList(overagePct: number) {
  const [boards, setBoards] = useState<BoardEntry[]>([]);
  const [lastAddedId, setLastAddedId] = useState('');
  const seq = useRef(0);

  const addBoard = useCallback((draft: BoardDraft) => {
    seq.current += 1;
    const id = 'b' + seq.current;
    setBoards(prev => prev.concat({ id, ...draft }));
    setLastAddedId(id);
    if (HAPTICS_ENABLED) {
      Vibration.vibrate(THUD_MS);
    }
  }, []);

  const removeBoard = useCallback((id: string) => {
    setBoards(prev => prev.filter(b => b.id !== id));
  }, []);

  const clearBoards = useCallback(() => {
    setBoards([]);
    setLastAddedId('');
  }, []);

  const totals = useMemo(() => computeTotals(boards, overagePct), [boards, overagePct]);

  return { boards, totals, lastAddedId, addBoard, removeBoard, clearBoards };
}

export default useLumberList;
