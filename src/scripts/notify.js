var jk = (window.jk || {});

jk.NOTIFY_NODE = $("#messages");

jk.notify = function(msg) {
    jk.NOTIFY_NODE.append("<p class='error'>" + msg + "</p>");
};