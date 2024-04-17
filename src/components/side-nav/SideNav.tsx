import {useState} from "react";

const SideNav = () => {
    const [open, setOpen] = useState(true)

    const toggleNav = () => {
        setOpen(!open)
    }

    return (
        <div className='w-[16rem]'>
            <button onClick={toggleNav}>hello</button>
            <div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
                <div>ñklsbksbk</div>
            </div>
        </div>
    )
}

export default SideNav
