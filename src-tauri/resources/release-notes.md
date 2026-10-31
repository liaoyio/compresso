## Release Notes

## 0.1.90

What's new:

- You can now use a custom speed
- You can now use a custom FPS
- You can now use a custom scale

## 0.1.81

What's new:

- Added support for more video formats: .mp4, .avi, .mkv, .mov, .flv, .wmv, .mpg, .mpeg, .ts, .m2ts, .webm, .ogg, .ogv, .3gp, .asf, .m4v, .mxf, .vob, .gif

## 0.1.78

What's new:

- You can now set a maximum file size for your compressed videos. This is great for Discord, email services, and other places that have size limits.

## 0.1.77

What's new:

- You can now trim videos. Click the file in the list before you start compression to trim the video.

What's changed:

- The "Start compression" button in the file list has changed from a Play icon to a "GO" button. It does the same thing, but less confusing.

What's fixed:

- The playhead in the comparison slider now moves when you play the video.

## 0.1.76

What's new:

- We have a new help site at https://docs.compresso.app
- You can now click the `i` icon in the Settings sidebar to read about each setting.
- You can now click "Help & Docs" in the Account menu to get to the help site.

## 0.1.74

What's improved:

- You will now see an error if Compresso can't read your video

What's fixed:

- The speed dropdown would sometimes not show the selected value

What's new:

- You can now downscale to a specific width or height in pixels.

## 0.1.73

What's new:

- Batches of videos now compress one by one for better CPU efficiency.
- You can now see the estimated compressed size while compressing.
- Compress, show in folder, and remove from list buttons are now in the file list.
- You can now keep the original video metadata
- The settings sidebar now appears to the right of the file list.

What's changed:

- Videos no longer compress automatically when you add them.

What's improved:

- You can now copy the email address for support to your clipboard.

### 0.1.72

What's improved

- The file list now has more space for big file sizes.
- More polish on the UI.

What's fixed

- Fixed a bug where the original file size would be shown as NaN in some cases on Windows 10 in non-English locales.

### 0.1.71

What's fixed:

- The Boost button looked weird in light mode. It now looks less weird.
- The Getting Started video did not play for some users. It now plays for everyone as long as they have an internet connection.

### 0.1.70

What's changed:

- The Account button packed its stuff and moved to the top right corner.

What's new:

- You can now disable Boost to decrease CPU usage. This is great if you want to use other apps while compressing.
- You can now reset settings to the default settings. Use the button in the top of the settings sidebar.

What's improved:

- The settings sidebar is now more compact
- The scroll bar in settings no longer covers the settings

### 0.1.69

What's new:

- You can now see what's new in the app by clicking the Account icon in the lower left corner.
- You can now reset the quality setting

What's improved:

- The file list now shows video sizes as **kB**, **MB**, and **GB** instead of just **MB**.
- The standard compression setting is now slightly higher quality and larger file, matching Rotato Compress on the web.
- Compression with standard settings is now slightly faster and uses slightly less CPU/battery. We're working on GPU acceleration for the future.
- We redesigned the settings sidebar to make it easier to find everything you need.

What's fixed:

- Fixed a bug where a video file with multiple extensions (e.g. `video.final.done.mp4`) would cause the output file to have the wrong name.
- Fixed a bug where a gigabyte would be shown as **1 B** rather than **1 GB**.
- Fixed a bug where the frame rate would be set to 25 when it should have been whatever the original frame rate was.
