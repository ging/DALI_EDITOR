import React from 'react';
import interact from 'interactjs';
import ReactDOM from 'react-dom';
/* eslint-disable react/prop-types */

export default class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        let { props, state, markElements } = this.props;
        let scale = state.scale || 1;
        let translateX = this.state.translateX || (state.translate ? state.translate.x : 0) || 0;
        let translateY = this.state.translateY || (state.translate ? state.translate.y : 0) || 0;
        let transform = `translate(${translateX + (this.state.dragging ? "px" : "%")},${translateY + (this.state.dragging ? "px" : "%")}) scale(${scale})`;

        return <div style={{ height: "100%", width: "100%" }} className="draggableImage"
            onWheel={(e) => {
                const delta = Math.sign(e.deltaY);
                props.update('scale', Math.round(10 * Math.min(20, Math.max(1, scale - delta / 5))) / 10);
            }}>
            <img ref ="img" id={props.id + "-image"}
                className="basicImageClass"
                style={{ width: state.allowDeformed ? "100%" : "100%", height: state.allowDeformed ? "" : "auto", transform, WebkitTransform: transform, MozTransform: transform }}
                src={state.url}
                onError={(e) => {
                    e.target.onError = null;
                    e.target.src = img_broken; // Ediphy.Config.broken_link;
                }}
            />
            <div className="dropableRichZone" style={{ height: "100%", width: "100%", position: 'absolute', top: 0, left: 0 }} >
                {markElements}
            </div>
        </div>;
    }

    componentDidMount() {
        let scale = this.props.state.scale || 1;
        interact(ReactDOM.findDOMNode(this))
            .draggable({
                enabled: true,
                ignoreFrom: 'a, .pointerEventsEnabled, .markeditor',
                onstart: (event) => {
                    event.stopPropagation();
                    let parent = event.target;
                    let original = parent.childNodes[0];
                    scale = this.props.state.scale || 1;
                    // Clone, assign values and hide original
                    let clone = original.cloneNode(true);
                    let originalRect = original.getBoundingClientRect();
                    let parentRect = parent.getBoundingClientRect();
                    let x = originalRect.left - parentRect.left;
                    let y = originalRect.top - parentRect.top;
                    clone.setAttribute("id", "clone2");
                    clone.setAttribute('data-x', x);
                    clone.setAttribute('data-y', y);
                    clone.style.zIndex = '9999 !important';
                    original.setAttribute('data-x', x);
                    original.setAttribute('data-y', y);
                    clone.style.position = 'absolute';
                    clone.style.WebkitTransform = clone.style.transform = 'translate(' + (x) + 'px, ' + (y) + 'px) scale(' + scale + ')';
                    parent.appendChild(clone);
                    original.style.opacity = 0;
                },
                onmove: (event) => {
                    event.stopPropagation();
                    scale = this.props.state.scale || 1;
                    let target = document.getElementById('clone2');
                    let original = event.target.childNodes[0];
                    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.WebkitTransform = target.style.transform = 'translate(' + (x) + 'px, ' + (y) + 'px) scale(' + scale + ')';
                    target.style.zIndex = '9999';
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                    original.setAttribute('data-x', x);
                    original.setAttribute('data-y', y);
                },
                onend: (event) => {
                    event.stopPropagation();
                    let target = event.target.childNodes[0];
                    scale = this.props.state.scale || 1;
                    target.style.zIndex = '0';
                    target.style.opacity = 1;
                    // Get position and if contained in sortableContainer || PluginPlaceHolder, convert to %
                    let actualLeft = target.getAttribute('data-x');
                    let actualTop = target.getAttribute('data-y');
                    let x = (parseFloat(actualLeft) / target.parentElement.offsetWidth * 100);
                    let y = (parseFloat(actualTop) / target.parentElement.offsetHeight * 100);

                    // Delete clone and unhide original
                    let clone = document.getElementById('clone2');
                    if (clone) {
                        clone.parentElement.removeChild(clone);
                    }
                    this.props.props.update('translate', { x, y });
                    event.stopPropagation();

                },
            });
    }
}
/* eslint-enable react/prop-types */
