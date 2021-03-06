var _CalF = {
	$: function(object) { //选择器
		if (object === undefined) return;
		var getArr = function(name, tagName, attr) {
			var tagName = tagName || '*',
				eles = document.getElementsByTagName(tagName),
				clas = (typeof document.body.style.maxHeight === "undefined") ? "className" : "class"; //ie6
			attr = attr || clas,
				Arr = [];
			for (var i = 0; i < eles.length; i++) {
				if (eles[i].getAttribute(attr) == name) {
					Arr.push(eles[i]);
				}
			}
			return Arr;
		};

		if (object.indexOf('#') === 0) { //#id 
			return document.getElementById(object.substring(1));
		} else if (object.indexOf('.') === 0) { //.class
			return getArr(object.substring(1));
		} else if (object.match(/=/g)) { //attr=name
			return getArr(object.substring(object.search(/=/g) + 1), null, object.substring(0, object.search(/=/g)));
		} else if (object.match(/./g)) { //tagName.className
			return getArr(object.split('.')[1], object.split('.')[0]);
		}
	},
	addHandler: function(node, type, handler) {
		node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
	},
	removeHandler: function(node, type, handler) {
		node.removeEventListener ? node.removeEventListener(type, handler, false) : node.detachEvent("on" + type, handler);
	},
	getPosition: function(obj) { //获取元素在页面里的位置和宽高
		var top = 0,
			left = 0,
			width = obj.offsetWidth,
			height = obj.offsetHeight;

		while (obj.offsetParent) {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}

		return {
			"top": top,
			"left": left,
			"width": width,
			"height": height
		};
	},
	addClass: function(c, node) { // 添加样式名
		node.className = node.className + ' ' + c;
	},
	removeClass: function(c, node) { // 移除样式名
		var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
		node.className = node.className.replace(reg, '');
	},
	stopPropagation: function(event) { // 阻止冒泡
		var event = event || window.event;
		event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
	},
	getStyle: function(obj, attr) { //获取css属性
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	},
	ie6: function() {
		return !!window.ActiveXObject && !window.XMLHttpRequest;
	}

};

var cityData = ['北京|beijing|bj', '上海|shanghai|sh', '重庆|chongqing|cq', '深圳|shenzhen|sz', '广州|guangzhou|gz', '杭州|hangzhou|hz',
	'南京|nanjing|nj', '苏州|shuzhou|sz', '天津|tianjin|tj', '成都|chengdu|cd', '南昌|nanchang|nc', '三亚|sanya|sy', '青岛|qingdao|qd',
	'厦门|xiamen|xm', '西安|xian|xa', '长沙|changsha|cs', '合肥|hefei|hf', '西藏|xizang|xz', '内蒙古|neimenggu|nmg', '安庆|anqing|aq', '阿泰勒|ataile|atl', '安康|ankang|ak',
	'阿克苏|akesu|aks', '包头|baotou|bt', '北海|beihai|bh', '百色|baise|bs', '保山|baoshan|bs', '长治|changzhi|cz', '长春|changchun|cc', '常州|changzhou|cz', '昌都|changdu|cd',
	'朝阳|chaoyang|cy', '常德|changde|cd', '长白山|changbaishan|cbs', '赤峰|chifeng|cf', '大同|datong|dt', '大连|dalian|dl', '达县|daxian|dx', '东营|dongying|dy', '大庆|daqing|dq', '丹东|dandong|dd',
	'大理|dali|dl', '敦煌|dunhuang|dh', '鄂尔多斯|eerduosi|eeds', '恩施|enshi|es', '福州|fuzhou|fz', '阜阳|fuyang|fy', '贵阳|guiyang|gy',
	'桂林|guilin|gl', '广元|guangyuan|gy', '格尔木|geermu|gem', '呼和浩特|huhehaote|hhht', '哈密|hami|hm',
	'黑河|heihe|hh', '海拉尔|hailaer|hle', '哈尔滨|haerbin|heb', '海口|haikou|hk', '黄山|huangshan|hs', '邯郸|handan|hd',
	'汉中|hanzhong|hz', '和田|hetian|ht', '晋江|jinjiang|jj', '锦州|jinzhou|jz', '景德镇|jingdezhen|jdz',
	'嘉峪关|jiayuguan|jyg', '井冈山|jinggangshan|jgs', '济宁|jining|jn', '九江|jiujiang|jj', '佳木斯|jiamusi|jms', '济南|jinan|jn',
	'喀什|kashi|ks', '昆明|kunming|km', '康定|kangding|kd', '克拉玛依|kelamayi|klmy', '库尔勒|kuerle|kel', '库车|kuche|kc', '兰州|lanzhou|lz',
	'洛阳|luoyang|ly', '丽江|lijiang|lj', '林芝|linzhi|lz', '柳州|liuzhou|lz', '泸州|luzhou|lz', '连云港|lianyungang|lyg', '黎平|liping|lp',
	'连成|liancheng|lc', '拉萨|lasa|ls', '临沧|lincang|lc', '临沂|linyi|ly', '芒市|mangshi|ms', '牡丹江|mudanjiang|mdj', '满洲里|manzhouli|mzl', '绵阳|mianyang|my',
	'梅县|meixian|mx', '漠河|mohe|mh', '南充|nanchong|nc', '南宁|nanning|nn', '南阳|nanyang|ny', '南通|nantong|nt', '那拉提|nalati|nlt',
	'宁波|ningbo|nb', '攀枝花|panzhihua|pzh', '衢州|quzhou|qz', '秦皇岛|qinhuangdao|qhd', '庆阳|qingyang|qy', '齐齐哈尔|qiqihaer|qqhe',
	'石家庄|shijiazhuang|sjz', '沈阳|shenyang|sy', '思茅|simao|sm', '铜仁|tongren|tr', '塔城|tacheng|tc', '腾冲|tengchong|tc', '台州|taizhou|tz',
	'通辽|tongliao|tl', '太原|taiyuan|ty', '威海|weihai|wh', '梧州|wuzhou|wz', '文山|wenshan|ws', '无锡|wuxi|wx', '潍坊|weifang|wf', '武夷山|wuyishan|wys', '乌兰浩特|wulanhaote|wlht',
	'温州|wenzhou|wz', '乌鲁木齐|wulumuqi|wlmq', '万州|wanzhou|wz', '乌海|wuhai|wh', '兴义|xingyi|xy', '西昌|xichang|xc', '襄樊|xiangfan|xf',
	'西宁|xining|xn', '锡林浩特|xilinhaote|xlht', '西双版纳|xishuangbanna|xsbn', '徐州|xuzhou|xz', '义乌|yiwu|yw', '永州|yongzhou|yz', '榆林|yulin|yl', '延安|yanan|ya', '运城|yuncheng|yc',
	'烟台|yantai|yt', '银川|yinchuan|yc', '宜昌|yichang|yc', '宜宾|yibin|yb', '盐城|yancheng|yc', '延吉|yanji|yj', '玉树|yushu|ys', '伊宁|yining|yn', '珠海|zhuhai|zh', '昭通|zhaotong|zt',
	'张家界|zhangjiajie|zjj', '舟山|zhoushan|zs', '郑州|zhengzhou|zz', '中卫|zhongwei|zw', '芷江|zhijiang|zj', '湛江|zhanjiang|zj'
];


var iCity = {
	inputSelector: function(id) { //input添加点击事件
		var input = document.getElementById(id);
		_CalF.addHandler(input, 'click', function() {
			iCity.input = input;
			popList.style.visibility = "hidden";
			iCity.outClick();
			iCity.aClick();
			iCity.getPosition();
		});
		_CalF.addHandler(input, 'keyup', function(event) {
			var event = event || window.event,
				keycode = event.keyCode;
			popCity.style.visibility = "hidden";
			iCity.createUL();
		});
	},
	_temp: [
		"<h1>选择城市(支持汉字/拼音/拼音缩写)</h1>",
		"<ul id='popMenu'>",
		"<li class='active'>热门城市</li>",
		"<li>ABCDEFG</li>",
		"<li>HIGHLMN</li>",
		"<li>OPQRSTU</li>",
		"<li>VWXYZ</li>",
		"</ul>",
		"<div id='popCityCon'></div>"
	],
	cityClass: function() { //城市分类
		if (!this.citys) {
			//{HOT:{hot:[],ABCDEFG:{a:[1,2,3],b:[1,2,3]},HIGHLMN:{},OPQRSTU:{},VWXYZ:{}}
			this.citys = {
				"hotCity": [],
				"ABCDEFG": {},
				"HIGHLMN": {},
				"OPQRSTU": {},
				"VWXYZ": {}
			};
			var make, fn, name,
				reg1 = /^[a-g]$/i,
				reg2 = /^[h-n]$/i,
				reg3 = /^[o-u]$/i,
				reg4 = /^[v-z]$/i;

			for (i in cityData) {
				make = cityData[i].split("|"); //分割成数组
				fn = make[2].substring(0, 1).toUpperCase(); //获取英文第一个字母转换成大写
				name = make[0];
				if (reg1.test(fn)) {
					if (!this.citys.ABCDEFG[fn]) this.citys.ABCDEFG[fn] = [];
					this.citys.ABCDEFG[fn].push(name)
				} else if (reg2.test(fn)) {
					if (!this.citys.HIGHLMN[fn]) this.citys.HIGHLMN[fn] = [];
					this.citys.HIGHLMN[fn].push(name)
				} else if (reg3.test(fn)) {
					if (!this.citys.OPQRSTU[fn]) this.citys.OPQRSTU[fn] = [];
					this.citys.OPQRSTU[fn].push(name)
				} else if (reg4.test(fn)) {
					if (!this.citys.VWXYZ[fn]) this.citys.VWXYZ[fn] = [];
					this.citys.VWXYZ[fn].push(name)
				}

				if (i < 20) {
					if (!this.citys.hotCity["HOT"]) this.citys.hotCity["HOT"] = [];
					this.citys.hotCity["HOT"].push(name);
				}
			}

		}
	},
	creatDiv: function() {
		var popCity = document.createElement("div"); //城市div
		popCity.id = "popCity";
		popCity.innerHTML = this._temp.join("");
		_CalF.addHandler(popCity, "click", _CalF.stopPropagation); //阻止事件冒泡

		var popList = document.createElement("div"); //输入提示div
		_CalF.addHandler(popList, "click", _CalF.stopPropagation); //阻止事件冒泡
		popList.id = "popList";

		document.body.appendChild(popCity);
		document.body.appendChild(popList);
		this.popCity = popCity;
		this.popList = popList;
	},
	getData: function() {
		this.creatDiv();
		this.cityClass();
		var i, div, arr, dl, dt, dd, _tempDD,
			popCityCon = _CalF.$("#popCityCon"),
			data = this.citys;

		for (var i in data) {
			div = document.createElement("div");
			div.id = i;
			if (div.id == "hotCity") div.className = "active";
			arr = [];

			for (var b in data[i]) {
				arr.push(b);
				arr.sort();
			}

			for (var c in arr) {
				dl = document.createElement("dl");
				dt = document.createElement("dt");
				dd = document.createElement("dd");
				dt.innerHTML = arr[c];

				_tempDD = [];
				for (var d in data[i][arr[c]]) {
					_tempDD.push("<a>" + data[i][arr[c]][d] + "</a>");
				}
				dd.innerHTML = _tempDD.join("");

				dl.appendChild(dt);
				dl.appendChild(dd);
				div.appendChild(dl);
			}

			popCityCon.appendChild(div);
		}
		if (_CalF.ie6()) {
			popCityCon.appendChild(this.createIframe());
			this.aHover();
		}
		this.tabClick();
	},
	tabClick: function() {
		var index,
			popMenu = _CalF.$("#popMenu"),
			popCityCon = _CalF.$("#popCityCon"),
			myIframe = _CalF.$("#myIframe"),
			popCity = _CalF.$("#popCity"),
			lis = popMenu.getElementsByTagName("li"),
			divs = popCityCon.getElementsByTagName("div");
		for (var i = 0; i < lis.length; i++) {
			lis[i].index = i;
			lis[i].onclick = function() {
				for (var j = 0; j < i; j++) {
					_CalF.removeClass("active", lis[j]);
					_CalF.removeClass("active", divs[j]);
				}
				_CalF.addClass("active", this);
				_CalF.addClass("active", divs[this.index]);
				if (_CalF.ie6()) {
					myIframe.style.height = popCity.offsetHeight + 'px';
				};
			}
		}
	},
	aClick: function() {
		var that = this,
			popCityCon = _CalF.$("#popCityCon"),
			links = popCityCon.getElementsByTagName("a");
		for (var i in links) {
			links[i].onclick = function() {
				that.input.value = this.innerHTML;
				that.popCity.style.visibility = "hidden";
			}
		}
	},
	aHover: function() {
		var that = this,
			popCityCon = _CalF.$("#popCityCon"),
			links = popCityCon.getElementsByTagName("a");
		for (var i in links) {
			links[i].onmouseover = function() {
				_CalF.addClass("active", this)
			}
			links[i].onmouseout = function() {
				_CalF.removeClass("active", this)
			}
		}
	},
	liClick: function() {
		var that = this,
			popList = that.popList,
			lis = popList.getElementsByTagName("li");
		for (var i = 0, len = lis.length; i < len; i++) {
			lis[i].onclick = function() {
				that.input.value = this.innerHTML;
				that.popList.style.visibility = "hidden";
			}
		}
	},
	liHover: function() {
		var that = this,
			popList = that.popList,
			lis = popList.getElementsByTagName("li");
		for (var i = 0, len = lis.length; i < len; i++) {
			lis[i].onmouseover = function() {
				_CalF.addClass("active", this)
			}
			lis[i].onmouseout = function() {
				_CalF.removeClass("active", this)
			}
		}
	},
	getPosition: function() {
		var Pos = _CalF.getPosition(iCity.input);
		popCity.style.top = Pos.top + Pos.height + "px";
		popCity.style.left = Pos.left + "px";
		popCity.style.visibility = "visible";

		popList.style.top = Pos.top + Pos.height + "px";
		popList.style.left = Pos.left + "px";
		popList.style.width = Pos.width + "px";
	},
	createIframe: function() { //ie6创建iframe遮罩
		var myIframe = document.createElement('iframe');
		myIframe.id = 'myIframe';
		myIframe.style.position = 'absolute';
		myIframe.style.zIndex = '-1';
		myIframe.style.left = '-1px';
		myIframe.style.top = 0;
		myIframe.style.border = 0;
		myIframe.style.filter = 'alpha(opacity= 0 )';
		myIframe.style.width = this.popCity.offsetWidth + 'px';
		myIframe.style.height = this.popCity.offsetHeight + 'px';
		this.myIframe = myIframe;
		return myIframe;
	},
	createIframe2: function() { //ie6创建iframe遮罩
		var myIframe2 = document.createElement('iframe');
		myIframe2.id = 'myIframe2';
		myIframe2.style.position = 'absolute';
		myIframe2.style.zIndex = '-1';
		myIframe2.style.left = '-1px';
		myIframe2.style.top = 0;
		myIframe2.style.border = 0;
		myIframe2.style.filter = 'alpha(opacity= 0 )';
		myIframe2.style.width = this.popList.offsetWidth + 'px';
		myIframe2.style.height = this.popList.offsetHeight + 'px';
		return myIframe2;
	},
	createUL: function() {
		var value = this.input.value,
			popList = this.popList;
		if (value !== "") {
			var ul = document.createElement('ul'),
				searchResult = [],
				reg = new RegExp("^" + value + "|\\|" + value, 'gi'),
				make, str;
			searchResult.push("<ul>");
			for (var i in cityData) {
				if (reg.test(cityData[i])) { //含有字符串
					make = cityData[i].split("|"); //分割成数组
					str = "<li>" + make[0] + "</li>";
					searchResult.push(str);
				}
			}
			searchResult.push("</ul>");

			if (searchResult.length > 2) {
				popList.innerHTML = searchResult.join("");
				if (_CalF.ie6()) {
					popList.appendChild(this.createIframe2());
					this.liHover();
				};
				this.liClick();
				popList.style.visibility = "visible";
			}

		} else {
			popList.style.visibility = "hidden";
		}
	},
	outClick: function() { //鼠标在对象区域外点击隐藏
		var that = this;
		_CalF.addHandler(document, 'click', function(event) {
			var event = event || window.event,
				target = event.target || event.srcElement;
			if (target == that.input || target == that.popCity || target == that.popList) return;
			that.popCity.style.visibility = "hidden";
			that.popList.style.visibility = "hidden";
		});
	}


};

iCity.getData();
var input = iCity.inputSelector("input-weather");