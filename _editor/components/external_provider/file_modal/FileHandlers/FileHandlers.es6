import React from 'react';
import { createBox } from '../../../../../common/common_tools';
import { ID_PREFIX_BOX, ID_PREFIX_SORTABLE_CONTAINER } from '../../../../../common/constants';
import { randomPositionGenerator } from '../../../clipboard/clipboard.utils';
import { isSlide, isBox } from '../../../../../common/utils';

export default function handlers(self) {
    let type = self.state.type;
    let download = { // Forces browser download
        title: 'Download',
        disabled: !self.state.element,
        action: ()=>{
            let anchor = document.createElement('a');
            anchor.href = self.state.element;
            anchor.href = anchor.href.replace(/^data:.*\/[^;]+/, 'data:application/octet-stream');

            anchor.target = '_blank';
            anchor.download = self.state.name;
            anchor.click();
        },
    };
    let page = self.currentPage();
    let { initialParams, isTargetSlide } = getInitialParams(self, page);
    let currentPlugin = (self.props.fileModalResult && self.props.fileModalResult.id && self.props.pluginToolbars[self.props.fileModalResult.id]) ? self.props.pluginToolbars[self.props.fileModalResult.id].pluginId : null;
    switch(type) {
    case 'image' :
        return{
            icon: 'image',
            buttons: [
                {
                    title: 'Insert',
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type,
                    action: ()=>{
                        if (self.state.element) {
                            if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                                initialParams.url = self.state.element;
                                createBox(initialParams, "HotspotImages", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                                self.props.close();
                            } else {
                                self.props.close({ id: self.props.fileModalResult.id, value: self.state.element });
                            }
                        }

                    },
                },
                download,
            ],
        };
    case 'video' :
        return {
            icon: 'play_arrow',
            buttons: [
                {
                    title: 'Insert',
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type,
                    action: ()=>{
                        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                            initialParams.url = self.state.element;
                            createBox(initialParams, "EnrichedPlayer", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                            self.props.close();
                        } else {
                            self.props.close({ id: self.props.fileModalResult.id, value: self.state.element });
                        }
                    },
                },
                download,
            ] };
    case 'audio' :
        return {
            icon: 'audiotrack',
            buttons: [
                {
                    title: 'Insert',
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type,
                    action: ()=>{
                        if (self.props.fileModalResult && !self.props.fileModalResult.id) {
                            initialParams.url = self.state.element;
                            createBox(initialParams, "EnrichedPlayer", isTargetSlide, self.props.onBoxAdded, self.props.boxes);
                            self.props.close();
                        } else {
                            self.props.close({ id: self.props.fileModalResult.id, value: self.state.element });
                        }
                    },
                },
                download,
            ] };
    case 'pdf' :
        return {
            icon: 'picture_as_pdf',
            buttons: [
                {
                    title: 'Insert',
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (self.props.fileModalResult && self.props.fileModalResult.id),
                    action: ()=>{ // Open side view
                        if (self.state.element) {
                            self.setState({ pdfSelected: true });
                        }
                    },
                },
                download,
            ] };
    case 'csv' :
    case 'json':
        return {
            icon: 'view_agenda',
            buttons: [
                {
                    title: 'Insert Table',
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (currentPlugin && currentPlugin !== 'DataTable'),
                    action: () => {
                        if (self.state.element) {
                            let xhr = new XMLHttpRequest(),
                                fileReader = new FileReader();
                            fileReader.onload = (e)=>dataToState(e, self, type, initialParams, isTargetSlide, 'DataTable');
                            if(isDataURL(self.state.element)) {
                                fileReader.readAsBinaryString(dataURItoBlob(self.state.element));
                            } else {
                                xhr.open("GET", self.state.element, true);
                                xhr.responseType = "blob";

                                xhr.addEventListener("load", function() {
                                    if (xhr.status === 200) {
                                        fileReader.readAsBinaryString(xhr.response);
                                    }
                                }, false);
                                // Send XHR
                                xhr.send();
                            }

                        }

                    },
                },
                {
                    title: 'Insert Graph',
                    disabled: !page || self.props.disabled || !self.state.element || !self.state.type || (currentPlugin && currentPlugin !== 'GraficaD3'),
                    action: () => {
                        if (self.state.element) {
                            let xhr = new XMLHttpRequest(),
                                fileReader = new FileReader();
                            fileReader.onload = (e)=>dataToState(e, self, type, initialParams, isTargetSlide, 'GraficaD3');
                            if(isDataURL(self.state.element)) {
                                fileReader.readAsBinaryString(dataURItoBlob(self.state.element));
                            } else {
                                xhr.open("GET", self.state.element, true);
                                xhr.responseType = "blob";

                                xhr.addEventListener("load", function() {
                                    if (xhr.status === 200) {
                                        fileReader.readAsBinaryString(xhr.response);
                                    }
                                }, false);
                                // Send XHR
                                xhr.send();
                            }

                        }

                    },
                },
                download,
            ] };
    default :
        return {
            icon: 'attach_file',
            buttons: [
                download,
            ] };
    }
}
function getInitialParams(self, page) {
    let ids = {};
    let initialParams;
    let isTargetSlide = false;

    if (page) {
        let containerId = ID_PREFIX_SORTABLE_CONTAINER + Date.now();
        let id = ID_PREFIX_BOX + Date.now();
        isTargetSlide = isSlide(page.type);
        let parent = isTargetSlide ? page.id : page.boxes[0];
        let row = 0;
        let col = 0;
        let container = isTargetSlide ? 0 : containerId;
        let newInd;
        if (self.props.boxSelected && self.props.boxes[self.props.boxSelected] && isBox(self.props.boxSelected)) {
            parent = self.props.boxes[self.props.boxSelected].parent;
            container = self.props.boxes[self.props.boxSelected].container;
            isTargetSlide = container === 0;
            row = self.props.boxes[self.props.boxSelected].row;
            col = self.props.boxes[self.props.boxSelected].col;
            newInd = self.getIndex(parent, container);
        }

        ids = { id, parent, container, row, col, page: page ? page.id : 0 };
        initialParams = {
            id: ID_PREFIX_BOX + Date.now(),
            parent: parent, //
            container: container,
            row: row,
            col: col,
            index: newInd,
            page: page ? page.id : 0,
            position: isTargetSlide ? {
                type: "absolute",
                x: randomPositionGenerator(20, 40),
                y: randomPositionGenerator(20, 40),
            } : { type: 'relative', x: "0%", y: "0%" },
        };
    }

    return { initialParams, isTargetSlide };
}
function csvToState(csv) {
    let lines = csv.split("\n");

    let data = [];

    let headers = lines[0].split(",");

    for(let i = 1; i < lines.length; i++) {

        let obj = Array(headers.length);
        let currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[j] = "" + currentline[j];
        }
        data.push(obj);
    }

    return { headers, data };
}

function jsonToState(json) {
    console.log(json);
    json = JSON.parse(json);
    console.log(json);
    let headers = [];
    let data = [];
    if (validateJson(json)) {
        headers = Object.keys(json[0]);
        data = json.map(r=>Object.values(r));
        return { headers, data };
    }
    return {};
}

function validateJson(json) {
    let data = {};
    if(json.length === 0) {
        return false;
    }
    let cols = Object.keys(json[0]);
    if(cols.length === 0) {
        return false;
    }
    for(let row of json) {

        if(!compareKeys(cols, Object.keys(row))) {
            return false;
        }
        cols = Object.keys(row);
    }
    return true;
}

function compareKeys(a, b) {
    a = a.sort().toString();
    b = b.sort().toString();
    return a === b;
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    let ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    let blob = new Blob([ab], { type: mimeString });
    return blob;

}

function dataToState(e, self, format, initialParams, isTargetSlide, plugin) {
    let data = e.currentTarget.result;
    let headers = (data[0]) ? new Array(data[0].length) : [];
    let processed = { data: [], headers: [] };
    if (format === 'csv') {
        processed = csvToState(data);
    } else if (format === 'json') {
        processed = jsonToState(data);
    }
    data = processed.data;
    headers = processed.headers;
    let value = { name: self.state.name, data, rows: data.length, cols: data[0].length, keys: headers };
    if (plugin === 'GraficaD3') {
        value.dataProvided = data;
        value.dataProcessed = data;
    }

    if (self.props.fileModalResult && !self.props.fileModalResult.id) {
        initialParams.initialState = value;
        createBox(initialParams, plugin, isTargetSlide, self.props.onBoxAdded, self.props.boxes);
    }else {
        self.props.close({ id: self.props.fileModalResult.id, value });
    }
    self.props.close();
}

function isDataURL(s) {
    let regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return !!s.match(regex);
}
