/**
 * 
 * 2023.10월 : br
 * 모바일 etopia 구조적 용도
 * 
 */
var $doc = $(document);
$doc.ready(function(){
Kakao.init("e26bd625a2612a1880395308bf330f72");
var userAgent ='';
	    var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
	    if ( varUA.indexOf('android') > -1) {
	        //안드로이드
	        userAgent = "android";
	    } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
	        //IOS
	        userAgent = "ios";
	    } else {
	        //아이폰, 안드로이드 외
	        userAgent = "other";
	    }

});
function stickyResultTable(){
	var $table = $("#refund_result table");
	if(!$table.length) return;
	$table.stickyTable()
}
function sticky3depthTable(){
	var $table = $('#subInput table');
	if(!$table.length) return;
	$table.stickyTable({onlyTopFixed: true});
}

function inputWidthFull() {
	var $table = $('table');
	if(!$table.length) return;
	var $input = $table.find('input');
	$.each($input, function(i){
		var $tg = $input.eq(i);
		if($tg.attr('type') === "text" || $tg.attr('type') === "password") {
			$tg.css('width', '100%')
		}
	})
}

function selectBoxWrap() {
	var $wrap = $('.content_area');
	if(!$wrap.length) return;
	$wrap.find('select').wrap('<div class="select-box"></div>');
}

function commentBoxSticky() {
	var $box = $doc.find('.commentBox');
	if(!$box.length) return;
	$box.parent().addClass('commentbox-sticky')
}

function autoTableInterval() {
	var $tg = $doc.find('.guaranteeTd0');
	if(!$tg.length) return;
	$tg.each(function(i){
		var $interval = $tg.eq(i);
		if($interval.parent().prev().length > 0) {
			$interval.parent().prev().find('.commentBox').css('padding-bottom','16px');
		}
	})
}

function tableWideSet() {
	var $table = $(".tableType02");
	if(!$table.length) return;
	var $group = $table.find("colgroup")
	$group.find("col:not(:first-child)").remove();
}

function scrollBottom() {
	var $wrap = $('html, body');
	$wrap.animate({scrollTop: $wrap.height()}, 1000);
}

function accessibilityAccordionInit() {
	var optWrap = '[data-accordion="accordion-wrap"]';
	var optHead = '[data-accordion="accordion-head"]';
	var optBody = '[data-accordion="accordion-body"]';
	var expanded = 'aria-expanded';
	var controls = 'aria-controls';
	var id = 'id';
	var on = 'on';
	var role = 'role';
	var ac = 'accControl';
	var _T = 'true';
	var _F = 'false';
	
	var $accWrap = $(optWrap);
	if(!$accWrap.length) return;
	
	$.each($accWrap, function(i) {
		var $tgW = $accWrap.eq(i);	
		var $tgHead = $tgW.find(optHead);
		var $tgBody = $tgW.find(optBody);
		var _N = i+1;
				
		var $accID = $tgHead.attr(id) ? $tgHead.attr(id) : 'accId'+_N;
		
		$tgHead.attr({
			[expanded] : _F,
			[controls] : ac+_N,
			[id] : $accID
		})
		
		$tgBody.attr({
			[role] : 'region',
			[controls] : $accID,
			[id] : ac+_N
		})
		
		if($tgBody.css('display') === 'block') {
			$tgHead.attr({[expanded]: _T})
			$accWrap.addClass(on);
		}
	})
	
	$(optHead).on('click', function(e) {
		e.preventDefault();
		var tf = $(this).attr(expanded) == _F ? _T : _F;
		$(this).attr(expanded, tf);
		$(this).parent().siblings().find(optHead).attr(expanded, _F);
		$(this).parent().toggleClass(on).siblings().removeClass(on);
		$(this).parent().siblings().find(optBody).slideUp();	
		$(this).next().slideToggle();
	})
}

/* 20231127 | 모바일보험료계산 알림톡 이미지 생성 | 신제원 */
function dataURItoBlob(dataURI) {
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++)
	{
		ia[i] = byteString.charCodeAt(i);
	}

	var bb = new Blob([ab], { type: mimeString });
	return bb;
}
function sendKakaoImage(){
	$("#m-print").css("width","fit-content"); // 이미지 생성 전 가로스크롤 임시 제거
	$("#m-print").css("padding","10px"); // 이미지에 padding 10px 부여
	$(".sticky-col").css("display","none"); // 해약환급금 예시표 sticky 임시 제거
	$(".sticky-intersect").css("display","none"); // 해약환급금 예시표 sticky 임시 제거
	$(".sticky-thead").css("display","none"); // 해약환급금 예시표 sticky 임시 제거
	html2canvas(document.querySelector("#m-print")).then(canvas => {
		//document.body.appendChild(canvas);
		var imgDataUrl = canvas.toDataURL("image/png");
		//var imgHtml = '<img src=\"' + imgDataUrl + '\" alt=\"\" class=\"resultImg\">';
		//$('#m-print').append(imgHtml);
		//$(".resultImg").css("display", "none");
		
		//Kakao.init("e26bd625a2612a1880395308bf330f72");
	var imgBlob = dataURItoBlob(imgDataUrl);
			var imgFile = new File([imgBlob],'image' + '.png', {
				type : imgBlob.type,
			});	
	var imgFiles = [imgFile];
	Kakao.Share.uploadImage({
		file:imgFiles,
	}).then(function(res){
		alert("이미지생성성공 : "+ res.infos.original.url);
		sendKakaoTmp(res.infos.original.url);
	}).catch(error => {
		console("이미지생성실패 : " + error);
	});;
					
	})
	$("#m-print").css("width","auto"); // 이미지 생성 후 가로스크롤 제거 취소
	$("#m-print").css("padding","0px"); // 이미지 생성 후 영역 padding 제거
	$(".sticky-col").css("display","block"); // 해약환급금 예시표 sticky 제거 취소
	$(".sticky-intersect").css("display","block"); // 해약환급금 예시표 sticky 제거 취소
	$(".sticky-thead").css("display","block"); // 해약환급금 예시표 sticky 제거 취소	
		
	//alert("sendCard");

}
function sendKakaoTmp(imageUrl){
	//alert("sendKakaoTmp 실행 : "+imageUrl);
	Kakao.Share.sendDefault({
			 objectType: 'feed',
			  content: {
				title: '간단보험료 설계 결과',
				description: '하단 버튼 클릭 후 이미지를 길게 눌러 저장하세요.',
				imageUrl: imageUrl,
				imageWidth:600,
				imageHeight:390,
				link: {
					// mobileWebUrl: 'https://mdev.idblife.com/callToFP.mvc?telNum=' + final_phone,
					mobileWebUrl:imageUrl,
					// webUrl: 'https://mdev.idblife.com/callToFP.mvc?telNum=' + final_phone,
					webUrl: imageUrl,
					//androidExecParams: 'tel:' + final_phone,
					//iosExecParams: 'tel:' + final_phone
				},
			},
			buttons: [
				{
					title: '이미지 저장하기',
					link: {
						mobileWebUrl: imageUrl,
						webUrl: imageUrl,
					},
				},
			]
		});
	}

function sendKakaoImage3(){
	/*if(checkMobile =='android' || checkMobile =='ios' || checkMobile == 'other'){*/
		Kakao.Share.sendDefault({
			 objectType: 'feed',
			  content: {
				title: '스마트명함 서비스',
				description: 'DB생명보험 설계사입니다. 보험가입 문의주시면 친철히 상담해드리겠습니다.',
				imageUrl: '',
				imageWidth:600,
				imageHeight:390,
				link: {
					// mobileWebUrl: 'https://mdev.idblife.com/callToFP.mvc?telNum=' + final_phone,
					mobileWebUrl: '',
					// webUrl: 'https://mdev.idblife.com/callToFP.mvc?telNum=' + final_phone,
					webUrl: '',
					//androidExecParams: 'tel:' + final_phone,
					//iosExecParams: 'tel:' + final_phone
				},
			},
			buttons: [
				{
					title: 'DB생명보험',
					link: {
						mobileWebUrl: 'https://mdev.idblife.com',
						webUrl: 'https://www.idblife.com',
						//androidExecParams: 'https://www.idblife.com',
						//iosExecParams: 'https://www.idblife.com'
					},
				},
			]
		});
	/*}*/
	//alert(userAgent);
}
