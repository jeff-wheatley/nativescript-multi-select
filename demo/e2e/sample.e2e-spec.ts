import { AppiumDriver, createDriver, SearchOptions } from "nativescript-dev-appium";
import { assert } from "chai";

let confirmText = "CONFIRM";
const selectText = "select";

describe("sample scenario", () => {
    const defaultWaitTime = 5000;
    let driver: AppiumDriver;

    before(async () => {
        driver = await createDriver();
        confirmText = driver.nsCapabilities.device.platform === "android" ? confirmText : confirmText.toLowerCase();
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            await driver.logTestArtifacts(this.currentTest.title);
        }
    });

    it("should launch the multi select dialog", async () => {
        const btnTap = await driver.waitForElement("select");
        await btnTap.click();

        const confirmButton = await driver.waitForElement(confirmText);
        assert.equal(await confirmButton.text(), confirmText);
    });

    it("should select c item and click confirm", async () => {
        const itemTap = await driver.waitForElement("C");
        await itemTap.click();

        const confirmButton = await driver.waitForElement(confirmText);
        await confirmButton.click();

        const lblMessage = await driver.waitForElement("moi-c");
        assert.equal(await lblMessage.text(), "moi-c");
    });

    it("should remove a item and click confirm", async () => {
        const btnTap = await driver.waitForElement(selectText);
        await btnTap.click();

        const itemTap = await driver.waitForElement("A");
        await itemTap.click();

        const confirmButton = await driver.waitForElement(confirmText);
        await confirmButton.click();

        const listView = await driver.findElementsByText("moi", SearchOptions.contains);

        assert.equal(await listView.length, 2);
    });

    it("should cancel selection", async () => {
        const btnTap = await driver.waitForElement(selectText);
        await btnTap.click();

        let itemTap = await driver.waitForElement("D");
        await itemTap.click();

        itemTap = await driver.waitForElement("A");
        await itemTap.click();

        const confirmButton = await driver.waitForElement("cancel");
        await confirmButton.click();

        const listView = await driver.findElementsByText("moi", SearchOptions.contains);

        assert.equal(await listView.length, 2);
    });
});