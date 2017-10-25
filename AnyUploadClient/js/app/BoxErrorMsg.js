function BoxErrorMsg() {
    this.errorMap = [];
    this.init = function () {
        this.errorMap["ERROR_CODE_0"] = "未知错误";
        this.errorMap["ERROR_CODE_1"] = "不存在这个用户";
        this.errorMap["ERROR_CODE_2"] = "创建用户顶级文件夹失败";
        this.errorMap["ERROR_CODE_3"] = "md5校验失败";
        this.errorMap["ERROR_CODE_4"] = "上传失败，不存在这个文件";
        this.errorMap["ERROR_CODE_5"] = "上传失败，上传位置不对";
        this.errorMap["ERROR_CODE_6"] = "上传失败，长度不对";
        this.errorMap["ERROR_CODE_7"] = "上传失败，没发送文件";
        this.errorMap["ERROR_CODE_8"] = "上传失败，不存在实体文件";
        this.errorMap["ERROR_CODE_9"] = "上传失败，时间超前";
        this.errorMap["ERROR_CODE_10"] = "上传失败，更换基础文件失败";
        this.errorMap["ERROR_CODE_11"] = "上传失败，写入文件失败";
        this.errorMap["ERROR_CODE_12"] = "上传失败，更新数据失败";
        this.errorMap["ERROR_CODE_13"] = "创建文件夹失败，父类文件夹不能为空";
        this.errorMap["ERROR_CODE_14"] = "创建文件夹失败";
        this.errorMap["ERROR_CODE_15"] = "修改文件夹失败，不存在这个文件夹";
        this.errorMap["ERROR_CODE_16"] = "获取文件夹子类失败";
        this.errorMap["ERROR_CODE_17"] = "获取文件夹子文件夹失败";
        this.errorMap["ERROR_CODE_18"] = "获取回收站文件失败";
        this.errorMap["ERROR_CODE_19"] = "修改文件失败";
        this.errorMap["ERROR_CODE_20"] = "将选择文件移动到回收站失败";
        this.errorMap["ERROR_CODE_21"] = "将选择文件还原失败";
        this.errorMap["ERROR_CODE_22"] = "将选择文件移动到指定文件夹失败";
        this.errorMap["ERROR_CODE_23"] = "将选择文件彻底删除失败";
        this.errorMap["ERROR_CODE_24"] = "清空回收站失败";
        this.errorMap["ERROR_CODE_25"] = "md5校验失败，超出最大允许空间";
    }
}
$T.boxErrorMsg = new BoxErrorMsg();
$T.boxErrorMsg.init();