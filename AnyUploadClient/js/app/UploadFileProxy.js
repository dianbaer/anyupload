(function (window) {
    if (!window.anyupload) window.anyupload = {};
    var notificationExt = window.anyupload.notificationExt;
    var UploadFileProxy = function () {
        juggle.Proxy.apply(this);
        this.url = null;
        /**
         * 校验md5
         * @param uploadFileId 界面上的显示对象id
         * @param fileBaseMd5 md5
         * @param userFileName 文件名
         * @param userFoldParentId 父类id（没用）
         * @param fileBaseTotalSize 文件大小
         * @param userFileId 文件id（没用）
         */
        this.checkMD5 = function (uploadFileId, fileBaseMd5, userFileName, userFoldParentId, fileBaseTotalSize, userFileId) {
            var data = {
                "hOpCode": "50000",
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
            httpClient.send(data, this.url, null);
            httpClient.addEventListener(juggle.httpEventType.SUCCESS, this.checkMD5Success, this);
            httpClient.addEventListener(juggle.httpEventType.ERROR, this.checkMD5Fail, this);
        };
        this.checkMD5Success = function (event) {
            var result = JSON.parse(event.mData);
            var sendParam = event.mTarget.sendParam;
            //返回错误
            if (result.hOpCode === "49999") {
                this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_FAIL, {
                    "result": result,
                    "sendParam": sendParam
                }));
                return;
            }
            //protobuf传0则是null，纠正过来
            if (result.fileBasePos === null || result.fileBasePos === undefined) {
                result.fileBasePos = 0;
            }
            this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_SUCCESS, {
                "result": result,
                "sendParam": sendParam
            }));
        };
        this.checkMD5Fail = function (event) {
            var sendParam = event.mTarget.sendParam;
            this.notifyObservers(this.getNotification(notificationExt.MD5_CHECK_FAIL, {
                "result": null,
                "sendParam": sendParam
            }));
        };
        /**
         * 上传文件
         * @param uploadFileId 显示对象id
         * @param userFileId 文件id
         * @param fileBasePos 位置
         * @param uploadLength 长度
         * @param fileArray 文件块
         */
        this.uploadFile = function (uploadFileId, userFileId, fileBasePos, uploadLength, fileArray) {
            var data = {
                "hOpCode": "50001",
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
            httpClient.sendFile(fileArray, data, this.url, null);
            httpClient.addEventListener(juggle.httpEventType.SUCCESS, this.uploadFileSuccess, this);
            httpClient.addEventListener(juggle.httpEventType.ERROR, this.uploadFileFail, this);
        };
        this.uploadFileSuccess = function (event) {
            var result = JSON.parse(event.mData);
            var sendParam = event.mTarget.sendParam;
            //错误的返回
            if (result.hOpCode === "49999") {
                this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_FAIL, {
                    "result": result,
                    "sendParam": sendParam
                }));
                return;
            }
            //protobuf传0则是null，纠正过来
            if (result.fileBasePos === null || result.fileBasePos === undefined) {
                result.fileBasePos = 0;
            }
            this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_SUCCESS, {
                "result": result,
                "sendParam": sendParam
            }));
        };
        this.uploadFileFail = function (event) {
            var sendParam = event.mTarget.sendParam;
            this.notifyObservers(this.getNotification(notificationExt.UPLOAD_FILE_FAIL, {
                "result": null,
                "sendParam": sendParam
            }));
        }
    };
    window.anyupload.uploadFileProxy = new UploadFileProxy();
})(window);