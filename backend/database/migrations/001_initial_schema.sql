-- =============================================
-- YUNTA APP - Migración inicial
-- Crea las tablas base de la aplicación
-- =============================================

-- Tabla de usuarios
-- Extiende el sistema de auth de Supabase con datos extra
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  ubicacion VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de canchas
-- Almacena canchas de fútbol con su ubicación geográfica
CREATE TABLE IF NOT EXISTS canchas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(150) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('futbol_5', 'futbol_7', 'futbol_11')),
  superficie VARCHAR(50),
  precio_por_hora DECIMAL(10, 2),
  telefono VARCHAR(20),
  calificacion DECIMAL(3, 2) DEFAULT 0,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de eventos folklóricos
-- Peñas, guitarreadas y eventos culturales
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creador_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  direccion VARCHAR(255) NOT NULL,
  latitud DECIMAL(10, 8) NOT NULL,
  longitud DECIMAL(11, 8) NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE,
  entrada_libre BOOLEAN DEFAULT TRUE,
  precio DECIMAL(10, 2),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de canciones
-- Cancionero folklórico con letras y acordes
CREATE TABLE IF NOT EXISTS canciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(150) NOT NULL,
  artista VARCHAR(150),
  genero VARCHAR(50) CHECK (genero IN ('zamba', 'chacarera', 'cueca', 'chamamé', 'milonga', 'vidala', 'otro')),
  tono_original VARCHAR(10),
  letra TEXT,
  acordes TEXT,
  subido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  aprobado BOOLEAN DEFAULT FALSE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de asistencias
-- Relaciona usuarios con eventos (quién va a qué peña)
CREATE TABLE IF NOT EXISTS asistencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  evento_id UUID REFERENCES eventos(id) ON DELETE CASCADE,
  confirmado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, evento_id)
);
