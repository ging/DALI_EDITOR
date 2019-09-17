import PropTypes from 'prop-types';
import React, { Component } from 'react';

import CarouselButtons from '../carouselButtons/CarouselButtons';
import CarouselHeader from '../carouselHeader/CarouselHeader';
import FileTree from "../FileTree";

import { connect } from "react-redux";
import { updateUI } from "../../../../common/actions";

/**
 * Index wrapper container
 */
class EditorCarousel extends Component

{
    /**
     * Renders React Component
     * @returns {code}
     */
    render() {

        return (
            <div id="colLeft" className="wrapperCarousel"
                style={{
                    maxWidth: this.props.carouselShow ? (this.props.carouselFull ? '100%' : '212px') : '80px',
                    overflowX: this.props.carouselFull ? 'hidden' : '',
                }}>
                <CarouselHeader
                    dispatch={this.props.dispatch}
                    carouselFull={this.props.carouselFull}
                    carouselShow={this.props.carouselShow}
                    courseTitle={this.props.title}
                    onToggleWidth={this.onToggleWidth}
                />
                <FileTree
                    boxes={this.props.boxes}
                    carouselShow={this.props.carouselShow}
                    containedViews={this.props.containedViews}
                    containedViewSelected={this.props.containedViewSelected}
                    dispatch={this.props.dispatch}
                    navItemsIds={this.props.navItemsIds}
                    navItems={this.props.navItems}
                    navItemSelected={this.props.navItemSelected}
                    indexSelected={this.props.indexSelected}
                    onBoxAdded={this.props.onBoxAdded}
                    viewToolbars={this.props.viewToolbars}
                />
                <CarouselButtons
                    carouselShow={this.props.carouselShow}
                />
            </div>
        );
    }

    onToggleWidth = () => {
        if(this.props.carouselShow) {
            this.props.dispatch(updateUI({
                carouselShow: false,
                carouselFull: false,
            }));
        } else {
            this.props.dispatch(updateUI({ carouselShow: true }));
        }
    }

}

function mapStateToProps(state) {
    return {
        carouselShow: state.reactUI.carouselShow,
        carouselFull: state.reactUI.carouselFull,
        boxes: state.undoGroup.present.boxesById,
        title: state.undoGroup.present.globalConfig.title || '---',
        containedViews: state.undoGroup.present.containedViewsById,
        containedViewSelected: state.undoGroup.present.containedViewSelected,
        indexSelected: state.undoGroup.present.indexSelected,
        navItemsIds: state.undoGroup.present.navItemsIds,
        navItems: state.undoGroup.present.navItemsById,
        navItemSelected: state.undoGroup.present.navItemSelected,
        displayMode: state.undoGroup.present.displayMode,
        viewToolbars: state.undoGroup.present.viewToolbarsById,
    };
}

export default connect(mapStateToProps)(EditorCarousel);

EditorCarousel.propTypes = {
    /**
     * Redux action dispatcher
     */
    dispatch: PropTypes.func,
    /**
     * Object containing all contained views (identified by its ID)
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Selected contained view (by ID)
     */
    containedViewSelected: PropTypes.any,
    /**
     * Object containing all created boxes (by id)
     */
    boxes: PropTypes.object,
    /**
     * Objects Array that contains all created views (identified by its *id*)
     */
    navItemsIds: PropTypes.array.isRequired,
    /**
     * Object containing all views (by id)
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Current selected view (by ID)
     */
    navItemSelected: PropTypes.any,
    /**
     * Collection of callbacks for contained views handling
     */
    handleContainedViews: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for canvas handling
     */
    handleCanvas: PropTypes.object.isRequired,
    /**
     * Collection of callbacks for nav items handling
     */
    handleNavItems: PropTypes.object.isRequired,
    /**
     * View/Contained view selected at the index
     */
    indexSelected: PropTypes.any,
    /**
     * Callback for adding a box
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Callback for renaming view
     */
    title: PropTypes.string,
    /**
     * Indicates whether the index has been expanded or not
     */
    carouselShow: PropTypes.bool,
    /**
     * Indicates whether the index takes the whole screen's width or not
     */
    carouselFull: PropTypes.bool,
    /**
     * Object containing all the pages' toolbars
     */
    viewToolbars: PropTypes.object,
};
