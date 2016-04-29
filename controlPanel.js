
exports.ControlPanel = function(){
    
    var useUpmVersion = true;

    // we want mraa to be at least version 0.6.1
    var mraa = require('mraa');
    var version = mraa.getVersion();
    
     var upmBuzzer = require("jsupm_buzzer");
    var buzz = new upmBuzzer.Buzzer(5);
    buzz.setVolume(0.20);
     buzz.stopSound();
    
    exports.ControlPanel.buzzer = buzz;

    
     var chords = [];
    chords.push(upmBuzzer.DO);
    chords.push(upmBuzzer.RE);
    chords.push(upmBuzzer.MI);
    chords.push(upmBuzzer.FA);
    chords.push(upmBuzzer.SOL);
    chords.push(upmBuzzer.LA);
    chords.push(upmBuzzer.SI);
    chords.push(upmBuzzer.DO);
    chords.push(upmBuzzer.SI);

    var groveSensor = require('jsupm_grove')
    var backButton = new groveSensor.GroveButton(3);
    var checkButton = new groveSensor.GroveButton(2);
        var display = exports.ControlPanel.display;
    
    var rotaryEncoder = require("jsupm_rotaryencoder");
    var myRotaryEncoder = new rotaryEncoder.RotaryEncoder(7, 8);
    
    var backButtonUp = true;
    var checkButtonUp = true;
    
    var intervalObject;
    
    var rotaryDelta = 0;
    var active = false;
    
    this.getRotaryDelta = function(){
        return rotaryDelta;
    }
    
    this.isActive = function(){
        return active;
    }
    
    this.getDisplay = function(){
        return display;
    }
    
    this.getBuzzer = function(){
        return buzz;
    }
    
    this.getUpmBuzzer =function(){
        return upmBuzzer;
    }
    
    var playCount = 0;
    
    this.playBuzz = function(durationMs){
        this.playBuzzNote(upmBuzzer.SI, durationMs);
    }
    
    this.playBuzzNote = function(pitch, durationMs){
        playCount++;
        var currentCount = playCount;
        buzz.setVolume(0.20);
        buzz.stopSound();
        buzz.playSound(chords[2],0); 
        setTimeout(function(){
            if(playCount == currentCount){
                killSound();
            }
               
        }, durationMs);
    }
    
    function killSound(){
           buzz.stopSound();
            buzz.setVolume(0.0);
    }
    
    
   
        
      this.activate = function(){
          var interval = 100;
          myRotaryEncoder.initPosition(0);
        active = true;
        intervalObject = setInterval(function(){
            
           

          
               if(backButtonUp && backButton.value()==1)
                   backButtonPressed();
               else if(!backButtonUp && backButton.value() == 0)
                   backButtonReleased();
           
            if(checkButtonUp && checkButton.value()==1)
                checkButtonPressed();
            else if(!checkButtonUp && checkButton.value()==0)
                checkButtonReleased();
            
            
             rotaryDelta = myRotaryEncoder.position();
            myRotaryEncoder.initPosition(0);
            
            
            if(rotaryDelta!= 0)
                rotaryDeltaChanged();           
             
        }, interval);        
    }
      
       this.deactivate = function(){
        if(intervalObject != null)
            clearInterval(intervalObject);
        active = false;
           killSound();
    }
       

       
       function rotaryDeltaChanged(){
           onRotaryDeltaChanged();
       }
       
         function backButtonPressed(){
        console.log("backButtonPressed - backButton: "+backButton.value()+", checkButton: "+checkButton.value());
        
        backButtonUp = false;
             onBackButtonPressed();
//             onBackButtonPressed.forEach(function(func){
//                 func();
//             });
    }
    
  
    
    function backButtonReleased(){
        backButtonUp = true;
        
        onBackButtonReleased();
//         onBackButtonReleased.forEach(function(func){
//                 func();
//             });
    }
    
  
    
    function checkButtonPressed(){
        console.log("checkButtonPressed - backButton: "+backButton.value()+", checkButton: "+checkButton.value());
        
        checkButtonUp = false;
        
        onCheckButtonPressed();
//         onCheckButtonPressed.forEach(function(func){
//                 func();
//             });
    }
    
   
    
    function checkButtonReleased(){
        checkButtonUp = true;
        onCheckButtonReleased();
//         onCheckButtonReleased.forEach(function(func){
//                 func();
//             });
    }
    
     var onRotaryDeltaChanged = function(){};
var onBackButtonPressed = function(){};
  var onBackButtonReleased = function(){};
  var onCheckButtonPressed = function(){};
 var onCheckButtonReleased = function(){};
    
    this.setOnRotaryDeltaChanged =function(fn){onRotaryDeltaChanged=fn;}
    this.setOnBackButtonPressed =function(fn){onBackButtonPressed=fn;}
    this.setOnCheckButtonPressed =function(fn){onCheckButtonPressed=fn;}

}

exports.ControlPanel.buzzer = null;

exports.ControlPanel.display = null;

exports.initDisplay = function(callback){
    if(  exports.ControlPanel.display == null){
             var lcd = require('jsupm_i2clcd');
         exports.ControlPanel.display = new lcd.Jhd1313m1(0, 0x3E, 0x62);

             setTimeout(function(){
                 delete exports.ControlPanel.display;
                 exports.ControlPanel.display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
                  display = exports.ControlPanel.display;
                 callback();
        },500);   
    }
}

      