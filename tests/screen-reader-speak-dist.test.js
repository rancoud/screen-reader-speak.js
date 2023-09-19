const dateNow = 1479427200000;

jest.useFakeTimers({now: dateNow});

describe("screen-reader-speak", function(){
    beforeEach(function() {
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        require("../dist/screen-reader-speak");
    });

    function getFirstDivInBody() {
        return document.getElementsByTagName("div")[0];
    }

    it("should be defined", () => {
        expect(window.screenReaderSpeak).toBeDefined();
    });

    it("should add div in body", () => {
        let err = window.screenReaderSpeak("sample");
        expect(err).toBeUndefined();

        jest.clearAllTimers();

        const div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        expect(div.getAttribute("id")).toBe("speak-" + dateNow);
        expect(div.getAttribute("class")).toBe("sr-only");
        expect(div.innerHTML).toBe("");
    });

    it("should add text in div after 100ms", () => {
        let err = window.screenReaderSpeak("sample 100ms");
        expect(err).toBeUndefined();

        jest.advanceTimersByTime(100);
        jest.clearAllTimers();

        const div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        expect(div.getAttribute("id")).toBe("speak-" + dateNow);
        expect(div.getAttribute("class")).toBe("sr-only");
        expect(div.innerHTML).toBe("sample 100ms");
    });

    it("should delete div in body after 1000ms", () => {
        let err = window.screenReaderSpeak("sample 1000ms");
        expect(err).toBeUndefined();

        jest.advanceTimersByTime(100);
        const div = getFirstDivInBody();
        expect(div.innerHTML).toBe("sample 1000ms");

        jest.advanceTimersByTime(1000);
        jest.clearAllTimers();

        expect(getFirstDivInBody()).toBeUndefined();
    });

    it("should return TypeError for text argument", () => {
        let err;

        err = window.screenReaderSpeak(1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get number");
        jest.clearAllTimers();

        err = window.screenReaderSpeak(true);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get boolean");
        jest.clearAllTimers();

        err = window.screenReaderSpeak(false);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get boolean");
        jest.clearAllTimers();

        err = window.screenReaderSpeak([]);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get object");
        jest.clearAllTimers();

        err = window.screenReaderSpeak({});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get object");
        jest.clearAllTimers();

        err = window.screenReaderSpeak(NaN);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get number");
        jest.clearAllTimers();

        err = window.screenReaderSpeak(undefined);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get undefined");
        jest.clearAllTimers();

        err = window.screenReaderSpeak(null);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get object");
        jest.clearAllTimers();

        err = window.screenReaderSpeak(() => {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument text, expect string, get function");
        jest.clearAllTimers();
    });

    it("should return TypeError for priority argument", () => {
        let err;
        let div;

        err = window.screenReaderSpeak("", 1);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument priority, expect string, get number");
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", true);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument priority, expect string, get boolean");
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", false);
        expect(err).toBeUndefined(); // use "polite" by default
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", []);
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument priority, expect string, get object");
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument priority, expect string, get object");
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", NaN);
        expect(err).toBeUndefined(); // use "polite" by default
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", undefined);
        expect(err).toBeUndefined(); // use "polite" by default
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", null);
        expect(err).toBeUndefined(); // use "polite" by default
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", () => {});
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toBe("Invalid argument priority, expect string, get function");
        jest.clearAllTimers();
    });

    it("should block xss html", () => {
        let err = window.screenReaderSpeak("<img src='x' onerror='alert(1)' alt=''>");
        expect(err).toBeUndefined();

        jest.advanceTimersByTime(100);
        const div = getFirstDivInBody();
        expect(div.innerHTML).toBe("&lt;img src='x' onerror='alert(1)' alt=''&gt;");

        jest.advanceTimersByTime(1000);
        jest.clearAllTimers();

        expect(getFirstDivInBody()).toBeUndefined();
    });

    it("should use correct aria-live values", () => {
        let err;
        let div;

        err = window.screenReaderSpeak("", "off");
        expect(err).toBeUndefined();
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("off");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", "polite");
        expect(err).toBeUndefined();
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", "assertive");
        expect(err).toBeUndefined();
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("assertive");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("");
        expect(err).toBeUndefined();
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", "OFF");
        expect(err).toBeUndefined();
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("off");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();

        err = window.screenReaderSpeak("", "incorrect value");
        expect(err).toBeUndefined();
        div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.clearAllTimers();
    });

    it("should not throw error when manipulate dom after purged", () => {
        let err = window.screenReaderSpeak("");
        expect(err).toBeUndefined();

        document.body.innerHTML = `<html lang="en"><body></body></html>`;

        jest.advanceTimersByTime(100);
        jest.advanceTimersByTime(1000);
    });

    it("should not throw error when manipulate dom after having undefined document.body + should do return ReferenceError when having no document.body", () => {
        let err = window.screenReaderSpeak("");
        expect(err).toBeUndefined();

        Object.defineProperty(document, 'body', {
            get: jest.fn().mockImplementation(() => { return ''; }),
            set: jest.fn().mockImplementation(() => {}),
        });

        jest.advanceTimersByTime(100);
        jest.advanceTimersByTime(1000);

        err = window.screenReaderSpeak("");
        expect(err).toBeInstanceOf(ReferenceError);
        expect(err.message).toBe("document.body not exist");
        jest.clearAllTimers();
    });
});
