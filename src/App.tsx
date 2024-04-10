import React from 'react';
import './assets/styles/style.css';
import './assets/styles/animate.css';
import './assets/styles/bootstrap-datetimepicker.min.css';
import './assets/styles/bootstrap.min.css';
import './assets/styles/dataTables.bootstrap4.min.css';
import header from './components/header';
import DashboardNavbar from './components/dashboard-navbar';


function App() {
  return (
    <div>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=0"
      />
      <meta name="description" content="POS - Bootstrap Admin Template" />
      <meta
        name="keywords"
        content="admin, estimates, bootstrap, business, corporate, creative, management, minimal, modern,  html5, responsive"
      />
      <meta
        name="author"
        content="Dreamguys - Bootstrap Admin Template"
      />
      <meta name="robots" content="noindex, nofollow" />
      <title>PROTOTIPO - INICIO</title>
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href="assets/img/favicon.jpg"
      />
      <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="assets/css/animate.css" />
      <link
        rel="stylesheet"
        href="assets/css/dataTables.bootstrap4.min.css"
      />
      <link
        rel="stylesheet"
        href="assets/plugins/fontawesome/css/fontawesome.min.css"
      />
      <link rel="stylesheet" href="assets/plugins/fontawesome/css/all.min.css" />
      <link rel="stylesheet" href="assets/css/style.css" />
      
      {/* Aquí se renderiza la barra de navegación del dashboard */}
      <DashboardNavbar />

      {/* Aquí se renderizarán los componentes de tu aplicación */}
    </div>
  );
}

export default App;

