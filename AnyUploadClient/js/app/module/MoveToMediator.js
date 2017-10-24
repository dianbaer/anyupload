function MoveToMediator() {
    this.nowChooseId = null;
    this.data;
    this.init = function (view, data) {
        layer.open({
            type: 1,
            skin: "layer_PJY",
            area: ['520px', '340px'],
            title: "移动到",
            move: false,
            content: $("#layer1"),
            success: function (layero, index) {
                $(".layerWin_PJY").mCustomScrollbar({
                    theme: "minimal",
                    advanced: {autoExpandHorizontalScroll: true},
                    scrollbarPosition: "outside"
                });
            }
        });
        this.nowChooseId = null;
        this.data = data;
        $T.userFoldProxy.getUserFoldChildrenUserFold($T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID));
        $(".layerWin_PJY").on("click", ".layerList_PJY a i", this.openChildUserFold);
        $("#move_to_topFold").on("click", "a span", this.onChooseFold);
        $(".layerNo_PJY").on("click", this.onCannel);
        $(".layerYes_PJY").on("click", this.onChangeFold);
        // $(".layerWin_PJY").on("click", ".layerList_PJY a i", function () {
        //     $(this).toggleClass("open_PJY");
        //     $(this).parent().next().stop().slideToggle(200)
        // }).on("click", ".layerList_PJY li span:not('.changeBox_PJY')", function () {
        //     if (!$(this).children().hasClass("changeBox_PJY")) {
        //         $(".layerList_PJY li span").removeClass("on2_PJY");
        //         $(this).addClass("on2_PJY")
        //     }
        // }).on("click", ".layAdd_PJY", function () {
        //     $(".layerList_PJY").find(".changeBox_PJY").each(function () {
        //         var context2 = $(this).find("input").val();
        //         var self2 = $(this).parent();
        //         if (context2 != "") {
        //             self2.html(context2)
        //         } else {
        //             self2.html("新建文件夹")
        //         }
        //     });
        //     var getNum1 = $(".layerList_PJY").find(".on2_PJY").parent().parent("li").children("ul").length;
        //     var getNum2 = $(".layerList_PJY").find(".on2_PJY").parent("li").children("ul").length;
        //     if (getNum1 != 0) {
        //         var text1 = '<li>'
        //             + '<span>'
        //             + '<span class="changeBox_PJY">'
        //             + '<input type="text"/>'
        //             + '<b class="yes_PJY"></b>'
        //             + '<b class="no_PJY"></b>'
        //             + '</span>'
        //             + '</span>'
        //             + '</li>';
        //         $(".layerList_PJY").find(".on2_PJY").parent().parent().children("ul").prepend(text1);
        //
        //
        //     } else if (getNum2 == 0) {
        //         var context = $(".layerList_PJY").find(".on2_PJY").html();
        //         var text2 = ' <a href="javascript:;"><i></i><span class="on2_PJY">' + context + '</span></a>'
        //             + '<ul>'
        //             + '<li>'
        //             + '<span>'
        //             + '<span class="changeBox_PJY">'
        //             + '<input type="text"/>'
        //             + '<b class="yes_PJY"></b>'
        //             + '<b class="no_PJY"></b>'
        //             + '</span>'
        //             + '</span>'
        //             + '</li>'
        //             + '</ul>';
        //         $(".layerList_PJY").find(".on2_PJY").parent().html(text2)
        //     }
        //     $(".layerList_PJY").find("input:text").trigger("focus");
        //     $(".layerList_PJY").find(".on2_PJY").parent().next("ul").stop().slideDown(100);
        //     $(".layerList_PJY").find(".on2_PJY").prev().addClass("open_PJY")
        // }).on("click", ".layerList_PJY .yes_PJY", function () {
        //     var context2 = $(this).prev().val();
        //     var self2 = $(this).parent().parent();
        //     if (context2 != "") {
        //         self2.html(context2)
        //     } else {
        //         self2.html("新建文件夹")
        //     }
        // }).on("click", ".layerList_PJY .no_PJY", function () {
        //     var self2 = $(this).parent().parent();
        //     self2.html("新建文件夹");
        // }).on("click", ".layerYes_PJY", function () {
        //     $(".layer_PJY .layui-layer-setwin .layui-layer-close1").trigger("click");
        // }).on("click", ".layerNo_PJY", function () {
        //     $(".layer_PJY .layui-layer-setwin .layui-layer-close1").trigger("click");
        // })

    }
    // 注销方法
    this.dispose = function () {

    }
    // 关心消息数组
    this.listNotificationInterests = [$T.notificationExt.GET_FOLD_CHILDREN_USERFOLD_SUCCESS];
    // 关心的消息处理
    this.handleNotification = function (data) {
        switch (data[0].name) {
            case $T.notificationExt.GET_FOLD_CHILDREN_USERFOLD_SUCCESS:
                this.getFoldChildrenUserFold(data[0].body);
                break;
        }
    }
    this.onCannel = function () {
        $(".layer_PJY .layui-layer-setwin .layui-layer-close1").trigger("click");
    }
    this.onChangeFold = function () {
        if ($T.moveToMediator.nowChooseId == null) {
            return;
        }
        for (var i = 0; i < $T.moveToMediator.data.userFoldIds.length; i++) {
            var userFoldId = $T.moveToMediator.data.userFoldIds[i];
            if (userFoldId == $T.moveToMediator.nowChooseId) {
                alert("将要移动的文件夹含有移动到的文件夹");
                return;
            }
        }
        $(".layer_PJY .layui-layer-setwin .layui-layer-close1").trigger("click");
        $T.mutliOperateProxy.moveTo($T.moveToMediator.data.userFoldIds, $T.moveToMediator.data.userFileIds, $T.moveToMediator.nowChooseId);
    }
    this.onChooseFold = function () {
        var parentId;
        if (this.id == "move_to_topFold_span") {
            parentId = $T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID);
        } else {
            var idArray = this.id.split("_");
            parentId = idArray[0];
        }
        if (parentId == null) {
            return;
        }
        if ($T.moveToMediator.nowChooseId != null) {
            if ($T.moveToMediator.nowChooseId == $T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID)) {
                $("#move_to_topFold_span").removeClass("on2_PJY");
            } else {
                $("#" + $T.moveToMediator.nowChooseId + "_previewspan").removeClass("on2_PJY");
            }
            $T.moveToMediator.nowChooseId = null;
        }

        if (this.id == "move_to_topFold_span") {
            $("#move_to_topFold_span").addClass("on2_PJY");
        } else {
            var idArray = this.id.split("_");
            $("#" + idArray[0] + "_previewspan").addClass("on2_PJY");
        }
        $T.moveToMediator.nowChooseId = parentId;

    }
    this.openChildUserFold = function () {
        var parent;
        var parentId;
        if (this.id == "move_to_topFold_open") {
            parent = $("#move_to_topFold");
            parentId = $T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID);
        } else {
            var idArray = this.id.split("_");
            parent = $("#" + idArray[0] + "_move");
            parentId = idArray[0];
        }
        if (parent.hasClass("open_children")) {
            parent.removeClass("open_children");
            $(this).parent().next().stop().slideToggle(200);
            $(this).toggleClass("open_PJY");
        } else {
            $T.userFoldProxy.getUserFoldChildrenUserFold(parentId);
        }
    }
    this.getFoldChildrenUserFold = function (data) {
        var parent;
        if (data.userFoldParentId == $T.cookieParam.getCookieParam($T.cookieName.USER_FOLD_TOP_ID)) {
            parent = $("#move_to_topFold");
            $("#move_to_topFold_open").toggleClass("open_PJY");
        } else {
            parent = $("#" + data.userFoldParentId + "_move");
            $("#" + data.userFoldParentId + "_open").toggleClass("open_PJY");
        }
        $("#" + data.userFoldParentId + "_ul").remove();
        parent.addClass("open_children");
        if (data.userFoldList != null && data.userFoldList.length > 0) {
            var ul = document.createElement("ul");
            ul.id = data.userFoldParentId + "_ul";
            var container = $(ul);
            for (var i = 0; i < data.userFoldList.length; i++) {
                var userFold = data.userFoldList[i];
                var view = this.createUserFoldView(userFold);
                container.append(view);
            }
            parent.append(container);
            for (var i = 0; i < data.userFoldList.length; i++) {
                var userFold = data.userFoldList[i];
                if (userFold.haveChildUserFold) {
                    $("#" + userFold.userFoldId + "_open").show();
                } else {
                    $("#" + userFold.userFoldId + "_open").hide();
                }
            }
            container.stop().slideToggle(200);
        }

    }
    this.createUserFoldView = function (userFold) {
        var view = document.createElement("li");
        var body;
        body = '<a href="javascript:;"><i id="' + userFold.userFoldId + '_open"></i><span id="' + userFold.userFoldId + '_previewspan">' + userFold.userFoldName + '</span></a>';
        view.innerHTML = body;
        view.id = userFold.userFoldId + "_move";
        return $(view);
    }


}
$T.moveToMediator = new MoveToMediator();