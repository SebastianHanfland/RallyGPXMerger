import LZString from 'lz-string';

export const Imprint = () => {
    return (
        <div style={{ textAlign: 'left', margin: '100px' }}>
            <div className="inner">
                <h2 id="toc_1">Impressum</h2>

                <h4>Angaben gemäß § 5 TMG</h4>

                <p>
                    <strong>
                        {LZString.decompress('㊅うࡠ츂ဝ耈Ĥ膘ۉĲ ')} <br />
                        {LZString.decompress('ᒄ〖ݠ츂‾셌@昀넀')} <br />
                        {LZString.decompress('ᬁ恌ǀ가䀢аᎁ氌Є썀')}
                    </strong>{' '}
                    <br />
                    (Germany)
                </p>

                <h4>Kontakt</h4>

                <p>
                    <strong>{LZString.decompress('અ〶݀尀䃔Š✌ࣀ嘃뀃聬罀晵爀')}</strong> <br />
                    <strong>E-Mail: {LZString.decompress('㎅う࡬ˠ阐㬁퀂턃」ꈂ怂쁷桐ᚂࠆㅄ摱ࠀ')}</strong>
                </p>

                <h4>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h4>
                <p>
                    <strong>
                        {LZString.decompress('㊅うࡠ츂ဝ耈Ĥ膘ۉĲ ')} <br />
                        {LZString.decompress('ᒄ〖ݠ츂‾셌@昀넀')} <br />
                        {LZString.decompress('ᬁ恌ǀ가䀢аᎁ氌Є썀')}
                    </strong>{' '}
                    <br />
                    (Germany)
                </p>
            </div>
        </div>
    );
};
