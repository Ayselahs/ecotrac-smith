import Link from 'next/link'
import { Nav } from 'react-bootstrap'
import styles from '../styles/Sidebar.module.css'
import { useState } from 'react'

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const togglebar = () => setIsOpen(!isOpen)
    return (
        <>
            <button className={`btn ${styles.hamburger}`} onClick={togglebar}>
                <span className={isOpen ? styles.iconClose : styles.iconHamburger}>=</span>
            </button>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <Nav className='flex-column align-items-start justify-content-start bg-light sidebar-sticky vh-100'>
                    <Nav.Item className='w-100'>
                        <Nav.Link as={Link} href="/loggedDashboard" className='text-dark'>
                            Dashboard Logged &rarr;
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='w-100'>
                        <Nav.Link as={Link} href="/plane">
                            Plane Emissions &rarr;
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='w-100'>
                        <Nav.Link as={Link} href="/train">
                            Train Emissions &rarr;
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className='w-100'>
                        <Nav.Link as={Link} href="/">
                            Home &rarr;
                        </Nav.Link>
                    </Nav.Item>

                </Nav >

            </div>
        </>


    )
}

export default Sidebar