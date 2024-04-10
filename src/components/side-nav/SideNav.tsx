import ListGroup from 'react-bootstrap/ListGroup';
import {useState} from "react";

const SideNav = () => {
    const [open, setOpen] = useState(true)
// react hooks


    const toggleNav = () => {
        setOpen(!open)
    }

    return (
        <div className='side-nav' style={{
            width: open ? '15rem' : '5rem'
        }}>
            <button onClick={toggleNav}>hello</button>

            <ListGroup>
                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
            </ListGroup>
        </div>
    )
}

export default SideNav
