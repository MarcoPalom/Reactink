import React from 'react';
import './assets/styles/style.css';
import './assets/styles/animate.css';
import './assets/styles/bootstrap-datetimepicker.min.css';
import './assets/styles/bootstrap.min.css';
import './assets/styles/dataTables.bootstrap4.min.css';

function App() {
  return (
    <div className="header">
      <div className="header-left active">
    
    
        <a href="index.html" className="logo">
        <img src='./assets/img/login.png'/>
        </a>
    
    
        <a href="index.html" className="logo-small">
          <img src='./assets/img/logo-small.png'alt="" />
        </a>
    
        <a id="toggle_btn" href={void(0)}>
        </a>
    
        <a id="mobile_btn" className="mobile_btn" href="#sidebar">
          <span className="bar-icon">
              <span></span>
          <span></span>
          <span></span>
          </span>
        </a>
    
    
        <ul className="nav user-menu">
    
    
          <li className="nav-item">
            <div className="top-nav-search">
              <a href={void(0)} className="responsive-search">
                <i className="fa fa-search"></i>
              </a>
              <form action="#">
                <div className="searchinputs">
                  <input type="text" placeholder="Busqueda ..." />
                  <div className="search-addon">
                    <span><img src="assets/img/icons/closes.svg" alt="img"/></span>
                  </div>
                </div>
                <a className="btn" id="searchdiv"><img src="Assets/img/icons/search.svg" alt="img" /></a>
              </form>
            </div>
          </li>
    
    
          <li className="nav-item dropdown">
            <a href={void(0)} className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
              <img src="assets/img/icons/notification-bing.svg" alt="img" />
    
              <span className="badge rounded-pill">4</span>
            </a>
    
    
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notificaciones</span>
                <a href={void(0)} className="clear-noti"> Eliminar todas </a>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message">
    
    
                    <a href="activities.html">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                            <img alt="" src="Assets/img/profiles/avatar-02.jpg"/>
                          </span>
    
    
                        <div className="media-body flex-grow-1">
                          <p className="noti-details"><span className="noti-title">John Doe</span> added new task <span className="noti-title">Patient appointment booking</span></p>
                          <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="activities.html">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                            <img alt="" src="Assets/img/profiles/avatar-03.jpg"/>
                          </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details"><span className="noti-title">Tarah Shropshire</span> changed the task name <span className="noti-title">Appointment booking with payment gateway</span></p>
                          <p className="noti-time"><span className="notification-time">6 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="activities.html">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                            <img alt="" src="assets/img/profiles/avatar-06.jpg"/>
                          </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details"><span className="noti-title">Misty Tison</span> added <span className="noti-title">Domenic Houston</span> and <span className="noti-title">Claire Mapes</span> to project <span className="noti-title">Doctor available module</span></p>
                          <p className="noti-time"><span className="notification-time">8 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="activities.html">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                            <img alt="" src="Assets/img/profiles/avatar-17.jpg"/>
                          </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details"><span className="noti-title">Rolland Webber</span> completed task <span className="noti-title">Patient and Doctor video conferencing</span></p>
                          <p className="noti-time"><span className="notification-time">12 mins ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="notification-message">
                    <a href="activities.html">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                            <img alt="" src="Assets/img/profiles/avatar-13.jpg"/>
                          </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details"><span className="noti-title">Bernardo Galaviz</span> added new task <span className="noti-title">Private chat module</span></p>
                          <p className="noti-time"><span className="notification-time">2 days ago</span></p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
    
    
    
              <div className="topnav-dropdown-footer">
                <a href="activities.html">Ver todas las notificaciones</a>
              </div>
            </div>
          </li>
    
    
          <li className="nav-item dropdown has-arrow main-drop">
            <a href={void(0)} className="dropdown-toggle nav-link userset" data-bs-toggle="dropdown">
              <span className="user-img"><img src="Assets/img/profiles/avator1.jpg" alt=""/>
                            <span className="status online">
                            </span>
              </span>
            </a>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img"><img src="Assets/img/profiles/avator1.jpg" alt=""/>
                      <span className="status online"></span>
                  </span>
                  <div className="profilesets">
                    <h6>John Doe</h6>
                    <h5>Administrador</h5>
                  </div>
                </div>
    
                <hr className="m-0" />
                <a className="dropdown-item" href="profile.html"> <i className="me-2" data-feather="user"></i> Mi Perfil</a>
                <a className="dropdown-item" href="generalsettings.html"><i className="me-2" data-feather="settings"></i>Configuraciones</a>
                <hr className="m-0" />
                <a className="dropdown-item logout pb-0" href="signin.html"><img src="Assets/img/icons/log-out.svg" className="me-2" alt="img" />Cerrar Sesión</a>
              </div>
            </div>
          </li>
        </ul>
    
        <div className="dropdown mobile-user-menu">
          <a href={void(0)} className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="profile.html">Mi Perfil</a>
            <a className="dropdown-item" href="generalsettings.html">Configuraciones</a>
            <a className="dropdown-item" href="signin.html">Cerrar Sesión</a>
          </div>
    
    
        </div>
      </div>
    </div>
  );
}

export default App;
