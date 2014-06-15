
QUnit.module("Core Functionality");

QUnit.test("Namespace and notify method exists", function(assert) {
    assert.ok(window.jk, "Namespace exists");
    assert.equal(typeof window.jk.notify, "function", "notify function exists");
});

QUnit.test("Notify node exists", function(assert) {
    assert.ok(jk.NOTIFY_NODE, "Notification node variable exists");
    assert.equal(jk.NOTIFY_NODE.length, 1, "Notification node element exists");
});

QUnit.test("Notify method works", function(assert) {
    assert.equal(jk.NOTIFY_NODE.find("p").length, 0, "No messages by default");
    jk.notify("test");
    assert.equal(jk.NOTIFY_NODE.find("p").length, 1, "New message was added");
    assert.equal(jk.NOTIFY_NODE.find("p").text(), "test", "New message has correct text");
    assert.ok(jk.NOTIFY_NODE.find("p").hasClass("error"), "New message <p> has correct class");
});
