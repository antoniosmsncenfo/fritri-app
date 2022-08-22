import io.appium.java_client.MobileBy;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class Fritri_Auto {

    public AndroidDriver<MobileElement> driver;
    public WebDriverWait wait;

    @BeforeMethod
    public void setup() throws MalformedURLException {
        DesiredCapabilities caps = new DesiredCapabilities();
        caps.setCapability("deviceName", "FritriPhone");
        caps.setCapability("udid", "emulator-5554"); //DeviceId from "adb devices" command
        caps.setCapability("platformName", "Android");
        caps.setCapability("platformVersion", "11.0");
        caps.setCapability("noReset", "false");
        driver = new AndroidDriver<MobileElement>(new URL("http://127.0.0.1:4723/wd/hub"), caps);
        wait = new WebDriverWait(driver, 10);

    }

    @Test
    public void loginSuccess() throws InterruptedException {
    /*    //Click and pass Splash
        driver.findElementByAccessibilityId("FRITRI-APP").click();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
*/
        driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]").click();

        MobileElement mail = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]");
        mail.sendKeys("antoniosmsn@hotmail.com");

        driver.findElementByXPath(" //android.widget.ScrollView[@content-desc=\"Block\"]/android.view.ViewGroup").click();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        MobileElement pass = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[2]");
        pass.sendKeys("aaAA11");

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[3]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath(" //android.widget.ScrollView[@content-desc=\"Block\"]/android.view.ViewGroup").click();

        //Create trip
        driver.findElementByXPath("(//android.widget.TextView[@content-desc=\"Text\"])[4]").click();

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[1]").click();

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Block\"])[1]/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView").click();
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[2]").click();
        //Scroll
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(100000)"));

        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));

        //LOgout
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[6]").click();
        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]").click();

    }

    @Test
    public void loginFailed() throws InterruptedException {
        //Click and pass Splash
        driver.findElementByAccessibilityId("FRITRI-APP").click();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

        driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]").click();

        MobileElement mail = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]");
        mail.sendKeys("FRITRI@email.com");

        driver.findElementByXPath(" //android.widget.ScrollView[@content-desc=\"Block\"]/android.view.ViewGroup").click();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        MobileElement pass = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[2]");
        pass.sendKeys("123");

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[3]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button ").click();

    }

    @Test
    public void createTrip() throws InterruptedException {
    /*    //Click and pass Splash
        driver.findElementByAccessibilityId("FRITRI-APP").click();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
*/
        driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]").click();
        MobileElement mail = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]");
        mail.sendKeys("antoniosmsn@hotmail.com");

        driver.findElementByXPath(" //android.widget.ScrollView[@content-desc=\"Block\"]/android.view.ViewGroup").click();
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

        MobileElement pass = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[2]");
        pass.sendKeys("aaAA11");

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[3]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath(" //android.widget.ScrollView[@content-desc=\"Block\"]/android.view.ViewGroup").click();

        //Create trip
        driver.findElementByXPath("(//android.widget.TextView[@content-desc=\"Text\"])[4]").click();

        driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]").click();
        MobileElement name = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[1]");
        name.sendKeys("TEST 4.5 QA");

        driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[2]").click();
        MobileElement destino = (MobileElement)  driver.findElementByXPath("(//android.widget.EditText[@content-desc=\"Input\"])[2]");
        destino.sendKeys("Limón Costa RIca");

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Block\"])[2]").click();


        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[3]/android.view.ViewGroup/android.view.View").click();
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(100000)"));

        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Block\"])[13]/android.view.ViewGroup/android.view.ViewGroup").click();

        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[3]/android.view.ViewGroup/android.view.View").click();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Block\"])[17]/android.view.ViewGroup/android.view.ViewGroup").click();
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[2]/android.view.ViewGroup/android.view.View").click();
        driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Block\"])[17]/android.view.ViewGroup/android.view.ViewGroup").click();
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[2]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[2]/android.view.ViewGroup/android.view.View").click();

        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button").click();
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));
        driver.findElementByXPath("(//android.widget.ImageView[@content-desc=\"Image\"])[6]").click();
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[4]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[5]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[2]").click();

        //Scroll
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));
        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[3]/android.view.ViewGroup/android.view.View").click();
        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[2]").click();

        driver.navigate().back();




         /* driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));

        driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[6]").click();
        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]").click();



        //Scrolls
        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(100000)"));

        driver.findElement(MobileBy.AndroidUIAutomator(
                "new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(100000)"));

        //LOgout
     driver.findElementByXPath("(//android.view.ViewGroup[@content-desc=\"Button\"])[6]").click();
        driver.findElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.Button[1]").click();
*/
    }


    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
