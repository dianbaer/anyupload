function UploadFileProxy() {
    juggle.Proxy.apply(this);
    this.checkMD5 = function (uploadFileId, fileBaseMd5, userFileName, userFoldParentId, fileBaseTotalSize, userFileId) {
        var data = {
            "hOpCode": 50000,
            "fileBaseMd5": fileBaseMd5,
            "userFileName": userFileName,
            "userFoldParentId": userFoldParentId,
            "fileBaseTotalSize": fileBaseTotalSize,
            "userFileId": userFileId
        };
        // 用于确认回调到底是哪个文件的消息
        var sendParam = {
            "data": data,
            "uploadFileId": uploadFileId
        };
        var httpClient = new juggle.HttpClient();
        httpClient.sendParam = sendParam;
        httpClient.send(data, "http://localhost:8080/AnyUploadServer/s", null);
        httpClient.addEventListener(juggle.httpEventType.SUCCESS, this.checkMD5Success, this);
        httpClient.addEventListener(juggle.httpEventType.ERROR, this.checkMD5Fail, this);
        // var result = {
        // "hOpCode" : 50000,
        // "result" : 2,
        // "fileBasePos" : 0,
        // "uploadMaxLength" : 65536,
        // "userFileId" : Math.uuid()
        // }
        // this.checkMD5Success(result, sendParam);
    };
    this.checkMD5Success = function (event) {
        var result = event.mData;
        var sendParam = event.mTarget.sendParam;

        if (result.fileBasePos === null || result.fileBasePos === undefined) {
            result.fileBasePos = 0;
        }
        this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_SUCCESS, {
            "result": result,
            "sendParam": sendParam
        }));
    };
    this.checkMD5Fail = function (event) {
        var result = event.mData;
        var sendParam = event.mTarget.sendParam;
        this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_FAIL, {
            "result": result,
            "sendParam": sendParam
        }));
    };
    this.uploadFile = function (uploadFileId, userFileId, fileBasePos, uploadLength, fileArray) {
        var data = {
            "hOpCode": 50001,
            "userFileId": userFileId,
            "fileBasePos": fileBasePos,
            "uploadLength": uploadLength
        };
        // 用于确认回调到底是哪个文件的消息
        var sendParam = {
            "data": data,
            "uploadFileId": uploadFileId
        };

        var httpClient = new juggle.HttpClient();
        httpClient.sendParam = sendParam;
        httpClient.sendFile(fileArray, data, "http://localhost:8080/AnyUploadServer/s", null);
        httpClient.addEventListener(juggle.httpEventType.SUCCESS, this.uploadFileSuccess, this);
        httpClient.addEventListener(juggle.httpEventType.ERROR, this.uploadFileFail, this);
        // var result = {
        // "hOpCode" : 50001,
        // "result" : 2,
        // "fileBasePos" : fileBasePos + uploadLength,
        // "uploadMaxLength" : 65536,
        // "userFileId" : userFileId,
        // "waitTime" : 640
        // };
        // this.uploadFileSuccess(result, sendParam);
    };
    this.uploadFileSuccess = function (event) {
        var result = event.mData;
        var sendParam = event.mTarget.sendParam;
        if (result.fileBasePos === null || result.fileBasePos === undefined) {
            result.fileBasePos = 0;
        }
        this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_SUCCESS, {
            "result": result,
            "sendParam": sendParam
        }));
    };
    this.uploadFileFail = function (event) {
        var result = event.mData;
        var sendParam = event.mTarget.sendParam;
        this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_FAIL, {
            "result": result,
            "sendParam": sendParam
        }));
    }
}