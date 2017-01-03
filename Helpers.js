var Helpers = {
    timeToHumanReadable : function(time){
        var seconds = Math.ceil(time);
        var minutes = 0;
        while(seconds > 60){
            minutes ++;
            seconds -= 60;
        }
        if(minutes > 0){
            return minutes + ":" + seconds;
        }else{
            return seconds + "s";
        }
    }
}