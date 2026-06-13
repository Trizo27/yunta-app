import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { colors, spacing, radius } from '../../theme'

const HomeScreen = () => {
  const navigation = useNavigation()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Yunta</Text>
        <Text style={styles.greeting}>Hola 👋</Text>
        <Text style={styles.subtitle}>¿Qué querés hacer hoy?</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.card, styles.cardFolklore]}
          onPress={() => navigation.navigate('Folklore')}
        >
          <Text style={styles.cardIcon}>🎸</Text>
          <Text style={styles.cardTitle}>Folklore</Text>
          <Text style={styles.cardSub}>Peñas y canciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardCanchas]}
          onPress={() => {}}
        >
          <Text style={styles.cardIcon}>⚽</Text>
          <Text style={styles.cardTitle}>Canchas</Text>
          <Text style={styles.cardSub}>Próximamente</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Qué es Yunta?</Text>
        <Text style={styles.sectionText}>
          Una app para conectar la cultura popular cordobesa — encontrá peñas y guitarreadas cerca tuyo, aprendé canciones del cancionero folklórico y organizá tus partidos de fútbol.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  appName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryLight,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.white,
  },
  subtitle: {
    fontSize: 15,
    color: colors.primaryLight,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: 12,
    marginTop: -20,
  },
  card: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardFolklore: {
    backgroundColor: colors.accentLight,
  },
  cardCanchas: {
    backgroundColor: colors.primaryBg,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  section: {
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
})

export default HomeScreen
