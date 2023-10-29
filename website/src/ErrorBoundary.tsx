import React, { ErrorInfo, ReactNode } from 'react';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { storage } from './store/storage.ts';

interface Props {
    children?: ReactNode;
}

export class ErrorBoundary extends React.Component<Props, { error: Error | null }> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: null,
        };
    }

    componentDidCatch(error: Error, _: ErrorInfo): void {
        this.setState({ error });
    }

    render() {
        if (this.state.error) {
            return (
                <Container>
                    <h3 className="text-center">An Error happened, it might be due to wrongly stored data</h3>
                    <h4 className="text-center">Error:</h4>
                    <div className="text-center">{JSON.stringify(this.state.error)}</div>
                    <Button onClick={storage.clear}>Clear locally stored data</Button>
                </Container>
            );
        }
        return this.props.children;
    }
}
