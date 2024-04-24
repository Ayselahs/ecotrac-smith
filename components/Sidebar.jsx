import Link from 'next/link'
import { Nav } from 'react-bootstrap'
import styles from '../styles/Sidebar.module.css'

function Sidebar() {
    return (
        <div className={`${styles.sidebar}`}>
            <Nav className='d-flex flex-column align-items-start justify-content-start bg-light sidebar-sticky vh-100'>
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

    )
}

export default Sidebar