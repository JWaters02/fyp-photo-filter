import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavbarBrand
} from 'reactstrap';

interface ToolbarProps {
    userRole: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ userRole }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand>Photo thingy</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        <NavItem>
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </NavItem>
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
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default Toolbar;