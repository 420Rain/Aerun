import { useDemoState } from '@/components/demo-state';
import type { ActiveRun, RunRecord } from '@/components/demo-state';
import { CONDITIONS, getCondition, getRoutePm, ROUTES, RouteKey, TIME_OPTIONS, TimeKey } from '@/data/mockData';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const C = { ink: '#000000', lime: '#8AFFFF', paper: '#F5F7F2', sage: '#E6EEE7', green: '#527F69', muted: '#71817A', line: '#DCE5DD', amber: '#F1B65C', white: '#FFFFFF', coral: '#D6755A', teal: '#168B83' };

export function Label({ children, style }: React.PropsWithChildren<{ style?: object }>) { return <Text style={[s.label, style]}>{children}</Text>; }
export function Copy({ children, style }: React.PropsWithChildren<{ style?: object }>) { return <Text style={[s.copy, style]}>{children}</Text>; }
export function Card({ children, style }: React.PropsWithChildren<{ style?: object }>) { return <View style={[s.card, style]}>{children}</View>; }

export function Header({ area = false, showAvatar = true }: { area?: boolean; showAvatar?: boolean }) {
  return <View style={s.header}>
    <View><Text style={s.wordmark}>Aerun<Text style={s.wordmarkDot}>.</Text></Text><Text style={s.tagline}>YOUR ROUTE. YOUR AIR.</Text></View>
    <View style={s.headerRight}>
      {area && <View style={s.location}><Text style={s.pin}>⌖</Text><Text style={s.locationText}>Metro Manila · Demo area</Text></View>}
      {showAvatar && <Pressable onPress={() => router.push('/account')} style={({ pressed }) => [s.headerAvatar, pressed && s.pressed]} accessibilityRole="button" accessibilityLabel="Open account">
        <Text style={s.headerAvatarText}>R</Text><View style={s.avatarOnline}/>
      </Pressable>}
    </View>
  </View>;
}
export function Screen({ children, bottomSafe = false }: React.PropsWithChildren<{ bottomSafe?: boolean }>) {
  return <SafeAreaView style={s.safe} edges={bottomSafe ? ['top', 'bottom'] : ['top']}><ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}<Text style={s.footer}>Aerun · An illustrative prototype for Metro Manila</Text></ScrollView></SafeAreaView>;
}
export function SectionTitle({ title, right }: { title: string; right?: string }) { return <View style={s.sectionHeading}><Text style={s.sectionTitle}>{title}</Text>{right ? <Text style={s.eyebrow}>{right}</Text> : null}</View>; }

function PrimaryButton({ title, onPress, secondary = false }: { title: string; onPress: () => void; secondary?: boolean }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [s.primary, secondary && s.primarySecondary, pressed && s.pressed]}><Text style={[s.primaryText, secondary && s.primarySecondaryText]}>{title}</Text><Text style={[s.primaryArrow, secondary && s.primarySecondaryText]}>↗</Text></Pressable>;
}
function MiniStat({ label, value, icon }: { label: string; value: string; icon: string }) { return <View style={s.miniStat}><Text style={s.statIcon}>{icon}</Text><Text style={s.statLabel}>{label}</Text><Text style={s.statValue}>{value}</Text></View>; }

function TimeSelector() {
  const { time, setTime } = useDemoState();
  const [open, setOpen] = useState(false);

  const selectTime = (item: TimeKey) => {
    setTime(item);
    setOpen(false);
  };

  return <>
    <Pressable
      onPress={() => setOpen(true)}
      style={({ pressed }) => [s.timeDropdown, pressed && s.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Selected run time ${time}. Open time selector.`}
      accessibilityState={{ expanded: open }}
    >
      <View style={s.timeDropdownCopy}>
        <Text style={s.timeDropdownLabel}>SELECTED RUN TIME</Text>
        <Text style={s.timeDropdownValue}>{time}</Text>
      </View>
      <View style={s.timeDropdownChevron}><Text style={s.timeDropdownChevronText}>⌄</Text></View>
    </Pressable>

    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <View style={s.timeModalRoot}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close time selector" />
        <View style={s.timeModalPanel}>
          <View style={s.timeModalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={s.timeModalTitle}>Choose a run time</Text>
              <Text style={s.timeModalSubtitle}>Scroll to select any hour of the day.</Text>
            </View>
            <Pressable onPress={() => setOpen(false)} style={s.timeModalClose} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={s.timeModalCloseText}>×</Text>
            </Pressable>
          </View>
          <ScrollView style={s.timeOptionsScroll} contentContainerStyle={s.timeOptionsContent} showsVerticalScrollIndicator>
            {TIME_OPTIONS.map(item => (
              <Pressable
                key={item}
                onPress={() => selectTime(item)}
                style={[s.timeOption, time === item && s.timeOptionActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: time === item }}
              >
                <Text style={[s.timeOptionText, time === item && s.timeOptionTextActive]}>{item}</Text>
                {time === item && <Text style={s.timeOptionCheck}>✓</Text>}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </>;
}

function ConditionCard({ time }: { time: TimeKey }) {
  const condition = CONDITIONS[time];
  const meterWidth = `${Math.min(100, Math.round(condition.pmMid * 2.5))}%` as `${number}%`;
  return <>
    <View style={s.pmCard}>
      <View style={s.pmTop}><Text style={s.pmLabel}>ILLUSTRATIVE PM2.5 ESTIMATE</Text><View style={s.pmIcon}><Text style={s.pmIconText}>✳</Text></View></View>
      <View style={s.pmNumberLine}><Text style={s.pmNumber}>{condition.pm}</Text><Text style={s.pmUnit}>µg/m³</Text></View>
      <Text style={s.pmCaption}>Demo model range · {condition.uncertainty} uncertainty</Text>
      <View style={s.pmMeter}><View style={[s.pmMeterFill, { width: meterWidth }]} /></View>
      <Text style={s.pmDisclaimer}>Illustrative estimate, not a measurement</Text>
    </View>
    <Card style={s.weatherCard}>
      <View style={s.weatherTop}><View><Label>AT {time.toUpperCase()} · DEMO CONDITIONS</Label><Text style={s.weatherName}>{condition.weather}</Text></View><Text style={s.weatherGlyph}>{condition.temperature >= 32 ? '☀' : time.includes('PM') ? '☾' : '☁'}</Text></View>
      <View style={s.statRow}><MiniStat icon="°" label="TEMP" value={`${condition.temperature}°`}/><MiniStat icon="◌" label="RAIN" value={`${condition.rain}%`}/><MiniStat icon="↗" label="WIND" value={`${condition.wind} km/h`}/></View>
    </Card>
  </>;
}

export function TodayScreen() {
  const { time } = useDemoState(); const condition = getCondition(time);
  return <Screen><Header area/><View style={s.intro}><Text style={s.greeting}>Plan a better run.</Text><Copy style={s.subheading}>Explore an hour-by-hour picture of the air and weather.</Copy></View>
    <ConditionCard time={time}/>
    <SectionTitle title="Choose a time" right="24-HOUR DEMO OUTLOOK"/><TimeSelector/>
    <Card style={s.recommendation}><View style={s.recIcon}><Text style={s.recIconText}>↗</Text></View><View style={s.recBody}><Label>RUN WINDOW SUGGESTION</Label><Text style={s.recTitle}>{condition.recommendation}</Text><Copy style={s.recCopy}>{condition.note} This is a demo recommendation, not health advice.</Copy></View></Card>
    <PrimaryButton title="Compare routes for this hour" onPress={() => router.navigate('/routes')}/>
    <Text style={s.disclaimer}>Values are illustrative mock data, not live measurements or health advice. Conditions can vary block by block.</Text>
  </Screen>;
}

// The map is a stylized street diagram of the Manila Bay / Ermita / Aseana area.
// It intentionally requires no map API key, GPS permission, or network connection.
type MapPoint = [number, number];
const STREET_NETWORK: MapPoint[][] = [
  [[5, 18], [31, 23], [52, 24], [75, 19], [96, 17]],
  [[3, 35], [24, 39], [48, 40], [73, 35], [97, 31]],
  [[1, 54], [24, 55], [48, 57], [71, 51], [96, 47]],
  [[0, 74], [22, 73], [45, 72], [67, 66], [94, 62]],
  [[13, 4], [17, 27], [22, 47], [26, 69], [30, 96]],
  [[37, 0], [39, 20], [42, 42], [45, 62], [48, 98]],
  [[59, 1], [61, 22], [64, 43], [68, 66], [73, 98]],
  [[80, 0], [79, 22], [82, 44], [86, 65], [90, 95]],
  [[4, 88], [18, 81], [29, 75], [43, 70], [56, 65]],
  [[19, 10], [32, 13], [47, 13], [64, 10]],
];

function segmentStyle(a: MapPoint, b: MapPoint, mapWidth: number, mapHeight: number, thickness = 8) {
  const x1 = (a[0] / 100) * mapWidth; const y1 = (a[1] / 100) * mapHeight;
  const x2 = (b[0] / 100) * mapWidth; const y2 = (b[1] / 100) * mapHeight;
  const dx = x2 - x1; const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = `${Math.atan2(dy, dx)}rad` as `${number}rad`;
  return { position: 'absolute' as const, left: (x1 + x2) / 2 - length / 2, top: (y1 + y2) / 2 - thickness / 2, width: length, height: thickness, borderRadius: thickness, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D7DFD8', transform: [{ rotate: angle }], zIndex: 1 };
}
function RouteSegments({ points, mapWidth, mapHeight, color }: { points: MapPoint[]; mapWidth: number; mapHeight: number; color: string }) {
  return <>{points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    return <View key={`${index}-outline`} style={[segmentStyle(point, next, mapWidth, mapHeight, 10), { backgroundColor: '#FFFFFF', borderColor: color, borderWidth: 1, zIndex: 4 }]} />;
  })}{points.slice(0, -1).map((point, index) => {
    const next = points[index + 1];
    return <View key={`${index}-route`} style={[segmentStyle(point, next, mapWidth, mapHeight, 5), { backgroundColor: color, borderWidth: 0, zIndex: 5 }]} />;
  })}</>;
}
function RoadMap({ routeKey, showRoute = true, live = false }: { routeKey: RouteKey; showRoute?: boolean; live?: boolean }) {
  const [mapWidth, setMapWidth] = useState(340);
  const route = ROUTES[routeKey];
  const startPoint = route.path[0]; const endPoint = route.path[route.path.length - 1];
  return <View style={[s.map, live && s.mapLive]} onLayout={event => setMapWidth(Math.max(300, event.nativeEvent.layout.width))}>
    <View style={s.mapWater}><Text style={s.mapWaterText}>MANILA BAY</Text></View>
    <View style={s.mapPark}><Text style={s.mapParkText}>RIZAL PARK</Text></View>
    <View style={s.mapParkSmall}><Text style={s.mapParkSmallText}>CCP COMPLEX</Text></View>
    {[...STREET_NETWORK, ...Object.values(ROUTES).map(item => item.path)].map((line, lineIndex) => line.slice(0, -1).map((point, index) => <View key={`street-${lineIndex}-${index}`} style={segmentStyle(point, line[index + 1], mapWidth, 300, lineIndex % 3 === 0 ? 10 : 7)} />))}
    <View style={[s.mapDistrict, { top: '14%', left: '7%' }]}><Text style={s.mapDistrictText}>INTRAMUROS</Text></View>
    <View style={[s.mapDistrict, { top: '58%', left: '7%' }]}><Text style={s.mapDistrictText}>ERMITA</Text></View>
    <View style={[s.mapDistrict, { bottom: '12%', left: '62%' }]}><Text style={s.mapDistrictText}>ASEANA</Text></View>
    <Text style={[s.mapStreetName, { top: '41%', left: '36%', transform: [{ rotate: '-8deg' }] }]}>TAFT AVE</Text>
    <Text style={[s.mapStreetName, { top: '78%', left: '34%', transform: [{ rotate: '-8deg' }] }]}>ROXAS BLVD</Text>
    <Text style={[s.mapStreetName, { top: '22%', left: '57%', transform: [{ rotate: '3deg' }] }]}>UN Avenue</Text>
    {showRoute && <RouteSegments points={route.path} mapWidth={mapWidth} mapHeight={300} color={route.color}/>}
    <View style={[s.mapCurrentPin, { left: `${startPoint[0]}%`, top: `${startPoint[1]}%` }]}><View style={s.mapCurrentCore}/></View>
    <View style={[s.mapEndPin, { left: `${endPoint[0]}%`, top: `${endPoint[1]}%` }]}><Text style={s.mapEndPinText}>●</Text></View>
    <View style={s.mapYouLabel}><View style={s.mapYouDot}/><Text style={s.mapYouText}>YOU · DEMO LOCATION</Text></View>
    <View style={s.mapLegend}><View style={[s.legendDot, { backgroundColor: route.color }]}/><Text style={s.legendText}>{route.name}</Text><Text style={s.legendMeta}>· Illustrative street map</Text></View>
  </View>;
}

function RouteCard({ routeKey }: { routeKey: RouteKey }) {
  const { time, route, setRoute } = useDemoState(); const item = ROUTES[routeKey]; const active = route === routeKey;
  return <Pressable onPress={() => setRoute(routeKey)} style={({ pressed }) => [s.routeCard, active && s.routeCardActive, pressed && s.pressed]} accessibilityRole="button" accessibilityState={{ selected: active }}>
    <View style={s.routeHeading}><View style={[s.routeDot, { backgroundColor: item.color }]}/><View style={s.routeNameBlock}><Text style={s.routeName}>{item.name}</Text><Text style={s.routeMeta}>{item.area}</Text><Text style={s.routeMeta}>{item.distance} · {item.duration}</Text></View><View style={[s.radio, active && s.radioOn]}>{active && <View style={s.radioInner}/>}</View></View>
    <View style={s.routeAir}><View><Text style={s.airLabel}>ILLUSTRATIVE PM2.5 · {time}</Text><Text style={s.airValue}>{getRoutePm(routeKey, time)} <Text style={s.airUnit}>µg/m³</Text></Text></View><View style={s.demoTag}><Text style={s.demoTagText}>DEMO RANGE</Text></View></View>
    <Text style={s.routeTradeoff}>{item.tradeoff}</Text>
    <View style={s.uncertaintyLine}><Text style={s.uncertainty}>ⓘ Sample estimate · uncertainty applies</Text>{active && <Text style={s.selectedLabel}>SELECTED</Text>}</View>
  </Pressable>;
}
export function RoutesScreen() {
  const { route, startRun } = useDemoState();
  const beginRun = () => { startRun(); router.push('/run'); };
  return <Screen><Header/><View style={s.intro}><Text style={s.pageTitle}>Find your route.</Text><Copy style={s.subheading}>Compare street loops across Manila Bay, Ermita, and Aseana.</Copy></View>
    <SectionTitle title="Plan for" right="24-HOUR DEMO OUTLOOK"/><TimeSelector/><RoadMap routeKey={route}/>
    <Text style={s.mapDisclaimer}>Illustrative street layout only · Not for turn-by-turn navigation or live location tracking</Text>
    <SectionTitle title="Routes for this hour" right="TAP TO SELECT"/>
    {(Object.keys(ROUTES) as RouteKey[]).map(routeKey => <RouteCard key={routeKey} routeKey={routeKey}/>)}
    <PrimaryButton title="Use this route" onPress={beginRun}/>
    <Text style={s.disclaimer}>The map and PM2.5 values are simulated. Aerun does not calculate inhaled dose or guarantee that a route is safe.</Text>
  </Screen>;
}

function SplitBar({ label, value, width, color }: { label: string; value: string; width: string; color: string }) { return <View style={s.splitRow}><Text style={s.splitLabel}>{label}</Text><View style={s.splitTrack}><View style={[s.splitFill, { width: width as `${number}%`, backgroundColor: color }]}/></View><Text style={s.splitValue}>{value}</Text></View>; }
function formatClock(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
function formatPace(totalSeconds: number) {
  return `${Math.floor(totalSeconds / 60)}:${Math.round(totalSeconds % 60).toString().padStart(2, '0')}`;
}
function ActiveRunStats({ run }: { run: ActiveRun }) {
  return <View style={s.liveStats}>
    <View><Text style={s.liveMetricValue}>{run.distanceKm.toFixed(2)}</Text><Text style={s.liveMetricLabel}>KM</Text></View>
    <View><Text style={s.liveMetricValue}>{formatClock(run.durationSeconds)}</Text><Text style={s.liveMetricLabel}>DURATION</Text></View>
    <View><Text style={s.liveMetricValue}>{formatPace(run.paceSeconds)}</Text><Text style={s.liveMetricLabel}>MIN/KM</Text></View>
  </View>;
}
export function ActivityScreen() {
  const { time, route, startRun } = useDemoState(); const condition = CONDITIONS[time]; const selectedRoute = ROUTES[route];
  const beginRun = () => { startRun(); router.push('/run'); };
  return <Screen><Header area/><View style={s.intro}><Text style={s.pageTitle}>Record a run.</Text><Copy style={s.subheading}>See the environmental context before you head out.</Copy></View>
    <ConditionCard time={time}/>
    <SectionTitle title="Recording location" right="DEMO ROUTE"/>
    <Card style={s.contextCard}><View style={s.contextRoute}><View style={[s.routeDot, { backgroundColor: selectedRoute.color }]}/><View style={{ flex: 1 }}><Text style={s.contextName}>{selectedRoute.name}</Text><Text style={s.contextMeta}>{selectedRoute.area} · {selectedRoute.distance}</Text></View><Pressable onPress={() => router.push('/routes')} style={s.changeRouteButton}><Text style={s.changeRouteText}>Change</Text></Pressable></View><Text style={s.contextWeather}>{condition.note}</Text></Card>
    <PrimaryButton title="Start recording activity" onPress={beginRun}/>
    <Text style={s.disclaimer}>This prototype simulates the run and does not use GPS. Environmental readings are illustrative and should not be used as health guidance.</Text>
  </Screen>;
}

export function RunMapScreen() {
  const { activeRun, tickRun, toggleRunPause, stopRun, finishRun } = useDemoState();
  useEffect(() => {
    if (!activeRun || activeRun.paused || activeRun.stopped) return;
    const interval = setInterval(tickRun, 1000);
    return () => clearInterval(interval);
  }, [activeRun?.id, activeRun?.paused, activeRun?.stopped]);
  if (!activeRun) {
    return <Screen bottomSafe><Header/><View style={s.intro}><Text style={s.pageTitle}>No active run</Text><Copy>Start a new activity to open the recording map.</Copy></View><PrimaryButton title="Go to record run" onPress={() => router.replace('/activity')}/></Screen>;
  }
  const finish = () => { finishRun(); router.replace('/profile'); };
  return <SafeAreaView style={s.runSafe} edges={['top', 'bottom']}>
    <View style={s.runTopBar}><Pressable onPress={() => router.replace('/activity')} style={s.runClose}><Text style={s.runCloseText}>×</Text></Pressable><View style={{ alignItems: 'center' }}><Text style={s.runTopTitle}>Aerun recording</Text><Text style={s.runTopSub}>SIMULATED RUN · {activeRun.recordedAt}</Text></View><View style={{ width: 40 }}/></View>
    <ScrollView contentContainerStyle={s.runContent} showsVerticalScrollIndicator={false}>
      <RoadMap routeKey={activeRun.routeKey} live/>
      <View style={s.liveLocationCard}><View style={s.liveLocationDot}/><View style={{ flex: 1 }}><Text style={s.liveLocationTitle}>Demo location · Metro Manila</Text><Text style={s.liveLocationSub}>{activeRun.routeName}</Text></View><Text style={s.liveSignal}>● GPS DEMO</Text></View>
      <ActiveRunStats run={activeRun}/>
      <View style={s.runConditionCard}><View style={s.runConditionHeader}><View style={s.recIcon}><Text style={s.recIconText}>✳</Text></View><View style={{ flex: 1 }}><Text style={s.runConditionTitle}>Environmental snapshot</Text><Text style={s.runConditionSub}>{activeRun.environment.time} · {activeRun.environment.weather} · {activeRun.environment.temperature}°C</Text></View><Text style={s.demoTagText}>DEMO</Text></View><View style={s.runConditionPmRow}><View><Text style={s.airLabel}>ILLUSTRATIVE PM2.5</Text><Text style={s.runConditionPm}>{activeRun.environment.pm} <Text style={s.airUnit}>µg/m³</Text></Text></View><Text style={s.runConditionNote}>Model estimate, not a sensor reading</Text></View></View>
      {activeRun.stopped && <View style={s.stoppedBanner}><Text style={s.stoppedText}>Run paused at this point. Finish to save your activity to Profile.</Text></View>}
      <View style={s.runControls}>
        <Pressable onPress={toggleRunPause} disabled={activeRun.stopped} style={[s.pauseButton, activeRun.stopped && s.controlDisabled]}><Text style={s.pauseButtonIcon}>{activeRun.stopped ? '■' : activeRun.paused ? '▶' : 'Ⅱ'}</Text><Text style={s.pauseButtonText}>{activeRun.stopped ? 'Stopped' : activeRun.paused ? 'Resume' : 'Pause'}</Text></Pressable>
        <Pressable onPress={activeRun.stopped ? finish : stopRun} style={[s.stopButton, activeRun.stopped && s.finishButton]}><Text style={[s.stopButtonText, activeRun.stopped && s.finishButtonText]}>{activeRun.stopped ? 'Finish run' : 'Stop'}</Text></Pressable>
      </View>
      <Text style={s.runDisclaimer}>The map, location, running metrics, and environmental values are mock data. The route is an illustration, not navigational guidance.</Text>
    </ScrollView>
  </SafeAreaView>;
}

function RunRecordCard({ record, expanded = true, onShare }: { record: RunRecord; expanded?: boolean; onShare: () => void }) {
  const [showDetails, setShowDetails] = useState(expanded);
  const duration = formatClock(record.durationSeconds);
  const distance = record.distanceKm.toFixed(1);
  const pace = formatPace(record.paceSeconds);
  return <Card style={s.activityCard}>
    <Pressable onPress={() => setShowDetails(value => !value)} style={s.activityHead} accessibilityRole="button" accessibilityState={{ expanded: showDetails }}>
      <View style={{ flex: 1 }}><Label>{record.recordedDate.toUpperCase()} · {record.recordedAt}</Label><Text style={s.activityTitle}>{record.routeName}</Text><Text style={s.routeMeta}>{record.location}</Text></View>
      <View style={s.recordHeadRight}><View style={s.samplePill}><Text style={s.samplePillText}>RECORDED</Text></View><Text style={s.accordionChevron}>{showDetails ? '⌃' : '⌄'}</Text></View>
    </Pressable>
    <View style={s.activityStats}><View><Text style={s.activityValue}>{distance}</Text><Text style={s.activityUnit}>KM</Text></View><View><Text style={s.activityValue}>{duration}</Text><Text style={s.activityUnit}>DURATION</Text></View><View><Text style={s.activityValue}>{pace}</Text><Text style={s.activityUnit}>MIN/KM</Text></View></View>
    {showDetails && <>
      <View style={s.splitDivider}/><Label>PACE BY KM · SIMULATED SPLITS</Label>
      <View style={s.splits}>{record.splits.map((split, index) => <SplitBar key={`${record.id}-${index}`} label={String(index + 1).padStart(2, '0')} value={split} width={`${Math.max(36, Math.min(94, 65 + (Number(split.split(':')[1]) - 25) / 2))}%`} color={index === record.splits.length - 1 ? C.amber : C.green}/>)}</View>
      <View style={s.recordEnvironment}><Label>ENVIRONMENT SNAPSHOT</Label><Text style={s.recordPm}>{record.environment.pm} <Text style={s.airUnit}>µg/m³ PM2.5</Text></Text><Text style={s.contextWeather}>{record.environment.weather} · {record.environment.temperature}°C · {record.environment.time}</Text><Text style={s.contextMeta}>Illustrative model estimate · not a direct measurement</Text></View>
    </>}
    <Pressable onPress={onShare} disabled={record.shared} style={[s.shareRecordButton, record.shared && s.shareRecordButtonDone]}><Text style={[s.shareRecordText, record.shared && s.shareRecordTextDone]}>{record.shared ? '✓ Shared to Community' : 'Share run to Community'}</Text><Text style={[s.shareRecordArrow, record.shared && s.shareRecordTextDone]}>{record.shared ? '✓' : '↗'}</Text></Pressable>
  </Card>;
}

function SocialProfileSection() {
  const { challenges } = useDemoState();
  const joined = challenges.filter(challenge => challenge.joined);
  return <>
    <SectionTitle title="Your running circle" right="DEMO COUNTS"/>
    <Card style={s.socialStatsCard}><View><Text style={s.socialStatValue}>128</Text><Text style={s.socialStatLabel}>FOLLOWERS</Text></View><View style={s.socialDivider}/><View><Text style={s.socialStatValue}>42</Text><Text style={s.socialStatLabel}>FOLLOWING</Text></View><Text style={s.sampleTag}>SAMPLE</Text></Card>
    <SectionTitle title="Joined challenges" right="DEMO ONLY"/>
    {joined.length ? joined.map(challenge => <Card key={challenge.id} style={s.joinedChallenge}><Text style={s.routeName}>{challenge.title}</Text><Text style={s.contextMeta}>{challenge.unit === 'km' ? `${challenge.progress.toFixed(1)} / ${challenge.goal} km` : `${challenge.progress} / ${challenge.goal} runs`} · Local demo progress</Text><View style={s.challengeProgress}><View style={[s.challengeProgressFill, { width: `${Math.min(100, (challenge.progress / challenge.goal) * 100)}%` as `${number}%` }]}/></View></Card>) : <Copy>No challenges joined yet. Find one in Community.</Copy>}
  </>;
}

export function ProfileScreen() {
  const { records, shareRecord } = useDemoState();
  const [briefing, setBriefing] = useState(true); const [alerts, setAlerts] = useState(false); const [distance, setDistance] = useState('5 km');
  return <Screen><Header/><View style={s.intro}><Text style={s.pageTitle}>Your Aerun.</Text><Copy style={s.subheading}>Every run has a story to tell.</Copy></View>
    <Card style={s.profileCard}><View style={s.avatar}><Text style={s.avatarText}>R</Text></View><View style={s.profileCopy}><Text style={s.profileName}>Demo Runner</Text><Text style={s.profileSub}>Your running history · Stored for this session only</Text></View><Pressable onPress={() => router.push('/account')}><Text style={s.profileSpark}>↗</Text></Pressable></Card>
    <SectionTitle title="Your recorded runs" right={`${records.length} RUN${records.length === 1 ? '' : 'S'}`}/>
    {records.length ? <>
      <RunRecordCard key={records[0].id} record={records[0]} expanded onShare={() => shareRecord(records[0].id)}/>
      {records.length > 1 && <View style={s.pastRunsBlock}><Text style={s.pastRunsTitle}>PAST RUNS · TAP TO EXPAND</Text>{records.slice(1).map(record => <RunRecordCard key={record.id} record={record} expanded={false} onShare={() => shareRecord(record.id)}/>)}</View>}
    </> : <Card style={s.emptyRuns}><View style={s.emptyMark}><Text style={s.emptyMarkText}>⌁</Text></View><Text style={s.emptyTitle}>Your first run starts here.</Text><Copy style={s.emptyCopy}>Completed activities will appear here with distance, pace, splits, and the environmental conditions from your run.</Copy><PrimaryButton title="Record your first run" onPress={() => router.navigate('/activity')}/></Card>}
    <SectionTitle title="Your preferences"/>
    <Card style={s.settingsCard}><Label>DEMO AREA</Label><View style={s.areaRow}><Text style={s.areaPin}>⌖</Text><View><Text style={s.settingTitle}>Metro Manila</Text><Text style={s.settingDetail}>Fixed illustrative demo area</Text></View></View><View style={s.settingsDivider}/><Label style={{ marginTop: 4 }}>COMFORT DISTANCE</Label><View style={s.distanceRow}>{['3 km', '5 km', '10 km'].map(value => <Pressable key={value} onPress={() => setDistance(value)} style={[s.distanceChip, distance === value && s.distanceChipOn]}><Text style={[s.distanceText, distance === value && s.distanceTextOn]}>{value}</Text></Pressable>)}</View></Card>
    <SectionTitle title="Demo preferences"/>
    <Card style={s.settingsCard}><SettingToggle title="Daily condition briefing" detail="Show a quick local demo summary" value={briefing} onValueChange={setBriefing}/><View style={s.settingsDivider}/><SettingToggle title="Condition change alerts" detail="Prototype toggle · no notifications sent" value={alerts} onValueChange={setAlerts}/></Card>
    <Card style={s.aboutCard}><View style={s.aboutHead}><View style={s.aboutLogo}><Text style={s.aboutLogoText}>a</Text></View><View><Label>ABOUT AERUN</Label><Text style={s.aboutTitle}>Your route. Your air.</Text></View></View><Text style={s.aboutCopy}>Localized PM2.5 modelling is a research direction under development. This pitch prototype uses invented illustrative data to explore how environmental context could fit into a running routine.</Text><View style={s.aboutBadge}><Text style={s.aboutBadgeText}>DEMO DATA · NOT LIVE</Text></View></Card>
    <SocialProfileSection/>
  </Screen>;
}

function SettingToggle({ title, detail, value, onValueChange }: { title: string; detail: string; value: boolean; onValueChange: (value: boolean) => void }) { return <View style={s.settingRow}><View style={s.settingCopy}><Text style={s.settingTitle}>{title}</Text><Text style={s.settingDetail}>{detail}</Text></View><Switch value={value} onValueChange={onValueChange} trackColor={{ false: '#CFD8D0', true: C.green }} thumbColor={C.white} accessibilityLabel={title}/></View>; }

export function AccountScreen() {
  const [panel, setPanel] = useState<'achievements' | 'weekly' | null>(null);
  return <Screen bottomSafe><Pressable onPress={() => router.back()} style={s.accountBack}><Text style={s.accountBackText}>‹  Back to Aerun</Text></Pressable><Header showAvatar={false}/><View style={s.intro}><Text style={s.pageTitle}>Your account.</Text><Copy style={s.subheading}>Your Aerun identity and running progress.</Copy></View>
    <Card style={s.accountHero}><View style={s.accountAvatar}><Text style={s.accountAvatarText}>R</Text></View><Text style={s.accountName}>Demo Runner</Text><Text style={s.accountEmail}>demo.runner@aerun.app</Text><Text style={s.accountMember}>AERUN MEMBER · DEMO PROFILE</Text></Card>
    <Pressable onPress={() => Alert.alert('Edit profile', 'Profile editing will be available in a future version.')} style={s.accountAction}><View style={s.accountActionIcon}><Text>✎</Text></View><View style={{ flex: 1 }}><Text style={s.accountActionTitle}>Edit profile</Text><Text style={s.accountActionSub}>Update your name, photo, and details</Text></View><Text style={s.accountActionArrow}>›</Text></Pressable>
    <Pressable onPress={() => setPanel(panel === 'achievements' ? null : 'achievements')} style={s.accountAction}><View style={s.accountActionIcon}><Text>✧</Text></View><View style={{ flex: 1 }}><Text style={s.accountActionTitle}>Achievements</Text><Text style={s.accountActionSub}>Badges and running milestones</Text></View><Text style={s.accountActionArrow}>{panel === 'achievements' ? '⌃' : '›'}</Text></Pressable>
    {panel === 'achievements' && <Card style={s.accountPanel}><Label>YOUR SAMPLE ACHIEVEMENTS</Label><View style={s.achievementGrid}><View style={s.achievement}><Text style={s.achievementIcon}>🌅</Text><Text style={s.achievementTitle}>Early bird</Text><Text style={s.achievementSub}>First morning run</Text></View><View style={s.achievement}><Text style={s.achievementIcon}>⌁</Text><Text style={s.achievementTitle}>City explorer</Text><Text style={s.achievementSub}>3 routes explored</Text></View><View style={s.achievement}><Text style={s.achievementIcon}>✦</Text><Text style={s.achievementTitle}>Getting started</Text><Text style={s.achievementSub}>5 runs logged</Text></View></View></Card>}
    <Pressable onPress={() => setPanel(panel === 'weekly' ? null : 'weekly')} style={s.accountAction}><View style={s.accountActionIcon}><Text>▥</Text></View><View style={{ flex: 1 }}><Text style={s.accountActionTitle}>Weekly progress</Text><Text style={s.accountActionSub}>Your activity at a glance</Text></View><Text style={s.accountActionArrow}>{panel === 'weekly' ? '⌃' : '›'}</Text></Pressable>
    {panel === 'weekly' && <Card style={s.accountPanel}><Label>THIS WEEK · SAMPLE DATA</Label><View style={s.weeklyMetrics}><View><Text style={s.weeklyValue}>14.8 km</Text><Text style={s.weeklyLabel}>DISTANCE</Text></View><View><Text style={s.weeklyValue}>3</Text><Text style={s.weeklyLabel}>RUNS</Text></View><View><Text style={s.weeklyValue}>1h 42m</Text><Text style={s.weeklyLabel}>TIME</Text></View></View><View style={s.weekBars}>{[42, 68, 30, 80, 48, 20, 12].map((height, index) => <View key={index} style={s.weekBarCol}><View style={[s.weekBar, { height: `${height}%` as `${number}%` }]}/><Text style={s.weekBarLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</Text></View>)}</View></Card>}
    <Text style={s.disclaimer}>Achievements and weekly progress are randomly generated demo information. Edit profile is a visual placeholder.</Text>
  </Screen>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper }, content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 16, maxWidth: 560, width: '100%', alignSelf: 'center' },
  header: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }, headerRight: { alignItems: 'flex-end', flexDirection: 'row', gap: 10 }, wordmark: { color: C.ink, fontSize: 26, lineHeight: 27, fontWeight: '900', letterSpacing: -1.3 }, wordmarkDot: { color: C.green }, tagline: { color: C.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1.35, marginTop: 2 }, location: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.white, borderColor: C.line, borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 8 }, pin: { fontSize: 15, color: C.green }, locationText: { fontSize: 9, fontWeight: '700', color: C.ink }, headerAvatar: { width: 38, height: 38, borderRadius: 15, backgroundColor: '#DCE9E2', borderWidth: 2, borderColor: C.white, alignItems: 'center', justifyContent: 'center', position: 'relative' }, headerAvatarText: { fontSize: 15, fontWeight: '900', color: C.ink }, avatarOnline: { position: 'absolute', right: -1, bottom: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: C.green, borderWidth: 2, borderColor: C.paper },
  intro: { gap: 5, marginTop: 7, marginBottom: 1 }, greeting: { fontSize: 31, lineHeight: 37, letterSpacing: -1.2, fontWeight: '800', color: C.ink }, pageTitle: { fontSize: 29, lineHeight: 35, letterSpacing: -1, fontWeight: '800', color: C.ink }, subheading: { color: C.muted, fontSize: 13, lineHeight: 19 }, label: { color: C.muted, fontSize: 9, lineHeight: 13, fontWeight: '900', letterSpacing: .9 }, copy: { color: C.muted, fontSize: 12, lineHeight: 18 }, card: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 19, padding: 15, gap: 12 },
  pmCard: { backgroundColor: C.ink, borderRadius: 24, padding: 20, overflow: 'hidden', marginTop: 1 }, pmTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, pmLabel: { color: '#B8C9BE', fontSize: 9, letterSpacing: 1, fontWeight: '800' }, pmIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#27433C', alignItems: 'center', justifyContent: 'center' }, pmIconText: { color: C.lime, fontSize: 16 }, pmNumberLine: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 10 }, pmNumber: { color: C.lime, fontSize: 48, fontWeight: '800', letterSpacing: -2.3, lineHeight: 57 }, pmUnit: { color: '#D4E2D7', fontSize: 13, fontWeight: '700' }, pmCaption: { color: '#D4E2D7', fontSize: 11, marginTop: 1 }, pmMeter: { height: 5, backgroundColor: '#36534A', borderRadius: 5, marginTop: 16, overflow: 'hidden' }, pmMeterFill: { height: '100%', borderRadius: 5, backgroundColor: C.lime }, pmDisclaimer: { color: '#A6BDB0', fontSize: 9, marginTop: 8 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, marginBottom: -6 }, sectionTitle: { fontSize: 16, color: C.ink, fontWeight: '800', letterSpacing: -.3 }, eyebrow: { color: C.muted, fontSize: 8, letterSpacing: .8, fontWeight: '800' }, timeDropdown: { minHeight: 62, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, timeDropdownCopy: { gap: 3 }, timeDropdownLabel: { color: C.muted, fontSize: 7, fontWeight: '900', letterSpacing: .9 }, timeDropdownValue: { color: C.ink, fontSize: 16, fontWeight: '900' }, timeDropdownChevron: { width: 32, height: 32, borderRadius: 11, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' }, timeDropdownChevronText: { color: C.green, fontSize: 19, fontWeight: '900', marginTop: -5 }, timeModalRoot: { flex: 1, backgroundColor: '#00000066', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 30 }, timeModalPanel: { width: '100%', maxWidth: 420, maxHeight: '78%', backgroundColor: C.paper, borderRadius: 22, padding: 16, gap: 12, elevation: 14, shadowColor: '#000000', shadowOpacity: .18, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } }, timeModalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 }, timeModalTitle: { color: C.ink, fontSize: 17, fontWeight: '900' }, timeModalSubtitle: { color: C.muted, fontSize: 9, marginTop: 3 }, timeModalClose: { width: 34, height: 34, borderRadius: 12, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }, timeModalCloseText: { color: C.ink, fontSize: 24, lineHeight: 27 }, timeOptionsScroll: { flexGrow: 0, flexShrink: 1 }, timeOptionsContent: { gap: 6, paddingBottom: 2 }, timeOption: { minHeight: 42, borderRadius: 11, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, timeOptionActive: { backgroundColor: C.ink, borderColor: C.ink }, timeOptionText: { color: C.ink, fontSize: 11, fontWeight: '700' }, timeOptionTextActive: { color: C.lime }, timeOptionCheck: { color: C.lime, fontSize: 14, fontWeight: '900' }, weatherCard: { gap: 15 }, weatherTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, weatherName: { color: C.ink, fontSize: 18, fontWeight: '800', marginTop: 4 }, weatherGlyph: { color: C.green, fontSize: 31, fontWeight: '300' }, statRow: { flexDirection: 'row', justifyContent: 'space-between' }, miniStat: { minWidth: '27%', gap: 2 }, statIcon: { color: C.green, fontSize: 15, fontWeight: '800' }, statLabel: { color: C.muted, fontSize: 7, fontWeight: '900', letterSpacing: .8 }, statValue: { color: C.ink, fontSize: 12, fontWeight: '800', marginTop: 1 }, recommendation: { flexDirection: 'row', backgroundColor: '#EAF3EC', borderColor: '#DCE9DD', gap: 12, padding: 14 }, recIcon: { width: 31, height: 31, borderRadius: 11, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' }, recIconText: { color: C.ink, fontSize: 17, fontWeight: '900' }, recBody: { flex: 1, gap: 4 }, recTitle: { color: C.ink, fontSize: 15, fontWeight: '800' }, recCopy: { fontSize: 11, lineHeight: 16 }, primary: { backgroundColor: C.lime, borderRadius: 15, minHeight: 52, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, primaryText: { color: C.ink, fontSize: 13, fontWeight: '900' }, primaryArrow: { color: C.ink, fontSize: 19, fontWeight: '700' }, primarySecondary: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line }, primarySecondaryText: { color: C.ink }, pressed: { opacity: .76, transform: [{ scale: .99 }] }, disclaimer: { color: C.muted, fontSize: 10, lineHeight: 15, marginTop: -4 }, footer: { color: '#9AA89F', fontSize: 9, textAlign: 'center', marginTop: 4 },
  map: { height: 300, borderRadius: 21, overflow: 'hidden', backgroundColor: '#E8EEE7', position: 'relative', borderWidth: 1, borderColor: '#DDE7DE' }, mapLive: { height: 300, borderRadius: 18 }, mapWater: { position: 'absolute', right: -32, top: -10, bottom: -10, width: '31%', borderRadius: 60, backgroundColor: '#CFE6E8', transform: [{ rotate: '5deg' }], zIndex: 0, justifyContent: 'center', alignItems: 'center' }, mapWaterText: { color: '#7BA4A4', fontSize: 9, fontWeight: '900', letterSpacing: 2, transform: [{ rotate: '90deg' }] }, mapPark: { position: 'absolute', width: '27%', height: '22%', top: '8%', right: '23%', backgroundColor: '#D2E5CD', borderRadius: 20, zIndex: 0, alignItems: 'center', justifyContent: 'center' }, mapParkText: { color: '#6F8F6C', fontSize: 8, fontWeight: '900' }, mapParkSmall: { position: 'absolute', width: '25%', height: '18%', bottom: '5%', left: '13%', backgroundColor: '#D8E8D2', borderRadius: 16, zIndex: 0, alignItems: 'center', justifyContent: 'center' }, mapParkSmallText: { color: '#6F8F6C', fontSize: 7, fontWeight: '900' }, mapDistrict: { position: 'absolute', backgroundColor: '#F5F7F0D9', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 6, zIndex: 2 }, mapDistrictText: { color: '#738378', fontSize: 7, fontWeight: '900', letterSpacing: .5 }, mapStreetName: { position: 'absolute', color: '#84948A', fontSize: 7, fontWeight: '900', backgroundColor: '#F5F7F0D9', paddingHorizontal: 4, zIndex: 3 }, mapCurrentPin: { position: 'absolute', width: 21, height: 21, borderRadius: 11, backgroundColor: C.white, borderWidth: 4, borderColor: C.ink, alignItems: 'center', justifyContent: 'center', marginLeft: -10, marginTop: -10, zIndex: 7 }, mapCurrentCore: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.lime }, mapEndPin: { position: 'absolute', width: 17, height: 17, borderRadius: 9, backgroundColor: C.white, borderWidth: 2, borderColor: C.coral, alignItems: 'center', justifyContent: 'center', marginLeft: -8, marginTop: -8, zIndex: 7 }, mapEndPinText: { fontSize: 6, color: C.coral }, mapYouLabel: { position: 'absolute', top: 10, left: 10, zIndex: 9, backgroundColor: C.white, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 }, mapYouDot: { width: 6, height: 6, backgroundColor: C.teal, borderRadius: 3 }, mapYouText: { color: C.ink, fontSize: 7, fontWeight: '900' }, mapLegend: { position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: '#FFFFFFF0', paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 5, zIndex: 9 }, legendDot: { width: 7, height: 7, borderRadius: 4 }, legendText: { color: C.ink, fontSize: 8, fontWeight: '900', flexShrink: 1 }, legendMeta: { color: C.muted, fontSize: 7 }, mapDisclaimer: { color: C.muted, fontSize: 9, textAlign: 'right', marginTop: -11 },
  routeCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 19, padding: 15, gap: 11 }, routeCardActive: { borderColor: C.green, borderWidth: 2, padding: 14, backgroundColor: '#FBFDF9' }, routeHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 }, routeDot: { width: 11, height: 11, borderRadius: 6 }, routeNameBlock: { flex: 1, gap: 3 }, routeName: { color: C.ink, fontSize: 14, fontWeight: '800' }, routeMeta: { color: C.muted, fontSize: 9, fontWeight: '600' }, radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#B8C6BB', alignItems: 'center', justifyContent: 'center' }, radioOn: { borderColor: C.green }, radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.green }, routeAir: { backgroundColor: C.paper, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, airLabel: { color: C.muted, fontSize: 8, fontWeight: '900', letterSpacing: .5 }, airValue: { color: C.ink, fontSize: 18, fontWeight: '800', marginTop: 2 }, airUnit: { color: C.muted, fontSize: 9, fontWeight: '700' }, demoTag: { backgroundColor: '#FFF2DB', paddingHorizontal: 7, paddingVertical: 5, borderRadius: 8 }, demoTagText: { color: '#80531E', fontSize: 7, fontWeight: '900', letterSpacing: .4 }, routeTradeoff: { color: C.ink, fontSize: 10, fontWeight: '600', lineHeight: 15 }, uncertaintyLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, uncertainty: { color: C.muted, fontSize: 8 }, selectedLabel: { color: C.green, fontSize: 8, fontWeight: '900', letterSpacing: .6 },
  contextCard: { gap: 12 }, contextRoute: { flexDirection: 'row', gap: 9, alignItems: 'center' }, contextName: { color: C.ink, fontSize: 13, fontWeight: '800' }, contextMeta: { color: C.muted, fontSize: 9, marginTop: 3 }, contextWeather: { color: C.muted, fontSize: 10, lineHeight: 15 }, changeRouteButton: { backgroundColor: C.sage, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 7 }, changeRouteText: { color: C.green, fontSize: 9, fontWeight: '900' },
  runSafe: { flex: 1, backgroundColor: C.paper }, runTopBar: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.line }, runClose: { width: 40, height: 40, borderRadius: 13, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' }, runCloseText: { color: C.ink, fontSize: 24 }, runTopTitle: { color: C.ink, fontSize: 14, fontWeight: '900' }, runTopSub: { color: C.muted, fontSize: 7, letterSpacing: .8, fontWeight: '900', marginTop: 3 }, runContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 28, gap: 13, maxWidth: 560, width: '100%', alignSelf: 'center' }, liveLocationCard: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 11 }, liveLocationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.teal, borderWidth: 2, borderColor: '#C6EEEA' }, liveLocationTitle: { color: C.ink, fontSize: 10, fontWeight: '900' }, liveLocationSub: { color: C.muted, fontSize: 8, marginTop: 2 }, liveSignal: { color: C.teal, fontSize: 7, fontWeight: '900' }, liveStats: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: C.ink, borderRadius: 19, paddingHorizontal: 17, paddingVertical: 19 }, liveMetricValue: { color: C.lime, fontSize: 27, fontWeight: '900', letterSpacing: -.8 }, liveMetricLabel: { color: '#B8C9BE', fontSize: 7, fontWeight: '900', letterSpacing: .8, marginTop: 4 }, runConditionCard: { backgroundColor: '#EAF8F7', borderColor: '#CDEDEC', borderWidth: 1, borderRadius: 17, padding: 13, gap: 11 }, runConditionHeader: { flexDirection: 'row', alignItems: 'center', gap: 9 }, runConditionTitle: { color: C.ink, fontSize: 11, fontWeight: '900' }, runConditionSub: { color: C.muted, fontSize: 8, marginTop: 3 }, runConditionPmRow: { borderTopWidth: 1, borderTopColor: '#D3EAE6', paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, runConditionPm: { color: C.ink, fontSize: 19, fontWeight: '900', marginTop: 3 }, runConditionNote: { color: C.muted, fontSize: 8, maxWidth: 116, textAlign: 'right', lineHeight: 12 }, stoppedBanner: { backgroundColor: '#FFF2DB', borderRadius: 11, padding: 10 }, stoppedText: { color: '#80531E', fontSize: 9, fontWeight: '700', lineHeight: 14 }, runControls: { flexDirection: 'row', gap: 10 }, pauseButton: { flex: 1, minHeight: 54, borderRadius: 15, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, pauseButtonIcon: { color: C.lime, fontSize: 15, fontWeight: '900' }, pauseButtonText: { color: C.white, fontSize: 12, fontWeight: '900' }, controlDisabled: { opacity: .5 }, stopButton: { flex: 1, minHeight: 54, borderRadius: 15, backgroundColor: '#F1E3DF', alignItems: 'center', justifyContent: 'center' }, stopButtonText: { color: C.coral, fontSize: 13, fontWeight: '900' }, finishButton: { backgroundColor: C.lime }, finishButtonText: { color: C.ink }, runDisclaimer: { color: C.muted, fontSize: 9, lineHeight: 14, textAlign: 'center' },
  activityCard: { gap: 14 }, activityHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, activityTitle: { color: C.ink, fontSize: 15, fontWeight: '800', marginTop: 4 }, recordHeadRight: { alignItems: 'center', gap: 3 }, accordionChevron: { color: C.muted, fontSize: 14, fontWeight: '900' }, samplePill: { backgroundColor: C.sage, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 }, samplePillText: { color: C.green, fontSize: 7, fontWeight: '900', letterSpacing: .7 }, activityStats: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }, activityValue: { color: C.ink, fontSize: 21, fontWeight: '800', letterSpacing: -.7 }, activityUnit: { color: C.muted, fontSize: 7, fontWeight: '900', letterSpacing: .7, marginTop: 2 }, splitDivider: { height: 1, backgroundColor: C.line, marginVertical: -4 }, splits: { gap: 9, marginTop: -3 }, splitRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, splitLabel: { width: 19, color: C.muted, fontSize: 8, fontWeight: '800' }, splitTrack: { flex: 1, height: 7, backgroundColor: C.paper, borderRadius: 5, overflow: 'hidden' }, splitFill: { height: '100%', borderRadius: 5 }, splitValue: { width: 34, textAlign: 'right', color: C.ink, fontSize: 8, fontWeight: '700' }, recordEnvironment: { backgroundColor: '#EAF8F7', borderRadius: 13, padding: 11, gap: 4 }, recordPm: { color: C.ink, fontSize: 17, fontWeight: '900', marginTop: 2 }, shareRecordButton: { minHeight: 43, borderRadius: 12, backgroundColor: C.ink, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 13 }, shareRecordButtonDone: { backgroundColor: C.sage }, shareRecordText: { color: C.lime, fontSize: 10, fontWeight: '900' }, shareRecordTextDone: { color: C.green }, shareRecordArrow: { color: C.lime, fontSize: 15, fontWeight: '900' }, pastRunsBlock: { gap: 10 }, pastRunsTitle: { color: C.muted, fontSize: 8, fontWeight: '900', letterSpacing: .9 }, emptyRuns: { alignItems: 'center', paddingVertical: 23, gap: 10 }, emptyMark: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' }, emptyMarkText: { color: C.ink, fontSize: 22, fontWeight: '900' }, emptyTitle: { color: C.ink, fontSize: 15, fontWeight: '900' }, emptyCopy: { color: C.muted, fontSize: 10, lineHeight: 15, textAlign: 'center', maxWidth: 265 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.ink, borderColor: C.ink }, avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: C.ink, fontSize: 21, fontWeight: '900' }, profileCopy: { flex: 1 }, profileName: { color: C.white, fontSize: 15, fontWeight: '800' }, profileSub: { color: '#B6C8BD', fontSize: 9, marginTop: 4 }, profileSpark: { color: C.lime, fontSize: 22 }, settingsCard: { gap: 13 }, areaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: -5 }, areaPin: { fontSize: 19, color: C.green }, settingTitle: { color: C.ink, fontSize: 11, fontWeight: '800' }, settingDetail: { color: C.muted, fontSize: 9, lineHeight: 14, marginTop: 3 }, settingsDivider: { height: 1, backgroundColor: C.line }, distanceRow: { flexDirection: 'row', gap: 7 }, distanceChip: { borderWidth: 1, borderColor: C.line, borderRadius: 11, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: C.white }, distanceChipOn: { backgroundColor: C.ink, borderColor: C.ink }, distanceText: { color: C.ink, fontSize: 10, fontWeight: '700' }, distanceTextOn: { color: C.lime }, settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 }, settingCopy: { flex: 1 }, aboutCard: { backgroundColor: '#EAF1E9', borderColor: '#DBE7DA', gap: 12 }, aboutHead: { flexDirection: 'row', alignItems: 'center', gap: 11 }, aboutLogo: { width: 34, height: 34, borderRadius: 12, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }, aboutLogoText: { color: C.lime, fontSize: 20, fontWeight: '900' }, aboutTitle: { color: C.ink, fontSize: 14, fontWeight: '800', marginTop: 2 }, aboutCopy: { color: '#53665B', fontSize: 11, lineHeight: 17 }, aboutBadge: { alignSelf: 'flex-start', backgroundColor: C.white, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }, aboutBadgeText: { color: '#80531E', fontSize: 8, fontWeight: '900', letterSpacing: .5 },
  socialStatsCard: { flexDirection: 'row', alignItems: 'center', gap: 22 }, socialStatValue: { color: C.ink, fontSize: 19, fontWeight: '900' }, socialStatLabel: { color: C.muted, fontSize: 7, fontWeight: '900', letterSpacing: .6, marginTop: 3 }, socialDivider: { width: 1, alignSelf: 'stretch', backgroundColor: C.line }, sampleTag: { marginLeft: 'auto', paddingVertical: 5, paddingHorizontal: 7, borderRadius: 7, backgroundColor: '#EAF8F7', color: C.teal, fontSize: 7, fontWeight: '900' }, joinedChallenge: { gap: 8, padding: 13 }, challengeProgress: { height: 5, backgroundColor: '#E7EEE8', borderRadius: 4, overflow: 'hidden' }, challengeProgressFill: { height: '100%', backgroundColor: C.teal, borderRadius: 4 },
  accountBack: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 6, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, borderRadius: 9 }, accountBackText: { color: C.ink, fontSize: 9, fontWeight: '800' }, accountHero: { alignItems: 'center', paddingVertical: 22, backgroundColor: C.ink, borderColor: C.ink, gap: 6 }, accountAvatar: { width: 74, height: 74, borderRadius: 25, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center', marginBottom: 5 }, accountAvatarText: { color: C.ink, fontSize: 29, fontWeight: '900' }, accountName: { color: C.white, fontSize: 18, fontWeight: '900' }, accountEmail: { color: '#C4D3CA', fontSize: 10 }, accountMember: { color: C.lime, fontSize: 7, fontWeight: '900', letterSpacing: 1, marginTop: 4 }, accountAction: { minHeight: 67, borderRadius: 16, padding: 12, backgroundColor: C.white, borderWidth: 1, borderColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 11 }, accountActionIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: C.sage, alignItems: 'center', justifyContent: 'center' }, accountActionTitle: { color: C.ink, fontSize: 12, fontWeight: '900' }, accountActionSub: { color: C.muted, fontSize: 9, marginTop: 3 }, accountActionArrow: { color: C.green, fontSize: 22, fontWeight: '700' }, accountPanel: { backgroundColor: '#F0F5F0', gap: 12 }, achievementGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 }, achievement: { flex: 1, minHeight: 104, backgroundColor: C.white, borderRadius: 12, padding: 8, alignItems: 'center', justifyContent: 'center', gap: 4 }, achievementIcon: { fontSize: 21 }, achievementTitle: { color: C.ink, fontSize: 9, fontWeight: '900', textAlign: 'center' }, achievementSub: { color: C.muted, fontSize: 7, textAlign: 'center' }, weeklyMetrics: { flexDirection: 'row', justifyContent: 'space-between' }, weeklyValue: { color: C.ink, fontSize: 17, fontWeight: '900' }, weeklyLabel: { color: C.muted, fontSize: 7, fontWeight: '900', marginTop: 3 }, weekBars: { height: 92, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', backgroundColor: C.white, borderRadius: 12, padding: 8 }, weekBarCol: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }, weekBar: { width: 13, backgroundColor: C.teal, borderRadius: 4, minHeight: 5 }, weekBarLabel: { color: C.muted, fontSize: 7, fontWeight: '800' },
});
