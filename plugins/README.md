# Plugins
Contains the lifecycle plugins for `bumpup`.

## Writing your own plugin
For details see the included plugins in this folder.

To write your own plugin you need to distribute it as an npm package that exposes one ore more functions at it's 
entry point. (See the section of each lifecycle below to see which function(s) need to be exposed)

### version
```javascript
// Takes no input and returns a version string
export const getLastVersion = () => '1.0.0';
```

### type
```javascript
// Takes the current version and returns the type of change.
export const getType = version => 'patch';

// Takes the new version and records it somewhere
// The @bumpup/type-git plugin uses this step to find all changes since the current version by writing the version to the git log.
// however this lifecycle step is not needed for every plugin, in that case just export an empty function
export const record = version => {};
```

### determine
```javascript
// Takes the type and returns a function that takes the current version and returns the new version
export const determine = type => version => '1.0.1'
```

### bump
```javascript
// Takes the version and bumps the version where necessary
export const record = version => console.log(version);
```
