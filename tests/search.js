
function searchSetup() {
    // We need to make sure that the notification method exists, but 
    // don't really care what it does, just that it was called...
    jk.notify = function() {
        jk.notify.callCount++;
    };
    jk.notify.callCount = 0;
}

QUnit.module("Search namespace and functions");

QUnit.test("Namespace and methods exists", function(assert) {
    assert.ok(window.jk, "Namespace exists");
    assert.equal(typeof window.jk.searchInit, "function", "searchInit function exists");
    assert.equal(typeof window.jk.doSearch, "function", "doSearch function exists");
    assert.equal(typeof window.jk.handleSearchResults, "function", "handleSearchResults function exists");
});

QUnit.module("Search Initialization", {
    setup: searchSetup
});

QUnit.test("Search initialization, no input", function(assert) {
    jk.searchInit();
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
    
    var events = $._data($("#search-form")[0], "events");
    assert.ok(!events || !events.submit || events.submit.length === 0, "No submit handler was added");
});

QUnit.test("Search initialization, bad form selector", function(assert) {
    jk.searchInit("#fhqwhgad", "#search-input", "#search-results");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
});

QUnit.test("Search initialization, bad input selector", function(assert) {
    jk.searchInit("#search-form", "#fhqwhgad", "#search-results");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
});

QUnit.test("Search initialization, bad results selector", function(assert) {
    jk.searchInit("#search-form", "#search-input", "#fhqwhgad");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
});

QUnit.test("Search initialization, correct input", function(assert) {
    jk.searchInit("#search-form", "#search-input", "#search-results");
    assert.strictEqual(jk.notify.callCount, 0, "The notification method was NOT called");
    assert.strictEqual(jk.$SEARCH_RESULTS[0], $("#search-results")[0], "The search results node is set correctly");

    var events = $._data($("#search-form")[0], "events");
    assert.ok(events && events.submit && events.submit.length === 1, "A submit handler was added");
    assert.equal(events.submit[0].handler.name, "submitHandler", "Correct submit handler attached");
});
