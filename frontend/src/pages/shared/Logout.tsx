import React from 'react';
import { Button, Form, FormGroup, } from "reactstrap";
import { logout } from '../../api';

const Logout = (props: any) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        logout()
            .then(response => {
                props.onLogoutSuccess();
            })
            .catch(error => {
                console.error("Logout error", error);
            });
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Button>Logout</Button>
                </FormGroup>
            </Form>
        </div>
    );
}

export default Logout;