import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessagesDisplay = ({ errorMessages }: { errorMessages: string[] }) => {
    if (!errorMessages || errorMessages.length === 0) {
        return null;
    }

    return (
        <div>
            {errorMessages.map((message: string, index: number) => (
                <Alert key={index} color="danger">
                    {message}
                </Alert>
            ))}
        </div>
    );
};

const WarningMessageDisplay = ({ warningMessages }: { warningMessages: string[] }) => {
    if (!warningMessages || warningMessages.length === 0) {
        return null;
    }

    return (
        <div>
            {warningMessages.map((message: string, index: number) => (
                <Alert key={index} color="warning">
                    {message}
                </Alert>
            ))}
        </div>
    );
};

const SuccessMessageDisplay = ({ successMessages }: { successMessages: string[] }) => {
    if (!successMessages || successMessages.length === 0) {
        return null;
    }

    return (
        <div>
            {successMessages.map((message: string, index: number) => (
                <Alert key={index} color="success">
                    {message}
                </Alert>
            ))}
        </div>
    );
};

export { ErrorMessagesDisplay, WarningMessageDisplay, SuccessMessageDisplay };