/**
 * BoardFootReckoner — app shell.
 * Pure state machine (rule #2): loader -> menu -> game -> gameover -> menu.
 * No react-navigation, no gameplay logic here.
 */
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DEFAULT_LIST_NAME,
  DEFAULT_OVERAGE,
  SEED_LISTS,
  SavedList,
} from './src/constants/config';
import { Totals, computeTotals } from './src/game/lumber';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import TotalsScreen from './src/screens/TotalsScreen';
import theme from './src/constants/theme';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';
type SheetKind = 'none' | 'species' | 'overage';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [lists, setLists] = useState<SavedList[]>(SEED_LISTS);
  const [overagePct, setOveragePct] = useState(DEFAULT_OVERAGE);
  const [initialSheet, setInitialSheet] = useState<SheetKind>('none');
  const [session, setSession] = useState(0);
  const [summary, setSummary] = useState<Totals>(() => computeTotals([], DEFAULT_OVERAGE));
  const [listName, setListName] = useState(DEFAULT_LIST_NAME);

  const listSeq = useRef(3);

  const goMenu = useCallback(() => {
    setInitialSheet('none');
    setScreen('menu');
  }, []);

  const startList = useCallback(() => {
    listSeq.current += 1;
    setListName('CUT LIST ' + String(listSeq.current).padStart(2, '0'));
    setInitialSheet('none');
    setSession(n => n + 1);
    setScreen('game');
  }, []);

  const startWithSpecies = useCallback(() => {
    listSeq.current += 1;
    setListName('CUT LIST ' + String(listSeq.current).padStart(2, '0'));
    setInitialSheet('species');
    setSession(n => n + 1);
    setScreen('game');
  }, []);

  const planAgain = useCallback(() => {
    setInitialSheet('none');
    setSession(n => n + 1);
    setScreen('game');
  }, []);

  const finishList = useCallback((totals: Totals, name: string) => {
    setSummary(totals);
    setListName(name);
    setScreen('gameover');
  }, []);

  const saveList = useCallback(() => {
    setLists(prev => {
      if (summary.boards === 0) {
        return prev;
      }
      const entry: SavedList = {
        id: 'list-' + listName + '-' + prev.length,
        name: listName,
        boards: summary.boards,
        boardFeet: summary.boardFeet,
        kilograms: summary.kilograms,
        speciesCount: summary.bySpecies.length,
        tone: theme.colors.earth.green,
      };
      return [entry].concat(prev).slice(0, 4);
    });
  }, [summary, listName]);

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen lists={lists} onStart={startList} onOpenSpecies={startWithSpecies} />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={'session-' + session}
          listName={listName}
          overagePct={overagePct}
          initialSheet={initialSheet}
          onOverageChange={setOveragePct}
          onExit={goMenu}
          onFinish={finishList}
        />
      ) : null}

      {screen === 'gameover' ? (
        <TotalsScreen
          totals={summary}
          listName={listName}
          onPlanAgain={planAgain}
          onMenu={goMenu}
          onSave={saveList}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
