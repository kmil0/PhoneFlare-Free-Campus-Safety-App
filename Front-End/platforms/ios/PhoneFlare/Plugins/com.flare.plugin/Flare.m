//
//  Flare.m
//  flare
//
//  Created by Eric Wu on 7/26/15.
//
//

#import "Flare.h"
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <CoreLocation/CoreLocation.h>

#define alarm_system_id 1304

@interface Flare()

@property (strong, nonatomic) NSTimer *timer;
@property (strong, nonatomic) NSTimer *headphonesTimer;
@property (strong, nonatomic) NSTimer *vibrateTimer;
@property (strong, nonatomic) NSTimer *alarmTimer;
//@property (strong, nonatomic) NSTimer *locationTimer;

@property (strong, nonatomic) NSDate *timerEndDate;
@property (strong, nonatomic) AVAudioRecorder *recorder;
@property (strong, nonatomic) AVAudioPlayer *player;

//@property (strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation Flare {
    BOOL isListening;
    BOOL isRecording;
    BOOL isEmergency;
    int vibeCount;
    NSString *headphonesCallbackId;
    CLLocation *currentLocation;
    NSData* responseData;
    NSURLConnection *connection;
}

static const int INITIALIZED = 0;

static const int TIMER_STARTED = 100;
static const int TIMER_TRIGGERED = 101;
static const int TIMER_STOPPED = 102;
static const int TIMER_ALREADY_LISTENING = -100;
static const int TIMER_NOT_SET = -101;
static const int TIMER_FAILED_NO_LOCATION = -102;

static const int HEADPHONES_LISTENING = 200;
static const int HEADPHONES_TRIGGERED = 201;
static const int HEADPHONES_STOPPED_LISTENING = 202;
static const int HEADPHONES_ALREADY_LISTENING = -200;
static const int HEADPHONES_NOT_LISTENING = -201;
static const int HEADPHONES_NOT_PLUGGED_IN = -202;
static const int HEADPHONES_FAILED_NO_LOCATION = -203;

static const int ALARM_SOUNDED = 300;
static const int ALARM_STOPPED = 301;
static const int ALARM_ARMED = 302;
static const int ALARM_DISARMED = 303;
static const int ALARM_NOT_SOUNDED = -300;

static const int RECORDING_STARTED = 400;
static const int RECORDING_STOPPED = 401;
static const int RECORDING_ALREADY = -400;
static const int RECORDING_NOT_STARTED = -401;

static const int VIBRATOR_ARMED = 500;
static const int VIBRATOR_DISARMED = 501;
static const int VIBRATOR_STARTED = 502;
static const int VIBRATOR_STOPPED = 503;
static const int VIBRATOR_DEFAULT_DURATION_SET = 504;
static const int VIBRATOR_NOT_PRESENT = -500;

static const int USER_ID_SET = 600;
static const int ACCESS_TOKEN_SET = 601;
static const int STOPPED_POSTING_LOCATION = 602;

static NSString *userID = @"3";
static NSString *accessToken = @"abcdefg";
static const NSString *formatUrl = @"http://demo.jonathanchin.com/email_post_dump.php";

static int default_grace_period = 0; //GRACE PERIOD FOR DISARMING
static int default_vibration_duration = 1;
static BOOL should_sound_alarm = YES;
static BOOL should_vibrate = YES;

//do all our setup stuff
-(void)pluginInitialize {
    
    isListening = NO;
    isRecording = NO;
    isEmergency = NO;
    /*
    //setup location
    if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied ||
        [CLLocationManager authorizationStatus] == kCLAuthorizationStatusRestricted ||
        ![CLLocationManager locationServicesEnabled]) {
        
        currentLocation = nil;
        
    } else {
        
        //setup geolocation
        // Instantiate location manager
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        self.locationManager.delegate = self;
        
        // Currentlocation update is in the callback below
        if ([[[UIDevice currentDevice] systemVersion] compare:@"8.0" options:NSNumericSearch] != NSOrderedAscending) { //ios 8 and above
            NSLog(@"request always auth");
            [self.locationManager requestAlwaysAuthorization];
            [self.locationManager startMonitoringSignificantLocationChanges];
        }
        [self.locationManager startUpdatingLocation];
        
    }*/
    
    //setup audio
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    NSError *err = nil;
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord
                  withOptions:AVAudioSessionCategoryOptionMixWithOthers
                        error:&err];
    NSLog(@"initialize");
    
    if(err){
        NSLog(@"audioSession: %@ %d %@", [err domain], [err code], [[err userInfo] description]);
        return;
    }
    err = nil;
    
    [audioSession setActive:YES error:&err];
    if(err){
        NSLog(@"audioSession: %@ %d %@", [err domain], [err code], [[err userInfo] description]);
        return;
    }
    
    //make the player
    NSString* path = [[NSBundle mainBundle] pathForResource:@"silentbeep"
                                                     ofType:@"wav"];
    
    NSURL* url = [NSURL fileURLWithPath:path];
    
    
    self.player = [[AVAudioPlayer alloc] initWithContentsOfURL:url
                                                         error:NULL];
    
    // Silent
    self.player.volume = 0;
    // Infinite
    self.player.numberOfLoops = -1;
    /*
    //sign up for notifications
    NSNotificationCenter* listener = [NSNotificationCenter defaultCenter];
    
    if (&UIApplicationDidEnterBackgroundNotification && &UIApplicationWillEnterForegroundNotification) {
        
        [listener addObserver:self
                     selector:@selector(keepAwake)
                         name:UIApplicationDidEnterBackgroundNotification
                       object:nil];
        
        [listener addObserver:self
                     selector:@selector(stopKeepingAwake)
                         name:UIApplicationWillEnterForegroundNotification
                       object:nil];
        
        [listener addObserver:self
                     selector:@selector(keepAwake)
                         name:AVAudioSessionInterruptionNotification
                       object:nil];
        
    } else {
        [self keepAwake];
    }*/
}
/*
#pragma mark - location delegate

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
    NSLog(@"location delegate called");
    // Check is permission is granted
    if ([CLLocationManager authorizationStatus] != kCLAuthorizationStatusDenied && [CLLocationManager authorizationStatus] != kCLAuthorizationStatusRestricted) {
        NSLog(@"permission granted");
        // Update user current location
        currentLocation = [locations lastObject];
    }
    
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error {
    NSLog(@"location failed with error:%@", error);
}*/

#pragma mark - playing in background methods

- (void) start_silent_player:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:0];
    
    [self.player play];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}



- (void) stop_silent_player:(CDVInvokedUrlCommand *)command {
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:0];
    
    [self.player pause];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}




/*
- (void) keepAwake {
    [self.player play];
}

- (void) stopKeepingAwake {
    [self.player pause];
}
*/
#pragma mark - initialize hack
- (void) initialize:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:INITIALIZED];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - timer

- (void) start_timer:(CDVInvokedUrlCommand *)command {
    /*
    //check if geolocation permission is granted
    if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied || [CLLocationManager authorizationStatus] == kCLAuthorizationStatusRestricted) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:TIMER_FAILED_NO_LOCATION];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }*/
    
    int delayInSecs = [[command argumentAtIndex:0] intValue];
    
    if (!delayInSecs) return;
    
    if (!self.timer) {
        NSDictionary *userInfo = @{@"callbackId":command.callbackId};
        
        self.timer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) delayInSecs
                                                      target:self
                                                    selector:@selector(fire:)
                                                    userInfo:userInfo
                                                     repeats:NO];
        self.timerEndDate = [[NSDate alloc] initWithTimeIntervalSinceNow:(NSTimeInterval) delayInSecs];
        
        /*
        //location update
        if ([[[UIDevice currentDevice] systemVersion] compare:@"8.0" options:NSNumericSearch] != NSOrderedAscending) { //ios 8 and above
            NSLog(@"request always auth");
            [self.locationManager requestAlwaysAuthorization];
            [self.locationManager startMonitoringSignificantLocationChanges];
        }
        [self.locationManager startUpdatingLocation];*/
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:TIMER_STARTED];
        [pluginResult setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:TIMER_ALREADY_LISTENING];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

    }
    
}

- (void) stop_timer:(CDVInvokedUrlCommand *)command {
    if (self.timer) {
        [self.timer invalidate];
        self.timer = nil;
        self.timerEndDate = nil;
        
        //[self.locationManager stopUpdatingLocation];
        
        if (self.headphonesTimer) {
            [self.headphonesTimer invalidate];
            self.headphonesTimer = nil;
        }
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:TIMER_STOPPED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:TIMER_NOT_SET];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (void) get_timer:(CDVInvokedUrlCommand *)command {
    if (self.timerEndDate) {
        NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat:@"h:mm a"];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[formatter stringFromDate:self.timerEndDate]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:TIMER_NOT_SET];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (void) is_timing:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:(self.timer != nil)];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//for the timer to fire
- (void) fire:(NSTimer *)timer {
    NSLog(@"fired! with timer: %@", timer);
    if (self.timer) {
        
        NSString *callbackId = [timer.userInfo objectForKey:@"callbackId"];
        
        //clear timer
        [self.timer invalidate];
        self.timer = nil;
        self.timerEndDate = nil;
        
        //sound the alarm
        if (should_sound_alarm) {
            if (self.alarmTimer) {
                [self.alarmTimer invalidate];
            }
            self.alarmTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 2.0f
                                                               target:self
                                                             selector:@selector(alarm)
                                                             userInfo:nil
                                                              repeats:YES];
            AudioServicesPlaySystemSound(alarm_system_id); //play immediately
        }

        
        //start vibrating
        if ([[UIDevice currentDevice].model isEqualToString:@"iPhone"]) { //can vibrate
            
            int duration = default_vibration_duration;
            
            int numLoops = duration / 0.4f; //find number of loops we need to run
            
            NSDictionary *userInfo = @{@"numLoops":[NSNumber numberWithInt:numLoops]};
            
            //make the device vibrate
            if (self.vibrateTimer) {
                [self.vibrateTimer invalidate];
            }
            self.vibrateTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 0.4f
                                                                 target:self
                                                               selector:@selector(vibe:)
                                                               userInfo:userInfo
                                                                repeats:YES];
            AudioServicesPlayAlertSound(kSystemSoundID_Vibrate);
        }
        
        /*
        //set up post location timer
        if (self.locationTimer) {
            [self.locationTimer invalidate];
        }
        self.locationTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 15.0f
                                                           target:self
                                                         selector:@selector(postLocation)
                                                         userInfo:nil
                                                          repeats:YES];
        //post location immediately
        [self postLocation];*/
        
        //send timertriggered response
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:TIMER_TRIGGERED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
    
    [self setIsEmergency];
}

#pragma mark - headphones

- (void) listen_for_headphones:(CDVInvokedUrlCommand *)command {
    
    /*
    //check if geolocation permission is granted
    if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied || [CLLocationManager authorizationStatus] == kCLAuthorizationStatusRestricted) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:HEADPHONES_FAILED_NO_LOCATION];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }*/
    
    //already listening
    if (isListening) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:HEADPHONES_ALREADY_LISTENING];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    //check headphones
    BOOL isHeadphonePluggedIn = NO;
    NSArray *availableOutputs = [[AVAudioSession sharedInstance] currentRoute].outputs;
    for (AVAudioSessionPortDescription *portDescription in availableOutputs) {
        if ([portDescription.portType isEqualToString:AVAudioSessionPortHeadphones]) {
            isHeadphonePluggedIn = YES;
        }
    }
    
    //headphones not plugged in
    if (!isHeadphonePluggedIn) {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:HEADPHONES_NOT_PLUGGED_IN];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    //start listening - cannot pass anything into object. OBJECT MUST BE NIL
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(audioRouteDidChange:)
                                                 name:AVAudioSessionRouteChangeNotification
                                               object:nil];
    headphonesCallbackId = command.callbackId;
    isListening = YES;
    
    /*
    //start location monitoring
    if ([[[UIDevice currentDevice] systemVersion] compare:@"8.0" options:NSNumericSearch] != NSOrderedAscending) { //ios 8 and above
        NSLog(@"request always auth");
        [self.locationManager requestAlwaysAuthorization];
        [self.locationManager startMonitoringSignificantLocationChanges];
    }
    [self.locationManager startUpdatingLocation];*/
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:HEADPHONES_LISTENING];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}



- (void) stop_listening:(CDVInvokedUrlCommand *)command {
    if (isListening) {
        [[NSNotificationCenter defaultCenter] removeObserver:self
                                                        name:AVAudioSessionRouteChangeNotification
                                                      object:nil];
        headphonesCallbackId = nil;
        isListening = NO;
        //[self.locationManager stopUpdatingLocation];
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:HEADPHONES_STOPPED_LISTENING];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:HEADPHONES_NOT_LISTENING];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}



- (void) is_listening:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isListening];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


//NOTE: THIS FUNCTION IS CALLED WHEN THE USER PULLS OUT HEADPHONES AFTER ARMING

- (void) audioRouteDidChange:(NSNotification *)notif {
    
    
    NSInteger routeChangeReason = [[notif.userInfo valueForKey:AVAudioSessionRouteChangeReasonKey] integerValue];
    
    switch (routeChangeReason) {
            
        case AVAudioSessionRouteChangeReasonNewDeviceAvailable: //headphone plugged in (nothing for now)
            break;
            
        case AVAudioSessionRouteChangeReasonOldDeviceUnavailable: { //headphone pulled out
            
            //stop listening
            [[NSNotificationCenter defaultCenter] removeObserver:self
                                                            name:AVAudioSessionRouteChangeNotification
                                                          object:nil];
            isListening = NO;
            
            if (!self.headphonesTimer) {
                
                self.headphonesTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) default_grace_period
                                                              target:self
                                                            selector:@selector(headphonesFire:)
                                                            userInfo:nil
                                                             repeats:NO];
                
            }
            
            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:HEADPHONES_TRIGGERED];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:headphonesCallbackId];
            break;
        }
            
        default: //anything else
            break;
    }
}

//for the headphonesTimer to fire
- (void) headphonesFire:(NSTimer *)timer {
    NSLog(@"headphones timer fired");
    if (self.headphonesTimer) {
        
        //clear timer
        [self.headphonesTimer invalidate];
        self.headphonesTimer = nil;
        
        //sound the alarm
        if (should_sound_alarm) {
            if (self.alarmTimer) {
                [self.alarmTimer invalidate];
            }
            self.alarmTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 2.0f
                                                               target:self
                                                             selector:@selector(alarm)
                                                             userInfo:nil
                                                              repeats:YES];
            AudioServicesPlaySystemSound(alarm_system_id); //play immediately
        }
        
        
        //start vibrating
        if ([[UIDevice currentDevice].model isEqualToString:@"iPhone"]) { //can vibrate
            
            int duration = default_vibration_duration;
            
            int numLoops = duration / 0.4f; //find number of loops we need to run
            
            NSDictionary *userInfo = @{@"numLoops":[NSNumber numberWithInt:numLoops]};
            
            //make the device vibrate
            if (self.vibrateTimer) {
                [self.vibrateTimer invalidate];
            }
            self.vibrateTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 0.4f
                                                                 target:self
                                                               selector:@selector(vibe:)
                                                               userInfo:userInfo
                                                                repeats:YES];
            AudioServicesPlayAlertSound(kSystemSoundID_Vibrate);
        }
        
        /*
        //set up post location timer
        if (self.locationTimer) {
            [self.locationTimer invalidate];
        }
        self.locationTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 15.0f
                                                              target:self
                                                            selector:@selector(postLocation)
                                                            userInfo:nil
                                                             repeats:YES];
        //post location immediately
        [self postLocation];*/
        
        //send timertriggered response
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:HEADPHONES_TRIGGERED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:headphonesCallbackId];
    }
    
    [self setIsEmergency];
}


#pragma mark - alarm

- (void) sound_alarm:(CDVInvokedUrlCommand *)command {
    if (should_sound_alarm) {
        if (self.alarmTimer) {
            [self.alarmTimer invalidate];
        }
        self.alarmTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 2.0f
                                                           target:self
                                                         selector:@selector(alarm)
                                                         userInfo:nil
                                                          repeats:YES];
        AudioServicesPlaySystemSound(alarm_system_id); //play immediately
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:ALARM_SOUNDED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:ALARM_NOT_SOUNDED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
    [self setIsEmergency];
}

//helper timer method
- (void) alarm {
    AudioServicesPlaySystemSound(alarm_system_id); //hard coded alarm.caf sound
}

- (void) stop_alarm:(CDVInvokedUrlCommand *)command {
    if (self.alarmTimer) {
        [self.alarmTimer invalidate];
        self.alarmTimer = nil;
    }
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:ALARM_STOPPED];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    [self setIsEmergency];
}

- (void) arm_alarm:(CDVInvokedUrlCommand *)command {
    should_sound_alarm = YES;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:ALARM_ARMED];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) disarm_alarm:(CDVInvokedUrlCommand *)command {
    should_sound_alarm = NO;
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:ALARM_DISARMED];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) is_alarm_armed:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:should_sound_alarm];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - recording
- (void) start_recording:(CDVInvokedUrlCommand *)command {
    
    if (!isRecording) { //not recording
    
        isRecording = YES;
        
        NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
        [dateFormatter setDateFormat:@"yyyy-MM-dd-hh:mm"];
        
        NSString *filename = [[[[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) firstObject] stringByAppendingString:@"/Flare-"] stringByAppendingString:[dateFormatter stringFromDate:[NSDate date]]] stringByAppendingString:@".caf"];
        
        //write record code
        NSDictionary* recorderSettings = [NSDictionary dictionaryWithObjectsAndKeys:
                                          [NSNumber numberWithInt:kAudioFormatAppleIMA4],AVFormatIDKey,
                                          [NSNumber numberWithInt:44100],AVSampleRateKey,
                                          [NSNumber numberWithInt:1],AVNumberOfChannelsKey,
                                          [NSNumber numberWithInt:16],AVLinearPCMBitDepthKey,
                                          [NSNumber numberWithBool:NO],AVLinearPCMIsBigEndianKey,
                                          [NSNumber numberWithBool:NO],AVLinearPCMIsFloatKey,
                                          nil];
        NSError* error = nil;
        self.recorder = [[AVAudioRecorder alloc] initWithURL:[NSURL URLWithString:filename] settings:recorderSettings error:&error];
        
        if (error) {
            NSLog(@"failed to make recorder with error %@", error);
            CDVPluginResult *pluginResult= [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:RECORDING_NOT_STARTED];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        
        [self.recorder prepareToRecord];
        [self.recorder record];
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:RECORDING_STARTED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:RECORDING_ALREADY];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
    [self setIsEmergency];
}

- (void) stop_recording:(CDVInvokedUrlCommand *)command {
    
    if (isRecording) {
    
        isRecording = NO;
        
        //stop the recording
        NSLog(self.recorder.isRecording ? @"recording" :@"not recording");
        if (self.recorder && self.recorder.isRecording) {
            [self.recorder stop];
            NSLog(@"successfully recorded %@", [self.recorder.url description]);
        }
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:RECORDING_STOPPED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:RECORDING_NOT_STARTED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
    [self setIsEmergency];
}

- (void) is_recording:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isRecording];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - vibration

- (void)can_vibrate:(CDVInvokedUrlCommand *)command {
    
    //currently no public api to see if device is vibration enabled.
    //as of right now only iPhones are vibration enabled, so we just check if device
    //is an iPhone
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:[[UIDevice currentDevice].model isEqualToString:@"iPhone"]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)arm_vibrator:(CDVInvokedUrlCommand *)command {
    should_vibrate = YES;
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:VIBRATOR_ARMED];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)disarm_vibrator:(CDVInvokedUrlCommand *)command {
    should_vibrate = NO;
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:VIBRATOR_DISARMED];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)start_vibrating:(CDVInvokedUrlCommand *)command {
    
    if ([[UIDevice currentDevice].model isEqualToString:@"iPhone"]) { //can vibrate
        
        int duration = [[command argumentAtIndex:0] intValue];
        if (!duration) return;
        
        int numLoops = duration / 0.4f; //find number of loops we need to run
        
        NSDictionary *userInfo = @{@"numLoops":[NSNumber numberWithInt:numLoops]};
        
        //make the device vibrate
        if (self.vibrateTimer) {
            [self.vibrateTimer invalidate];
        }
        self.vibrateTimer = [NSTimer scheduledTimerWithTimeInterval:(NSTimeInterval) 0.4f
                                                             target:self
                                                           selector:@selector(vibe:)
                                                           userInfo:userInfo
                                                            repeats:YES];
        AudioServicesPlayAlertSound(kSystemSoundID_Vibrate);
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:VIBRATOR_STARTED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:VIBRATOR_NOT_PRESENT];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
    [self setIsEmergency];
    
}

//hackity hack hack hack
- (void)vibe:(NSTimer *)timer {
    if (vibeCount >= [[timer.userInfo objectForKey:@"numLoops"] intValue]) {
        vibeCount = 0;
        [timer invalidate];
        self.vibrateTimer = nil;
        return;
    }
    AudioServicesPlayAlertSound(kSystemSoundID_Vibrate);
    vibeCount++;
}

- (void)stop_vibrating:(CDVInvokedUrlCommand *)command {
    
    if ([[UIDevice currentDevice].model isEqualToString:@"iPhone"]) { //can vibrate
        
        //make device stop vibrating
        [self.vibrateTimer invalidate];
        self.vibrateTimer = nil;
        vibeCount = 0;
        
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:VIBRATOR_STOPPED];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:VIBRATOR_NOT_PRESENT];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }

    [self setIsEmergency];
}

- (void)set_default_vibration_duration:(CDVInvokedUrlCommand *)command {
    default_vibration_duration = [[command argumentAtIndex:0] intValue];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:VIBRATOR_DEFAULT_DURATION_SET];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)get_default_vibration_duration:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:default_vibration_duration];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - rest calls

- (void)set_user_id:(CDVInvokedUrlCommand *)command {
    userID = (NSString *)[command argumentAtIndex:0];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:USER_ID_SET];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)set_access_token:(CDVInvokedUrlCommand *)command {
    accessToken = (NSString *)[command argumentAtIndex:0];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:ACCESS_TOKEN_SET];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
/*
- (void)postLocation {
    
    if (connection) {
        [connection cancel];
        connection = nil;
    }
    
    responseData = [NSMutableData new];
    
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:formatUrl, userID, accessToken]];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:60.0];
    
    [request setHTTPMethod:@"POST"];
    
    NSString *postData = [NSString stringWithFormat:@"latitude=%lf&longitude=%lf", currentLocation.coordinate.latitude, currentLocation.coordinate.longitude];
    
    NSLog(@"%@", postData);
    
    [request setValue:@"application/x-www-form-urlencoded; charset=utf-8" forHTTPHeaderField:@"Content-Type"];
    
    [request setValue:accessToken forHTTPHeaderField:@"Authorization"];
    
    //set post data of request
    [request setHTTPBody:[postData dataUsingEncoding:NSUTF8StringEncoding]];
    
    NSLog(@"request: %@", request);
    
    connection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
    
    [self setIsEmergency];
    
}

- (void) stop_posting_location:(CDVInvokedUrlCommand *)command {
    
    if (self.locationTimer) {
        [self.locationTimer invalidate];
        self.locationTimer = nil;
    }
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:STOPPED_POSTING_LOCATION];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    [self setIsEmergency];
}*/

- (void) setIsEmergency {
    isEmergency = isRecording || self.alarmTimer || self.vibrateTimer;
}

- (void) is_emergency:(CDVInvokedUrlCommand *)command {
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isEmergency];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) check_locservices:(CDVInvokedUrlCommand *)command {
    BOOL locationServicesEnabled = [CLLocationManager authorizationStatus] != kCLAuthorizationStatusDenied
                && [CLLocationManager authorizationStatus] != kCLAuthorizationStatusRestricted
                && [CLLocationManager locationServicesEnabled];
    
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:locationServicesEnabled];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}


@end
