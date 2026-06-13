import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native'
import { colors, spacing, radius } from '../../theme'

const NOTAS = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']

const BEMOLES = {
  'Reb': 'Do#', 'Mib': 'Re#', 'Solb': 'Fa#', 'Lab': 'Sol#', 'Sib': 'La#'
}

const normalizarNota = (nota) => BEMOLES[nota] || nota

const transponerNota = (nota, semitonos) => {
  const normalizada = normalizarNota(nota)
  const idx = NOTAS.indexOf(normalizada)
  if (idx === -1) return nota
  return NOTAS[(idx + semitonos + 12) % 12]
}

const transponerAcorde = (acorde, semitonos) => {
  if (semitonos === 0) return acorde

  if (acorde.includes('/')) {
    const [raiz, bajo] = acorde.split('/')
    const raizBase = raiz.replace(/\s*m7|\s*7|\s*m|\s*9/g, '')
    const calidad = raiz.slice(raizBase.length)
    return `${transponerNota(raizBase, semitonos)}${calidad}/${transponerNota(bajo, semitonos)}`
  }

  const match = acorde.match(/^([A-S][a-z#b]*)(\s*m7|\s*m|\s*7|\s*9)?(.*)$/)
  if (!match) return acorde

  const [, raiz, calidad = '', resto = ''] = match
  return `${transponerNota(raiz, semitonos)}${calidad}${resto}`
}

const parsearLinea = (linea) => {
  const segmentos = []
  const regex = /\[([^\]]+)\]([^\[]*)/g
  let match

  const primerCorchete = linea.indexOf('[')
  if (primerCorchete > 0) {
    segmentos.push({ texto: linea.slice(0, primerCorchete) })
  }

  while ((match = regex.exec(linea)) !== null) {
    segmentos.push({ acorde: match[1], texto: match[2] })
  }

  return segmentos
}

const LineaConAcordes = ({ linea, semitonos, esOriginal }) => {
  const tieneAcordes = linea.includes('[')

  if (!tieneAcordes) {
    return <Text style={styles.letraLinea}>{linea || ' '}</Text>
  }

  const segmentos = parsearLinea(linea)

  return (
    <View style={styles.lineaWrapper}>
      <View style={styles.acordesFila}>
        {segmentos.map((seg, i) => (
          <View key={i} style={styles.segmento}>
            {seg.acorde ? (
              <Text style={[
                styles.acordeInline,
                esOriginal && styles.acordeOriginal
              ]}>
                {transponerAcorde(seg.acorde, semitonos)}
              </Text>
            ) : (
              <Text style={styles.acordeVacio}>{' '}</Text>
            )}
          </View>
        ))}
      </View>
      <View style={styles.letraFila}>
        {segmentos.map((seg, i) => (
          <Text key={i} style={styles.letraSegmento}>{seg.texto}</Text>
        ))}
      </View>
    </View>
  )
}

const DetalleCancionScreen = ({ route }) => {
  const { cancion } = route.params
  const [semitonos, setSemitonos] = useState(0)

  const tonoActual = transponerNota(cancion.tono_original || 'Do', semitonos)
  const esOriginal = semitonos === 0

  const lineas = cancion.letra ? cancion.letra.split('\n') : []

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.icon}>🎸</Text>
        <Text style={styles.titulo}>{cancion.titulo}</Text>
        {cancion.artista && (
          <Text style={styles.artista}>{cancion.artista}</Text>
        )}
        <View style={styles.badges}>
          {cancion.genero && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cancion.genero}</Text>
            </View>
          )}
          <View style={[styles.badge, esOriginal && styles.badgeOriginal]}>
            <Text style={[styles.badgeText, esOriginal && styles.badgeTextOriginal]}>
              {esOriginal ? `★ ${tonoActual} (original)` : `Tono: ${tonoActual}`}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.transponerBox}>
        <View>
          <Text style={styles.transponerLabel}>Transponer</Text>
          <Text style={styles.transponerSub}>
            {semitonos === 0
              ? 'Tono original'
              : `${semitonos > 0 ? '+' : ''}${semitonos} semitono${Math.abs(semitonos) !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <View style={styles.transponerControls}>
          <TouchableOpacity
            style={styles.transponerBtn}
            onPress={() => setSemitonos(s => s - 1)}
          >
            <Text style={styles.transponerBtnText}>−</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.transponerBtn, esOriginal && styles.transponerBtnResetActive]}
            onPress={() => setSemitonos(0)}
          >
            <Text style={[styles.transponerResetText, esOriginal && styles.transponerResetTextActive]}>
              ↺
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.transponerBtn}
            onPress={() => setSemitonos(s => s + 1)}
          >
            <Text style={styles.transponerBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cancion.acordes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acordes de la canción</Text>
          <View style={styles.acordesBox}>
            <Text style={styles.acordesTexto}>
              {cancion.acordes
                .split(/\s*-\s*/)
                .map(acorde => transponerAcorde(acorde.trim(), semitonos))
                .join('   ')}
            </Text>
          </View>
        </View>
      )}

      {lineas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Letra y acordes</Text>
          <View style={styles.letraBox}>
            {lineas.map((linea, i) => (
              <LineaConAcordes
                key={i}
                linea={linea}
                semitonos={semitonos}
                esOriginal={esOriginal}
              />
            ))}
          </View>
        </View>
      )}

      {!cancion.acordes && lineas.length === 0 && (
        <View style={styles.sinContenido}>
          <Text style={styles.sinContenidoIcon}>🎼</Text>
          <Text style={styles.sinContenidoText}>
            Esta canción aún no tiene letra ni acordes cargados
          </Text>
        </View>
      )}

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
  icon: { fontSize: 44, marginBottom: 8 },
  titulo: { fontSize: 20, fontWeight: '600', color: colors.white, textAlign: 'center' },
  artista: { fontSize: 14, color: colors.primaryLight, marginTop: 4 },
  badges: {
    flexDirection: 'row', gap: 8, marginTop: 10,
    flexWrap: 'wrap', justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  badgeText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  badgeOriginal: { backgroundColor: colors.primaryDark },
  badgeTextOriginal: { color: colors.white },
  transponerBox: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  transponerLabel: { fontSize: 14, fontWeight: '600', color: colors.primaryDark },
  transponerSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  transponerControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  transponerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
  },
  transponerBtnText: { fontSize: 22, color: colors.primary, fontWeight: '400', lineHeight: 26 },
  transponerBtnResetActive: { backgroundColor: colors.primary },
  transponerResetText: { fontSize: 18, color: colors.textMuted },
  transponerResetTextActive: { color: colors.white },
  section: { padding: spacing.md },
  sectionTitle: {
    fontSize: 11, fontWeight: '600', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  acordesBox: {
    backgroundColor: colors.white, borderRadius: radius.md,
    padding: 14, borderWidth: 0.5, borderColor: colors.border,
  },
  acordesTexto: {
    fontFamily: 'monospace', fontSize: 15,
    color: colors.primaryDark, lineHeight: 26,
  },
  letraBox: { gap: 2 },
  lineaWrapper: { marginBottom: 8 },
  acordesFila: { flexDirection: 'row', flexWrap: 'wrap' },
  letraFila: { flexDirection: 'row', flexWrap: 'wrap' },
  segmento: { flexDirection: 'column' },
  acordeInline: {
    fontSize: 12, fontWeight: '700', color: colors.primary,
    fontFamily: 'monospace', paddingRight: 4,
  },
  acordeOriginal: { color: colors.accent },
  acordeVacio: { fontSize: 12 },
  letraSegmento: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
  letraLinea: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: 4 },
  sinContenido: { alignItems: 'center', padding: 40 },
  sinContenidoIcon: { fontSize: 44, marginBottom: 12 },
  sinContenidoText: {
    fontSize: 14, color: colors.textMuted,
    textAlign: 'center', lineHeight: 22,
  },
})

export default DetalleCancionScreen
