import { useEffect, useRef, useState } from 'react';
import { playBell } from '../audio/bell';
import {
  startForegroundService,
  stopForegroundService,
  updateForegroundBody,
} from '../services/foregroundService';

/**
 * options:
 * - loop: boolean
 * - label: string
 * - bellType: 'mandir' | 'om' | 'ting' | 'low' | 'high'
 * - bellEvery: seconds interval (default 10)
 */
export function useTimer(
  targetSeconds,
  options = {
    loop: true,
    label: 'Yoga Timer',
    bellType: 'mandir',
    bellEvery: 10,
  },
) {
  const loop = options.loop ?? true;
  const label = options.label ?? 'Yoga Timer';
  const bellType = options.bellType ?? 'mandir';
  const bellEvery = Math.max(1, options.bellEvery ?? 10);

  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(targetSeconds);
  const [cycles, setCycles] = useState(0);

  const startMs = useRef(null);
  const pausedAccumMs = useRef(0);
  const pauseStartMs = useRef(null);

  const uiTick = useRef(null);
  const bellTo = useRef(null);

  useEffect(() => setRemaining(targetSeconds), [targetSeconds]);

  const now = () => Date.now();
  const elapsedMs = () =>
    startMs.current ? now() - startMs.current - pausedAccumMs.current : 0;

  const clearTimers = () => {
    if (uiTick.current) clearInterval(uiTick.current);
    if (bellTo.current) clearTimeout(bellTo.current);
    uiTick.current = null;
    bellTo.current = null;
  };

  const startUI = () => {
    if (uiTick.current) clearInterval(uiTick.current);
    uiTick.current = setInterval(() => {
      const rem = Math.max(0, targetSeconds - Math.floor(elapsedMs() / 1000));
      setRemaining(rem);
    }, 250);
  };

  const scheduleNextBell = () => {
    if (!startMs.current) return;
    const elapsedSec = Math.floor(elapsedMs() / 1000);

    let next = Math.max(
      bellEvery,
      Math.ceil(elapsedSec / bellEvery) * bellEvery,
    );
    if (next > targetSeconds) next = targetSeconds;

    const msUntil = next * 1000 - elapsedMs();
    if (bellTo.current) clearTimeout(bellTo.current);
    bellTo.current = setTimeout(async () => {
      playBell(bellType);

      if (next >= targetSeconds) {
        setCycles(c => c + 1);
        if (loop) {
          startMs.current = now();
          pausedAccumMs.current = 0;
          pauseStartMs.current = null;
          setRunning(true);
          setRemaining(targetSeconds);
          startUI();
          scheduleNextBell();
          await updateForegroundBody(`${label} · Cycle ${cycles + 1}`);
        } else {
          setRunning(false);
          clearTimers();
          await stopForegroundService();
          setRemaining(0);
        }
      } else {
        scheduleNextBell();
      }
    }, Math.max(0, msUntil));
  };

  const start = async () => {
    if (running) return;
    startMs.current = now();
    pausedAccumMs.current = 0;
    pauseStartMs.current = null;
    setRunning(true);
    startUI();
    scheduleNextBell();
    await startForegroundService('🕉️ Divine Yoga Studio', `${label} running…`);
  };

  const pause = async () => {
    if (!running || pauseStartMs.current != null) return;
    pauseStartMs.current = now();
    setRunning(false);
    if (uiTick.current) clearInterval(uiTick.current);
    if (bellTo.current) clearTimeout(bellTo.current);
    await updateForegroundBody(`${label} paused`);
  };

  const resume = async () => {
    if (running || pauseStartMs.current == null) return;
    pausedAccumMs.current += now() - pauseStartMs.current;
    pauseStartMs.current = null;
    setRunning(true);
    startUI();
    scheduleNextBell();
    await updateForegroundBody(`${label} running…`);
  };

  const reset = async () => {
    setRunning(false);
    clearTimers();
    startMs.current = null;
    pauseStartMs.current = null;
    pausedAccumMs.current = 0;
    setRemaining(targetSeconds);
    await stopForegroundService();
  };

  const stop = async () => {
    setRunning(false);
    clearTimers();
    startMs.current = null;
    pauseStartMs.current = null;
    pausedAccumMs.current = 0;
    setRemaining(targetSeconds);
    setCycles(0);
    await stopForegroundService();
  };

  useEffect(
    () => () => {
      clearTimers();
      stopForegroundService();
    },
    [],
  );

  return { running, remaining, cycles, start, pause, resume, reset, stop };
}
