import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { colors, spacing, radius } from '../../theme'

const DetalleEventoScreen = ({ route }) => {
  const { evento } = route.params

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.icon}>🎵</Text>
        <Text style={styles.titulo}>{evento.titulo}</Text>
        <Text style={styles.direccion}>📍 {evento.direccion}</Text>
        <Text style={styles.fecha}>
          📅 {new Date(evento.fecha_inicio).toLocaleDateString('es-AR', {
            weekday: 'long', day: 'numeric', month: 'long'
          })}
        </Text>
        {evento.entrada_libre && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Entrada libre</Text>
          </View>
        )}
      </View>

      {evento.descripcion && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcion}>{evento.descripcion}</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Horario</Text>
          <Text style={styles.infoValue}>
            {new Date(evento.fecha_inicio).toLocaleTimeString('es-AR', {
              hour: '2-digit', minute: '2-digit'
            })} hs
          </Text>
        </View>
        {evento.precio && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Entrada</Text>
            <Text style={styles.infoValue}>${evento.precio}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>✅ Confirmar asistencia</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  icon: { fontSize: 48, marginBottom: 12 },
  titulo: { fontSize: 22, fontWeight: '600', color: colors.white, textAlign: 'center' },
  direccion: { fontSize: 13, color: colors.primaryLight, marginTop: 8 },
  fecha: { fontSize: 13, color: colors.primaryLight, marginTop: 4 },
  badge: {
    backgroundColor: colors.white, borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 4, marginTop: 10,
  },
  badgeText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  section: {
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '600', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
  },
  descripcion: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  infoBox: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  infoLabel: { fontSize: 13, color: colors.textMuted },
  infoValue: { fontSize: 13, fontWeight: '500', color: colors.primaryDark },
  btn: {
    margin: spacing.md,
    marginTop: 0,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
  },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
})

export default DetalleEventoScreen
