
function mockNotify() {
    // We need to make sure that the notification method exists, but 
    // don't really care what it does, just that it was called...
    jk.notify = function() {
        jk.notify.callCount++;
        jk.notify.lastArgs = arguments;
    };
    jk.notify.callCount = 0;
    jk.notify.lastArgs = null;
}

QUnit.module("Favorites namespace and functions");

QUnit.test("Namespace and methods exists", function(assert) {
    assert.ok(window.jk, "Namespace exists");
    assert.equal(typeof window.jk.favoriteInit, "function", "favoriteInit function exists");
    assert.equal(typeof window.jk.toggleFavorite, "function", "toggleFavorite function exists");
    assert.equal(typeof window.jk.toggleFavoriteIcon, "function", "toggleFavoriteIcon function exists");
});


QUnit.module("Favorites Initialization", {
    setup: function() {
        mockNotify();
    }
});

QUnit.test("no input", function(assert) {
    assert.throws(function() {
        jk.favoriteInit();
    }, "Error thrown on undefined input");
    
    assert.equal(jk.notify.callCount, 0, "The notification method was NOT called");
    
    var events = $._data($("#list")[0], "events");
    assert.ok(!events || !events.click || events.click.length === 0, "No click handler was added");
});

QUnit.test("invalid input", function(assert) {
    assert.throws(function() {
        jk.favoriteInit("#foobar");
    }, "Error thrown on bad input");
    
    assert.equal(jk.notify.callCount, 0, "The notification method was NOT called");
    
    var events = $._data($("#list")[0], "events");
    assert.ok(!events || !events.click || events.click.length === 0, "No click handler was added");
});

QUnit.test("correct input", function(assert) {
    jk.favoriteInit("#list", "img");
    assert.strictEqual(jk.notify.callCount, 0, "The notification method was NOT called");

    var events = $._data($("#list")[0], "events");
    assert.ok(events && events.click && events.click.length === 1, "A click handler was added");
    assert.equal(events.click[0].handler.name, "favoriteClickHandler", "Correct click handler attached");
});


QUnit.module("Toggle Favorites", {
    setup: function() {
        mockNotify();

        // In addition to a mock for the notifications, we can mock out the 
        // icon toggle handler so that we don't have to worry about errors from 
        // it affecting our tests for this run
        jk._old_toggleFavoriteIcon = jk.toggleFavoriteIcon;
        jk.toggleFavoriteIcon = function() {
            jk.toggleFavoriteIcon.callCount++;
            jk.toggleFavoriteIcon.lastArgs = arguments;
        };
        jk.toggleFavoriteIcon.callCount = 0;
        jk.toggleFavoriteIcon.lastArgs = null;

        // Mock request data
        $.mockjax({
            url: "data/favorite/1",
            responseText: { "beer": { id: 1, favorite: false } }
        });
        $.mockjax({
            url: "data/favorite/2",
            responseText: { "beer": { id: 2, favorite: true } }
        });
        $.mockjax({
            url: "data/favorite/3",
            status: 500,
            responseText: "Server Error"
        });
    },
    teardown: function() {
        // Put the original method back after we've mocked it out
        jk.toggleFavoriteIcon = jk._old_toggleFavoriteIcon;
        $.mockjaxClear();
    }
});

QUnit.test("undefined element and no callback", function(assert) {
    jk.toggleFavorite();
    assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
    assert.ok(/unable to determine which beer to mark as favorite/i.test(jk.notify.lastArgs[0]), "Correct message passed to notify");
    assert.equal(jk.toggleFavoriteIcon.callCount, 0, "The icon toggler method was NOT called");
});

QUnit.test("null element with callback", function(assert) {
    expect(4);
    jk.toggleFavorite(null, function(arg1) {
        assert.strictEqual(arg1, null, "null returned in callback on error");
        assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
        assert.ok(/unable to determine which beer to mark as favorite/i.test(jk.notify.lastArgs[0]), "Correct message passed to notify");
        assert.equal(jk.toggleFavoriteIcon.callCount, 0, "The icon toggler method was NOT called");
    });
});

QUnit.test("bad element with callback", function(assert) {
    expect(4);
    jk.toggleFavorite("foobar", function(arg1) {
        assert.strictEqual(arg1, null, "null returned in callback on error");
        assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
        assert.ok(/unable to determine which beer to mark as favorite/i.test(jk.notify.lastArgs[0]), "Correct message passed to notify");
        assert.equal(jk.toggleFavoriteIcon.callCount, 0, "The icon toggler method was NOT called");
    });
});

QUnit.test("No ID on element", function(assert) {
    expect(4);
    jk.toggleFavorite("#list li:first", function(arg1) {
        assert.strictEqual(arg1, null, "null returned in callback on error");
        assert.equal(jk.notify.callCount, 1, "The notification method was called on error");
        assert.ok(/please select a valid beer/i.test(jk.notify.lastArgs[0]), "Correct message passed to notify");
        assert.equal(jk.toggleFavoriteIcon.callCount, 0, "The icon toggler method was NOT called");
    });
});

QUnit.asyncTest("good selector with callback", function(assert) {
    expect(6);

    jk.toggleFavorite("#list li:first img", function(beer) {
        assert.deepEqual(beer, { id: 1, favorite: false }, "correct beer object returned in callback");
        assert.equal(jk.notify.callCount, 0, "The notification method was NOT called");
        assert.equal(jk.toggleFavoriteIcon.callCount, 1, "The icon toggler method was called");
        assert.equal(jk.toggleFavoriteIcon.lastArgs.length, 2, "The icon toggler was called with correct number of args");
        assert.strictEqual(jk.toggleFavoriteIcon.lastArgs[0][0], $("#list li:first img")[0], "The icon toggler was called with correct element");
        assert.strictEqual(jk.toggleFavoriteIcon.lastArgs[1], false, "The icon toggler was called with correct boolean value");
        start();
    });
});

QUnit.asyncTest("good element with callback", function(assert) {
    expect(6);

    var $el = $("#list li:eq(1) img");

    jk.toggleFavorite($el, function(beer) {
        assert.deepEqual(beer, { id: 2, favorite: true }, "correct beer object returned in callback");
        assert.equal(jk.notify.callCount, 0, "The notification method was NOT called");
        assert.equal(jk.toggleFavoriteIcon.callCount, 1, "The icon toggler method was called");
        assert.equal(jk.toggleFavoriteIcon.lastArgs.length, 2, "The icon toggler was called with correct number of args");
        assert.strictEqual(jk.toggleFavoriteIcon.lastArgs[0][0], $el[0], "The icon toggler was called with correct element");
        assert.strictEqual(jk.toggleFavoriteIcon.lastArgs[1], true, "The icon toggler was called with correct boolean value");
        start();
    });
});

QUnit.asyncTest("server error", function(assert) {
    expect(4);

    jk.toggleFavorite("#list li:last img", function(results) {
        assert.strictEqual(results, null, "The results are correct");
        assert.equal(jk.notify.callCount, 1, "The notification method was called on server error");
        assert.ok(/favorite action failed/i.test(jk.notify.lastArgs[0]), "Correct message passed to notify");
        assert.equal(jk.toggleFavoriteIcon.callCount, 0, "The icon toggler method was NOT called");
        start();
    });
});


QUnit.module("Toggle Icon");

QUnit.test("undefined input", function(assert) {
    var result = jk.toggleFavoriteIcon();
    
    assert.strictEqual(result, false, "method returned false on error");
    assert.equal($("img[src^=assets]").length, 0, "None of the list entries have an image");
});

QUnit.test("bad element", function(assert) {
    var result = jk.toggleFavoriteIcon("foobar");
    
    assert.strictEqual(result, false, "method returned false on error");
    assert.equal($("img[src^=assets]").length, 0, "None of the list entries have an image");
});

QUnit.test("non-image element", function(assert) {
    var result = jk.toggleFavoriteIcon("#list");
    
    assert.strictEqual(result, false, "method returned false on error");
    assert.equal($("img[src^=assets]").length, 0, "None of the list entries have an image");
});

QUnit.test("undefined favorite switch", function(assert) {
    var result = jk.toggleFavoriteIcon("#list img:first");
    
    assert.strictEqual(result, "assets/star-empty.png", "method returned correct image source");
    assert.equal($("#list img:first").attr("src"), "assets/star-empty.png", "Imahge has correct source");
    assert.equal($("img[src^=assets]").length, 1, "Only passed in image element has source changed");
});

QUnit.test("false favorite switch", function(assert) {
    var result = jk.toggleFavoriteIcon("#list img:first", false);
    
    assert.strictEqual(result, "assets/star-empty.png", "method returned correct image source");
    assert.equal($("#list img:first").attr("src"), "assets/star-empty.png", "Imahge has correct source");
    assert.equal($("img[src^=assets]").length, 1, "Only passed in image element has source changed");
});

QUnit.test("true favorite switch", function(assert) {
    var result = jk.toggleFavoriteIcon("#list img:first", true);
    
    assert.strictEqual(result, "assets/star-filled.png", "method returned correct image source");
    assert.equal($("#list img:first").attr("src"), "assets/star-filled.png", "Imahge has correct source");
    assert.equal($("img[src^=assets]").length, 1, "Only passed in image element has source changed");
});
