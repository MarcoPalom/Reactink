import { FaBell } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';

const TopNavNotifications = () => {


return(
<Dropdown  align={'end'} autoClose="inside">
            <Dropdown.Toggle className="dropdown-toggle nav-link border-butt" variant="success" id="dropdown-basic" >
            <FaBell />
                <span className="badge rounded-pill">4</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu notifications" rootCloseEvent="click" >
                <div className="topnav-dropdown-header">
                    <span className="notification-title">Notificaciones</span>
                    <a href="/#" className="clear-noti">Eliminar todas</a>
                </div>
                <div className="noti-content">
                    <ul className="notification-list">
                        <li className="notification-message">
                            <a href="activities.html">
                                <div className="media d-flex">
                                    <span className="avatar flex-shrink-0">
                                        <img alt="" src="assets/img/profiles/avatar-02.jpg"/>
                                    </span>
                                    <div className="media-body flex-grow-1">
                                        <p className="noti-details"><span className="noti-title">John Doe</span> added new task <span className="noti-title">Patient appointment booking</span></p>
                                        <p className="noti-time"><span className="notification-time">4 mins ago</span></p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="topnav-dropdown-footer">
                    <a href="activities.html">Ver todas las notificaciones</a>
                </div>
            </Dropdown.Menu> 
        </Dropdown>
)


}
export default TopNavNotifications;