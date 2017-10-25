function PostfixUtil() {
    this.postfixToClass = [];
    this.postfixToClass2 = [];
    this.init = function () {
        this.postfixToClass["ai"] = "fileicon_ai";
        this.postfixToClass["doc"] = "fileicon_doc";
        this.postfixToClass["docx"] = "fileicon_doc";
        this.postfixToClass["jpg"] = "fileicon_jpg";
        this.postfixToClass["jpeg"] = "fileicon_jpg";
        this.postfixToClass["pdf"] = "fileicon_pdf";
        this.postfixToClass["png"] = "fileicon_png";
        this.postfixToClass["ppt"] = "fileicon_ppt";
        this.postfixToClass["pptx"] = "fileicon_ppt";
        this.postfixToClass["psd"] = "fileicon_psd";
        this.postfixToClass["xls"] = "fileicon_xls";
        this.postfixToClass["txt"] = "fileicon_txt";


        this.postfixToClass2["zip"] = "zip_PJY";
        this.postfixToClass2["rar"] = "zip_PJY";
        this.postfixToClass2["gz"] = "zip_PJY";
        this.postfixToClass2["jpg"] = "jpg_PJY";
        this.postfixToClass2["jpeg"] = "jpg_PJY";
        this.postfixToClass2["png"] = "png_PJY";
        this.postfixToClass2["psd"] = "psd_PJY";
        this.postfixToClass2["ai"] = "ai_PJY";
        this.postfixToClass2["doc"] = "doc_PJY";
        this.postfixToClass2["docx"] = "doc_PJY";
        this.postfixToClass2["ppt"] = "ppt_PJY";
        this.postfixToClass2["pptx"] = "ppt_PJY";
        this.postfixToClass2["txt"] = "txt_PJY";
        this.postfixToClass2["xls"] = "xls_PJY";
    }
    this.getClassByFileName = function (userFileName) {
        var nameArray = userFileName.toLowerCase().split(".");
        if (nameArray.length == 1) {
            return "fileicon_qitageshi";
        } else {
            if (this.postfixToClass[nameArray[nameArray.length - 1]] == null) {
                return "fileicon_qitageshi";
            } else {
                return this.postfixToClass[nameArray[nameArray.length - 1]];
            }
        }
    }
    this.getClassByFileName2 = function (userFileName) {
        var nameArray = userFileName.toLowerCase().split(".");
        if (nameArray.length == 1) {
            return "fileOther_PJY";
        } else {
            if (this.postfixToClass2[nameArray[nameArray.length - 1]] == null) {
                return "fileOther_PJY";
            } else {
                return this.postfixToClass2[nameArray[nameArray.length - 1]];
            }
        }
    }
    this.isImage = function (userFileName) {
        var nameArray = userFileName.toLowerCase().split(".");
        if (nameArray.length == 1) {
            return false;
        } else {
            if (nameArray[nameArray.length - 1] == "png" || nameArray[nameArray.length - 1] == "jpg" || nameArray[nameArray.length - 1] == "jpeg" || nameArray[nameArray.length - 1] == "gif" || nameArray[nameArray.length - 1] == "bmp") {
                return true;
            } else {
                return false;
            }

        }
    }
}
$T.postfixUtil = new PostfixUtil();
$T.postfixUtil.init();