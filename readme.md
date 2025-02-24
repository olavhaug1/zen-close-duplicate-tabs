# Close duplicate tabs button for Zen browser

Adds a "Close Duplicate Tabs" option to the new tab button's context menu. This mirrors Firefox's feature to close all duplicate tabs across the browser, unlike [Zen](https://zen-browser.app/ "Zen Browser"), which only lets you close duplicates of a single tab via right-click.

It uses, and is dependent on [fx-autoconfig](https://github.com/MrOtherGuy/fx-autoconfig).

There is also a keyboard shortcut for closing duplicate tabs, currently set to <kbd>⌃ Control</kbd> + <kbd>⇧ Shift</kbd> + <kbd>U</kbd>. The shortcut can easily be changed to something else by changing the `key` and `modifier` of the object that is sent to `UC_API.Hotkeys.define()`.

```js
    // Keyboard shortcut
    const shortcut = {
        id: "closeDuplicateTabs",
        key: "U",
        modifiers: "ctrl shift",
        ...

    UC_API.Hotkeys.define(shortcut)...
```

## How to use and install

### Prerequisites

* Set up userChrome (involves changing settings in about:config and creating a chrome folder in the active browser profile). A guide that might be outdated: [Customizing the Firefox UI with CSS](https://www.reddit.com/r/firefox/wiki/userchrome/)
* Install fx-autoconfig and follow the install steps

### Install

* Copy the folders "CSS", "JS" and "resources" to the browsers chrome folder inside the active or preferred profile
  * On Windows it is typically located here: "%AppData%\zen\Profiles\\`{some-name}`.Default\chrome"
* Restart the browser

## Preview

![preview](preview.png)
