# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Implementacion en react de una vista de usuario y de empresa por separada, donde el usuario podra inscribirse en eventos y las empresas podran crearlo. Con empresas no nos referimos a unicamente empresas literalmente, sino mas una vista de negocio, donde una persona particular puede funcionar como empresa.

LOGRADO:
Seperacion en pages para mayor orden.
Gran modularidad gracias a componentes claros.
Implementacion de un formulario para la creacion de eventos.
Implementacion de hooks (useToggle) para el filtrado de los eventos al cual anotarse por partde de los usuarios.

FALTA:
Falta definir bien como sera la interfaz de la encuesta para votar o proponer canciones.
Tambien ordenar mejor el css.
Mejorar el readme

Aclaracion API: 
Implementamos una api que nos muestra eventos aleatorios. Los eventos no son exclusivamente argentinos porq no hay los suficientes, pero la realidad es que cuando implementemos el back los eventos que van a mostrarse seran solo los que se carguen dentro de la propia pagina, asiq no sera necesario el uso de una api mas adelante (O por lo menos esta api).

Problemas con la implementacio de la libreria Tailwind. No tanto por el hecho de no saber manejarla, sino mas bien por el hecho de que no nos funciona, ya hicimos las instalaciones varias veces y pruebas basicas como cambiar el fondo de color y no funciona. Pensamos que por ahi estaba interfiriendo el css, pero ese tampoco es el problema.