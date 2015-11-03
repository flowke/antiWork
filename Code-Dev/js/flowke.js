var
    mHdbg = Sizzle('.m-Hdbg')[0],

    mNav_li = Sizzle('.m-gloNav li'),
    mNav_ul = Sizzle('.m-gloNav ul')[0],
    mNav_hov = Sizzle('.m-gloNav .hov')[0],

    mSearch_kw = Sizzle('.m-search .kw')[0],

    aDln_hov = Sizzle('.m-download .hover'),
    aDln_dd = Sizzle('.m-download dd'),
    oDln_bor = Sizzle('.m-download dt')[0];


/* hd bg changing*/
(function(){
    var aImg = ['url(img/banner1.jpg)', 'url(img/banner2.jpg)', 'url(img/banner3.jpg)'],
        ctrlArray = 0,
        ctrlNode = 0;

    var newNode = document.createElement('div');
    newNode.className = 'm-Hdbg';
    newNode.style.opacity = 0;
    mHdbg.appendChild(newNode);

    mHdbg.timer = setInterval(function(){
        ctrlNode = (++ctrlNode) % 2;
        ctrlArray = (++ctrlArray) % aImg.length;

        mHdbg.children[ctrlNode].style.backgroundImage = aImg[ctrlArray];
        movement(mHdbg.children[1], {
            "opacity" : ctrlNode*100
        }, 600, 'easeIn' );

    },3000);

})();


/*bind fn to nav module*/
(function(){
    var widContain = [],
        dist = [],
        accu = 0;

    mNav_li[mNav_li.length-1].style.width = parseFloat( getStyle(mNav_li[0], 'width') ) + 40 + 'px';
    mNav_hov.indx = 0;

    for(var i=0, l=mNav_li.length-1; i<l; i++){
        var tem = parseFloat( getStyle(mNav_li[i], 'width') ) + 40;
        dist.push(accu);

        accu += tem;
        widContain.push(tem);

        (function(i){
            mNav_li[i].onmouseover = function(){
                setPoint(widContain[i], dist[i]);
            };
            mNav_li[i].onclick = function(){
                setPoint(widContain[i], dist[i]);
                mNav_hov.indx = i;
            };
        })(i);
    }
    mNav_ul.onmouseout = function(){
        mNav_hov.style.width = widContain[mNav_hov.indx] + 'px';
        mNav_hov.style.left = dist[mNav_hov.indx] + 'px';
    };
    function setPoint(a,b){
        mNav_hov.style.width = a + 'px';
        mNav_hov.style.left = b + 'px';
    }
})();

/*search module*/
(function(){
    var input = '';

    mSearch_kw.onfocus = function(){
        this.value = '';
        setSearch.call(this, 180, 12, '#000');
        this.value = input;
    };
    mSearch_kw.onblur = function(){
        input = this.value;
        setSearch.call(this,30, 10, '#AFAFAF');
        this.value = '';
    };
    function setSearch(wid, fsiz, color){
        this.style.width = wid + 'px';
        this.style.fontSize = fsiz + 'px';
        this.style.color = color;
    }

})();

/*bind fn to download module*/
for(var i=0, l=aDln_dd.length; i<l; i++){

    (function(i){
        aDln_dd[i].onmouseover = function(){
            aDln_hov[i].style.left = 0 + 'px';
            oDln_bor.style.borderLeftWidth = 0 +'px';
        };

        aDln_dd[i].onmouseout = function(){
            aDln_hov[i].style.left = -240 + 'px';
            oDln_bor.style.borderLeftWidth = 4 + 'px' ;
        };
    })(i);
    
}



/*move*/
function movement(elem,endVal,times,type, stepfn, cbfn ){
    
    if( typeof times == 'undefined' ){
        times = 400;
        type = 'linear';
    }
    
    if( typeof times == 'string' ){
        if(typeof type == 'function'){
            cbfn = type;
        }
        type = times;
        times = 400;
    }
    else if(typeof times == 'function'){
        cbfn = times;
        times = 400;
        type = 'linear';
    }
    else if(typeof times == 'number'){
        if(typeof type == 'function'){
            cbfn = type;
            type = 'linear';
        }
        else if(typeof type == 'undefined'){
            type = 'linear';
        }
    }
    
    var bgnVal = {};
    var changeVal = {};
    
    for(var attr in endVal){
        changeVal[attr] = 0;
        
        if( attr == 'opacity' ){
            bgnVal[attr] = Math.round( getStyle(elem, attr)*100 );  /*here to get Css*/
            changeVal[attr] = endVal[attr] - bgnVal[attr] ;
        }
        else{
            bgnVal[attr] = parseInt(getStyle(elem, attr)) ;     /*here to get Css*/
            changeVal[attr] = endVal[attr] - bgnVal[attr] ;
        }
    }
    
    var startTime = now();
    
    clearInterval(elem.timer);
    
    elem.timer = setInterval(function(){
        
        var changeTime = now();
        
        var t = changeTime - startTime;
        t = t > times ? times : t ;
        
        for(var attr in endVal){
            
            var value = Tween[type](t,bgnVal[attr],changeVal[attr],times);
            
            if(attr == 'opacity'){
                elem.style.opacity = value/100;
                elem.style.filter = 'alpha(opacity='+value+')';
            }
            else{
                elem.style[attr] = value + 'px';
            }
            
        }

        stepfn && stepfn();
        
        if(t == times){
            clearInterval(elem.timer);
            cbfn && cbfn();
        }
        
    },13);
    
    function now(){
        return (new Date()).getTime();
    }
    
}


var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) { 
            return b; 
        }
        if ( (t /= d) == 1 ) {
            return b+c; 
        }
        if (!p) {
            p=d*0.3; 
        }
        if (!a || a < Math.abs(c)) {
            a = c; 
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },    
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                    Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
           s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    }, 
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },       
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },      
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}



/*get style*/

function getStyle(elem, attr){
    var peElt = arguments[2] || null;

    var tempVal = css(elem, attr, peElt);
    var regVal = /%$/;
    if(tempVal.search(regVal) == -1){
        return tempVal;
    }else{
        var regAttr = /top|height/;
        var prt = elem.parentNode;
        var atr;
        if(attr.search(regAttr) == -1){
            atr = 'width';
        }else{
            atr = 'height';
        }
        
        return parseFloat(css(prt, atr))*parseFloat(tempVal)/100 + 'px' ;
    }

    function css(elem, attr, peElt){
        if(getComputedStyle){
            return getComputedStyle(elem, arguments[2] || null)[attr];
        }else{
            return elem.currentStyle[attr];
        }
    }  
}