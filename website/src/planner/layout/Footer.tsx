import { Col, Row } from 'react-bootstrap';

export const AppFooter = () => {
    return (
        <Row className="footer-copyright text-center py-3 d-xs-none d-sm-none d-md-none d-lg-block">
            <Col>
                <ul className="nav justify-content-center border-top pb-3 mb-3">
                    <li className="nav-item">
                        <a
                            href="https://github.com/SebastianHanfland/RallyGPXMerger"
                            className="nav-link px-2 text-muted"
                        >
                            github
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="https://github.com/SebastianHanfland/RallyGPXMerger/tree/main/docs"
                            className="nav-link px-2 text-muted"
                            target={'_blank'}
                        >
                            Docs
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="https://github.com/SebastianHanfland/RallyGPXMerger/blob/main/docs/Privacy.md"
                            className="nav-link px-2 text-muted"
                        >
                            Privacy
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="https://github.com/SebastianHanfland/RallyGPXMerger/blob/main/docs/FAQs.md"
                            className="nav-link px-2 text-muted"
                        >
                            FAQs
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            href="https://github.com/SebastianHanfland/RallyGPXMerger/blob/main/docs/About.md"
                            className="nav-link px-2 text-muted"
                        >
                            About
                        </a>
                    </li>
                </ul>
            </Col>
        </Row>
    );
};
