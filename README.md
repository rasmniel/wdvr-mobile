# IONIC SETUP PROCESS
- npm install ionic -g
- npm install cordova -g
- ionic serve

# IONIC BUILD PROCESS
- npm install && bower install
- cordova platform add android/ios
- ionic resources
- cordova prepare
- ionic build android/ios

#POSSIBLE AFRAME 0.3.2 ALTERATIONS FOR MOBILE
- Line 65820: Altered isGearVR function to always return true to allow GearVR functionality execution and thus avoiding a-scene black screen lock on VR mode.
- Obsolete AFRAME 0.3.2 alterations:
    - Line 62636: Uncomment if statement with screen.orientation.lock() invocation.
    - Line 66477: Encapsulate bounds assignment in if statements to check whether there is actually a 'layer.leftBounds/layer.rightBounds' before calling .length on object.

# SCREEN MIRROR
- Screen Mirror must run on casting device.
- Install application on devices as part of deployment process.
- .apk included in repository.