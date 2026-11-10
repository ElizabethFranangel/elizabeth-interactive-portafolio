This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Diseño e interacción

Georgia se utiliza en títulos y Segoe UI en textos y controles. Las secciones alternan fondos y el contenido entra suavemente al desplazarse, respetando movimiento reducido. Publicaciones presenta una categoría por pestaña. El halo de los cuadros sigue su borde a 2 px; los enlaces de texto brillan directamente sobre sus letras.

Las vistas de prueba en `.local-preview/` y `public/wireframes/` son locales y no se publican.

## Administración del portafolio

El enlace **Administrar · Iniciar sesión** del pie de página abre `/admin/` (incluye automáticamente la ruta del repositorio en GitHub Pages). El panel permite editar perfil, contacto, publicaciones, presentaciones, certificaciones y diplomados, participación y servicio académico, formación adicional, proyectos de investigación y listas de investigación y docencia; también agregar y quitar elementos de esas listas. Los textos editoriales, la cronología académica y los proyectos de software que siguen escritos directamente en los componentes todavía se editan en el código.

Los títulos de los 18 certificados están integrados en Research, Teaching y Scientific presentations. Al pasar el puntero o enfocar un título aparece la imagen; un clic, Enter o un toque abre el visor ampliado. Escape cierra el visor. Se usan los fondos claros del ejemplo y los fondos oscuros originales. Solo se sirven imágenes en public/certificates: no se incluyen PDF ni enlaces de descarga.

La web conserva su exportación estática. Supabase proporciona autenticación y almacenamiento compartido; los cambios guardados se muestran al abrir o recargar el portafolio sin recompilarlo. Sin configuración, se muestra el contenido original y el panel explica que falta conectar el servicio.

### Activación

1. Crea un proyecto en Supabase. En **Authentication → Users**, crea tu cuenta de administradora con correo y contraseña. Desactiva los registros públicos en las opciones de Auth si no los necesitas.
2. Ejecuta `supabase/setup.sql` una vez en el SQL Editor. Copia el UUID de tu cuenta y ejecuta la sentencia `insert into public.portfolio_admins ...` indicada al final del archivo. Esa tabla define quién puede editar; tener una cuenta por sí solo no concede permisos.
3. Copia `.env.example` a `.env.local`. Configura la URL y la clave **publishable** del proyecto. Nunca uses `service_role` ni claves secretas en variables `NEXT_PUBLIC_*`.
4. Reinicia `npm run dev`, abre `/admin/` e inicia sesión. El primer guardado crea el contenido publicado en la base de datos.
5. Para GitHub Pages, añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en **Settings → Secrets and variables → Actions → Variables** del repositorio y ejecuta el workflow de despliegue. Estas variables se incorporan durante la compilación.

La sesión vive en memoria y se pierde al recargar el panel. Si vence durante la edición, el panel permite iniciar sesión otra vez conservando los cambios en la pestaña. Los errores al guardar conservan el formulario. Si otra sesión modificó el contenido, se bloquea la sobrescritura: copia tus cambios antes de recargar y reconciliarlos. Cerrar sesión pide confirmación si quedan cambios sin guardar.

Los visitantes solo pueden leer el contenido publicado. Las políticas de Row Level Security protegen las escrituras en la base de datos, incluso si alguien omite el panel. Todo el contenido de `portfolio_content` es público: no guardes información privada allí. Referencia: [RLS en Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

### Verificación

`node --test tests/content-service.test.cjs` comprueba validación y llamadas al servicio con respuestas simuladas. `npx tsc --noEmit` y `npm run build` verifican tipos y exportación estática.

Una vez conectado el proyecto real, comprueba que un visitante puede leer pero no escribir, que una cuenta sin membresía no puede entrar ni guardar mediante REST y que la administradora puede agregar y actualizar elementos. Estas políticas requieren verificación con tu proyecto de Supabase; las pruebas locales no sustituyen esa comprobación.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
