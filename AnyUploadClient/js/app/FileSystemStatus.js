(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var FileSystemStatus = function () {
        this.nowFoldId = "rootId";
        this.nowFoldName = "root";
    };
    window.anyupload.fileSystemStatus = new FileSystemStatus();
})(window);