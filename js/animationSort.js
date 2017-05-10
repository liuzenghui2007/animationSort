/*!
 *
 *  @author zhenhui
 *  @快速排序思路及动画演示过程
 *  
 */
(function () {
    
    var drawSortProcess= function(id,arrayData){
         
             var _t = this;
             
            _t.replayArray = arrayData.toString(); //转换引用值为复制值
            _t.dataArray = arrayData;
            _t.el=document.getElementById(id);
            _t.lockMark = true;// 动画锁，防止过多动画同时运行
            _t.autoPlay = false;
            _t.replay = false;
            _t.begin = false;
            _t.animationTime = 3500;
            _t.markArray = [];
            _t.markIdx = 0;

            _t.el.innerHTML = "";
            _t.drawInit();
    }
    
    drawSortProcess.prototype = {
            drawInit : function(){
                        var _t= this;
                        var fId = _t.el.id;
                        //根据数组添加柱状图
                        for(var i=0;i<_t.dataArray.length;i++){

                              var div = document.createElement("div");
                              div.style.left = (i*30+i*10)+"px";
                              div.style.height = _t.dataArray[i]*10+"px";
                              div.id="sort"+fId+i;
                              div.className="sortLine";

                              _t.el.appendChild(div);
                        }

                        //设置父容器的高度
                        _t.el.style.height = Math.max.apply(null,_t.dataArray)*10+"px";

            },
            beginAnimation : function(){
                var _t= this;
                //开始排序
                if(!_t.begin){
                    _t.begin = true;
                    _t.quickSort(_t.dataArray);
                }

            },
            quickSort : function(array) {

                    var _t= this;

                    //快速排序，算法来源于网络
                    var i = 0;
                    var j = array.length - 1;
                    var Sort = function(i, j) {

                        var mArr = [];//用来记录算法内部处理数据过程，以方便动画处理
                        mArr.push(i);

                        // 结束条件
                        if (i == j) {
                            return
                        };

                        var key = array[i]; //记录key值
                        var stepi = i; // 记录开始位置
                        var stepj = j; // 记录结束位置
                        while (j > i) {
                            // j <<-------------- 向前查找

                            //如果i值有自增，则认为是新一轮比较开始，重新记录动画节点 
                            if(stepi!=i&&mArr.indexOf(i)==-1){
                                  mArr = [];
                                  mArr.push(i);
                            }

                            if (array[j] >= key) {

                                mArr.push(j);

                                j--;

                            } else {

                                array[i] = array[j];

                                  //当算法排序2个值时便将其当做一个动画节点，并重新记录起始值
                                  mArr.push(j);
                                  _t.markArray.push(mArr);
                                  mArr = [];
                                  mArr.push(j);


                                //i++ ------------>>向后查找
                                while (j > ++i) {

                                     mArr.push(i);

                                    if (array[i] > key) {

                                        array[j] = array[i];

                                         _t.markArray.push(mArr);
                                          mArr = [];

                                        break;
                                    }
                                }
                            }
                        }

                        // 如果第一个取出的 key 是最小的数
                        if (stepi == i) {

                            Sort(++i, stepj);
                            return;
                        }

                        // 最后一个空位留给 key
                        array[i] = key;

                        // 划分数据区块后递归
                        Sort(stepi, i);
                        Sort(j, stepj);
                    }

                    Sort(i, j);

                     //添加标记
                    _t.addMark();

                    return array;
         },
         moveLine : function(idx1,idx2){
              var _t = this,
                   fId = _t.el.id;

              (function(){

                    console.log(idx1+"===>"+idx2);  

                    var el1 = document.getElementById("sort"+fId+idx1),
                          el2 = document.getElementById("sort"+fId+idx2);
                    el1.className = "sortLine sortAct";
                    el2.className = "sortLine sortAct";
                    el1.style.left = (idx2*30 + idx2*10)+ "px";
                    el2.style.left = (idx1*30 + idx1*10)+ "px";

                    //调换位置后ID互换
                    el1.id="sort"+fId+idx2;
                    el2.id="sort"+fId+idx1;


                    _t.markIdx++; //动画运行后自增动画节点index，下次播放的就是下个节点的动画数据

                    //根据间隔时间执行下次动画
                    setTimeout(function(){
                         el1.className = "sortLine";
                         el2.className = "sortLine";

                          _t.clearMark();//清除旧标记
                          _t.lockMark = true;//先锁定不让播放
                          _t.addMark();//加载新动画节点数据


                          //如果是自动播放，则在对应时间自动释放动画锁
                          if(_t.autoPlay){
                              setTimeout(function(){
                                  _t.setLockAnimation();
                              },_t.animationTime/3)
                          }

                    },_t.animationTime/2);
              })();
         },
         addMark : function(){
              var _t = this;
              (function(){

                      if(_t.markIdx>_t.markArray.length-1){return} //数组循环完毕则跳出

                      var data = _t.markArray[_t.markIdx];
                      console.log(data);

                      for(var i=0;i<data.length;i++){
                              _t.addMarkEl(data,i);
                      }

               })();

         },
         addMarkEl : function(data,i){
                var _t = this;
                (function(){

                             var idx = data[i];
                             var idxLen = _t.markArray[_t.markIdx].length;

                             //如果有动画运行则延迟再试
                             if(_t.lockMark){
                                  if(_t.replay){return;}
                                  return setTimeout(function(){
                                      _t.addMarkEl(data,i);
                                  },(_t.animationTime-_t.animationTime/idxLen)/idxLen-100); //让动画时间分配的平均些

                              }
                              _t.lockMark = true;

                              //创建标签
                                var mEl = document.getElementById("sort"+_t.el.id+idx),
                                      mk = document.createElement("i");

                                mk.className = "mark";

                                mEl.getElementsByTagName("i").length==0&&mEl.appendChild(mk);

                                //未执行动画的情况自动添加标记
                                setTimeout(function(){ 

                                    _t.lockMark = false;
                                    var lastIndex = data.length-1;

                                    if(i==lastIndex){
                                          _t.moveLine(data[lastIndex],data[0]);//运行动画
                                    }

                                 },(_t.animationTime-_t.animationTime/idxLen)/idxLen-200);//让动画时间分配的平均些

                    })();
         },
         clearMark : function(){
              var _t = this,
                    fEl = document.getElementById(_t.el.id),
                    cEl = fEl.getElementsByTagName("div");

              for(var i=0;i<cEl.length;i++){
                  if(cEl[i].getElementsByTagName("i").length>0){
                      cEl[i].removeChild(cEl[i].getElementsByTagName("i")[0]);
                  }
              }

         },
         setLockAnimation : function(type){
              var _t= this;
              //步进或自动播放情况释放动画锁
              if(type=="next"||_t.autoPlay){
                _t.lockMark = false;
              }

         },
         setAutoPlay : function(){
              var _t= this;
              _t.autoPlay = !_t.autoPlay;
              console.log("setAuto="+_t.autoPlay);
              if(_t.autoPlay){
                _t.lockMark = false;
              }
         },
        //若有timeou进程使用replay会导致问题，有空再完善
        /* setReplay : function(){
              var _t = this;
              _t.replay = true;
              var id = _t.el.id;
              var oldArray = [];
              //IE8不支持ES5的map方法，使用循环
              var ra =  _t.replayArray.split(",");
              for(var a=0;a<ra.length;a++){
                    oldArray.push(parseInt(ra[a]));
              }

              setTimeout(function(){
                   drawSortProcess.call(_t,id,oldArray);
                  _t = null;
              },500);
         },*/
         setTime : function(){
              var time = document.getElementById("animationTime").value;

              if(time<3000){
                  alert("最小间隔时间为3秒");
                  return;
              }

              parseInt(time)>0?this.animationTime=time:1500;
         },
         getArray : function(){
            return this.dataArray;
         }

 
    }
    
      

window.drawSortProcess = drawSortProcess;
})();

/*===========================
兼容AMD或NODE
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.drawSortProcess;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.drawSortProcess;
    });
}

 var array = [6,8,3,21,18,13,6,5,9,8,10], t = new drawSortProcess("animationSort",array);



//按钮事件
var next = document.getElementById("next");
var play =  document.getElementById("play");
var pause = document.getElementById("pause");
var setTime = document.getElementById("setTime");
//var replay = document.getElementById("replay");

if(window.attachEvent){
    //IE8
    next.attachEvent("onclick", function(){
        t.beginAnimation();
        t.setLockAnimation("next");
        document.getElementById("value").innerHTML = t.getArray();
    });
    play.attachEvent("onclick", function(){
        t.beginAnimation();
        t.setAutoPlay();
        play.innerHTML == "开始"? play.innerHTML ="暂停":  play.innerHTML ="开始";
        document.getElementById("value").innerHTML = t.getArray();
    });
 
   setTime.attachEvent("onclick", function(){
        t.setTime();
    });
   /*replay.attachEvent("onclick", function(){
        t.setReplay();
    });*/

}else{

    next.addEventListener("click", function(){
        t.beginAnimation();
        t.setLockAnimation("next");
        document.getElementById("value").innerHTML = t.getArray();
    });
    play.addEventListener("click", function(){
        t.beginAnimation();
        t.setAutoPlay();
        play.innerHTML == "开始"? play.innerHTML ="暂停":  play.innerHTML ="开始";
        document.getElementById("value").innerHTML = t.getArray();
    });
 
    setTime.addEventListener("click", function(){
        t.setTime();
    });
 /*   replay.addEventListener("click", function(){
       t.setReplay();
       play.innerHTML = "开始";
    });
*/
}



//IE8不支持indexOf方法，Polyfill
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = +fromIndex || 0;
    if (Math.abs(n) === Infinity) {
      n = 0;
    }
    if (n >= len) {
      return -1;
    }
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
    while (k < len) {
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
 


