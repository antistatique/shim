# ABOUT SHIM
Shim is a node.js app that enables simultaneous, synced web surfing across a variety of devices and browsers.

Shim was developed by the Boston Globe Media Lab (twitter: @GlobeLab) as a timesaving way to see how its web sites render on a variety of gadgets & browsers. It works by tweaking Wifi to enable the easy synchronization of browsing sessions across several devices, with no client configuration needed.

This makes cross-browser and cross-device testing much easier. With one click, it's possible to see a page rendered on devices of varying screen size, input technology, etc.

Imagine a group of people browsing using a variety of devices, all connected to a single Wifi access point that's running Shim. Whenever one of them clicks on a link, all the others will be automatically redirected to the linked page. 

There is no device-specific configuration required, so even simple gadgets can synchronize. We've tested this so far with iPad, iPhone, Nexus S, Samsung Galaxy Tab, Motorola Xoom, Kindle 3, Barnes & Noble Color Nook, Windows Phone 7 and a variety of desktop browsers, but it should work on most current devices that have a Javascript-enabled web browser.

We've achieved this by turning on Internet Sharing on a stock Mac Book Pro, then modifying it at the system level to act as a transparent proxy. The laptop intercepts all wifi traffic and redirects it to a custom node.js server, which inserts a javascript "shim" at the head of each web page that is visited. The shim, once loaded in a device's browser, opens and maintains a socket connection to the server. Whenever a new page is requested, the page's url is broadcast to all connected browsers, which then redirect themselves to that url, keeping all devices in sync.

There have been a few requests to use the tool, so we're open sourcing it for all to use. Please feel free to modify it as you wish. We ask that you keep this "ABOUT SHIM" section at the the top of the README file. THANKS!

Shim was written in 2011 by Chris Marstall, Creative Technologist at the Boston Globe.

## REQUIREMENTS
* Shim must be installed on a 10.6 Mac with both wired *and* wireless network interfaces (for example, a newer stock MacBook). The wired interface will be used to communicate with the internet; the wireless interface will be used to serve pages to devices. Shim doesn't yet work on OS X Lion (10.7).

INSTALLING SHIM
1 download and install the OS X NodeJS package: http://sites.google.com/site/nodejsmacosx
2 git clone git://github.com/marstall/shim.git
3 cd shim
4 sudo ./setup.sh
5 Under Control Panel/Sharing, turn on Internet Sharing (select "Share your connection from [Ethernet] To Computers using [Airport]")
5 restart your Mac
6 cd shim
7 sudo ./configure_proxy.sh 


## RUNNING SHIM
cd shim
node shim.js

USING SHIM
1. Connect a given device to the SHIM server's Wifi AP.
2. On that device, google the word "attach" 
3. You should be automagically sent directly to the shim homepage, which prompts you to enter a url
4. Enter any url - your browser will be redirected there.
5. Grab other devices & google "attach" on them - they should be redirected to the same url.
6. On any attached device, click on a link. All devices should navigate to that page.
7. to reset all devices to the Shim homepage, google "shimreset"

## BOOKMARKLET
The easiest way to start synchronization after connecting devices is to use our bookmarklet. Just click it & all connected devices will be synced to the current page in your browser. To install the bookmark on a connected device, google "shimreset". Your browser should be redirected to the shim homepage, which has a link to the bookmarklet that you can drag to your bookmarks bar.

## MANUAL MODE
To set the current page, you can also simply just append the query parameter 's:33t' to any url. So http://foo.com would become http://foo.com/?s:33t . This will cause all currently attached devices to redirect to that url.

## SLIDESHOW/AUTOMATION MODE
If Shim finds a properly formatted <slideshow> object in config.json, it will rotate through any pages you specify, at a given interval. This can be used simply as a screensaver or demo mode. It may also be useful to do Selenium-style browser automation across several devices. Shim ships with an example values for the slideshow in <config.json.example>. Copy that file to <config.json> and restart Shim. After 10 seconds, you should see boston.com/news pop up on your connected devices, which will then rotate through different pages on boston.com every 10 seconds. Modify the values in the <config.json> to direct the slideshow to your own pages. The values are as follows: 
	INTERVAL: the number of milliseconds to wait before switching. Ex: "interval":10000
	PATH_BASE: if all your urls are on the same domain, you can enter the first part of the url here, starting with "http://", so you don't have to repeat it several times. Ex: "path_base":"http://www.boston.com/"
	PATHS: A json array of urls or partial urls to visit. The value of "path_base", if it is not blank, will be prepended to these. Exs: "paths":["news","sports"] or "paths":["http://www.boston.com/news","http://www.bostonglobe.com/sports"]

## SHARED COOKIES
By default, all cookies delivered by a server to any of the devices will be shared across all devices. This means you only have to log in on one browser, and all the others will automatically be logged in in the next request. To exclude a given cookie from the shared pool, add its name to the "excluded_cookies" object in <config.json> and restart Shim.

## CONFIG FILE
Shim will work without a config file. However, if you want to add a slideshow or do some basic cookie management, you should create a config file in the Shim home directory and call it <config.json>. The easiest way is to rename <config.json.template> to <config.json> and modify it to suit your needs. 

## AFTER A SYSTEM RESTART
run ./configure_proxy.sh

## UNINSTALLING SHIM

To uninstall Shim, do the following

$ sudo vi /etc/sysctl.conf
	# remove the following lines from the file:
	net.inet.ip.forwarding=1
	net.inet.ip.fastforwarding=1
	net.inet.ip.fw.enable=1
	net.inet.ip.fw.verbose=1
	net.inet.ip.scopedroute=0

$ sudo ipfw delete 02000 

then, restart - all network configurations should be reversed now. you may also wish to uninstall node.js, NPM, and the NPM packages installed in setup.sh
