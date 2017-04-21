import React, {Component} from 'react';
import {Tooltip, OverlayTrigger,Breadcrumb, BreadcrumbItem, Button} from 'react-bootstrap';
import i18n from 'i18next';

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
        //Equal size to the index of level
        size = size - 1;


        if (size === undefined || level === undefined || this.props.titles.length === 0) {
            //This happens when you are in a root element

            return "";

        } else if (size === level) {
            //This happens when you are in the first level
            let actual_index = (actual_parent.children.indexOf(actual_level.id));
            if (actual_index !== -1) {
                return (actual_index + 1) + ". ";
            }
        } else {
            //This happens when you have several sections in the array
            //You iterate inversely in the array until you get to the level stored in nav properties
            let actual_index;
            let interating_level = level + 1;

            for (let n = actual_level.level; interating_level < n; n--) {
                actual_level = actual_parent;
                actual_parent = this.props.navItems[actual_level.parent];
            }

            let final_level = actual_parent.children.indexOf(actual_level.id) + 1;
            if (actual_parent !== undefined && actual_parent.children !== undefined) {
                return final_level + ". ";
            } else {
                return "";
            }
        }
    }

    render() {
        let titles = this.props.titles;
        let currentStatus = this.props.navItem.titlesDisplay;
        let docTitle = this.props.title;
        let subTitle = i18n.t('subtitle');

        return (
            /* jshint ignore:start */

                <div className="title" onClick={(e) => {
                                        this.props.onBoxSelected(-1);
                                        this.props.onShowTitle();
                                        e.stopPropagation(); }}>
                    <div style={{backgroundColor:'white', display:(titles.length !== 0)? 'initial' : 'none' }}>
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


                    <div className={this.props.showButtons ?  "caja selectedTitle selectedBox":"caja"} >
                        <div className="cab">

                            <div className="cabtabla_numero"
                                contentEditable={this.props.navItem.parent === 0}
                                suppressContentEditableWarning
                                style={{display:(currentStatus.pageNumber == 'hidden') ? 'none' : 'block'}}
                                onBlur={e => {
                                        this.props.onUnitNumberChanged(this.props.navItem.id, parseInt(e.target.innerText, 10));
                                }}
                            >{this.props.navItem.unitNumber}</div>

                            <div className="tit_ud_cap">
                                {/* Course title*/}
                                <h1 style={{display:(currentStatus.courseTitle == 'hidden') ? 'none' : 'block'}}>{this.props.courseTitle}</h1>
                                {/* NavItem title */}
                                <h2 style={{display:(currentStatus.documentTitle == 'hidden') ? 'none' : 'block'}}>{docTitle}</h2>
                                {/* NavItem subtitle */}
                                <h3 style={{display:(currentStatus.documentSubTitle == 'hidden') ? 'none' : 'block'}}>{subTitle}</h3>

                                {/* breadcrumb */}
                                <h4 style={{display:(currentStatus.breadcrumb == 'hidden') ? 'none' : 'block'}}>
                                    {"breadcrumb_example / change this with real breadcrumb"}
                                </h4>
                            </div>

                            <div style={{display: 'none'}} className="clear"></div>
                        </div>
                    </div>


                    {/* <br style={{clear:'both',  visibility: 'inherit'}}/> */}
                </div>
            </div>
            /* jshint ignore:end */
        );
    }

}
