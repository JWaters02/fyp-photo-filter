import React, { useState, useEffect } from 'react';
import { Alert } from 'reactstrap';

let visibleLength = 5000;

const ErrorMessagesDisplay = ({ errorMessages }: { errorMessages: string[] }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, visibleLength);
        return () => clearTimeout(timer);
    }, [errorMessages]);

    if (!visible || !errorMessages || errorMessages.length === 0) {
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
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, visibleLength);
        return () => clearTimeout(timer);
    }, [warningMessages]);

    if (!visible || !warningMessages || warningMessages.length === 0) {
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

const SuccessMessageDisplay = ({ successMessages, time }: { successMessages: string[], time?: number }) => {
    const [visible, setVisible] = useState(true);

    visibleLength = time ? time : visibleLength;

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, visibleLength);
        return () => clearTimeout(timer);
    }, [successMessages]);

    if (!visible || !successMessages || successMessages.length === 0) {
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