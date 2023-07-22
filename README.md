# LetterBoard
LetterBoard is a TS/JS client side utility to open a customisable On Screen Keyboard (OSK) on any input or text box.

# Note
LetterBoard may not fully support TextAreas but the fix should be trivial.

# Usage
First include both the JS and CSS files in your project \
Simply add the initiator function to an onclick event from an input
```js
<input type="text" onclick="openOSK(this);"/>
```
And then when the box is clicked, the keyboard should open (and close if you click in the corners of it) \
It automatically brings the selected text field to the top of the screen and returns it once you are done typing.

# Demo
Before Clicked \
![image](https://github.com/roundsToThree/LetterBoard/assets/70044940/46efb6a5-579f-422d-afe0-c8d59694ca76)
After Clicked \
![image](https://github.com/roundsToThree/LetterBoard/assets/70044940/f9e01df1-88b7-4c37-9eb0-0a04e4b420df)
