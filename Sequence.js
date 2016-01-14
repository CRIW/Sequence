var ctx;
var sequence = {};

function initAudio(){
   ctx = new AudioContext();
   sequence.tracks = {};
}

function initUploadDrop(element){
   element.addEventListener('dragover', function(event){
      event.stopPropagation(); event.preventDefault();
   });
   element.addEventListener('dragenter', function(event){
      document.getElementById('standby').classList.add('dragActive');
      event.stopPropagation();
      event.preventDefault();
   });
   element.addEventListener('drop', function(event){
      event.stopPropagation();
      event.preventDefault();
      document.getElementById('standby').classList.remove('dragActive');
      if(event.dataTransfer.files && (event.dataTransfer.files.length > 0)){
         for(var i = 0; i < event.dataTransfer.files.length; i++){
            if(event.dataTransfer.files[i].name.endsWith('.mp3')){
               uploadFile(event.dataTransfer.files[i]);
            }
         }
      }
   });
}


function uploadFile(file){
   var cleanName = file.name.substring(0, file.name.lastIndexOf('.'));
   var temp = createTrackElement(cleanName, file.size);
   document.getElementById('standby').appendChild(temp);
   var reader = new FileReader();
   temp.setDescription('uploading');
   reader.onprogress = function(e){
      temp.setProgress(e.loaded / e.total);
      temp.setDescription('uploading ' + e.loaded + '/' + e.total);
   }
   reader.onload = function(e){
      temp.setProgress(e.loaded / e.total);
      temp.setDescription('upload finished');
      console.log(e.target.result);
      sequence.tracks[cleanName] = {
         "DOMNode" : temp
      };
      decodeBuffer(cleanName, e.target.result);
   }
   reader.readAsArrayBuffer(file);
}

function decodeBuffer(name, buffer){
   sequence.tracks[name].DOMNode.setDescription('decoding audio');
   ctx.decodeAudioData(buffer, function(decodedData){
      sequence.tracks[name].audio = decodedData;
      sequence.tracks[name].DOMNode.setDescription('');
      sequence.tracks[name].DOMNode.setProgress(0);
   });
}

function createTrackElement(name, description){
   /*<div class="track" draggable="true">
      <div class="track-background"></div>
      <div class="track-highlight"></div>
      <div class="track-progressbar">
         <div class="track-progress"></div>
      </div>
      <div class="track-name">Test</div>
      <div class="track-description">00:00/00:00</div>
   </div>*/
   var track = document.createElement('div');
   track.setAttribute('draggable', true);
   track.classList.add('track');
   track.trackbackground = document.createElement('div');
   track.trackbackground.classList.add('track-background');
   track.appendChild(track.trackbackground);
   track.trackhighlight = document.createElement('div');
   track.trackhighlight.classList.add('track-highlight');
   track.appendChild(track.trackhighlight);
   var trackprogressbar = document.createElement('div');
   trackprogressbar.classList.add('track-progressbar');
   track.trackprogress = document.createElement('div');
   track.trackprogress.classList.add('track-progress');
   trackprogressbar.appendChild(track.trackprogress);
   track.appendChild(trackprogressbar);
   track.trackname = document.createElement('div');
   track.trackname.classList.add('track-name');
   track.trackname.textContent = name;
   track.appendChild(track.trackname);
   track.trackdescription = document.createElement('div');
   track.trackdescription.classList.add('track-description');
   if(description){track.trackdescription.textContent = description;}
   track.appendChild(track.trackdescription);
   track.setName = function(name){
      this.trackname.textContent = name;
   }
   track.setDescription = function(description){
      this.trackdescription.textContent = description;
   }
   track.setHighlightColor = function(color){
      this.trackhighlight.style['background-color'] = color;
   }
   track.setProgress = function(progress){
      this.trackprogress.style.width = parseInt(progress * 100) + "%";
   }
   return track;
}
