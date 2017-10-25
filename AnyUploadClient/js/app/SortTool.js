function SortTool() {
    this.sort = function (array, property) {
        var size = array.length;
        for (var i = 0; i < size; i++) {
            for (var j = i + 1; j < size; j++) {
                var objI = array[i];
                var objJ = array[j];
                //交换位置
                if (objI[property] < objJ[property]) {
                    array[i] = objJ;
                    array[j] = objI;
                }

            }
        }
    }
    this.sortTwoProperty = function (array, property1, property2) {
        var size = array.length;
        for (var i = 0; i < size; i++) {
            for (var j = i + 1; j < size; j++) {
                var objI = array[i];
                var objJ = array[j];
                //交换位置
                if (objI[property1][property2] < objJ[property1][property2]) {
                    array[i] = objJ;
                    array[j] = objI;
                }

            }
        }
    }
}
$T.sortTool = new SortTool();