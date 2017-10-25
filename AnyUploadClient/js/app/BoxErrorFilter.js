function BoxErrorFilter() {
    this.filter = function (result, sendParam) {
        if (result.hOpCode == 49999) {
            $T.viewManager.notifyObservers($T.viewManager.getNotification($T.notificationExt.BOX_ERROR, result.errorCode));
            return false;
        } else {
            return true;
        }
    }
}