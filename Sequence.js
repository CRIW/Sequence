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
            var cleanName = event.dataTransfer.files[i].name.substring(0, event.dataTransfer.files[i].name.lastIndexOf('.'));
            if(event.dataTransfer.files[i].name.endsWith('.mp3') && (!sequence.tracks[cleanName])){
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
      temp.setDescription('finishing upload...');
      var blob = new Blob([e.target.result], {type:"audio/mpeg"});
      var blobURL = URL.createObjectURL(blob);
      var audio = new Audio(blobURL);
      audio.addEventListener('canplaythrough', function(){temp.setDescription('');});
      sequence.tracks[cleanName] = {
         "DOMNode" : temp,
         "blobURL" : blobURL,
         "audio" : new Audio(blobURL)
      };
      temp.setDescription('loading audio...');
      temp.setProgress(0);
   }
   reader.readAsArrayBuffer(file);
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
