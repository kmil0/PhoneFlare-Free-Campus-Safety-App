package com.flare.plugin;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.app.Activity;
import android.content.Intent;
import android.content.IntentFilter;
import android.app.PendingIntent;
import android.app.AlarmManager;
import android.os.SystemClock;
import java.util.Date;
import java.text.SimpleDateFormat;

import android.media.AudioManager;
import android.media.RingtoneManager;
import android.media.Ringtone;
import android.net.Uri;

import android.media.MediaRecorder;
import android.os.Environment;
import java.io.File;

import android.os.Vibrator;


public class Flare extends CordovaPlugin{

    Context context;
    Activity activity;
    CallbackContext callback_context;
    String package_name;

    BroadcastReceiver timer_receiver;
    AlarmManager alarm_manager;
    PendingIntent pending_intent;
    long timer_end = -1;

    BroadcastReceiver headphones_receiver;

    RingtoneManager ringtone_manager;
    Ringtone alarm;
    boolean should_sound_alarm = true;

    MediaRecorder media_recorder;
    boolean is_recording = false;

    Vibrator vibrator;
    boolean should_vibrate = true;
    static int vibrator_duration = 1;
    
    static final int ACTION_NOT_DEFINED = 0;
    static final int TRUE = 1;
    static final int FALSE = 0;
    
    static final int TIMER_STARTED = 100;
    static final int TIMER_TRIGGERED = 101;
    static final int TIMER_STOPPED = 102;
    static final int TIMER_ALREADY_LISTENING = -100;
    static final int TIMER_NOT_SET = -101;
    
    static final int HEADPHONES_LISTENING = 200;
    static final int HEADPHONES_TRIGGERED = 201;
    static final int HEADPHONES_STOPPED_LISTENING = 202;
    static final int HEADPHONES_ALREADY_LISTENING = -200;
    static final int HEADPHONES_NOT_LISTENING = -201;
    static final int HEADPHONES_NOT_PLUGGED_IN = -202;
    
    static final int ALARM_SOUNDED = 300;
    static final int ALARM_STOPPED = 301;
    static final int ALARM_ARMED = 302;
    static final int ALARM_DISARMED = 303;
    static final int ALARM_NOT_SOUNDED = -300;
    
    static final int RECORDING_STARTED = 400;
    static final int RECORDING_STOPPED = 401;
    static final int RECORDING_ALREADY = -400;
    static final int RECORDING_NOT_STARTED = -401;

    static final int VIBRATOR_ARMED = 500;
    static final int VIBRATOR_DISARMED = 501;
    static final int VIBRATOR_STARTED = 502;
    static final int VIBRATOR_STOPPED = 503;
    static final int VIBRATOR_DEFAULT_DURATION_SET = 504;

    static final int VIBRATOR_NOT_PRESENT = -500;
    static final int VIBRATOR_NOT_STARTED = -501;
    static final int VIBRATOR_ALREADY_STARTED = -502;
    
    static final String TIMER_INTENT = "com.flare.plugin.timer_intent";

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
	super.initialize(cordova, webView);
	activity = super.cordova.getActivity();
	context = activity.getApplicationContext();
	package_name = context.getPackageName();

	Uri alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
	if(alert == null){
	    alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
	    if(alert == null) {  
		alert = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);                
	    }
	}
	alarm = RingtoneManager.getRingtone(context, alert);

	vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
    }


    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callback_context) throws JSONException{

	this.callback_context = callback_context;

	switch(action){
	case "start_timer":
	    if(timer_receiver == null){
		// no timer started
		start_timer(Integer.parseInt(args.getString(0)));
	    }else{
		error(Flare.TIMER_ALREADY_LISTENING);
		// timer already started
	    }
	    break;
	case "stop_timer":
	    stop_timer();
	    break;
	case "get_timer":
	    get_timer();
	    break;
	case "is_timing":
	    if(timer_receiver != null){
		success(Flare.TRUE);
	    }else{
		success(Flare.FALSE);
	    }
	    break;
	case "listen_for_headphones":
	    listen_for_headphones();
	    break;
	case "stop_listening":
	    stop_listening();
	    break;
	case "is_listening":
	    if(headphones_receiver != null){
		success(Flare.TRUE);
	    }else{
		success(Flare.FALSE);
	    }
	    break;
	case "sound_alarm":
	    sound_alarm();
	    break;
	case "stop_alarm":
	    stop_alarm();
	    break;
	case "arm_alarm":
	    arm_alarm(true);
	    break;
	case "disarm_alarm":
	    arm_alarm(false);
	    break;
	case "is_alarm_armed":
	    if(should_sound_alarm){
		success(Flare.TRUE);
	    }else{
		success(Flare.FALSE);
	    }
	    break;
	case "start_recording":
	    start_recording();
	    break;
	case "stop_recording":
	    stop_recording();
	    break;
	case "is_recording":
	    if(is_recording){
		success(Flare.TRUE);
	    }else{
		success(Flare.FALSE);
	    }
	    break;
	case "can_vibrate":
	    if(vibrator.hasVibrator()){
		success(Flare.TRUE);
	    }else{
		success(Flare.FALSE);
	    }
	    break;
	case "arm_vibrator":
	    arm_vibrator(true);
	    break;
	case "disarm_vibrator":
	    arm_vibrator(false);
	    break;
	case "start_vibrating":
	    start_vibrating(Integer.parseInt(args.getString(0)));
	    break;
	case "stop_vibrating":
	    stop_vibrating();
	    break;
	case "set_default_vibration_duration":
	    set_default_vibration_duration(Integer.parseInt(args.getString(0)));
	    break;
	case "get_default_vibration_duration":
	    success(Flare.vibrator_duration);
	    break;
	default:
	    error(Flare.ACTION_NOT_DEFINED);
	    return false;
	}
	return true;
    }

    private void start_timer(int delay){
	timer_receiver = new BroadcastReceiver(){
		@Override
		public void onReceive(Context context, Intent intent){
		    sound_alarm(false);
		    start_vibrating(Flare.vibrator_duration, false);
		    stop_timer(false);
		    
		    Intent return_intent = new Intent();
		    return_intent.setClassName(context, package_name + ".MainActivity");
		    return_intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		    context.getApplicationContext().startActivity(return_intent);

		    success(Flare.TIMER_TRIGGERED);
		}
	    };

	context.registerReceiver(timer_receiver, new IntentFilter(Flare.TIMER_INTENT));
	PendingIntent pending_intent = PendingIntent.getBroadcast(context, 0, new Intent(Flare.TIMER_INTENT), 0);
	AlarmManager alarm_manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
	timer_end = System.currentTimeMillis() + delay * 1000;
	alarm_manager.set(AlarmManager.RTC_WAKEUP, timer_end, pending_intent);
	
	success(Flare.TIMER_STARTED);
    }
    
    private void stop_timer(){
	stop_timer(true);
    }

    private void stop_timer(boolean should_propagate){
	if(timer_receiver != null){
	    context.unregisterReceiver(timer_receiver);
	    timer_end = -1;
	    timer_receiver = null;
	    if(should_propagate){
		success(Flare.TIMER_STOPPED);
	    }
	}else{
	    if(should_propagate){
		error(Flare.TIMER_NOT_SET);
	    }
	}
    }
    
    private void get_timer(){
	if(timer_end > -1){
	    String alarm = new SimpleDateFormat("h:mm a").format(new Date(timer_end));
	    success(alarm);
	}else{
	    error(Flare.TIMER_NOT_SET);
	}
    }

    private void listen_for_headphones(){
	if(headphones_receiver != null){
	    error(Flare.HEADPHONES_ALREADY_LISTENING);
	    return;
	}
	AudioManager audio_manager = (AudioManager) activity.getSystemService(Context.AUDIO_SERVICE);

	if(!audio_manager.isWiredHeadsetOn()){
	    error(Flare.HEADPHONES_NOT_PLUGGED_IN);
	    return;
 	}

	
	headphones_receiver = new BroadcastReceiver(){
		@Override
		public void onReceive(Context context, Intent intent){
		    int state = intent.getIntExtra("state", -1);
		    switch(state){
		    case 0:
			// unplugged
			sound_alarm(false);
			start_vibrating(Flare.vibrator_duration, false);
			stop_listening(false);

			Intent return_intent = new Intent();
			return_intent.setClassName(context, package_name + ".MainActivity");
			return_intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			context.getApplicationContext().startActivity(return_intent);
			success(Flare.HEADPHONES_TRIGGERED);
		    case 1:
			// plugged in
		    case -1:
			// error
		    }
		}
	    };

	IntentFilter filter = new IntentFilter(Intent.ACTION_HEADSET_PLUG);
	context.registerReceiver(headphones_receiver, filter);

	success(Flare.HEADPHONES_LISTENING);
    }

    private void stop_listening(){
	stop_listening(true);
    }

    private void stop_listening(boolean should_propagate){
	if(headphones_receiver != null){
	    context.unregisterReceiver(headphones_receiver);
	    headphones_receiver = null;
	    if(should_propagate){
		success(Flare.HEADPHONES_STOPPED_LISTENING);
	    }
	}else{
	    if(should_propagate){
		error(Flare.HEADPHONES_NOT_LISTENING);
	    }
	}
    }

    private void sound_alarm(){
	sound_alarm(true);
    }

    private void sound_alarm(boolean should_propagate){
	// should check if already alarming
	if(!should_sound_alarm){
	    if(should_propagate){
		success(Flare.ALARM_NOT_SOUNDED);
	    }
	    return;
	}
	alarm.play();
	if(should_propagate){
	    success(Flare.ALARM_SOUNDED);
	}
    }
    
    private void stop_alarm(){
	// should check if is alarming
	alarm.stop();
	success(Flare.ALARM_STOPPED);
    }

    private void arm_alarm(boolean state){
	should_sound_alarm = state;
	if(state){
	    success(Flare.ALARM_ARMED);
	}else{
	    success(Flare.ALARM_DISARMED);
	}
    }
    
    private void start_recording(){
	if(is_recording){
	    error(Flare.RECORDING_ALREADY);
	    return;
	}

	media_recorder = new MediaRecorder();
	media_recorder.setAudioSource(MediaRecorder.AudioSource.MIC);

	// double check best format and encoder
	media_recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
	media_recorder.setAudioEncoder(MediaRecorder.AudioEncoder.DEFAULT);


	String filename = new SimpleDateFormat("yyyy-MM-dd-hh:mm").format(new Date());
	String outputFile = Environment
	    .getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
	    + "/Flare-" + filename + ".3gp";
	media_recorder.setOutputFile(outputFile);
	try{
	    media_recorder.prepare();
	} catch(Exception exception){
	    // do something
	}
	media_recorder.start();
	is_recording = true;
	success(Flare.RECORDING_STARTED);
    }

    private void stop_recording(){
	if(is_recording == false){
	    error(Flare.RECORDING_NOT_STARTED);
	    return;
	}
	media_recorder.stop();
	media_recorder.release();
	is_recording = false;
	success(Flare.RECORDING_STOPPED);
    }


    private void set_default_vibration_duration(int duration){
	Flare.vibrator_duration = duration;
    }
    
    private void arm_vibrator(boolean state){
	should_vibrate = state;
	if(state){
	    success(Flare.VIBRATOR_DISARMED);
	}else{
	    success(Flare.VIBRATOR_ARMED);
	}
    }

    private void start_vibrating(int duration){
	start_vibrating(duration, true);
    }

    private void start_vibrating(int duration, boolean should_propagate){
	if(!vibrator.hasVibrator()){
	    if(should_propagate){
		error(Flare.VIBRATOR_NOT_PRESENT);
	    }
	    return;
	}
	vibrator.vibrate(duration * 1000);
	if(should_propagate){
	    success(Flare.VIBRATOR_STARTED);
	}
    }

    private void stop_vibrating(){
	if(!vibrator.hasVibrator()){
	    error(Flare.VIBRATOR_NOT_PRESENT);
	    return;
	}
	vibrator.cancel();
	success(Flare.VIBRATOR_STOPPED);
    }
    
    private void success(int response){
	PluginResult result = new PluginResult(PluginResult.Status.OK, response);
	result.setKeepCallback(true);
	callback_context.sendPluginResult(result);
    }

    private void success(String response){
	PluginResult result = new PluginResult(PluginResult.Status.OK, response);
	result.setKeepCallback(true);
	callback_context.sendPluginResult(result);
    }

    private void error(int response){
	PluginResult result = new PluginResult(PluginResult.Status.ERROR, response);
	result.setKeepCallback(true);
	callback_context.sendPluginResult(result);
    }
}
