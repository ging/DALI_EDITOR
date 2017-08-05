import React, { Component } from 'react';
import { Tooltip, OverlayTrigger, Popover, Breadcrumb, BreadcrumbItem, Button } from 'react-bootstrap';
import i18n from 'i18next';
import { isSortableBox, isCanvasElement, isContainedView } from './../../../../utils';
require('./_daliHeader.scss');

export default class DaliHeader extends Component {

    /*
     * This method is used to calculate actual position for title indexes
     * It is used the array of titles, the actual position in the iteration, and the level stored in nav properties
     */
    getActualIndex(size = 1, level = 0) {
        // Default values are stored in this variables
        let actual_parent = this.props.navItems[this.props.navItem.parent];
        let actual_level = this.props.navItem;
        // Equal size to the index of level
        size = size - 1;

        if (size === undefined || level === undefined || this.props.titles.length === 0) {
            // This happens when you are in a root element

            return "";

        } else if (size === level) {
            // This happens when you are in the first level
            let actual_index = (actual_parent.children.indexOf(actual_level.id));
            if (actual_index !== -1) {
                return (actual_index + 1) + ". ";
            }
        } else {
            // This happens when you have several sections in the array
            // You iterate inversely in the array until you get to the level stored in nav properties
            let actual_index;
            let interating_level = level + 1;

            for (let n = actual_level.level; interating_level < n; n--) {
                actual_level = actual_parent;
                actual_parent = this.props.navItems[actual_level.parent];
            }

            let final_level = actual_parent.children.indexOf(actual_level.id) + 1;
            if (actual_parent !== undefined && actual_parent.children !== undefined) {
                return final_level + ". ";
            }
            return "";

        }
        return "";
    }

    render() {
        let titles = this.props.titles || [];
        let navItem = this.props.containedView !== 0 ? this.props.containedView : this.props.navItem;
        let currentStatus = (navItem.header) ? navItem.header.display : undefined;
        let docTitle = navItem.name;
        let subTitle = i18n.t('subtitle');
        let pagenumber = this.props.navItem.unitNumber;

        if (navItem !== undefined && navItem.id !== 0 && navItem.header) {
            docTitle = navItem.header.elementContent.documentTitle !== "" && (navItem.header.elementContent.documentTitle !== navItem.name) ? navItem.header.elementContent.documentTitle : navItem.name;
            subTitle = navItem.header.elementContent.documentSubTitle !== "" && (navItem.header.elementContent.documentSubTitle !== i18n.t('subtitle')) ? navItem.header.elementContent.documentSubTitle : i18n.t('subtitle');
            pagenumber = navItem.header.elementContent.numPage !== "" && (navItem.header.elementContent.numPage !== navItem.unitNumber) ? navItem.header.elementContent.numPage : navItem.unitNumber;
        }
        let cvList = [];
        if (this.props.containedView) {
            for (let id in this.props.containedView.parent) {
                let par = this.props.containedView.parent[id];
                if (this.props.toolbars[par]) {
                    let el = this.props.boxes[par];
                    let from = "unknown";
                    if (isSortableBox(el.parent)) {
                        let origin = this.props.boxes[el.parent].parent;
                        from = isContainedView(origin) ? this.props.containedViews[origin].name : this.props.navItems[origin].name;
                    } else if (isCanvasElement(el.parent)) {
                        from = isContainedView(el.parent) ? this.props.containedViews[el.parent].name : this.props.navItems[el.parent].name;
                    } else {
                        return;
                    }
                    cvList.push(<span className="cvList" key={id}><b>{this.props.toolbars[par].config.displayName}</b> { ' (' + from + ')'}</span>);
                    // return this.props.toolbars[parent].config.displayName + " from " + this.props.navItems[this.props.boxes[parent]] || this.props.containedViews[this.props.boxes[parent]] || this.props.boxes[parent];

                }
            }
        }
        let content;
        let unidad = "";
        // breadcrumb
        if(this.props.containedView === 0) {
            if (currentStatus !== undefined) {
                if (currentStatus.breadcrumb === 'reduced') {
                    let titleList = this.props.titles;

                    let actualTitle = titleList[titleList.length - 1];
                    unidad = titleList[0];
                    content = React.createElement("div", { className: "subheader" },
                        React.createElement(Breadcrumb, { style: { margin: 0, backgroundColor: 'inherit' } },
                            titleList.map((item, index) => {
                                if (index !== titleList.length) {
                                    return React.createElement(BreadcrumbItem, { key: index }, item);
                                }
                                return null;
                            })
                        )
                    );

                } else if (currentStatus.breadcrumb === 'expanded') {
                    let titlesComponents = "";
                    let titles_length = this.props.titles.length;
                    content = React.createElement("div", { className: "subheader" },
                        this.props.titles.map((text, index) => {
                            if (index === 0) {
                                unidad = text;
                            } else {
                                let nivel = (index > 4) ? 6 : index + 2;
                                return React.createElement("h" + nivel, {
                                    key: index,
                                    style: { marginTop: '0px' },
                                }, /* this.getActualIndex(titles_length, index) + */text);
                            }
                            return null;
                        })
                    );
                }

            }
        }

        if (navItem.id !== 0) {
            return (
                <div className="title" onClick={(e) => {
                    this.props.onBoxSelected(-1);
                    this.props.onShowTitle();
                    e.stopPropagation(); }}>
                    <div style={{ backgroundColor: 'transparent', display: (titles.length !== 0) ? 'initial' : 'none' }}>
                        {/*
                    <div id="daliTitleButtons" style={{height:'40px'}}>
                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip id="verticTooltip">{i18n.t('vertical')}
                            </Tooltip>}>
                            <button className={((!this.props.showButtons || currentStatus == 'hidden' || currentStatus == 'subtitle_hidden' )? 'daliTitleButton hidden ' : ' daliTitleButton ')
                                            + ((currentStatus == 'expanded') ? ' activeTitle' : ' ')}
                                    onClick={(e) => {
                                        this.props.titleModeToggled(this.props.navItem.id, 'expanded' );
                                        e.stopPropagation(); }}>
                                <i className="material-icons">vertical_align_bottom</i>
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip id="horizTooltip">{i18n.t('horizontal')}
                            </Tooltip>}>
                            <button className={((!this.props.showButtons || currentStatus == 'hidden' || currentStatus == 'subtitle_hidden' )? ' daliTitleButton hidden ' : ' daliTitleButton ')
                                            + ((currentStatus == 'reduced') ? ' activeTitle ' : '')}
                                    onClick={(e) => {
                                        this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                        e.stopPropagation();}}>
                                <i className="material-icons">keyboard_tab</i>
                            </button>
                        </OverlayTrigger>

                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip id="hide2Tooltip">{i18n.t('subtitle_hide')}
                            </Tooltip>}>
                            <button
                                className={((!this.props.showButtons || currentStatus == 'hidden' || currentStatus == 'subtitle_hidden' )? 'daliTitleButton hidden activeTitle' : 'daliTitleButton ')}
                                onClick={(e) => {
                                        this.props.titleModeToggled(this.props.navItem.id, 'subtitle_hidden');
                                        e.stopPropagation();}}>
                                <i className="material-icons">visibility_off</i>
                            </button>
                        </OverlayTrigger>

                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip id="show2Tooltip">{i18n.t('show_subtitle')}
                            </Tooltip>}>
                            <button className={ currentStatus == 'subtitle_hidden' ? 'daliTitleButton  ' : 'daliTitleButton hidden'}
                                    onClick={(e) => {
                                        this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                        this.props.onShowTitle();
                                        e.stopPropagation();}}>
                                <i className="material-icons">visibility</i>
                            </button>
                        </OverlayTrigger>

                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip id="hideTooltip">{i18n.t('hide')}
                            </Tooltip>}>
                            <button
                                className={((!this.props.showButtons || currentStatus == 'hidden' )? 'daliTitleButton margin-left hidden activeTitle' : 'daliTitleButton margin-left')}
                                onClick={(e) => {
                                        this.props.titleModeToggled(this.props.navItem.id, 'hidden');
                                        e.stopPropagation();}}>
                                <i className="material-icons">visibility_off</i>
                            </button>
                        </OverlayTrigger>

                        <OverlayTrigger placement="bottom" overlay={
                            <Tooltip id="showTooltip">{i18n.t('show')}
                            </Tooltip>}>
                            <button className={currentStatus == 'hidden'  ? 'daliTitleButton  ' : 'daliTitleButton hidden'}
                                    onClick={(e) => {
                                        this.props.titleModeToggled(this.props.navItem.id, 'reduced');
                                        this.props.onShowTitle();
                                        e.stopPropagation();}}>
                                <i className="material-icons">visibility</i>
                            </button>
                        </OverlayTrigger>

                    </div>
                    */}

                        <div className={this.props.showButtons ? "caja selectedTitle selectedBox" : "caja"} >
                            <div className="cab">

                                <div className="cabtabla_numero"
                                    contentEditable={false}
                                    suppressContentEditableWarning
                                    style={{ display: (currentStatus.pageNumber === 'hidden') ? 'none' : 'block' }}
                                    onBlur={e => {
                                        this.props.onUnitNumberChanged(navItem.id, parseInt(e.target.innerText, 10));

                                    }}
                                >{pagenumber}</div>

                                <div className="tit_ud_cap">
                                    {/* Course title*/}
                                    <h1 style={{ display: (currentStatus.courseTitle === 'hidden') ? 'none' : 'block' }}>{this.props.courseTitle}</h1>
                                    {/* NavItem title */}
                                    <h2 style={{ display: (currentStatus.documentTitle === 'hidden') ? 'none' : 'block' }}>{docTitle}{this.props.containedView !== 0 ? (<OverlayTrigger placement="bottom" overlay={
                                        <Popover className="cvPopover" id="popover-positioned-bottom" title={ i18n.t("contained_view_popover") }>
                                            { cvList.map(it => { return it; }) }
                                        </Popover>
                                    }><i className="material-icons infoIcon" style={{ fontSize: '16px' }}>info</i></OverlayTrigger>) : null }</h2>
                                    {/* NavItem subtitle */}
                                    <h3 style={{ display: (currentStatus.documentSubTitle === 'hidden') ? 'none' : 'block' }}>{ subTitle }</h3>

                                    {/* breadcrumb */}
                                    <div className="contenido" style={{ display: (currentStatus.breadcrumb === 'hidden') ? 'none' : 'block' }}>
                                        { content }
                                    </div>
                                </div>

                                <div style={{ display: 'none' }} className="clear" />
                            </div>
                        </div>

                        {/* <br style={{clear:'both',  visibility: 'inherit'}}/> */}
                    </div>
                </div>
            );
        }

        // return null;

    }

}
