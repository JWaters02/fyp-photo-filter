import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavbarBrand,
    Button
} from 'reactstrap';

interface ToolbarProps {
    userRole: string;
    onLogoutSuccess: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ userRole, onLogoutSuccess }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggle = () => setIsOpen(!isOpen);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const navbarStyle = userRole === 'footer' ? { bottom: 0 } : {};

    return (
        <div style={navbarStyle}>
            <Navbar color="light" light expand="md">
                <NavbarBrand>Family Photo Filter</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Nav className="me-auto" navbar>
                            {userRole !== 'footer' && (
                                <>
                                    {userRole === 'admin' && (
                                        <>
                                            <NavItem>
                                                <Link to="/manage-family" className="nav-link">
                                                    Manage Family
                                                </Link>
                                            </NavItem>
                                            <NavItem>
                                                <Link to="/unsorted-photos" className="nav-link">
                                                    Unsorted Photos
                                                </Link>
                                            </NavItem>
                                        </>
                                    )}
                                    {userRole !== 'admin' && (
                                        <>
                                            <NavItem>
                                                <Link to="/manage-account" className="nav-link">
                                                    Manage Account
                                                </Link>
                                            </NavItem>
                                            <NavItem>
                                                <Link to="/upload-photos" className="nav-link">
                                                    Upload Photos
                                                </Link>
                                            </NavItem>
                                            <NavItem>
                                                <Link to="/sorted-photos" className="nav-link">
                                                    Sorted Photos
                                                </Link>
                                            </NavItem>
                                        </>
                                    )}
                                </>
                            )}
                            {userRole === 'footer' && (
                                <NavItem>
                                    <Link to="#" className="nav-link" onClick={scrollToTop}>
                                        Back to Top
                                    </Link>
                                </NavItem>
                            )}
                        </Nav>
                        {userRole !== 'footer' && (
                            <>
                                <Button onClick={onLogoutSuccess} style={{ alignSelf: 'center' }}>
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default Toolbar;