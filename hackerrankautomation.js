require("chromedriver");
let swd       = require("selenium-webdriver");
let browser   = new swd.Builder();
let codeArray = [];

//  credentials
let { email, pass } = require("./credentials.json");
// tab/driver -> new tab

let tab = browser.forBrowser("chrome").build();
let promiseTabWillBeOpened = tab.get("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");

promiseTabWillBeOpened
    .then(function () {
        // implicit timeout
        let findTimeOutP = tab.manage().setTimeouts({
            implicit: 10000
        });
        return findTimeOutP;
    })
    .then(function () {
        // find an element
        // finding username textbox
        let promiseOfInputBoxUsername = tab.findElement(swd.By.css("#input-1"));
        return promiseOfInputBoxUsername;
    })
    .then(function (inputBoxUser) {
        // enter data
        let promiseOfFilledInputBoxUser = inputBoxUser.sendKeys(email);
        return promiseOfFilledInputBoxUser;
    })
    .then(function () {
        console.log("username entered!");
    })
    .then(function () {
        // finding password textbox
        let promiseOfInputBoxPassword = tab.findElement(swd.By.css("#input-2"));
        return promiseOfInputBoxPassword;
    })
    .then(function (inputBoxPass) {
        let promiseOfFilledInputBoxPass = inputBoxPass.sendKeys(pass);
        return promiseOfFilledInputBoxPass;
    })
    .then(function () {
        console.log("password entered!");
    })
    .then(function () {
        let promiseOfLogInButn = tab.findElement(swd.By.css("button[data-analytics='LoginPassword']"));
        return promiseOfLogInButn;
    })
    .then(function (logInBtn) {
        let promiseOfLogInClick = logInBtn.click();
        return promiseOfLogInClick;
    })
    .then(function () {
        console.log("Logged in successfully.")
    })
    .then(function () {
        // interview prep button
        let promiseOfInterviewPrepBtn = tab.findElement(swd.By.css("#base-card-1-link"));
        return promiseOfInterviewPrepBtn;
    })
    .then(function (interviewPrepBtn) {
        let promiseOfInterviewPrepBtnClick = interviewPrepBtn.click();
        return promiseOfInterviewPrepBtnClick;
    })
    .then(function () {
        console.log("clicked interview prep button.");
    })
    .then(function () {
        //warm up button selecting
        let promiseOfWarmUpBtn = tab.findElement(swd.By.css("a[data-attr2='interview-preparation-kit']"));
        return promiseOfWarmUpBtn;

    })
    .then(function (warmUpBtn) {
        let promiseOfWarmUpBtnClick = warmUpBtn.click();
        return promiseOfWarmUpBtnClick;
    })
    .then(function(){
        console.log("Clicked warm up button.");
        let promiseOfAllQueBtns = tab.findElements(swd.By.css("a.js-track-click.challenge-list-item"));
        return promiseOfAllQueBtns;
    })
    .then(function(allQuesBtns){
        let promiseOfAllQueLinks = allQuesBtns.map(function (anchor) {
            return anchor.getAttribute("href");
        })
        let promiseOfAllLinks = Promise.all(promiseOfAllQueLinks);
        return promiseOfAllLinks;
    })
    .then(function(allQuesLinks){
        // execution of all promises serially
        let promiseOfFirstQ = questionSolver(allQuesLinks[0]);
        for (let i = 1; i < allQuesLinks.length; i++) {
            promiseOfFirstQ = promiseOfFirstQ.then(function () {
                return questionSolver(allQuesLinks[i])
            })
        }
        let promiseOfLastQ = promiseOfFirstQ;
        return promiseOfLastQ;
    })
    .then(function () {
        console.log("All Questions solved");
    })
    .catch(function(err){
        console.log("ERROR "+ err + " HAS OCCURRED!");
    })

function questionSolver(url){
    return new Promise(function(resolve,reject){
        // logic for solving questions
        let promiseOfQuesPageOpen = tab.get(url);
        promiseOfQuesPageOpen.then(function(){
            let promiseOfEditorial = tab.findElement(swd.By.css("a[data-attr2='Editorial']"));
            return promiseOfEditorial;
        })
            .then(function (editorial) {
                let promiseOfEditorialClicked = editorial.click();
                return promiseOfEditorialClicked;
            })
            .then(function () {
                // check if there is alock icon
                let promiseOfLockIcon = handleLockButton();
                return promiseOfLockIcon;
            })
            .then(function () {
                // get all languages array
                let promiseOfCodeCopied = copyTheCode();
                return promiseOfCodeCopied;
            })
            .then(function (code) {
                let promiseOfCodePasted = pasteCode(code);
                return promiseOfCodePasted;
            })
            .then(function(){
                resolve();
            })
            .catch(function(err){
                console.log("An error " + err + " has occured.");
                reject(err);
            })
    })
}
   

function handleLockButton(){
    return new Promise(function(resolve,reject){
        let promiseOfLockBtn = tab.findElement(swd.By.css(".ui-btn.ui-btn-normal.ui-btn-primary"));
        promiseOfLockBtn
        .then(function(lockBtn){
            let promiseOfLockBtnClicked = lockBtn.click();
            return promiseOfLockBtnClicked;
        })
        .then(function(){
            resolve();
        }).catch(function(){
            console.log("Lock button was not found.");
            resolve();
        })
    })
}
function copyTheCode(){
    return new Promise(function (resolve, reject) {
        // all name
        let promiseAllLangElement = tab.findElements(swd.By.css(".hackdown-content h3"));
        // get all the code array
        let promiseAllcodeEement = tab.findElements(swd.By.css(".hackdown-content .highlight"));
        let promiseOfBothArrays = Promise.all([promiseAllLangElement, promiseAllcodeEement]);
        promiseOfBothArrays
            .then(function (bothArrays) {
                let langElements = bothArrays[0];
                globalCodeElements = bothArrays[1];
                let promiseAllLangText = [];
                for (let i = 0; i < langElements.length; i++) {
                    let promiseCurLang = langElements[i].getText();
                    promiseAllLangText.push(promiseCurLang);
                }
                return Promise.all(promiseAllLangText);
            })
            .then(function (allLangs) {
                let promiseOfCPP;
                for (let i = 0; i < allLangs.length; i++) {
                    if (allLangs[i].includes("C++")) {
                        promiseOfCPP = globalCodeElements[i].getText();
                        break;
                    }
                }
                return promiseOfCPP;
            }).then(function (code) {
                console.log(code)
                resolve(code);
            }).catch(function (err) {
                console.log("oops! error has occurred.")
                reject(err);
            })
    });
}

// clicking on problem tab, pasting code in custom input box, cutting already existing code, pasting code from custom input box to main textbox 

function pasteCode(code) {
    return new Promise(function (resolve, reject) {
        // click on problem tab
        let promiseOfProblemTab = tab.findElement(swd.By.css("li#Problem"));
        promiseOfProblemTab.then(function (problemTab) {
            let promiseOfProblemTabClicked = problemTab.click();
            return promiseOfProblemTabClicked;
        }).then(function () {
            let promiseOfInputBox = tab.findElement(swd.By.css(".custom-input-checkbox"));
            return promiseOfInputBox;
        }).then(function (inputBox) {
            let promiseOfInputBoxClicked = inputBox.click();
            return promiseOfInputBoxClicked;
        }).then(function () {
            let promiseOfCurInputSelected = tab.findElement(swd.By.css(".custominput"));
            return promiseOfCurInputSelected;
        }).then(function (curInputBox) {
            globalCurInputBox = curInputBox;
            let promiseOfCodeSent = curInputBox.sendKeys(code);
            return promiseOfCodeSent;
        }).then(function () {
            let promiseOfCTRLA = globalCurInputBox.sendKeys(swd.Key.CONTROL + "a");
            return promiseOfCTRLA;
        }).then(function () {
            let promiseOfCTRLX = globalCurInputBox.sendKeys(swd.Key.CONTROL + "x");
            return promiseOfCTRLX;
        })
            .then(function () {
                let promiseOfTextArea = tab.findElement(swd.By.css("textarea"));
                // console.log(2);
                return promiseOfTextArea;
            }).then(
                function (textArea) {
                    globalTextArea = textArea;
                    let promiseOfCodeSel = textArea.sendKeys(swd.Key.CONTROL + "a");
                    // console.log(3);
                    return promiseOfCodeSel;
                }).then(function () {
                    let promiseOfCTRLV = globalTextArea.sendKeys(swd.Key.CONTROL + "v");
                    return promiseOfCTRLV;
                }).then(function () {
                    let promiseOfSubmitCodeBtn = tab.findElement(swd.By.css("button.hr-monaco-submit"));
                    return promiseOfSubmitCodeBtn;
                }).then(function (submitBtn) {
                    let promiseOfSubmitBtnClicked = submitBtn.click();
                    return promiseOfSubmitBtnClicked;
                })
            .then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            })
       
    })
}

//elem.send_keys(Keys.CONTROL, 'a') #highlight all in box
// elem.send_keys(Keys.CONTROL, 'c') #copy
// elem.send_keys(Keys.CONTROL, 'v') #paste
