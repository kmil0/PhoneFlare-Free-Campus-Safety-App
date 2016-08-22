module.exports = {
    echo: function(message, success, error){
	cordova.exec(success, error, "Flare", "echo", [message]);
    },
    start_timer: function(delay, success, error){
	cordova.exec(success, error, "Flare", "start_timer", [delay]);
    },
    stop_timer: function(success, error){
	cordova.exec(success, error, "Flare", "stop_timer", []);
    },
    get_timer: function(success, error){
	cordova.exec(success, error, "Flare", "get_timer", []);
    },
    is_timing: function(success, error){
	cordova.exec(success, error, "Flare", "is_timing", []);
    },
    listen_for_headphones: function(success, error){
	cordova.exec(success, error, "Flare", "listen_for_headphones", []);
    },
    stop_listening: function(success, error){
	cordova.exec(success, error, "Flare", "stop_listening", []);
    },
    is_listening: function(success, error){
	cordova.exec(success, error, "Flare", "is_listening", []);
    },
    sound_alarm: function(success, error){
	cordova.exec(success, error, "Flare", "sound_alarm", []);
    },
    stop_alarm: function(success, error){
	cordova.exec(success, error, "Flare", "stop_alarm", []);
    },
    arm_alarm: function(success, error){
	cordova.exec(success, error, "Flare", "arm_alarm", []);
    },
    disarm_alarm: function(success, error){
	cordova.exec(success, error, "Flare", "disarm_alarm", []);
    },
    is_alarm_armed: function(success, error){
	cordova.exec(success, error, "Flare", "is_alarm_armed", []);
    },
    start_recording: function(success, error){
	cordova.exec(success, error, "Flare", "start_recording", []);
    },
    stop_recording: function(success, error){
	cordova.exec(success, error, "Flare", "stop_recording", []);
    },
    is_recording: function(success, error){
	cordova.exec(success, error, "Flare", "is_recording", []);
    },
    can_vibrate: function(success, error){
	cordova.exec(success, error, "Flare", "can_vibrate", []);
    },
    start_vibrating: function(duration, success, error){
	cordova.exec(success, error, "Flare", "start_vibrating", [duration]);
    },
    arm_vibrator: function(success, error){
	cordova.exec(success, error, "Flare", "arm_vibrator", []);
    },
    disarm_vibrator: function(success, error){
	cordova.exec(success, error, "Flare", "disarm_vibrator", []);
    },
    stop_vibrating: function(success, error){
	cordova.exec(success, error, "Flare", "stop_vibrating", []);
    },
    set_default_vibration_duration: function(duration, success, error){
	cordova.exec(success, error, "Flare", "set_default_vibration_duration", [duration]);
    },
    get_default_vibration_duration: function(success, error){
	cordova.exec(success, error, "Flare", "get_default_vibration_duration", []);
    },
    initialize: function(success,error){
            cordova.exec(success, error, "Flare", "initialize", []);
    },
    is_emergency: function(success,error){
            cordova.exec(success, error, "Flare", "is_emergency", []);
    },
    check_locservices: function(success,error){
            cordova.exec(success, error, "Flare", "check_locservices", []);
    },
    stop_posting_location: function(success,error){
            cordova.exec(success, error, "Flare", "stop_posting_location", []);
    },
    stop_silent_player: function(success,error){
            cordova.exec(success, error, "Flare", "stop_silent_player", []);
    },
    start_silent_player: function(success,error){
            cordova.exec(success, error, "Flare", "start_silent_player", []);
    },
    
    // Constants
    ACTION_NOT_DEFINED: 0,

    // Timer    
    TIMER_STARTED: 100,
    TIMER_TRIGGERED: 101,
    TIMER_STOPPED: 102,
    
    TIMER_ALREADY_LISTENING: -100,
    TIMER_NOT_SET: -101,

    // Headphones
    HEADPHONES_LISTENING: 200,
    HEADPHONES_TRIGGERED: 201,
    HEADPHONES_STOPPED_LISTENING: 202,
    
    HEADPHONES_ALREADY_LISTENING: -200,
    HEADPHONES_NOT_LISTENING: -201,
    HEADPHONES_NOT_PLUGGED_IN: -202,

    // Alarm
    ALARM_SOUNDED: 300,
    ALARM_STOPPED: 301,
    ALARM_ARMED: 302,
    ALARM_DISARMED: 303,

    ALARM_NOT_SOUNDED: -300,
    
    // Recording
    RECORDING_STARTED: 400,
    RECORDING_STOPPED: 401,
    
    RECORDING_ALREADY: -400,
    RECORDING_NOT_STARTED: -401,

    // Vibrator
    VIBRATOR_ARMED: 500,
    VIBRATOR_DISARMED: 501,
    VIBRATOR_STARTED: 502,
    VIBRATOR_STOPPED: 503,
    VIBRATOR_DEFAULT_DURATION: 504,
    
    VIBRATOR_NOT_PRESENT: -500,
    VIBRATOR_NOT_STARTED: -501,

    USER_ID_SET: 600,
    ACCESS_TOKEN_SET:601,
    STOPPED_POSTING_LOCATION:602

}
