export function EnrichedVideo(base) {

    return {
        init: function(){
            this.__marks = {};
            this.t= "";
            this.actualMark = "";
        },
        getRenderTemplate: function (state) {
            this.__marks = state.__marks;
            return "<video " +
                ((state.controls) ? " controls='true' " : "") +
                ((state.autoplay) ? " autoPlay " : "") +
                " style=\"width: 100%; height: 100%; pointer-events: 'none'; z-index:0;\" src=\"" +
                state.url + this.t + "\" ontimeupdate='$dali$.timeUpdate()'></video>";
        },
        getMarkArray: function(){
            var marks =  this.__marks;
            if (Object.keys(marks).length <= 0) {
                return false;
            }
            var marksArray = [];
            Object.keys(marks).map((mark) =>{
                let inner_mark = marks[mark];
                let value = inner_mark.value.toString();
                marksArray.push(value);
            });

            return marksArray;

        },
        getMarkKeys: function(){
            var marks = this.__marks;
            var markKeys = {};
            Object.keys(marks).map((mark) =>{
                let inner_mark = marks[mark];
                let value = inner_mark.value.toString();
                markKeys[value] = inner_mark.id;
            });
            return markKeys;
        },
        getActualMarkTime: function(time){
            return this.getMarkArray()[this.getMarkArray().indexOf(time.toString())];
        },
        timeUpdate: function (e, element) {
            var time = document.getElementById("box-" + element).getElementsByTagName('video')[0].currentTime;
            time = Math.floor(time);
            if ( this.actualMark.length !== 0 && this.getActualMarkTime(time) !== time.toString()){
                this.actualMark = "";
            }

            if(this.getMarkArray() && this.getMarkArray().indexOf(time.toString() !== -1) && this.actualMark.toString() !== this.getActualMarkTime(time)){

                this.t= "#t=" + time;
                this.actualMark = time;
                base.triggerMark(element, this.getMarkKeys()[time]);
            }
        }
    };
}
