import React, { useState, useEffect } from 'react';
import logo from 'assets/img/logo3.png';
import logosmall from 'assets/img/logo-small.png';



const TopNavLeft = () => {

    

    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            e.stopPropagation();
            const body = document.querySelector('body');
            const toggleBtn = document.getElementById('toggle_btn');
            if (body?.classList.contains('mini-sidebar') && toggleBtn?.offsetParent !== null) {
                const target = (e.target as HTMLElement).closest('.sidebar, .header-left');
                if (target) {
                    body.classList.add('expand-menu');
                    const subdropUl = document.querySelectorAll('.subdrop + ul');
                    subdropUl.forEach((ul) => {
                        (ul as HTMLElement).style.display = 'block';
                    });
                } else {
                    body.classList.remove('expand-menu');
                    const subdropUl = document.querySelectorAll('.subdrop + ul');
                    subdropUl.forEach((ul) => {
                        (ul as HTMLElement).style.display = 'none';
                    });
                }
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('mouseover', handleMouseOver);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    const [miniSidebar, setMiniSidebar] = useState<boolean>(false);

    const toggleSidebar = () => {
        if (miniSidebar) {
            document.body.classList.remove('mini-sidebar');
            setMiniSidebar(false);
            localStorage.setItem('screenModeNightTokenState', 'night');
            setTimeout(() => {
                document.body.classList.remove('mini-sidebar');
                const headerLeft = document.querySelector('.header-left');
                if (headerLeft) {
                    headerLeft.classList.add('active');
                }
            }, 100);
        } else {
            document.body.classList.add('mini-sidebar');
            setMiniSidebar(true);
            localStorage.removeItem('screenModeNightTokenState');
            setTimeout(() => {
                document.body.classList.add('mini-sidebar');
                const headerLeft = document.querySelector('.header-left');
                if (headerLeft) {
                    headerLeft.classList.remove('active');
                }
            }, 100);
        }
    };

    useEffect(() => {
        const toggleBtn = document.getElementById('toggle_btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleSidebar);
         
        }

        return () => {
            if (toggleBtn) {
                toggleBtn.removeEventListener('click', toggleSidebar);
            }
        };

    }, [miniSidebar]);


    return(
        <div className="header-left active">
        <a href="index.html" className="logo">
            <img src={logo} alt=""/>
        </a>
        <a href="index.html" className="logo-small">
            <img src={logosmall} alt=""/>
        </a>
        <a id="toggle_btn" href="/#"></a>
        </div>
      

    )
}
export default TopNavLeft;