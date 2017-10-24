function PageObj() {
    this.start;
    this.end;
    this.allNum;
    this.totalPage;
    this.currentPage;
    this.pageSize;
}
function PageFormat() {
    this.format = function (currentPage, pageSize, allNum) {
        if (pageSize < 1) {
            pageSize = allNum;
        }
        var totalPage = parseInt(Math.ceil(allNum / pageSize));
        if (currentPage > totalPage) {
            currentPage = totalPage;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        var start = (currentPage - 1) * pageSize;
        var end = (currentPage) * pageSize;
        if (end > allNum) {
            end = allNum;
        }
        var pageObj = new PageObj();
        pageObj.start = start;
        pageObj.end = end;
        pageObj.allNum = allNum;
        pageObj.totalPage = totalPage;
        pageObj.currentPage = currentPage;
        pageObj.pageSize = pageSize;
        return pageObj;
    }
}
$T.pageFormat = new PageFormat();