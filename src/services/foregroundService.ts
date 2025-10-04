import notifee, {
  AndroidColor,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';

const NOTIF_ID = 'divine-running';
const CHANNEL_ID = 'divine_timer_channel';

export async function ensureNotificationPermission() {
  try {
    await notifee.requestPermission();
  } catch {}
}

export async function startForegroundService(title: string, body: string) {
  await ensureNotificationPermission();

  const channelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Divine Yoga Timer',
    importance: AndroidImportance.HIGH, // visible but not noisy (we won't set a sound)
  });

  await notifee.displayNotification({
    id: NOTIF_ID,
    title,
    body,
    android: {
      channelId,
      asForegroundService: true,
      ongoing: true, // user can't swipe it away
      smallIcon: 'ic_stat_bell', // drawable (white vector)
      color: AndroidColor.PURPLE,
      onlyAlertOnce: true,
      showTimestamp: false,
      actions: [
        { title: '⏸ Pause', pressAction: { id: 'pause' } },
        { title: '⏹ Stop', pressAction: { id: 'stop' } },
      ],
    },
  });

  // keep service alive until stopped
  await notifee.registerForegroundService(() => new Promise(() => {}));
}

export async function updateForegroundBody(body: string) {
  await notifee.displayNotification({
    id: NOTIF_ID,
    title: '🕉️ Divine Yoga Studio',
    body,
    android: {
      channelId: CHANNEL_ID,
      asForegroundService: true,
      ongoing: true,
      smallIcon: 'ic_stat_bell',
      onlyAlertOnce: true,
      showTimestamp: false,
    },
  });
}

export async function stopForegroundService() {
  try {
    await notifee.cancelNotification(NOTIF_ID);
    await notifee.stopForegroundService();
  } catch {}
}

/** Call once in App.tsx to wire the notif buttons to your timer controls */
export function attachNotificationHandlers(opts: {
  onPause?: () => void,
  onStop?: () => void,
}) {
  return notifee.onForegroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
      const id = detail.pressAction?.id;
      if (id === 'pause') opts.onPause?.();
      if (id === 'stop') opts.onStop?.();
    }
  });
}
