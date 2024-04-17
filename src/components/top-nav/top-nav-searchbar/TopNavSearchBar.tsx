import search from 'assets/img/icons/search.svg';
import closes from 'assets/img/icons/closes.svg';
import React, { useState } from 'react';


const TopNavSearchBar = () =>{
    const [searchInputsVisible, setSearchInputsVisible] = useState(false);
    const [searchInputsClass, setSearchInputsClass] = useState('');

    const handleSearchClick = () => {
        setSearchInputsVisible(true);
        setSearchInputsClass('show');
    };

    const handleCloseClick = () => {
        setSearchInputsClass('');
    };

    return(
        <li className="nav-item">
             <div className="top-nav-search">
                <a href="/#" className="responsive-search">
                            <i className="fa fa-search"></i>
                </a>
                     <form action="#">
                        <div className={`searchinputs ${searchInputsClass}`}>
                            <input type="text" placeholder="Busqueda ..."/>
                                <div className="search-addon">
                                    <span onClick={handleCloseClick}><img src={closes} alt="img"/></span>
                            </div>
                        </div>
                        <a className="btn"  onClick={handleSearchClick} id="searchdiv"><img src={search} alt="img"/></a>
                    </form>
             </div>
        </li>
    )
}
export default TopNavSearchBar;