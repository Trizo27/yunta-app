import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { getCanciones, getGeneros } from '../../services/api'
import { colors, spacing, radius } from '../../theme'

const CancionesScreen = ({ navigation }) => {
  const [canciones, setCanciones] = useState([])
  const [generos, setGeneros] = useState(['todos'])
  const [loading, setLoading] = useState(true)
  const [generoSeleccionado, setGeneroSeleccionado] = useState('todos')

  useEffect(() => { cargarGeneros() }, [])
  useEffect(() => { cargarCanciones() }, [generoSeleccionado])

  const cargarGeneros = async () => {
    try {
      const result = await getGeneros()
      setGeneros(['todos', ...(result.data || [])])
    } catch (e) {}
  }

  const cargarCanciones = async () => {
    try {
      setLoading(true)
      const result = await getCanciones(
        generoSeleccionado === 'todos' ? null : generoSeleccionado
      )
      setCanciones(result.data || [])
    } catch (e) {
      setCanciones([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={canciones}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>Cancionero 🎸</Text>
            <FlatList
              horizontal
              data={generos}
              keyExtractor={g => g}
              showsHorizontalScrollIndicator={false}
              style={styles.chips}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.chip, generoSeleccionado === item && styles.chipActive]}
                  onPress={() => setGeneroSeleccionado(item)}
                >
                  <Text style={[styles.chipText, generoSeleccionado === item && styles.chipTextActive]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />}
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🎼</Text>
              <Text style={styles.emptyText}>No hay canciones todavía</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalleCancion', { cancion: item })}
          >
            <View style={styles.cardLeft}>
              <Text style={{ fontSize: 20 }}>🎸</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardMeta}>{item.artista}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.genero}</Text>
              </View>
            </View>
            <Text style={styles.tono}>{item.tono_original}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  header: { fontSize: 22, fontWeight: '600', color: colors.primaryDark, marginBottom: 12 },
  chips: { marginBottom: 16 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full,
    backgroundColor: colors.white, marginRight: 8,
    borderWidth: 0.5, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textMuted },
  chipTextActive: { color: colors.white, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: colors.textMuted },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: 14, marginBottom: 10,
    borderWidth: 0.5, borderColor: colors.border,
    elevation: 1,
  },
  cardLeft: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.accentLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.primaryDark },
  cardMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: colors.primaryBg,
    borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4,
  },
  badgeText: { fontSize: 11, color: colors.primary, fontWeight: '500' },
  tono: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
})

export default CancionesScreen
