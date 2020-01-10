import React from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
export function MarkPreview(props) {
    return (
        <FormGroup>
            <h4>Previsualización</h4>
            <br/>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                {getPreviewContent(props)}
            </div>
        </FormGroup>
    );
}

function getPreviewContent(props) {
    let previewContent = null;
    switch (props.state.markType) {
    case 'area':
        let path = props.props.markCursorValue?.svgPath ?? props.props.currentRichMark?.content?.svgPath ?? false;
        previewContent = path ? (
            <div style={{ width: '100%' }}>
                <svg
                    viewBox={`0 0 ${props.state.svg?.canvasSize?.width ?? 0} ${props.state.svg?.canvasSize?.height ?? 0}`}
                    style={{ pointerEvents: 'none' }}
                    height={'100%'} width={'100%'}
                    preserveAspectRatio="none">
                    <path d={path} fill={props.state.color || '#000000'}/>
                </svg>
            </div>
        ) : 'Draw a shape';
        break;
    case 'image':
        let originalDimensions = props.state.originalDimensions;
        let previewSize = {};
        let imageSize = (props.state.size / 100);
        if (props.props.boxesById[props.props.boxSelected] && document.getElementById("box-" + props.props.boxesById[props.props.boxSelected].id)) {
            let y = document.getElementById("box-" + props.props.boxesById[props.props.boxSelected].id).getBoundingClientRect().height;
            let x = document.getElementById("box-" + props.props.boxesById[props.props.boxSelected].id).getBoundingClientRect().width;
            let selectedPluginAspectRatio = x / y;
            previewSize.height = x > y ? String(15 / selectedPluginAspectRatio) + "em" : "15em";
            previewSize.width = x > y ? "15em" : String(15 * selectedPluginAspectRatio) + "em";
            previewSize.aspectRatio = selectedPluginAspectRatio;
        }
        let width = previewSize.height < previewSize.width ? 100 * imageSize : (100 * imageSize / previewSize.aspectRatio * originalDimensions.aspectRatio);
        let source = props.state.image ? props.state.image : props.props.fileModalResult?.value || "https://live.staticflickr.com/65535/49246500741_6ef20b5fcd.jpg";
        previewContent = (<div style={{
            height: previewSize.height,
            width: previewSize.width,
            marginLeft: "7%",
            border: "1px dashed grey",
        }}>
            <img height="auto" width={String(width) + "%"} onLoad={props.onImgLoad} src={source}/>
        </div>);
        break;
    case 'icon':
        let icon = props.state.selectedIcon ?? 'room';
        previewContent = <i className="material-icons" style={{
            color: (props.state.color || "black"),
            fontSize: (props.state.size / 10) + "em",
            paddingLeft: "7%",
        }}>{icon}</i>;
        break;
    default:
        break;
    }
    return previewContent;
}