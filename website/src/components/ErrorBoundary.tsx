import React, { ErrorInfo, ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { storage } from '../store/storage.ts';

interface Props {
    children?: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, { error: Error | null; errorInfo: ErrorInfo | null }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: null,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.error) {
            return (
                <Container>
                    <h3 className="text-center">An Error happened, it might be due to wrongly stored data</h3>
                    <h4 className="text-center">Error:</h4>
                    <div className="text-center">{JSON.stringify(this.state.error)}</div>
                    <h4 className="text-center">ErrorInfo:</h4>
                    <div className="text-center">{JSON.stringify(this.state.errorInfo)}</div>
                    <Button
                        onClick={() => {
                            storage.clear();
                            window.location.reload();
                        }}
                    >
                        Clear locally stored data
                    </Button>
                </Container>
            );
        }
        return this.props.children;
    }
}
