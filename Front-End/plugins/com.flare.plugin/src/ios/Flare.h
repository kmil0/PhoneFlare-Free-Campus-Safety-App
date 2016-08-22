//
//  Flare.h
//  flare
//
//  Created by Eric Wu on 7/26/15.
//
//

#import <Cordova/CDVPlugin.h>
#import <CoreLocation/CoreLocation.h>

@interface Flare : CDVPlugin

//initialize
- (void) initialize:(CDVInvokedUrlCommand *)command;

//timer
- (void) start_timer:(CDVInvokedUrlCommand *)command;
- (void) stop_timer:(CDVInvokedUrlCommand *)command;
- (void) get_timer:(CDVInvokedUrlCommand *)command;
- (void) is_timing:(CDVInvokedUrlCommand *)command;

//silent
- (void) start_silent_player:(CDVInvokedUrlCommand *)command;
- (void) stop_silent_player:(CDVInvokedUrlCommand *)command;


//headphones
- (void) listen_for_headphones:(CDVInvokedUrlCommand *)command;
- (void) stop_listening:(CDVInvokedUrlCommand *)command;
- (void) is_listening:(CDVInvokedUrlCommand *)command;

//alarm
- (void) sound_alarm:(CDVInvokedUrlCommand *)command;
- (void) stop_alarm:(CDVInvokedUrlCommand *)command;
- (void) arm_alarm:(CDVInvokedUrlCommand *)command;
- (void) disarm_alarm:(CDVInvokedUrlCommand *)command;
- (void) is_alarm_armed:(CDVInvokedUrlCommand *)command;

//recording
- (void) start_recording:(CDVInvokedUrlCommand *)command;
- (void) stop_recording:(CDVInvokedUrlCommand *)command;
- (void) is_recording:(CDVInvokedUrlCommand *)command;

//vibrating
- (void) can_vibrate:(CDVInvokedUrlCommand *)command;
- (void) arm_vibrator:(CDVInvokedUrlCommand *)command;
- (void) disarm_vibrator:(CDVInvokedUrlCommand *)command;
- (void) start_vibrating:(CDVInvokedUrlCommand *)command;
- (void) stop_vibrating:(CDVInvokedUrlCommand *)command;
- (void) set_default_vibration_duration:(CDVInvokedUrlCommand *)command;
- (void) get_default_vibration_duration:(CDVInvokedUrlCommand *)command;

//userID & access token
- (void) set_user_id:(CDVInvokedUrlCommand *)command;
- (void) set_access_token:(CDVInvokedUrlCommand *)command;
//- (void) stop_posting_location:(CDVInvokedUrlCommand *)command;

//is emergency
- (void) is_emergency:(CDVInvokedUrlCommand *)command;

//loc services
- (void) check_locservices:(CDVInvokedUrlCommand *)command;

@end
