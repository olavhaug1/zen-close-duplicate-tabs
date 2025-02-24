// ==UserScript==
// @include *
// @name    Add "Close Duplicate Tabs" Button to New Tab context menu(s)
// @namespace   closeDuplicateTabs
// ==/UserScript==

(() => {
    const getGBrowser = () => window.gBrowser || window._gBrowser || null;
    const duplicateTabsExist = () => getGBrowser() && getGBrowser().getAllDuplicateTabsToClose().length > 0;

    const createMenuItem = (id) => {
        if (document.getElementById(id)) return null;

        return window.MozXULElement.parseXULToFragment(`
            <menuitem id="${id}"
                class="menu-item-close-duplicate-tabs"
                label="Close Duplicate Tabs"
                data-lazy-l10n-id="tab-context-close-duplicate-tabs"
                accesskey="U"
                disabled="${!duplicateTabsExist()}"
            />
            <menuseparator />
        `);
    };

    const insertMenuItem = (menu, id) => {
        if (!menu) {
            return;
        }
        const element = createMenuItem(id);
        attachClickListener(id);
        if (element) {
            menu.insertBefore(element, menu.firstElementChild);
        }
    };

    const addContextMenuItem = () => {
        const menu = document.getElementById("new-tab-button-popup");
        insertMenuItem(menu, "new-tab-button-popup_context_closeDuplicateTabs");
    };

    const addLongPressMenuItem = () => {
        const longPressMenus = [
            document.querySelector("#new-tab-button > .new-tab-popup"),
            document.querySelector("#tabs-newtab-button > .new-tab-popup")
        ];

        longPressMenus.forEach((menu, index) => {
            insertMenuItem(menu, `new-tab-popup_context_closeDuplicateTabs-${index}`);
        });
    };

    const handleMutation = () => {
        if (!getGBrowser()) return;

        addContextMenuItem();
        addLongPressMenuItem();
    };

    UC_API.Runtime.startupFinished().then(() => {
        const observer = new MutationObserver(handleMutation);
        observer.observe(document, { childList: true, subtree: true });
    });

    // Keyboard shortcut
    const shortcut = {
        id: "closeDuplicateTabs",
        key: "U",
        modifiers: "ctrl shift",
        command: () => {
            const gBrowser = getGBrowser();
            if (gBrowser) {
                removeDuplicatesAndNotify();
            }
        }
    };

    UC_API.Hotkeys.define(shortcut).autoAttach({ suppressOriginalKey: true });

    function removeDuplicatesAndNotify() {
        const gBrowser = window.gBrowser || window._gBrowser;
        if (!gBrowser) return;

        const duplicateTabs = gBrowser.getAllDuplicateTabsToClose();
        const duplicateCount = duplicateTabs.length;

        if (duplicateCount > 0) {
            gBrowser.removeAllDuplicateTabs();
            showClosedTabsNotification(duplicateCount);
        }
    }

    function attachClickListener(menuItemId) {
        const menuItem = document.getElementById(menuItemId);
        if (menuItem && !menuItem.hasListenerAttached) {
            menuItem.addEventListener("command", removeDuplicatesAndNotify);
            menuItem.hasListenerAttached = true;
        }
    }

    function showClosedTabsNotification(closedTabCount) {
        if (closedTabCount === 0) return;

        const panelId = "duplicate-tabs-confirmation-hint";

        const existingPanel = document.getElementById(panelId);
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = createNotification(panelId, closedTabCount);

        if (!panel) return;

        document.documentElement.appendChild(panel);

        const anchor = document.getElementById("tabs-newtab-button");
        panel.openPopup(anchor, "before_start", 0, 0, false, false);

        setTimeout(() => {
            panel.hidePopup();
            panel.remove();
        }, 2000);
    }

    const createNotification = (panelId, closedTabCount) => {
        const panel = document.getElementById("confirmation-hint").cloneNode(true);
        if (!panel) return
        panel.id = panelId;
        panel.setAttribute("tabspecific", "false");
        panel.setAttribute("hasbeenopened", "true");
        panel.setAttribute("animate", "open");
        panel.setAttribute("panelopen", "true");

        const hbox = panel.querySelector(`#${panelId} > hbox`);
        hbox.id = "duplicate-tabs-confirmation-hint-checkmark-animation-container";
        hbox.setAttribute("animate", "true");

        const image = hbox.querySelector(`#${panelId} > hbox > image`);
        image.id = "duplicate-tabs-confirmation-hint-checkmark-image";

        const vbox = panel.querySelector(`#${panelId} > vbox`);
        vbox.id = "duplicate-tabs-confirmation-hint-message-container";

        const label = vbox.querySelector(`#${panelId} > vbox > label`);
        label.id = "duplicate-tabs-confirmation-hint-message";
        label.setAttribute("data-l10n-args", `{"tabCount": ${closedTabCount}}`);

        return panel;
    }
})();
