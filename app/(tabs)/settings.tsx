import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Bell, ChevronRight, CircleHelp, MapPinned, Shield, Smartphone, Volume2 } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { useSettingsState } from '@/lib/settings-provider';
import { colors } from '@/lib/theme';

export default function Settings() {
  const { voiceGuidance, hazardAlerts, setVoiceGuidance, setHazardAlerts } = useSettingsState();
  const [location, setLocation] = useState(false);
  const enableLocation = async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => setLocation(true), () => setLocation(true));
    } else {
      setLocation(true);
    }
  };

  return (
    <Screen>
      <SectionHeader eyebrow="PERSONAL CONTROL" title="Settings" />
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>NM</Text>
        </View>
        <View>
          <Text style={styles.profileName}>NearMiss driver</Text>
          <Text style={styles.profileSub}>Personal safety profile</Text>
        </View>
        <ChevronRight size={18} color={colors.muted} />
      </View>
      <Text style={styles.label}>SAFETY PREFERENCES</Text>
      <SettingRow icon={<Bell size={19} color={colors.red} />} title="Hazard alerts" detail="Get notified about risk zones" control={<Switch value={hazardAlerts} onValueChange={setHazardAlerts} trackColor={{ false: colors.line, true: colors.teal }} thumbColor="#fff" />} />
      <SettingRow icon={<Volume2 size={19} color={colors.teal} />} title="Voice guidance" detail="Speak high-risk alerts aloud" control={<Switch value={voiceGuidance} onValueChange={setVoiceGuidance} trackColor={{ false: colors.line, true: colors.teal }} thumbColor="#fff" />} />
      <SettingRow icon={<MapPinned size={19} color={colors.yellow} />} title="Location access" detail={location ? 'Always allowed' : 'Tap to enable'} control={<Pressable onPress={enableLocation}><Text style={styles.enable}>{location ? 'ON' : 'ENABLE'}</Text></Pressable>} />
      <Text style={styles.label}>ABOUT NEARMISS</Text>
      <SettingRow icon={<Shield size={19} color={colors.green} />} title="Privacy & safety" detail="How your data is protected" control={<ChevronRight size={18} color={colors.muted} />} />
      <SettingRow icon={<CircleHelp size={19} color={colors.teal} />} title="Help center" detail="Get support and learn more" control={<ChevronRight size={18} color={colors.muted} />} />
      <View style={styles.version}>
        <Smartphone size={15} color={colors.muted} />
        <Text style={styles.versionText}>NearMiss · Prototype 1.0</Text>
      </View>
    </Screen>
  );
}

function SettingRow({ icon, title, detail, control }: { icon: React.ReactNode; title: string; detail: string; control: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.detail}>{detail}</Text>
      </View>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  profile: { backgroundColor: colors.surface, borderRadius: 19, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 29 },
  avatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 12 },
  profileName: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  profileSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  label: { color: colors.muted, letterSpacing: 1.4, fontSize: 11, fontWeight: '900', marginBottom: 10 },
  row: { backgroundColor: colors.surface, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 9 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.canvas, justifyContent: 'center', alignItems: 'center' },
  copy: { flex: 1 },
  title: { color: colors.ink, fontWeight: '800', fontSize: 14 },
  detail: { color: colors.muted, fontSize: 11, marginTop: 4 },
  enable: { color: colors.teal, fontWeight: '900', fontSize: 11 },
  version: { flexDirection: 'row', gap: 7, justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  versionText: { color: colors.muted, fontSize: 11 },
});
