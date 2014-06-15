
QUnit.module("Search Functionality");

QUnit.test("Namespace and methods exists", function(assert) {
    assert.ok(window.jk, "Namespace exists");
    assert.equal(typeof window.jk.searchInit, "function", "searchInit function exists");
    assert.equal(typeof window.jk.doSearch, "function", "doSearch function exists");
    assert.equal(typeof window.jk.handleSearchResults, "function", "handleSearchResults function exists");
});
