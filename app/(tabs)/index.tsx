import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Activity, Bell, CheckCircle2, Clock3, ShieldCheck, TrendingUp } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertOverlay } from '@/components/AlertOverlay';
import { DrivingModeCard } from '@/components/DrivingModeCard';
import { FeedbackSheet } from '@/components/FeedbackSheet';
import { PermissionCard } from '@/components/PermissionCard';
import { RiskMap } from '@/components/RiskMap';
import { RouteSearchBar } from '@/components/RouteSearchBar';
import { Screen } from '@/components/Screen';
import { supabase } from '@/lib/supabase';
import { colors, shadow } from '@/lib/theme';

export default function Home() {
  const [destination, setDestination] = useState('');
  const [planned, setPlanned] = useState(false);
  const [driving, setDriving] = useState(false);
  const [permission, setPermission] = useState(false);
  const [alert, setAlert] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);

  const requestPermission = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setPermission(true),
        () => setPermission(true),
      );
    } else {
      setPermission(true);
    }
  };

  const planRoute = async () => {
    if (!destination.trim()) { Alert.alert('Add a destination', 'Tell us where you want to go first.'); return; }
    const { data, error } = await supabase.from('trips').insert({ destination: destination.trim(), distance_km: 12.4, duration_min: 24, risk_score: 'medium', green_pct: 58, yellow_pct: 27, red_pct: 15 }).select('id').maybeSingle();
    if (error) { Alert.alert('Could not plan route', 'Please check your connection and try again.'); return; }
    if (data?.id) setTripId(data.id);
    setPlanned(true);
  };

  const submitFeedback = async (rating: number, hazard: boolean, note: string) => {
    setSubmitting(true);
    const { error: fbError } = await supabase.from('route_feedback').insert({ trip_id: tripId, safety_rating: rating, reported_hazards: hazard, confirmed_safe: !hazard, feedback_note: note || null });
    if (fbError) { setSubmitting(false); Alert.alert('Submission failed', 'Could not save your feedback. Please try again.'); return; }

    if (hazard && tripId) {
      const { error: hzError } = await supabase.from('hazard_reports').insert({
        trip_id: tripId,
        hazard_type: 'other',
        severity: 'yellow',
        description: note?.trim() || 'User-reported hazard from post-trip feedback',
        zone_type: 'yellow',
        status: 'pending',
      });
      if (hzError) { setSubmitting(false); Alert.alert('Submission failed', 'Your feedback was saved but the hazard report could not be created. Please try again.'); return; }
    }

    if (tripId) {
      await supabase.from('trips').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', tripId);
    }

    setSubmitting(false);
    setFeedback(false);
    Alert.alert('Report received', 'Thanks for helping keep NearMiss accurate.');
  };

  return <Screen><View style={styles.header}><View><Text style={styles.greeting}>GOOD MORNING</Text><Text style={styles.title}>Travel with clarity.</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>NM</Text></View></View><PermissionCard granted={permission} onGrant={requestPermission} /><RouteSearchBar destination={destination} onDestinationChange={setDestination} onSearch={planRoute} />{!planned ? <><View style={styles.intro}><View style={styles.introIcon}><ShieldCheck size={21} color={colors.teal} /></View><View><Text style={styles.introTitle}>A calmer way to drive</Text><Text style={styles.introBody}>NearMiss reads the road ahead, not just the road map.</Text></View></View><DrivingModeCard active={driving} onToggle={() => setDriving(!driving)} /></> : <><View style={styles.routeHeader}><View><Text style={styles.routeKicker}>ACTIVE ROUTE</Text><Text style={styles.routeTitle}>To {destination}</Text></View><View style={styles.routeBadge}><TrendingUp size={14} color={colors.yellow} /><Text style={styles.routeBadgeText}>MODERATE</Text></View></View><RiskMap destination={destination} /><View style={styles.stats}><Stat icon={<Clock3 size={17} color={colors.teal} />} value="24 min" label="estimated" /><Stat icon={<Activity size={17} color={colors.yellow} />} value="12.4 km" label="distance" /><Stat icon={<Bell size={17} color={colors.red} />} value="3 alerts" label="ahead" /></View><DrivingModeCard active={driving} onToggle={() => setDriving(!driving)} /><Pressable onPress={() => setAlert(true)} style={styles.demoButton}><Bell size={16} color={colors.red} /><Text style={styles.demoText}>Preview high-risk alert</Text></Pressable><Pressable onPress={() => setFeedback(true)} style={styles.complete}><CheckCircle2 size={18} color="#fff" /><Text style={styles.completeText}>Simulate arrival</Text></Pressable>{feedback && <FeedbackSheet onSubmit={submitFeedback} />}</>}<AlertOverlay visible={alert} onDismiss={() => setAlert(false)} /></Screen>;
}
function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <View style={styles.stat}>{icon}<Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
const styles = StyleSheet.create({ header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }, greeting: { color: colors.teal, letterSpacing: 1.7, fontWeight: '900', fontSize: 11 }, title: { color: colors.ink, fontWeight: '900', fontSize: 29, marginTop: 5 }, avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#fff', fontWeight: '900', fontSize: 12 }, intro: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: colors.surface, borderRadius: 18, marginBottom: 18 }, introIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }, introTitle: { color: colors.ink, fontWeight: '800', fontSize: 15 }, introBody: { color: colors.muted, fontSize: 12, marginTop: 4 }, routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, routeKicker: { color: colors.teal, fontSize: 10, letterSpacing: 1.5, fontWeight: '900' }, routeTitle: { color: colors.ink, fontSize: 22, fontWeight: '900', marginTop: 5 }, routeBadge: { backgroundColor: colors.yellowSoft, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 7, flexDirection: 'row', gap: 5, alignItems: 'center' }, routeBadgeText: { color: colors.yellow, fontWeight: '900', fontSize: 9 }, stats: { backgroundColor: colors.surface, borderRadius: 18, flexDirection: 'row', justifyContent: 'space-around', padding: 16, marginBottom: 18, ...shadow }, stat: { alignItems: 'center', gap: 4 }, statValue: { color: colors.ink, fontWeight: '900', fontSize: 14 }, statLabel: { color: colors.muted, fontSize: 10 }, demoButton: { flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center', padding: 12 }, demoText: { color: colors.red, fontWeight: '800', fontSize: 13 }, complete: { backgroundColor: colors.teal, height: 50, borderRadius: 14, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 3 }, completeText: { color: '#fff', fontWeight: '800' } });
