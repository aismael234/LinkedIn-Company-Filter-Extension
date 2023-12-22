# Installation
1. Download this project as a ZIP using the green "Code" button on the upper right.
2. Unzip the folder.
3. Follow the instructions (provided by Chrome) to load an unpacked extension: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked.

# Usage
1. The extension will trigger automatically upon searching the LinkedIn job boards (https://linkedin.com/jobs/search).

2. You can press the "↻" (Refresh) button to manually trigger the extension after adding a new company name.

## Potential Bugs
During development, there were times when an infinite page reload loop would occur. Most causes have been fixed, but there may be a slight chance that it will occur again (all edges cases may not have been covered, particularly concerning Regex matching).
