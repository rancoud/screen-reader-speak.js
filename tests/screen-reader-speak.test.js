jest.useFakeTimers();

describe("screen-reader-speak", function(){
    const dateNow = 1479427200000;

    beforeEach(function() {
        document.body.innerHTML = `<html lang="en"><body></body></html>`;
        jest.spyOn(Date, "now").mockImplementation(() => dateNow);
        require("../src/screen-reader-speak");
    });

    function getFirstDivInBody() {
        return document.getElementsByTagName("div")[0];
    }

    it("should be defined", function(done) {
        expect(window.screenReaderSpeak).toBeDefined();

        done();
    });

    it("should add div in body", function(done) {
        let err = window.screenReaderSpeak("sample");
        expect(err).toBeUndefined();

        jest.clearAllTimers();

        const div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        expect(div.getAttribute("id")).toBe("speak-" + dateNow);
        expect(div.getAttribute("class")).toBe("sr-only");
        expect(div.innerHTML).toBe("");

        done();
    });

    it("should add text in div after 100ms", function(done) {
        let err = window.screenReaderSpeak("sample 100ms");
        expect(err).toBeUndefined();

        jest.advanceTimersByTime(100);
        jest.clearAllTimers();

        const div = getFirstDivInBody();
        expect(div.getAttribute("aria-live")).toBe("polite");
        expect(div.getAttribute("id")).toBe("speak-" + dateNow);
        expect(div.getAttribute("class")).toBe("sr-only");
        expect(div.innerHTML).toBe("sample 100ms");

        done();
    });

    it("should delete div in body after 1000ms", function(done) {
        let err = window.screenReaderSpeak("sample 1000ms");
        expect(err).toBeUndefined();

        jest.advanceTimersByTime(100);
        const div = getFirstDivInBody();
        expect(div.innerHTML).toBe("sample 1000ms");

        jest.advanceTimersByTime(1000);
        jest.clearAllTimers();

        expect(getFirstDivInBody()).toBeUndefined();

        done();
    });

    it("should return TypeError for text argument", function(done) {
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

        done();
    });

    it("should return TypeError for priority argument", function(done) {
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

        done();
    });

    it("should block xss html", function(done) {
        let err = window.screenReaderSpeak("<img src='x' onerror='alert(1)'>");
        expect(err).toBeUndefined();

        jest.advanceTimersByTime(100);
        const div = getFirstDivInBody();
        expect(div.innerHTML).toBe("&lt;img src='x' onerror='alert(1)'&gt;");

        jest.advanceTimersByTime(1000);
        jest.clearAllTimers();

        expect(getFirstDivInBody()).toBeUndefined();

        done();
    });

    it("should use correct aria-live values", function(done) {
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

        done();
    });

    it("should not throw error when manipulate dom after purged", function(done) {
        let err = window.screenReaderSpeak("");
        expect(err).toBeUndefined();

        document.body.innerHTML = `<html lang="en"><body></body></html>`;

        jest.advanceTimersByTime(100);
        jest.advanceTimersByTime(1000);

        done();
    });

    it("should not throw error when manipulate dom after having undefined document.body + should do return ReferenceError when having no document.body", function(done) {
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

        done();
    });
});