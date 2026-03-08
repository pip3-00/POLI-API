# Politécnico Ann y Ted Kheel - Sitio Web Oficial

Sitio web institucional moderno y responsive desarrollado como proyecto práctico para aplicar frontend con HTML/CSS/JavaScript y un backend básico con FastAPI, simulando un entorno real de desarrollo full stack.

Demo live :


## 🚀 Características

- **Frontend Responsive**: HTML5, CSS3, JavaScript vanilla con Bootstrap 5
- **Backend API**: Python con FastAPI para funcionalidades dinámicas
- **Galería Interactiva**: Lightbox con navegación de imágenes
- **Sistema de Comentarios**: Formulario funcional para comentarios de visitantes
- **Noticias y Eventos**: Sistema de gestión de contenido dinámico
- **Optimizado para SEO**: Meta tags y estructura semántica
- **Accesibilidad**: Cumple con estándares de accesibilidad web

## 🛠️ Tecnologías Utilizadas

### Frontend

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript**: Interactividad y funcionalidades dinámicas
- **Bootstrap 5**: Framework CSS para diseño responsive
- **Font Awesome**: Iconografía moderna

### Backend

Implementación inicial con FastAPI que expone endpoints REST para noticias, eventos, estudiantes y horarios. Actualmente devuelve respuestas simuladas (mock data), preparado para futura integración con base de datos y lógica de negocio.

- **Python 3**

- **FastAPI**

- **Uvicorn** (servidor de desarrollo)

## 📁 Estructura del Proyecto

poli-PI/
├── index.html          # Página principal
├── login.html          # Portal de administración
├── app.js              # Funcionalidades principales JS
├── noticias.js         # Sistema de noticias
├── index.css           # Estilos principales
├── assets/             # Imágenes, iconos, fuentes
└── backend/            # API con FastAPI


## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 16+ (para el frontend)
- Python 3.13+ (para el backend)

### Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/pip3-00/Portafolio.git
cd Portafolio/poli-pi-website
```

2. **Instalar dependencias del frontend**

```bash
npm install
```

3. **Instalar dependencias del backend**

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Ejecutar en Desarrollo

**Frontend (Puerto 3000)**

```bash
npm run dev
```

**Backend (Puerto 8000)**

```bash
npm run backend-dev
```

### Ejecutar en Producción

**Frontend**

```bash
npm start
```

**Backend**

```bash
npm run backend
```

## 📖 API Endpoints

El backend proporciona los siguientes endpoints:

- `GET /noticias` - Obtener todas las noticias
- `POST /eventos` - Crear un nuevo evento
- `GET /estudiantes` - Listar estudiantes
- `PUT /horarios` - Actualizar horarios

Nota: Los endpoints actuales retornan datos de ejemplo (mock responses) como parte de una implementación inicial del backend.

## 🎨 Secciones del Sitio

1. **Inicio**: Hero section con información institucional
2. **Vida Estudiantil**: Galería interactiva y carrusel de imágenes
3. **Noticias**: Sistema de noticias con filtros y búsqueda
4. **Contacto**: Información de contacto y formularios

## 📱 Características Responsive

- Diseño adaptable para móviles, tablets y desktop
- Navegación colapsable en dispositivos móviles
- Imágenes optimizadas para diferentes resoluciones
- Touch-friendly para dispositivos táctiles

## 🔧 Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```
API_BASE_URL=http://localhost:8000
SITE_NAME=Politécnico Ann y Ted Kheel
```

### Personalización

- Editar `frontend/index.css` para cambiar estilos
- Modificar `frontend/index.html` para contenido
- Actualizar `backend/main.py` para funcionalidades API

## 🚀 Deployment

Ver [docs/deployment.md](docs/deployment.md) para instrucciones detalladas de deployment.

## 🧠 Qué aprendí en este proyecto

-Organización de un proyecto frontend + backend

-Uso de FastAPI para crear APIs simples

-Separación de responsabilidades entre capas

-Uso correcto de .gitignore

-Manejo de ramas en Git

-Documentación clara para otros desarrolladores

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autor

**Daphne de Jesus**

- Desarrollo Full Stack
- Interesada en frontend, backend y arquitectura de proyectos reales

© 2025 Todos los derechos reservados.
