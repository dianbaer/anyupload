function FileSystemStatus() {
    // 当前所在文件夹id，null为根文件
    this.nowFoldId = null;
    this.nowFoldName = "全部文件";
    this.nowFoldParentId = "";
}
fileSystemStatus = new FileSystemStatus();