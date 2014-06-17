
function mockNotify() {
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
    setup: function() {
        mockNotify();
    }
});

QUnit.test("no input", function(assert) {
    jk.searchInit();
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
    
    var events = $._data($("#search-form")[0], "events");
    assert.ok(!events || !events.submit || events.submit.length === 0, "No submit handler was added");
});

QUnit.test("bad form selector", function(assert) {
    jk.searchInit("#fhqwhgad", "#search-input", "#search-results");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
});

QUnit.test("bad input selector", function(assert) {
    jk.searchInit("#search-form", "#fhqwhgad", "#search-results");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
});

QUnit.test("bad results selector", function(assert) {
    jk.searchInit("#search-form", "#search-input", "#fhqwhgad");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.strictEqual(jk.$SEARCH_RESULTS, null, "The search results node is still null");
});

QUnit.test("correct input", function(assert) {
    jk.searchInit("#search-form", "#search-input", "#search-results");
    assert.strictEqual(jk.notify.callCount, 0, "The notification method was NOT called");
    assert.strictEqual(jk.$SEARCH_RESULTS[0], $("#search-results")[0], "The search results node is set correctly");

    var events = $._data($("#search-form")[0], "events");
    assert.ok(events && events.submit && events.submit.length === 1, "A submit handler was added");
    assert.equal(events.submit[0].handler.name, "submitHandler", "Correct submit handler attached");
});


QUnit.module("Search Execution", {
    setup: function() {
        mockNotify();

        // In addition to a mock for the notifications, we can mock out the 
        // results handler so that we don't have to worry about errors from 
        // it affecting our tests for this run
        jk._old_handleSearchResults = jk.handleSearchResults;
        jk.handleSearchResults = function() {
            jk.handleSearchResults.callCount++;
            jk.handleSearchResults.lastArgs = arguments;
        };
        jk.handleSearchResults.callCount = 0;
        jk.handleSearchResults.lastArgs = null;

        // Mock request data
        $.mockjax({
            url: "data/search.json",
            data: { query: "no results" },
            responseText: { "results": [] }
        });
        $.mockjax({
            url: "data/search.json",
            data: { query: "has results" },
            responseText: { "results": ["one", "two"] }
        });
        $.mockjax({
            url: "data/search.json",
            data: { query: "with error" },
            status: 500,
            responseText: "Server Error"
        });
    },
    teardown: function() {
        // Put the original method back after we've mocked it out
        jk.handleSearchResults = jk._old_handleSearchResults;
        $.mockjaxClear();
    }
});

QUnit.test("undefined query and callback", function(assert) {
    jk.doSearch();
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.equal(jk.handleSearchResults.callCount, 0, "The result handler method was NOT called");
});

QUnit.test("blank query and no callback", function(assert) {
    jk.doSearch("");
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.equal(jk.handleSearchResults.callCount, 0, "The result handler method was NOT called");
});

QUnit.test("blank query with valid callback", function(assert) {
    expect(3);
    jk.doSearch("", function(arg1) {
        assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
        assert.equal(jk.handleSearchResults.callCount, 0, "The result handler method was NOT called");
        assert.strictEqual(arg1, null, "The callback argument is null");
    });
});

QUnit.asyncTest("good query, no results", function(assert) {
    expect(5);

    jk.doSearch("no results", function(results) {
        assert.deepEqual(results, [], "The results are correct (empty)");
        assert.equal(jk.notify.callCount, 0, "The notification method was NOT called");
        assert.equal(jk.handleSearchResults.callCount, 1, "The result handler was called");
        assert.equal(jk.handleSearchResults.lastArgs.length, 1, "The result handler was called with correct number of args");
        assert.deepEqual(jk.handleSearchResults.lastArgs[0], [], "The result handler was called with correct args");
        start();
    });
});

QUnit.asyncTest("Search execution, good query, has results", function(assert) {
    expect(5);

    jk.doSearch("has results", function(results) {
        assert.deepEqual(results, ["one", "two"], "The results are correct");
        assert.equal(jk.notify.callCount, 0, "The notification method was NOT called");
        assert.equal(jk.handleSearchResults.callCount, 1, "The result handler was called");
        assert.equal(jk.handleSearchResults.lastArgs.length, 1, "The result handler was called with correct number of args");
        assert.deepEqual(jk.handleSearchResults.lastArgs[0], ["one", "two"], "The result handler was called with correct args");
        start();
    });
});

QUnit.asyncTest("server error", function(assert) {
    expect(3);

    jk.doSearch("with error", function(results) {
        assert.strictEqual(results, null, "The results are correct");
        assert.equal(jk.notify.callCount, 1, "The notification method was called on server error");
        assert.equal(jk.handleSearchResults.callCount, 0, "The result handler was NOT called");
        start();
    });
});


QUnit.module("Search Results", {
    setup: function() {
        mockNotify();
    }
});

