import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native'
import { getEventos } from '../../services/api'
import { colors, spacing, radius } from '../../theme'

const EventosScreen = ({ navigation }) => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { cargarEventos() }, [])

  const cargarEventos = async () => {
    try {
      setLoading(true)
      const result = await getEventos()
      setEventos(result.data || [])
    } catch (e) {
      setError('No se pudieron cargar los eventos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Cargando eventos...</Text>
    </View>
  )

  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={cargarEventos}>
        <Text style={styles.retryText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.header}>Peñas y Eventos 🎵</Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🪗</Text>
            <Text style={styles.emptyText}>No hay eventos próximos</Text>
            <Text style={styles.emptySub}>¡Sé el primero en crear uno!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalleEvento', { evento: item })}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardIcon}>🎵</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardMeta}>📍 {item.direccion}</Text>
              <Text style={styles.cardMeta}>
                📅 {new Date(item.fecha_inicio).toLocaleDateString('es-AR', {
                  weekday: 'short', day: 'numeric', month: 'short'
                })}
              </Text>
              {item.entrada_libre && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Entrada libre</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CrearEvento')}
      >
        <Text style={styles.fabText}>+ Crear evento</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: 12, color: colors.textMuted, fontSize: 14 },
  errorText: { color: '#c0392b', fontSize: 14, marginBottom: 12 },
  retryBtn: { backgroundColor: colors.primary, padding: 10, borderRadius: radius.md },
  retryText: { color: colors.white, fontWeight: '600' },
  list: { padding: spacing.md },
  header: { fontSize: 22, fontWeight: '600', color: colors.primaryDark, marginBottom: 16 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.primaryDark },
  emptySub: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: colors.border,
    elevation: 2,
  },
  cardLeft: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  cardIcon: { fontSize: 20 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.primaryDark, marginBottom: 4 },
  cardMeta: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: colors.primaryBg,
    borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4,
  },
  badgeText: { fontSize: 11, color: colors.primary, fontWeight: '500' },
  fab: {
    margin: spacing.md, backgroundColor: colors.accent,
    borderRadius: radius.md, padding: 14, alignItems: 'center',
  },
  fabText: { color: colors.white, fontWeight: '600', fontSize: 15 },
})

export default EventosScreen
