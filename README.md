# JSON Formatter for Chrome
### Installing the extension

To install the plugin open the extensions tab by clicking the 'burger' menu in Chrome, which can be found in the top-right of the window just below the Close icon. Select More tools->Extensions. Another way is to open a new tab and type [chrome://extensions/](chrome://extensions/)

Once the extensions tab is open click the 'Load unpacked extension...' button and locate the directory where you saved you extension files. If all is well the page will refresh and you will see your extension listed.

The icon specified in the manifest will be displayed on the toolbar. Right-click the icon to remove the extension or hide it from the toolbar

### Running the extension

To run the extension simply navigate to a URL that matches the pattern defined in the manifest.json and you should see the JSON nicely formatted.

### Git commands for basic workflow
1. git remote add origin https://github.com/jmwollny/json
2. git checkout master
3. git checkout -b new-branch
4. git add .
5. git commit -m "commit message goes here"
6. git push origin new-branch
7. git checkout master
8. git pull origin master
