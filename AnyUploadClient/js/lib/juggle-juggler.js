(function (window) {
    if (!window.juggle) window.juggle = {};
    var JugglerEventType = function () {
        /**
         * 离开时间轴
         * @type {string}
         */
        this.REMOVE_FROM_JUGGLER = "removeFromJuggler";
    };
    window.juggle.jugglerEventType = new JugglerEventType();
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var tools = window.juggle.tools;
    var jugglerEventType = window.juggle.jugglerEventType;
    var Juggler = function () {
        this.mObjects = [];
        this.mElapsedTime = 0;
        /**
         * 添加对象至时间轴，同一对象不能重复添加，如果继承事件类，会监听离开时间轴的事件（无回调）
         * @param object
         */
        this.add = function (object) {
            if (object && tools.indexOf(this.mObjects, object) === -1) {
                this.mObjects[this.mObjects.length] = object;
                if (object.isEventDispatcher)
                    object.addEventListener(jugglerEventType.REMOVE_FROM_JUGGLER, this.onRemove, this);
            }
        };
        /**
         * 判断这个对象是否在时间轴（无回调）
         * @param object
         * @returns {boolean}
         */
        this.contains = function (object) {
            return tools.indexOf(this.mObjects, object) !== -1;
        };
        /**
         * 将时间轴这个对象位置置空意义非凡，能够有效的控制新加入的动画进入这次调度
         * 如果是事件类移除事件监听
         * @param object
         */
        this.remove = function (object) {
            if (tools.isNull(object))
                return;
            if (object.isEventDispatcher)
                object.removeEventListener(jugglerEventType.REMOVE_FROM_JUGGLER, this.onRemove);
            var index = tools.indexOf(this.mObjects, object);
            if (index !== -1)
                this.mObjects[index] = null;
        };
        /**
         * 动画调度，
         * 回调中新加入的动画不能在这一次被调度，因为没有经历时间过程这是合理的
         * 回调中移除的分两种可能，已经在本次调度的无影响，没有在本次调度的取消本次调度
         * @param time
         */
        this.advanceTime = function (time) {
            //确定这次调度的长度
            var numObjects = this.mObjects.length;
            var currentIndex = 0;
            var i;
            this.mElapsedTime += time;
            if (numObjects === 0)
                return;
            //回调里可能含有后面给前面移除与前面给后面移除两种
            //后面给前面移除this.mObjects这轮含有null
            //前面给后面移除会进行调换
            for (i = 0; i < numObjects; ++i) {
                var object = this.mObjects[i];
                if (object) {
                    //将后面不为空的动画对象换到前面为空的位置上
                    if (currentIndex !== i) {
                        this.mObjects[currentIndex] = object;
                        this.mObjects[i] = null;
                    }
                    object.advanceTime(time);
                    ++currentIndex;
                }
            }
            //这次应该调度的长度和实际长度不一样
            if (currentIndex !== i) {
                //这个长度在回调过程中，很有可能已经改变了，重新取一下
                numObjects = this.mObjects.length;
                //将新加入的动画与前面为空的调换
                while (i < numObjects)
                    this.mObjects[currentIndex++] = this.mObjects[i++];
                //清空后面为空的动画对象
                this.mObjects.length = currentIndex;
            }
        };
        /**
         * 接受REMOVE_FROM_JUGGLER事件
         * @param event
         */
        this.onRemove = function (event) {
            //离开动画列表，并且移除监听事件
            this.remove(event.mTarget);
        }
    };
    window.juggle.Juggler = Juggler;
})(window);
(function (window) {
    if (!window.juggle) window.juggle = {};
    var Juggler = window.juggle.Juggler;
    var JugglerManager = function () {
        this.onEnterFrame = function () {
            var now = new Date().getTime();
            var passedTime = (now - juggle.jugglerManager.processTime) / 1000.0;
            juggle.jugglerManager.processTime = now;
            if (passedTime === 0.0 || this.isStop) {
                return;
            }
            juggle.jugglerManager.juggler.advanceTime(passedTime);
        };
        this.processTime = new Date().getTime();
        this.juggler = new Juggler();
        this.intervalId = setInterval(this.onEnterFrame, 25);
        this.isStop = false;
    };
    window.juggle.jugglerManager = new JugglerManager();
})(window);