import { Dropdown } from "react-bootstrap";
import { HiUser } from "react-icons/hi";
import { CiLogout } from "react-icons/ci";



const TopNavUsermenu = () => {

    return (
        <Dropdown>
            <Dropdown.Toggle className="dropdown-toggle nav-link userset" variant="success" id="dropdown-basic" >
                <HiUser>

                    <span className="status online"></span>
                </HiUser>


            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdown-menu menu-drop-user" rootCloseEvent="click" >

                <div className="profilename">
                    <div className="profileset">
                        <span className="user-img"><HiUser />
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
                    <a className="dropdown-item logout pb-0" href="signin.html"><CiLogout />Cerrar Sesión</a>
                </div>
            
        </Dropdown.Menu>



    </Dropdown >



)


}
export default TopNavUsermenu;