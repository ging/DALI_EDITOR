import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import i18n from "i18next";
import './_ActionsRibbon.scss';
import Alert from '../../common/alert/Alert';
import Clipboard from '../../clipboard/Clipboard';
import { isSlide, isBox, isSortableBox } from '../../../../common/utils';
export default class ActionsRibbon extends Component {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            buttons: [],
            clipboardAlert: false,
        };
        this.isPage = this.isPage.bind(this);
    }

    isPage() {
        return this.props.containedViews[this.props.containedViewSelected] ? this.props.containedViews[this.props.containedViewSelected] : (
            this.props.navItems[this.props.navItemSelected] ? this.props.navItems[this.props.navItemSelected] : null
        );
    }
    /**
     * Render React Component
     * @returns {code}
     */
    render() {
        let onClick = (e)=>{this.setState({ clipboardAlert: !this.state.clipboardAlert });};

        let clipboardActions = [
            { key: "copy", disabled: !(this.props.boxSelected && isBox(this.props.boxSelected)), icon: "content_copy", i18nkey: "clipboard.copy", onClick: onClick },
            { key: "cut", disabled: !(this.props.boxSelected && isBox(this.props.boxSelected)), icon: "content_cut", i18nkey: "clipboard.cut", onClick: onClick },
            { key: "paste", disabled: false, icon: "content_paste", i18nkey: "clipboard.paste", onClick: onClick },
            { key: "duplicate", disabled: !(this.props.boxSelected && isBox(this.props.boxSelected)), icon: "content_copy", i18nkey: "clipboard.duplicate", onClick: ()=> {} },
        ];

        let page = this.isPage();
        let slide = page && isSlide(page.type);
        let container = 0;
        let box_layer = page.boxes.indexOf(this.props.boxSelected);
        let disable_bt = (this.props.boxSelected !== -1 && isBox(this.props.boxes[this.props.boxSelected].parent)) || this.props.boxSelected === -1 || page.boxes.length === 1;
        let boxes = page.boxes;

        // TODO:revisar este código para que puedan funcionar las capas en los documentos (posición absoluta combinada con relativa...mal)
        // let index = Object.keys(this.props.boxes).length;
        /* if (!slide && this.props.boxes[this.props.boxSelected] !== undefined && index > 1) {
            container = this.props.boxes[this.props.boxSelected].container;
            boxes = this.props.boxes[page.boxes[0]].sortableContainers[container].children;
            box_layer = this.props.boxes[page.boxes[0]].sortableContainers[container].children.indexOf(this.props.boxSelected);
            disable_bt = this.props.boxSelected === -1 || page.boxes.length === 2;
        } */
        let layerActions = [
            { key: "BringtoFront", i18nkey: "order.BringtoFront", icon: "flip_to_front", disabled: (disable_bt || box_layer === boxes.length - 1), onClick: () => { this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'front', boxes);} },
            { key: "Ahead", i18nkey: "order.Ahead", icon: "flip_to_front", disabled: (disable_bt || box_layer === boxes.length - 1), onClick: () => { this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'ahead', boxes);} },
            { key: "Behind", i18nkey: "order.Behind", icon: "flip_to_back", disabled: (disable_bt || box_layer === 0), onClick: () => { this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'behind', boxes);} },
            { key: "SendtoBack", i18nkey: "order.SendtoBack", icon: "flip_to_back", disabled: (disable_bt || box_layer === 0), onClick: () => { this.props.onBoxLayerChanged(this.props.boxSelected, page.id, container, 'back', boxes);} },
            "separator",
            { key: "Grid", i18nkey: "Grid", icon: "grid_on", disabled: false, onClick: this.props.onGridToggle },
            "separator",

        ];
        let button = (act, ind) => {
            return <button key={act.key}
                className={(act.key === "Grid" && this.props.grid) ? "ActionBtn active" : "ActionBtn"}
                disabled={act.disabled}
                name={act.key}
                onClick={act.onClick}>
                <i className="material-icons">{act.icon}</i>
                <span className="hideonresize">{ i18n.t(act.i18nkey) }</span>
            </button>;
        };
        return (
            <Col id="ActionRibbon" md={12} xs={12}
                style={{
                    height: this.props.ribbonHeight,
                    overflowY: 'hidden',
                }} ref="holder">
                <div id="Actions">
                    { slide ? layerActions.map((act, ind) => {
                        if (act === "separator") {
                            return <span id="vs" key={ind} />;
                        }
                        return button(act, ind);}) : null }
                    <Clipboard boxes={this.props.boxes} key="clipboard"
                        boxSelected={this.props.boxSelected}
                        navItemSelected={this.props.navItemSelected}
                        containedViewSelected={this.props.containedViewSelected}
                        navItems={this.props.navItems}
                        containedViews={this.props.containedViews}
                        toolbars={this.props.toolbars}
                        onTextEditorToggled={this.props.onTextEditorToggled}
                        onBoxPasted={this.props.onBoxPasted}
                        onBoxDeleted={this.props.onBoxDeleted} >
                        { clipboardActions.map((act, ind)=>{
                            return button(act, ind);
                        })}
                    </Clipboard>

                    {this.createAlert(this.state.clipboardAlert, onClick)}
                </div>
            </Col>
        );
    }
    createAlert(state, callback) {
        let actions = ["copy", "cut", "paste"];
        let shortCuts = ["C", "X", "V"];
        return <Alert show={state} onClose={callback} className="pageModal" key="alert">
            <p>{i18n.t("clipboard.msg")}</p>
            {actions.map((act, ind) => {
                return <Col xs={4} key={ind}>
                    <h2>Ctrl+{shortCuts[ind]}</h2>
                    <div>{i18n.t("clipboard.to")} {i18n.t("clipboard." + actions[ind]).toLowerCase()}</div>
                </Col>;
            })}
            <br/>

        </Alert>;
    }
}

ActionsRibbon.propTypes = {
    /**
     * Id of the page selected
     */
    navItemSelected: PropTypes.any,
    /**
     * Id of the contained view selected
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing pages and sections
     */
    navItems: PropTypes.object,
    /**
     * Object that holds contained views
     */
    containedViews: PropTypes.object,
    /**
     * Height of the ribbon in px (contains the string px)
     */
    ribbonHeight: PropTypes.string,
    /**
     * Toggle grid on slides function
     */
    onGridToggle: PropTypes.func,
    /**
     * Whether grid is disabled or not
     */
    grid: PropTypes.bool,
};