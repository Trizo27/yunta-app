import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Switch, Alert,
  ActivityIndicator
} from 'react-native'
import { colors, spacing, radius } from '../../theme'

const BASE_URL = 'http://192.168.100.197:3000'

const CrearEventoScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false)

  // Estado del formulario
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    direccion: '',
    fecha: '',
    hora: '',
    entrada_libre: true,
    precio: '',
  })

  const actualizarCampo = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  const validar = () => {
    if (!form.titulo.trim()) {
      Alert.alert('Campo requerido', 'El título es obligatorio')
      return false
    }
    if (!form.direccion.trim()) {
      Alert.alert('Campo requerido', 'La dirección es obligatoria')
      return false
    }
    if (!form.fecha.trim()) {
      Alert.alert('Campo requerido', 'La fecha es obligatoria (formato: DD/MM/AAAA)')
      return false
    }
    if (!form.hora.trim()) {
      Alert.alert('Campo requerido', 'La hora es obligatoria (formato: HH:MM)')
      return false
    }
    return true
  }

  const construirFecha = () => {
    // Convertimos DD/MM/AAAA HH:MM a ISO string
    const [dia, mes, anio] = form.fecha.split('/')
    const [hora, minutos] = form.hora.split(':')
    return new Date(anio, mes - 1, dia, hora, minutos).toISOString()
  }

  const crearEvento = async () => {
    if (!validar()) return

    try {
      setLoading(true)

      // Por ahora usamos coordenadas de Córdoba capital por defecto
      // Más adelante integramos geolocalización automática
      const body = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        direccion: form.direccion.trim(),
        latitud: -31.4167,
        longitud: -64.1833,
        fecha_inicio: construirFecha(),
        entrada_libre: form.entrada_libre,
        precio: form.entrada_libre ? null : parseFloat(form.precio) || null,
      }

      const response = await fetch(`${BASE_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        Alert.alert('Error', data.error || 'No se pudo crear el evento')
        return
      }

      Alert.alert(
        '¡Evento creado! 🎉',
        'Tu evento fue publicado exitosamente',
        [{ text: 'Ver eventos', onPress: () => navigation.goBack() }]
      )
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Crear evento</Text>
        <Text style={styles.heroSub}>Compartí una peña o guitarreada con la comunidad</Text>
      </View>

      <View style={styles.form}>

        {/* Título */}
        <View style={styles.campo}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Peña Los Cardones"
            placeholderTextColor={colors.textMuted}
            value={form.titulo}
            onChangeText={v => actualizarCampo('titulo', v)}
          />
        </View>

        {/* Descripción */}
        <View style={styles.campo}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Contá de qué se trata el evento..."
            placeholderTextColor={colors.textMuted}
            value={form.descripcion}
            onChangeText={v => actualizarCampo('descripcion', v)}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Dirección */}
        <View style={styles.campo}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Av. Colón 1250, Córdoba"
            placeholderTextColor={colors.textMuted}
            value={form.direccion}
            onChangeText={v => actualizarCampo('direccion', v)}
          />
        </View>

        {/* Fecha y hora en fila */}
        <View style={styles.filaDoble}>
          <View style={[styles.campo, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Fecha *</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textMuted}
              value={form.fecha}
              onChangeText={v => actualizarCampo('fecha', v)}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={[styles.campo, { flex: 1 }]}>
            <Text style={styles.label}>Hora *</Text>
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor={colors.textMuted}
              value={form.hora}
              onChangeText={v => actualizarCampo('hora', v)}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        {/* Entrada libre switch */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.label}>Entrada libre</Text>
            <Text style={styles.switchSub}>
              {form.entrada_libre ? 'El evento es gratuito' : 'El evento tiene costo'}
            </Text>
          </View>
          <Switch
            value={form.entrada_libre}
            onValueChange={v => actualizarCampo('entrada_libre', v)}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={form.entrada_libre ? colors.primary : colors.textMuted}
          />
        </View>

        {/* Precio — solo si no es entrada libre */}
        {!form.entrada_libre && (
          <View style={styles.campo}>
            <Text style={styles.label}>Precio ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2000"
              placeholderTextColor={colors.textMuted}
              value={form.precio}
              onChangeText={v => actualizarCampo('precio', v)}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Botón crear */}
        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={crearEvento}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.btnText}>Publicar evento 🎵</Text>
          }
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroTitle: { fontSize: 22, fontWeight: '600', color: colors.white },
  heroSub: { fontSize: 13, color: colors.primaryLight, marginTop: 4 },
  form: { padding: spacing.md },
  campo: { marginBottom: spacing.md },
  label: {
    fontSize: 13, fontWeight: '600',
    color: colors.primaryDark, marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 12,
    fontSize: 15,
    color: colors.primaryDark,
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: 'top',
  },
  filaDoble: { flexDirection: 'row' },
  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 12,
    marginBottom: spacing.md,
  },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
})

export default CrearEventoScreen
