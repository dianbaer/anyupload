function UserFoldProxy() {
    this.NAME = "UserFoldProxy";
    this.nowFoldChildren = null;
    this.nowRecycleList = null;
    this.nowSortType = 1;
    this.createUserFold = function (userFoldName, userFoldParentId) {
        var data = {
            "hOpCode": 50003,
            "userFoldName": userFoldName,
            "userFoldParentId": userFoldParentId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.createUserFoldSuccess;
        sendParam.failHandle = this.createUserFoldFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.canContinuous = true;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.createUserFoldSuccess = function (result, sendParam) {
        $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
    }
    this.createUserFoldFail = function (result, sendParam) {

    }
    this.updateUserFold = function (userFoldId, userFoldName, userFoldState, isUpdateUserFoldParent, userFoldParentId) {
        var data = {
            "hOpCode": 50004,
            "userFoldId": userFoldId,
            "userFoldName": userFoldName,
            "isUpdateUserFoldParent": isUpdateUserFoldParent == "1" ? true : false,
            "userFoldParentId": userFoldParentId,
            "userFoldState": userFoldState
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.updateUserFoldSuccess;
        sendParam.failHandle = this.updateUserFoldFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.updateUserFoldSuccess = function (result, sendParam) {
        $T.userFoldProxy.getUserFoldChildren($T.fileSystemStatus.nowFoldId);
    }
    this.updateUserFoldFail = function (result, sendParam) {

    }
    this.getUserFoldChildren = function (userFoldParentId) {
        var data = {
            "hOpCode": 50005,
            "userFoldParentId": userFoldParentId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.getUserFoldChildrenSuccess;
        sendParam.failHandle = this.getUserFoldChildrenFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.getUserFoldChildrenSuccess = function (result, sendParam) {
        this.nowFoldChildren = result;
        this.sort();
        this.nowFoldChildren.userFoldMap = [];
        this.nowFoldChildren.userFileMap = [];
        if (this.nowFoldChildren.userFoldList != null) {
            for (var i = 0; i < this.nowFoldChildren.userFoldList.length; i++) {
                var userFold = this.nowFoldChildren.userFoldList[i];
                this.nowFoldChildren.userFoldMap[userFold.userFoldId] = userFold;
            }
        }
        if (this.nowFoldChildren.userFileList != null) {
            for (var i = 0; i < this.nowFoldChildren.userFileList.length; i++) {
                var userFile = this.nowFoldChildren.userFileList[i];
                this.nowFoldChildren.userFileMap[userFile.userFileId] = userFile;
            }
        }
        $T.fileSystemStatus.setNowFold(this.nowFoldChildren.recursionUserFoldList[0]);
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.GET_FOLD_CHILDREN_SUCCESS, result));
    }
    this.sort = function () {
        if (this.nowFoldChildren.userFoldList != null) {
            if (this.nowSortType == 1) {
                $T.sortTool.sort(this.nowFoldChildren.userFoldList, "userFoldName");
            } else if (this.nowSortType == 2) {
                $T.sortTool.sort(this.nowFoldChildren.userFoldList, "userFoldName");
            } else if (this.nowSortType == 3) {
                $T.sortTool.sort(this.nowFoldChildren.userFoldList, "userFoldUpdateTimeStamp");
            }
        }
        if (this.nowFoldChildren.userFileList != null) {
            if (this.nowSortType == 1) {
                $T.sortTool.sort(this.nowFoldChildren.userFileList, "userFileName");
            } else if (this.nowSortType == 2) {
                $T.sortTool.sortTwoProperty(this.nowFoldChildren.userFileList, "fileBase", "fileBaseTotalSize");
            } else if (this.nowSortType == 3) {
                $T.sortTool.sort(this.nowFoldChildren.userFileList, "userFileUpdateTimeStamp");
            }
        }
    }
    this.sortNowFoldChildren = function () {
        this.sort();
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.GET_FOLD_CHILDREN_SUCCESS, this.nowFoldChildren));
    }
    this.getUserFoldChildrenFail = function (result, sendParam) {

    }
    this.getUserFoldChildrenUserFold = function (userFoldParentId) {
        var data = {
            "hOpCode": 50014,
            "userFoldParentId": userFoldParentId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.getUserFoldChildrenUserFoldSuccess;
        sendParam.failHandle = this.getUserFoldChildrenUserFoldFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.getUserFoldChildrenUserFoldSuccess = function (result, sendParam) {
        if (result.userFoldList != null) {
            if (this.nowSortType == 1) {
                $T.sortTool.sort(result.userFoldList, "userFoldName");
            } else if (this.nowSortType == 2) {
                $T.sortTool.sort(result.userFoldList, "userFoldName");
            } else if (this.nowSortType == 3) {
                $T.sortTool.sort(result.userFoldList, "userFoldUpdateTimeStamp");
            }
        }
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.GET_FOLD_CHILDREN_USERFOLD_SUCCESS, {
            "userFoldParentId": sendParam.data.userFoldParentId,
            "userFoldList": result.userFoldList
        }));
    }
    this.getUserFoldChildrenUserFoldFail = function (result, sendParam) {

    }
    this.getRecycleBin = function (userFoldTopId) {
        var data = {
            "hOpCode": 50006,
            "userFoldTopId": userFoldTopId
        };

        var sendParam = new SendParam();
        sendParam.successHandle = this.getRecycleBinSuccess;
        sendParam.failHandle = this.getRecycleBinFail;
        sendParam.object = this;
        sendParam.data = data;
        sendParam.token = $T.cookieParam.getCookieParam($T.cookieName.TOKEN);
        sendParam.url = $T.url.boxUrl;
        sendParam.canContinuous = true;
        $T.httpUtil.send(sendParam);
    }
    this.getRecycleBinSuccess = function (result, sendParam) {
        this.nowRecycleList = result;
        $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.GET_RECYCLEBIN_SUCCESS, result));
    }
    this.getRecycleBinFail = function (result, sendParam) {

    }
}
$T.userFoldProxy = new UserFoldProxy();