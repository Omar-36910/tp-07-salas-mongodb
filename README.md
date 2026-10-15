# Trabajo práctico 07: Laboratorio de Persistencia con MongoDB y Mongoose

## 1. Punto de partida y nombre de la copia
Este proyecto toma como base directa la aplicación modular del **TP-06 (`tp-06-salas-modular`)**. La copia de trabajo se denomina **`tp-07-salas-mongodb`**, conservando intacta la lógica Express del sitio web en memoria e incorporando de forma paralela un laboratorio de persistencia basado en scripts de terminal independientes que interactúan con una base de datos en la nube.

## 2. Versiones utilizadas y confirmación del uso de Atlas Free (M0)
* **Entorno de ejecución:** Node.js (versión 20+ recomendada).
* **Gestor de paquetes:** npm.
* **Dependencias principales:** `express`, `ejs`, `express-ejs-layouts`, `morgan`, `mongoose` (^8.x).
* **Herramientas de calidad:** `prettier`, `eslint`, `@eslint/js`.
* **Servidor de base de datos:** Se confirma el uso de un clúster gratuito **MongoDB Atlas Free Tier (M0)**, alojando una base de datos específica llamada `reservas_salas_u7`.

## 3. Pasos desde una descarga nueva (Incluyendo Preparación de Atlas y Entorno)

### A. Preparar el clúster gratuito en Atlas
1. Registrarse o iniciar sesión en **MongoDB Atlas** y crear un clúster gratuito tipo **M0 (Free Tier)**.
2. **Crear un usuario de base de datos:** En el panel izquierdo, ir a *Security* > *Database Access* y añadir un usuario con un nombre de usuario y contraseña seguros, asignándole privilegios de lectura y escritura (`readWriteAnyDatabase` o acceso exclusivo a la base `reservas_salas_u7`).
3. **Configurar la IP permitida:** Ir a *Security* > *Network Access* y añadir una regla de acceso. Para entornos de desarrollo local, se puede permitir la dirección IP actual o configurar temporalmente el acceso global (`0.0.0.0/0`).
4. **Obtener la URI de conexión:** Ir a *Database* > *Connect* > *Connect your application* (Node.js), y copiar la cadena URI provista.

### B. Configurar el entorno local
1. Instalar las dependencias ejecutando en la raíz del proyecto:
   ```bash
   npm install

```

2. Copiar el archivo plantilla de entorno y renombrarlo:
```bash
cp .env.example .env

```


3. Editar el archivo `.env` generado, reemplazando los marcadores de la variable `MONGODB_URI` con tus credenciales reales de Atlas (usuario, contraseña y host del clúster), manteniendo intactas las opciones de conexión originales (`?retryWrites=true&w=majority`). El archivo `.env` queda automáticamente excluido del control de versiones por el `.gitignore`.

## 4. Diagnóstico DNS y comandos de ejecución

### Diagnóstico DNS

Para evitar errores comunes de resolución de registros SRV/TXT (típicos en ciertas redes corporativas, educativas o ISPs locales con restricciones de resolución), se configuró explícitamente el módulo `node:dns` fijando resolutores públicos estables de confianza dentro de `src/config/base-datos.js`:

```javascript
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

```

Esto asegura que la resolución de nombres de dominio de Atlas sea robusta y directa a nivel de Node.js sin alterar la configuración del sistema operativo.

### Comandos exactos de ejecución y calidad

* **Comprobar conexión con Atlas:**
```bash
node --env-file=.env scripts/comprobar-conexion.js

```


* **Crear una reserva en la base de datos:**
```bash
node --env-file=.env scripts/crear-reserva.js

```


* **Listar reservas desde la base de datos:**
```bash
node --env-file=.env scripts/listar-reservas.js

```


* **Verificación de calidad (Prettier y ESLint en `src` y `scripts`):**
```bash
npm run format
npm run check

```


* **Arranque del sitio web (en memoria):**
```bash
npm start
# o con entorno local:
npm run start:local

```



## 5. Mapa de archivos y explicación de esquema, modelo y colección

* `src/config/entorno.js`: Lector centralizado de variables de entorno (`PORT`, `NODE_ENV`, `MONGODB_URI`). Reemplaza a `configuracion.js` del TP-06.
* `src/config/base-datos.js`: Configura los DNS de Node y expone las funciones asíncronas `conectarDB` y `desconectarDB`.
* `src/modelos/reserva.js`: Define el esquema de Mongoose y compila el modelo.
* `scripts/comprobar-conexion.js`: Valida el acceso al clúster sin modificar datos.
* `scripts/crear-reserva.js`: Instancia un documento válido, lo persiste mediante `.save()` y reporta el `_id` oficial generado.
* `scripts/listar-reservas.js`: Consulta la colección mediante `.find()`, imprimiendo el total de documentos y sus propiedades.

### Explicación de Esquema, Modelo y Colección

* **Esquema (`Schema`):** Representa la definición estructural lógica en Mongoose. Determina los tipos de datos de cada campo, las reglas de validación obligatorias, el saneamiento (`trim`) y las restricciones de formato.
* **Modelo (`Model`):** Es la clase constructora compilada a partir del esquema. Permite interactuar con la base de datos para ejecutar operaciones de consulta, inserción, actualización y borrado.
* **Colección:** Es la agrupación física de documentos dentro de la base de datos de MongoDB Atlas. En este proyecto se encuentra vinculada de manera explícita bajo el nombre `reservas`.

## 6. Campos y reglas

El modelo define restricciones estrictas sobre los siguientes campos:

* `estudiante`: `String`, obligatorio, saneado con `trim()`.
* `email`: `String`, obligatorio, `trim()`, validación de formato básico mediante expresión regular (`match: /@/`).
* `sala`: `String`, obligatorio, validado estrictamente mediante un `enum`: `["Sala Norte", "Sala Sur", "Sala Multimedia"]`.
* `fecha`: `String`, obligatorio, saneado con `trim()`.
* `turno`: `String`, obligatorio, limitado mediante `enum` a: `["Mañana", "Tarde", "Noche"]`.
* `personas`: `Number`, obligatorio, validado con límites numéricos `min: 1`, `max: 6` y una validación de tipo entero estricta mediante `Number.isInteger`.

### Límites que todavía no se controlan

Esta etapa cubre reglas estructurales básicas de campos individuales. Todavía no se abordan validaciones complejas de negocio avanzadas, tales como: fechas de calendario imposibles, solapamientos horarios en una misma sala, duplicidad de reservas por un mismo estudiante o límites de capacidad compartida globales.

## 7. Matriz de pruebas y evidencia de persistencia

| Caso de Prueba | Resultado Esperado | Evidencia Observada / Estado |
| --- | --- | --- |
| **Conexión válida** | Confirmación y proceso terminado | Éxito: Conexión establecida y desconexión limpia. |
| **Variable MONGODB_URI vacía** | Fallo de configuración, sin éxito | Error controlado: Termina con código de salida distinto de cero. |
| **Contraseña incorrecta en .env** | Fallo de autenticación, sin éxito | Error de autenticación en Atlas detectado y reportado. |
| **Colección vacía (base limpia)** | Listado con cantidad 0, sin error | Devuelve un arreglo vacío y muestra un total de 0 registros. |
| **Reserva válida** | Se guarda y devuelve `_id` | Documento persistido correctamente con su `ObjectId` oficial. |
| **Consulta desde proceso nuevo** | Recupera el `_id` creado previamente | Comprobado: Al cerrar el script de creación y abrir un script de consulta independiente, el documento sigue estando disponible. |
| **Segunda consulta** | No agrega registros extra | Cantidad de registros constante sin alterations anómalas. |
| **Estudiante vacío** | Rechazo de Mongoose, sin cambios | Error de validación en campo `estudiante`, documento no guardado. |
| **Email sin `@**` | Rechazo de Mongoose, sin cambios | Falla la regla `match` de la arroba, operación rechazada. |
| **Sala o turno no permitido** | Rechazo de Mongoose, sin cambios | Falla la restricción del `enum`, operación rechazada. |
| **Fecha vacía** | Rechazo de Mongoose, sin cambios | Error de campo requerido, documento no guardado. |
| **Personas 0, 7 o decimal (2.5)** | Rechazo de Mongoose, sin cambios | Fallan los límites `min/max` o la validación `isInteger`. |

### Evidencia de persistencia entre procesos independientes

Al ejecutar `node --env-file=.env scripts/crear-reserva.js`, el script se conecta, persiste un documento y finaliza. Posteriormente, al abrir un **proceso de Node.js completamente independiente** ejecutando `node --env-file=.env scripts/listar-reservas.js`, el documento se recupera intacto de Atlas mostrando exactamente el mismo `_id` y aumentando el conteo global en uno, demostrando de forma categórica que la persistencia externa es real y duradera.

## 8. Explicación sobre la memoria web y la Unidad 8

El sitio web Express (rutas de vistas y formularios HTML) continúa operando deliberadamente en memoria RAM volátil utilizando la semilla estática inicial heredada del TP-06. La razón metodológica de esta separación es aislar y validar de manera independiente el comportamiento de Mongoose, los esquemas y la conexión con Atlas mediante scripts de consola. La migración integral de los controladores HTTP del sitio web para que operen mediante promesas asíncronas conectadas directamente a la base de datos se abordará formalmente en la próxima unidad (**Unidad 8**).

## 9. Confirmación de seguridad

Se confirma de manera absoluta y categórica que **no se publican** en el repositorio archivos `.env`, credenciales de acceso, contraseñas de Atlas ni datos personales de usuarios. El control de versiones excluye automáticamente dichos archivos gracias a la regla configurada en el `.gitignore`, versionando únicamente el archivo plantilla seguro y público `.env.example`.

```

```