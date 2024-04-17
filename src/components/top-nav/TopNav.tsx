import TopNavSearchBar from 'components/top-nav/top-nav-searchbar/TopNavSearchBar';
import TopNavLeft from 'components/top-nav/top-nav-left/TopNavLeft';
import TopNavNotifications from './top-nav-notifications/TopNavNotifications';
import TopNavUsermenu from './top-nav-usermenu/TopNavUsermenu';

const TopNav = () => {
	
    return (

        <div className='header'>

           <TopNavLeft/>

            <a id="mobile_btn" className="mobile_btn" href="#sidebar">
                <span className="bar-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </a>
           
            <ul className="nav user-menu">

                <TopNavSearchBar/>
                
				<li className="nav-item dropdown">

					<TopNavNotifications/>
					
				</li>
                <li className="nav-item dropdown has-arrow main-drop">

                  <TopNavUsermenu/>

                </li>


            </ul>
        </div>
    );
}

export default TopNav;
