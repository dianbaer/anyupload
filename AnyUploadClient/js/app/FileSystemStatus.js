function FileSystemStatus() {
    // 当前所在文件夹id，null为根文件
    this.nowFoldId = null;
    this.nowFoldName = null;
    this.nowFoldParentId = "";
    this.goTopFold = function () {
        this.nowFoldId = $T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID);
        this.nowFoldName = "全部文件";
        this.nowFoldParentId = null;
    }
    this.setNowFold = function (userFold) {
        if (userFold.userFoldTopId == null) {
            this.nowFoldId = userFold.userFoldId;
            this.nowFoldName = "全部文件";
            this.nowFoldParentId = null;
        } else {
            this.nowFoldId = userFold.userFoldId;
            this.nowFoldName = userFold.userFoldName;
            this.nowFoldParentId = userFold.userFoldParentId;
        }
    }
}
$T.fileSystemStatus = new FileSystemStatus();