### BACKEND DEL PROYECTO 
                          
Notas de la entrega:
- Este proyecto corresponde al trabajo practico de la materia.El backend esta desarrollado en **Node.js con Express**, con **Prisma** como ORM y conexion a base de datos.El repositorio incluye tanto el frontend como el backend.

### Funcionalidades implementadas

- Gestión de usuarios (registro, login, validaciones).
- Creación y gestión de eventos.
- Inscripción y desinscripción de usuarios a eventos.
- Validaciones en formularios (backend y frontend).
- Uso de Prisma para la persistencia de datos.
- Endpoints RESTful organizados en **controllers**.

### validaciones y Controladores:
- **Usuarios**: se validan datos obligatorios como nombre, email y contraseña.  
- **Eventos**: se verifica que contengan título, fecha y descripción antes de persistirlos.  
- **Inscripciones**: el sistema controla que un usuario no se inscriba dos veces en el mismo evento.  
- **Desinscripciones**: se gestionan correctamente para mantener integridad de datos.  

Los controladores están organizados de forma modular y separan la lógica de negocio de las rutas.
## Observaciones relevantes

- Durante las pruebas, se detectó y resolvió un error en el proceso de desinscripción de eventos (se esperaba JSON pero respondía HTML).  
- Se agregó manejo de errores con mensajes claros hacia el cliente.  
- El backend está preparado para futuras ampliaciones (ejemplo: notificaciones, integración con APIs externas).
## Créditos del equipo

Este trabajo fue realizado en equipo por los integrantes del grupo, cada uno aportando en distintas áreas:  

- **Backend**: desarrollo de controladores, validaciones, configuración de Prisma y conexión con base de datos.  
- **Frontend**: vistas de login, registro e interacción con eventos.  
- **Integración**: pruebas de endpoints, debugging y documentación.
