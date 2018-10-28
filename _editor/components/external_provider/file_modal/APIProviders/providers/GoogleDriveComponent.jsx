import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, InputGroup, Glyphicon, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from '../common/SearchComponent';
import ImageComponent from '../common/ImageComponent';
import GooglePicker from 'react-google-picker';
export default class GoogleDriveComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: '',
            msg: i18n.t("FileModal.APIProviders.no_files"),
        };
        this.onSearch = this.onSearch.bind(this);
    }
    render() {
        return <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}
                    <SearchComponent query={this.state.value} onChange={(e)=>{this.setState({ query: e.target.value });}} onSearch={this.onSearch} /></h5>
                <hr />

                <FormGroup>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary hiddenButton" onClick={(e) => {
                            this.onSearch(this.state.query);
                            e.preventDefault();
                        }}>{i18n.t("vish_search_button")}
                        </Button>
                    </Col>
                </FormGroup>

            </Form>
            <div className={"ExternalResults"}>
                <GooglePicker clientId={'854542748878-51e02udhsu2q2cp512fg7kalbplkim6j.apps.googleusercontent.com'}
                    developerKey={'AIzaSyDbKOqlWXUmWCRcjtY4gSBld8Qspey-yRY'}
                    scope={['https://www.googleapis.com/auth/drive.readonly']}
                    onChange={data => console.log('on change:', data)}
                    onAuthFailed={data => console.log('on auth failed:', data)}
                    multiselect={false}
                    navHidden={false}
                    authImmediate={false}
                    mimeTypes={['image/png', 'image/jpeg', 'image/jpg']}
                    viewId={'DOCS'}>
                    <button>SEARCH</button>
                </GooglePicker>
            </div>
        </div>;
    }

    onSearch(text) {
        const BASE = 'https://www.europeana.eu/api/v2/search.json?wskey=ZDcCZqSZ5&query=' + (text || "europeana") + '&qf=TYPE:IMAGE&profile=RICH&media=true&rows=100&qf=IMAGE_SIZE:small';
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching"), results: [] });
        fetch(encodeURI(BASE))
            .then(res => res.text()
            ).then(imgStr => {
                let imgs = JSON.parse(imgStr);
                if (imgs && imgs.items) {
                    let results = imgs.items.map(img=>{
                        return {
                            title: img.title[0],
                            url: img.edmIsShownBy,
                            thumbnail: img.edmPreview,
                        };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
            // eslint-disable-next-line no-console
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            });
    }
}

GoogleDriveComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
    /**
     * Icon that identifies the API provider
     */
    icon: PropTypes.any,
    /**
     * API Provider name
     */
    name: PropTypes.string,
};