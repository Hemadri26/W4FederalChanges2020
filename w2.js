//global variables definition
/*myScroll,lang,account,countryName, currentDate*/

var myScroll, lang;
var account = "";
var buttonstatus = true;
var countryName = "US";
var currentDate = new Date();
var currentApp = "w4";
var calculatedLanguage = ""; //Fix for any browser language
var w2 = {
	initialize : function() {"use strict";
		this.bind();
	},
	bind : function() {"use strict";
		if(lilly.tool.checkPlatformIpad()) {
			document.addEventListener('touchmove', function(e) {
				e.preventDefault();
			}, false);
		}
	},
	onBeforeScrollStart : function(e) {"use strict";
		var nodeType = e.explicitOriginalTarget ? e.explicitOriginalTarget.nodeName.toLowerCase() : (e.target ? e.target.nodeName.toLowerCase() : '');
		if(nodeType !== 'select' && nodeType !== 'option' && nodeType !== 'input' && nodeType !== 'textarea') {
			$("#edit-page input[type='text']").blur();
			e.preventDefault();
			e.stopPropagation();
		}
	},
	refreshScroll : function() {"use strict";
		if(lilly.tool.checkPlatformIpad()) {
			setTimeout(function() {
				myScroll.refresh();
			}, 500);
		}
	},
	changeView : function(fromView, toView, fromStep, toStep) {"use strict";
		//$("#steps").removeClass(fromStep).addClass(toStep);
		//change page
		$(fromView).fadeOut().hide();
		$(toView).fadeIn();
	},
	toArray : function(object) {
		if( typeof object[0] === "undefined") {
			object = [object];
		}
		return object;
	},
	myLillyCallback : function(response) {

		lilly.tool.loading.hide();
	},
	callMyLilly : function(element) {
		/*lilly.tool.loading.show();
		var url = "http://backtomylilly.com?&handler=w2.myLillyCallback&data=" + element;
		$("body").append("<a href='" + url + "' id='w2Online-temp-link'></a>");
		setTimeout(function() {
			document.getElementById("w2Online-temp-link").click();
			$("#w2Online-temp-link").remove();
		}, 100);*/
		lilly.tool.loading.show();
		var pathname = element.match(/\/\/[^\/]+\/([^\.]+)/)[1];
		pathname = "/" + pathname;
		pathname = pathname.replace("/gdv","");
		pathname = pathname.replace("/gqa","");
		var url = "http://backtomylilly.com?&handler=w2.myLillyCallback&data=" + element;
		var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
		//if(navigator.userAgent.match(/iPad/i) == null)
		if(!is_uiwebview)
		{
		url = pathname;
		$("body").append("<a href='" + url + "' id='w2Online-temp-link' target='_blank'></a>");
		lilly.tool.loading.hide();
		}
		else{
		$("body").append("<a href='" + url + "' id='w2Online-temp-link'></a>");
		}
		setTimeout(function() {
			document.getElementById("w2Online-temp-link").click();
			$("#w2Online-temp-link").remove();
		}, 100);
	},
	ready : function() {"use strict";
		/*lilly.tool.initConsole();
		$("[data-localize]").localize("lang", {
			level : 3,
			pathPrefix : "ApplicationComp/W2-W4/lang",
			callback : function(data, defaultCallback) {
				lang = data;
				defaultCallback(data);
			}
		});*/
				lilly.tool.getAcceptLanguage(function(lang1){
			//console.log("lilly.tool.getAcceptLanguage-"+lang);
			var language = lang1.toString().toLowerCase();
	    //language = lilly.tool.getLocation();
		lilly.tool.initConsole();
		if(!go__b(countryName)){
			return;
		}
		$("[data-localize]").localize("lang",$.extend({}, {
			level : 3,
			language : language,
			pathPrefix : "ApplicationComp/W2-W4/lang",
			callback : function(data, defaultCallback) {
				lang = data;
				defaultCallback(data);
				calculatedLanguage = language;
			}},
			{
			errorFunc : function(jqXHR, textStatus, errorThrown){
							$("[data-localize]").localize("lang",$.extend({}, {
							//level : 3,
							language : 'en',
							pathPrefix : "ApplicationComp/W2-W4/lang",
							callback : function(data, defaultCallback) {
							lang = data;
							calculatedLanguage = 'en';
							defaultCallback(data);
							}
							}));
						}
			
			
                       // phase2 : true
		}));

		if(lilly.tool.checkPlatformIpad()) {
			myScroll = new iScroll('scroll-wrapper');
			myScroll.options.onBeforeScrollStart = w2.onBeforeScrollStart;
			lilly.tool.ipadScreenResize('908px', '666px', 'scroll-wrapper');
			setTimeout(function() {
				myScroll.refresh();
			}, 500);
		}
		$(window).resize(function() {
			lilly.tool.loading.position();
			if(lilly.tool.checkPlatformIpad()) {
				lilly.tool.ipadScreenResize('908px', '666px', 'scroll-wrapper');
				setTimeout(function() {
					myScroll.refresh();
				}, 500);
			}
		});

		overviewapp.init();
		$("#btn-home").click(function(e) {
			if(lilly.tool.checkBrowserContainer()) {
				window.location.href = containerHomeBref;
			} else {
				window.location.href = browserHomeBref;
			}
		});
		});
	}
};
var overviewapp = {
	responseData : function() {

		overviewapp.getW2Data(function(response) {

			if(currentApp == "w2") {
				if(response.PersonnelNumber)
					$('#personnelNo').html(response.PersonnelNumber);
				if(response.PersonnelName)
					$('#name').html(response.PersonnelName);
				if(response.Form || response.Election) {
					console.log("Form Record Found");
					var W2FormArray = new Array();
					if(response.Form) {

						var W2FormData = w2.toArray(response.Form);
						var exist;
						$.each(W2FormData, function(ind, val) {
							exist = false;
							var i = 0;
							if(!W2FormArray.length) {
								W2FormArray[0] = {
									"year" : val.Year
								};
								W2FormArray[0].forms = [W2FormData[ind]];
							} else {
								$.each(W2FormArray, function(index, formArray) {
									if(val.Year == formArray.year) {
										exist = true;
										W2FormArray[index].forms.push(val);
									}
								});
								if(!exist) {
									i = W2FormArray.length;
									W2FormArray[i] = {
										"year" : val.Year
									};
									W2FormArray[i].forms = [W2FormData[ind]];
								}
							}
						});
						W2FormArray.sort(function(a, b) {
							return b.year - a.year;
						});
						$('#collapsible-block').empty();
					}
					overviewapp.generateOverviewTemplate("collapsible-block", response.Election, W2FormArray);
				} else {
					jAlert("No Record Found");
				}
				$('.onoffswitch-inner').bind('click', function() {

				});
				/*do cleanup first, remove all addresses except the feed*/
				$("#overview-page .icon-plus").parent().unbind('click').click(overviewapp.onAddBtnClick);
				$("#overview-page .icon-trash").parent().unbind('click').click(overviewapp.onDeleteBtnClick);
				$("#overview-page .icon-pencil").parent().unbind('click').click(overviewapp.onEditBtnClick);
				$('#collapsible-block .collapsible-div:first .section-title').trigger('click');
				$('#collapsible-block .collapsible-div').find('.collapsible-form:first').find('input:radio').attr('checked', true);
				$("#w2Heading").show();
				$("#w4Heading").hide();

			} else {
				if(response.GlobalId)
					$('#personnelNo').html(response.GlobalId);
				if(response.EmpName)
					$('#name').html(response.EmpName);
				if(response.W4Overview) {
					var W2FormArray = new Array();
					var filingArray = new Array();
					var fieldArray = new Array();
					var W4fedArray = new Array();
					var TaxExemIndArr = new Array();
					var alternateFormula = new Array();
					response.W4Overview = overviewapp.sort(response.W4Overview);
					var W2FormData = w2.toArray(response.W4Overview);
					var exist;
					$.each(W2FormData, function(ind, val) {
						exist = false;
						var i = 0;
						if(!W2FormArray.length) {
							W2FormArray[0] = {
								"year" : val.Year
							};
							W2FormArray[0].forms = [W2FormData[ind]];
						} else {
							$.each(W2FormArray, function(index, formArray) {
								if(val.Year == formArray.year) {
									exist = true;
									W2FormArray[index].forms.push(val);
								}
							});
							if(!exist) {
								i = W2FormArray.length;
								W2FormArray[i] = {
									"year" : val.Year
								};
								W2FormArray[i].forms = [W2FormData[ind]];
							}
						}
					});
					$('#collapsible-block').empty();

					if(response.FilingStatus)
						filingArray = w2.toArray(response.FilingStatus);
					if(response.Fields_Property)
						fieldArray = w2.toArray(response.Fields_Property);
					if(response.Tax_Exem_Ind)
						TaxExemIndArr = w2.toArray(response.Tax_Exem_Ind);
					if(response.Alternate_Formula)
						alternateFormula = w2.toArray(response.Alternate_Formula)
					overviewapp.generateOverviewTemplateW4("collapsible-block", response.W4Overview, filingArray, fieldArray, W2FormArray, TaxExemIndArr, alternateFormula);

				} else {
					jAlert("No Record Found");
				}
				/*do cleanup first, remove all addresses except the feed*/
				$("#overview-page-w4 .icon-plus").parent().unbind('click').click(overviewapp.onAddBtnClick);
				$("#overview-page-w4 .icon-trash").parent().unbind('click').click(overviewapp.onDeleteBtnClick);
				$("#overview-page-w4 .icon-pencil").parent().unbind('click').click(overviewapp.onEditBtnClick);
				//$('#collapsible-block .collapsible-div:first .section-title').trigger('click');
				$('#collapsible-block .collapsible-div .section-title').trigger('click');
				$('#collapsible-block .collapsible-div').find('.collapsible-form:first').find('input:radio').attr('checked', true);
				$("#w4Heading").show();
				$("#w2Heading").hide();
			}
		});
	},
	init : function() {"use strict";
		w2.changeView("#edit-page", "#overview-page", "step1", "step2");
		$("#overview-page .icon-plus,#overview-page .icon-trash,#overview-page .icon-pencil").parent().unbind('click');
		overviewapp.responseData();
	},
	sort : function(data) {
		var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		function ConvertDate(dates) {
			console.log(dates);
			var dates = dates.ValidTo;
			D = dates.substring(0, dates.indexOf(" "));
			M = dates.substring(dates.indexOf(" ") + 1, dates.indexOf(","));
			Y = dates.substring(dates.lastIndexOf(" ") + 1, dates.length);
			if(D.length == 1) {
				D = "0" + D;
			}
			for( l = 0; l < 12; l++) {
				if(months[l] == M) {
					M = l + 1;
					break;
				}
			}
			if(M < 10) {
				M = "0" + M;
			}
			return Y + "" + M + "" + D;
		}

		function SortDates(dateArr) {
			for( z = 0; z < dateArr.length - 1; z++) {
				for( y = 0; y < (dateArr.length - (z + 1)); y++) {
					if(eval(ConvertDate(dateArr[y + 1]) + "<" + ConvertDate(dateArr[y]))) {
						temp = dateArr[y + 1];
						dateArr[y + 1] = dateArr[y];
						dateArr[y] = temp;
					}
				}
			}
			console.log(dateArr);
			return dateArr;
		}

		return SortDates(data);

	},
	getW2Data : function(successHandler) {"use strict";

		function onBeforeSend() {
			lilly.tool.loading.show();
		}

		function onComplete() {
			w2.refreshScroll();
		}

		function handleErrorResponse(responseString) {
			var errorMessage = '';
			var error = $(responseString).find("Error");
			if(error.length > 0) {
				$.each(error, function() {
					var errortext = $(this).find("ErrorMsg").text();
					console.log("W4 Data call returned with error:" + errortext);
					errorMessage += "<li>" + errortext + "</li>"
				});
			} else {
				errorMessage = "Some Internal Error Occured";
			}
			jAlert(errorMessage, 'Error');
			lilly.tool.loading.hide();
		}

		function onGetW2DataSuccessful(responseString) {
			var error = $(responseString).find("Error");
			var errortext = $(error).find("ErrorMsg").text(), $json = $.xml2json(responseString);
			if(error && (error.length > 0 && (errortext != null && errortext !== ""))) {
				handleErrorResponse(responseString);
				return;
			}

			var $responseBody = "";
			if(currentApp == "w4") {
				$responseBody = $json.Body.ZGetW4Overview_ResMT01;
			} else {
				$responseBody = $json.Body.GetW2Overview_RespMT;
			}
			console.log($responseBody);
			setTimeout(lilly.tool.loading.hide, 10);
			successHandler($responseBody);

		}

		var url = lilly.ws.url.W2_DATA;
		var soapAction = lilly.ws.soapAction.W2_DATA;
		var data = lilly.ws.concatW2Data({
			userId : account
		});
		if(currentApp == "w4") {
			url = lilly.ws.url.W4_DATA;
			soapAction = lilly.ws.soapAction.W4_DATA;
			data = lilly.ws.concatW4Data({
				userId : account
			});
			console.log(lilly.ws.concatW4Data({
				userId : account
			}))
		}
		lilly.tool.invokeSOAGWService({
			url : url,
			soapAction : soapAction,
			success : onGetW2DataSuccessful,
			error : handleErrorResponse,
			beforeSend : onBeforeSend,
			complete : onComplete,
			data : data
		});

	},
	generateOverviewTemplate : function(feedElement, election, formArray) {
		feedElement = $("#" + feedElement);
		$(feedElement).empty();
		if( typeof election == "undefined") {
			console.log("No election Record");
		} else {
			if(election.TaxCompany) {
				var W2ElectionData = w2.toArray(election.TaxCompany);
				var cloneElement = $("#election-template-w2 .election-div").clone();
				var electionStatus = election.ElectionStatus;
				cloneElement.find(".section-title1").html(currentDate.getFullYear() + "-Election");
				cloneElement.find(".tax-company-div").remove();

				$.each(W2ElectionData, function(ind, val) {
					var cloneElementChild = $("#election-template-w2 .election-div .tax-company-div").clone();
					cloneElementChild.find(".label-medium").html(val.TaxCompanyName);			//CHG1085356
					cloneElementChild.find(".read-only").html(val.TaxCompanyCode);			//CHG1085356
					cloneElementChild.find(".companyCode").html(val.TaxCompanyCode);			//CHG1085356
					cloneElementChild.appendTo(cloneElement.find(".election-content"));
					cloneElementChild.find(".onoffswitch input:checkbox").attr("id", "myonoffswitch" + ind);
					cloneElementChild.find(".onoffswitch label").attr("for", "myonoffswitch" + ind);
					cloneElementChild.find(".onoffswitch input:checkbox").bind("click", overviewapp.switchBind);
			 		if(val.Status.toLowerCase() == 'online') {
						cloneElementChild.find('.onoffswitch-inner').css('margin-left', '0px');
						cloneElementChild.find('.w2onoffswitch-switch').css('right', '0px');
			// Added class 'onswitch' when the status is online
						cloneElementChild.find(".onoffswitch-checkbox").addClass("onSwitch");
					
					} else {
						cloneElementChild.find('.onoffswitch-inner').css('margin-left', '-120%');
						cloneElementChild.find('.w2onoffswitch-switch').css('right', '56px');
			// Added class 'onswitch' when the status is Paper
						cloneElementChild.find(".onoffswitch-checkbox").addClass("offSwitch");
					}

				});
				cloneElement.appendTo(feedElement);
				if(electionStatus.toLowerCase() == "closed") {
					$(".onoffswitch input:checkbox").attr("disabled", true);
					$('.onoffswitch-inner').css({
						"opacity" : "0.4"
					});
				}
			}
		}
		if(formArray.length > 0) {
			var message = "<div id='name' class='head-font'>" + "Only online elected forms displayed below</div>";
			feedElement.append(message);
			$.each(formArray, function(index, value) {
				var cloneElement = $("#collapsible-template-w2 .collapsible-div").clone();
				cloneElement.find(".section-title span").html(value.year + "-Forms");
				cloneElement.find(".section-title").click(overviewapp.onArrowClick);
				cloneElement.find(".collapsible-form").remove();
				$.each(value.forms, function(ind, formElement) {
					var cloneElementChild = $("#collapsible-template-w2 .collapsible-div .collapsible-div-content .collapsible-form").clone();
					cloneElementChild.find("input:radio").attr("name", "radio-" + formElement.Year);
					cloneElementChild.find("input:radio").attr("value", formElement.URL);
					cloneElementChild.find("input:radio").click(overviewapp.onRadioClick);
					cloneElementChild.find(".label-medium").html(formElement.TaxCompany);
					cloneElementChild.find(".read-only").html(formElement.FormDescription);
					cloneElementChild.appendTo(cloneElement.find(".collapsible-div-content"));
				});
				var href = cloneElement.find('input:radio:first').attr("value");
				if(cloneElement.find('input:radio').length == 1)
					cloneElement.find('input:radio').addClass("hide");
				cloneElement.find(".btn-view").parent().attr("id", href);
				cloneElement.appendTo(feedElement);

			});
		} else {
			console.log("No Form Records");
		}
	},
	generateOverviewTemplateW4 : function(feedElement, election, filingArray, fieldArray, formArray, TaxExemIndArr, alternateFormula) {
		//selecting filing status dropdown options
		var heading = document.getElementById("w4Heading");
		heading.innerHTML = lang.title.w4title;

		var dropdownValues = new Array();
		var TaxExemIndValues = new Array();
		var alternateFormulaValues = new Array();
		$(TaxExemIndArr).each(function(ind, value) {
			TaxExemIndValues.push({
				"key" : value.Key,
				"text" : value.Text
			});

		});
		feedElement = $("#" + feedElement);
		$(feedElement).empty();
		election = w2.toArray(election);
		//federal
		var cloneCollapse = $("#collapsible-template-w4").clone();
		cloneCollapse.find(".section-title span").html('Federal');
		cloneCollapse.removeClass("hide").removeAttr("id");
		//$(feedElement).empty();
		$.each(election, function(key, val) {
			var filingStatus = "";
			if(val.TaxAuthority.toLowerCase() == "fed") {
				$(filingArray).each(function(ind, value) {
					if(value.TaxAuthority == val.TaxAuthority) {
						dropdownValues.push({
							"status" : value.Status,
							"text" : value.Text
						});
						if(val.FilingStatus == value.Status) {
							filingStatus = value.Text;
						}
					}
				});
				$(alternateFormula).each(function(ind, value) {
					if(value.TaxAuthority == val.TaxAuthority) {
						alternateFormulaValues.push({
							"status" : value.Key,
							"text" : value.Text
						});
					}
				});
				var clone = $("#collapsible-div-content-w4-template").clone();
				clone.removeAttr("id").removeClass("hide");
				clone.find(".taxAuthority").html(val.TaxAuthority);
				clone.find(".filingStatus").html(filingStatus);
				clone.find(".exemptions").hide();
				clone.find(".addAmountt").hide();
				clone.find(".amount1").html(val.Num_Allowances);
				clone.find(".amount2").html(val.Add_Withheld);
				clone.find(".validFrom").html(val.ValidFrom);
				clone.find(".validTo").html(val.ValidTo);
				clone.find(".btn-next").bind('click', overviewapp.onNewClick);

				var fieldProp = new Array();
				$(fieldArray).each(function(ind, value) {

					if(value.TaxAuthority == val.TaxAuthority)

						fieldProp.push({
							"taxauthority" : value.TaxAuthority,
							"name" : value.Name,
							"property" : value.Property
						});

				});
				clone.data("fielddata", fieldProp);
				clone.data("W4DATA", val);
				clone.data("dropdowndata", dropdownValues);
				clone.data("taxexeminddata", TaxExemIndValues);
				clone.data("alternateFormula", alternateFormulaValues);
				cloneCollapse.find(".collapsible-content-box").append(clone);
			}
		});
		$(feedElement).append(cloneCollapse);

		//states
		var cloneCollapse = $("#collapsible-template-w4").clone();
		cloneCollapse.find(".section-title span").html('State' + "&nbsp" + "&nbsp" + "&nbsp" + "&nbsp");
		cloneCollapse.removeClass("hide").removeAttr("id");
		var TaxExemIndValues = new Array();
		$(TaxExemIndArr).each(function(ind, value) {
			TaxExemIndValues.push({
				"key" : value.Key,
				"text" : value.Text
			});

		});
		$.each(formArray[0].forms, function(key, val) {

			if(val.TaxAuthority != "FED") {
				var dropdownValues = new Array();
				var alternateFormulaValues = new Array();
				var filingStatus = "";
				$(filingArray).each(function(ind, value) {
					if(value.TaxAuthority == val.TaxAuthority) {
						dropdownValues.push({
							"status" : value.Status,
							"text" : value.Text
						});
						if(val.FilingStatus == value.Status) {
							filingStatus = value.Text;
						}
					}
				});
				$(alternateFormula).each(function(ind, value) {
					if(value.TaxAuthority == val.TaxAuthority) {
						alternateFormulaValues.push({
							"status" : value.Key,
							"text" : value.Text
						});
					}
				});
				var fieldProp = new Array();
				$(fieldArray).each(function(ind, value) {

					if(value.TaxAuthority == val.TaxAuthority)

						fieldProp.push({
							"taxauthority" : value.TaxAuthority,
							"name" : value.Name,
							"property" : value.Property
						});

				});
				var clone = $("#collapsible-div-content-w4-template").clone();
				clone.removeAttr("id").removeClass("hide");
				clone.find(".taxAuthority").html(val.TaxAuthority);
				clone.find(".filingStatus").html(filingStatus);
				clone.find(".allowances").hide();
				clone.find(".totalAmount").hide();
				clone.find(".amount1").html(val.Num_Allowances);
				//clone.find(".amount1").html(val.Num_Exemptions);
				clone.find(".amount2").html(val.Add_Withheld);
				clone.find(".validFrom").html(val.ValidFrom);
				clone.find(".validTo").html(val.ValidTo);
				clone.data("W4DATA", val);

				clone.data("dropdowndata", dropdownValues);
				clone.data("taxexeminddata", TaxExemIndValues);
				clone.data("fielddata", fieldProp);
				clone.data("alternateFormula", alternateFormulaValues);
				clone.find(".btn-next").bind('click', overviewapp.onNewClick);
				cloneCollapse.find(".collapsible-content-box").append(clone);
			}
		});
		$(feedElement).append(cloneCollapse);
		$(".section-title").click(overviewapp.onArrowClick);

	},
	onW2Click : function() {
		currentApp = "w2";
		overviewapp.init();

	},
	onW4Click : function() {
		currentApp = "w4";
		overviewapp.init();
	},
	onNewClick : function() {
		var heading = document.getElementById("w4Heading");
		var data = $(this).closest(".w4-row").data("W4DATA");
		var dropdownValues = $(this).closest(".w4-row").data("dropdowndata");
		var TaxExemIndValues = $(this).closest(".w4-row").data("taxexeminddata");
		var fieldProp = $(this).closest(".collapsible-div-content").data("fielddata");
		var employee = $(this).closest(".collapsible-div").find(".section-title span").text();
		var alternateFormula = $(this).closest(".w4-row").data("alternateFormula");
		if(employee == 'Federal') {
			$(".nonResidentAlien").show();
			$(".NameInstruction").show();
			$(".LastNameDiffer").show();
			heading.innerHTML = lang.title.fedTitle;
			//$(".test").hide();
		} else {
			$(".LastNameDiffer").hide();
			$(".NameInstruction").hide();
			$(".nonResidentAlien").hide();
			heading.innerHTML = lang.title.stateTitle;
		}
		$("#edit-table").data("W4DATA", data);
		$("#edit-table").data("dropdowndata", dropdownValues);
		$("#edit-table").data("taxexeminddata", TaxExemIndValues);
		$("#edit-table").data("fielddata", fieldProp);

		editapp.init(data, dropdownValues, fieldProp, TaxExemIndValues, alternateFormula);
		w2.refreshScroll();
	},
	onArrowClick : function(e) {"use strict";
		$(this).parent().find('.collapsible-div-content ').toggleClass('show');
		if($(this).parent().find('div.collapsible-div-content').hasClass('show'))
			$(this).parent().find('img').attr('src', 'CommonComp/img/arrow-down-white.png');
		else
			$(this).parent().find('img').attr('src', 'CommonComp/img/arrow-right-white.png');
		w2.refreshScroll();
	},
	onRadioClick : function(e) {"use strict";
		var url = $(this).attr("value");
		console.log(url);
		$(this).parent().parent().find('a').attr("id", url);
	},
	switchBind : function(event) {
		var attrcheck = $(this).parent().find(".onoffswitch-checkbox").prop("checked");
		var TaxCCode = $(this).closest("div.tax-company-div").find("div.companyCode").html();
		var ElecYear = $(".election-div").find(".section-title").html().substring(0, 4);
		var personnelNo = $('#personnelNo').html();
		var self = $(this);

		function onBeforeSend() {
			lilly.tool.loading.show();
		}

		function onComplete() {
			w2.refreshScroll();
		}

		function handleErrorResponse(responseString) {
			var errorMessage = '';
			var error = $(responseString).find("Error");
			if(error.length > 0) {
				$.each(error, function() {
					var errortext = $(this).find("ErrorMsg").text();
					console.log("W4 Data call returned with error:" + errortext);
					errorMessage += "<li>" + errortext + "</li>"
				});
			} else {
				errorMessage = "Some Internal Error Occured";
			}
			jAlert(errorMessage, 'Error');
			lilly.tool.loading.hide();
		}

		function onGetW2DataSuccessful(responseString) {
			var error = $(responseString).find("Error");
			var errortext = $(error).find("ErrorMsg").text(), $json = $.xml2json(responseString);
			if(error && (error.length > 0 && (errortext != null && errortext !== ""))) {
				handleErrorResponse(responseString);
				return;
			}

			var $responseBody = "";
			if(currentApp == "w4") {
				//W4
				$responseBody = $json.Body.ZGetW4Overview_ResMT01;
			} else {
				//W2
				$responseBody = $json.Body.GetW2Overview_RespMT;
			}
			setTimeout(lilly.tool.loading.hide, 10);
			
			// switchPopupContent object contains the content inside the popup
			var switchPopupContent = $responseBody.DisclaimerText + '<br>' + '<br>' +$responseBody.URLLabel + '&nbsp; : &nbsp;' +'<a href='+$responseBody.URLContent+ '?opensafari target="_blank">'+ $responseBody.URLText +'</a>'+ '<br>'			// Popup is displayed after clicking on switch button 
			// jconfirm method is the code for POPUP
			jConfirm(switchPopupContent, 'Confirmation', function(r) {
				if(r) {
					var onSwitchClass = self.parent().find(".onoffswitch-checkbox").hasClass("offSwitch");
				//code when switch button moves from PAPER to ONLINE
					if(onSwitchClass) {
						self.parent().find('.onoffswitch-inner').css('margin-left', '0px');
						self.parent().find('.w2onoffswitch-switch').css('right', '0px');
						self.parent().find(".onoffswitch-checkbox").removeClass("offSwitch").addClass("onSwitch");
						status = 'Online';
					} else {
						//switch button moves from ONLINE to PAPER
						self.parent().find('.onoffswitch-inner').css('margin-left', '-120%');
						self.parent().find('.w2onoffswitch-switch').css('right', '56px');
						self.parent().find(".onoffswitch-checkbox").removeClass("onSwitch").addClass("offSwitch");
						status = 'Paper';
					}
					var json = {
						TaxCompanyCode : TaxCCode,
						ElectionYear : ElecYear,
						Status : status,
						personnelNumber : personnelNo

					};
					//console.log(json);
					overviewapp.saveSwitchData(json);
				} else {
					
					return false;
				}
			});
		}
		
		var url = lilly.ws.url.W2_DATA;
		var soapAction = lilly.ws.soapAction.W2_DATA;
		var data = lilly.ws.concatW2Data({
			userId : account
		});
		// Calling web service
		lilly.tool.invokeSOAGWService({
			url : url,
			soapAction : soapAction,
			success : onGetW2DataSuccessful,
			error : handleErrorResponse,
			beforeSend : onBeforeSend,
			complete : onComplete,
			data : data
		});

	},
	saveSwitchData : function(getJsonObject) {"use strict";
		function onBeforeSend() {
			lilly.tool.loading.show();
		}

		function onComplete() {
			w2.refreshScroll();
		}

		function handleSuccessResponse(responseString) {
			var error = $(responseString).find("Error");
			var errortext = $(error).find("ErrorMsg").text(), $json = $.xml2json(responseString);
			if(error && (error.length > 0 && (errortext != null && errortext !== ""))) {
				handleErrorResponse(responseString);
				return;
			}
			lilly.tool.loading.hide();

		}

		function handleErrorResponse(responseString) {
			var errorMessage = '';
			var error = $(responseString).find("Error");
			error = error.length > 0 ? error : $(responseString).find("Error");
			if(error.length > 0) {
				$.each(error, function() {
					var errortext = $(this).find("ErrorMsg").text();
					var errorcode = $(this).find("ErrorCode").text();
				});
			} else {
				errorMessage = "Some Internal Error Occured";
			}
			lilly.tool.loading.hide();
		}


		lilly.tool.invokeSOAGWService({
			url : lilly.ws.url.SWITCH_DATA,
			soapAction : lilly.ws.soapAction.SWITCH_BUTTON_DATA,
			success : handleSuccessResponse,
			error : handleErrorResponse,
			beforeSend : onBeforeSend,
			complete : onComplete,
			data : lilly.ws.concatSwitchData(getJsonObject)
		});

	}
};

var editapp = {
	init : function(userData, dropdownValues, fieldProp, TaxExemIndValues, alternateFormula) {

		editapp.generateTemplate("edit-table", userData, dropdownValues, fieldProp, TaxExemIndValues, alternateFormula);
		w2.changeView("#overview-page", "#edit-page", "step1", "step2");
	},
	onCancelClick : function(e) {"use strict";
		editapp.cleanupFields();
		overviewapp.init();
		//w2.changeView("#edit-page", "#overview-page", "step1", "step2");
	},
	onSubmitClick : function(e) {"use strict";
		if($("#confirmationCheckbox").attr("checked") == undefined) {
			jAlert("Please check the Declaration");
			return;
		}
		var W4Data = editapp.getW4Data();
		editapp.saveW4Data(W4Data, function() {
			editapp.cleanupFields();
			overviewapp.init();
		});

		w2.refreshScroll();
	},
	cleanupFields : function() {"use strict";
		console.log("editapp.cleanupFields");
		$("#edit-page #edit-table .edit-page-content").empty();
	},
	getW4Data : function() {
		var W4Data = $("#edit-table").data("W4DATA");
		var fieldData = $("#edit-table").data("fielddata");
		var NonResi_Alien;
		var LastName_SSNcheck;
		if($(".switch1 input:checkbox").attr("checked") != undefined)
			NonResi_Alien = "";
		else
			NonResi_Alien = "X";
		if($(".switch2 input:checkbox").attr("checked") != undefined)
			LastName_SSNcheck = "";
		else
			LastName_SSNcheck = "X";

		// if(W4Data.NonResi_Alien != undefined) {
		// return {
		// globalId : $("#personnelNo").text(),
		// EmpName : $("#name").text(),
		// W4Overview_Fed : {
		// TaxAuthority : W4Data.TaxAuthority,
		// FilingStatus : $("#Status").val(),
		// ValidFrom : W4Data.ValidFrom,
		// ValidTo : W4Data.ValidTo,
		// NonResi_Alien : NonResi_Alien,
		// LastName_SSNcheck : LastName_SSNcheck,
		// Num_Allowances : $("#Claim").val(),
		// Add_Withheld : $("#Withheld").val(),
		// Num_Exemptions : W4Data.Num_Exemptions,
		// Num_Dep_Exemptions : W4Data.Num_Dep_Exemptions
		//
		// }
		// }
		// } else {

		return {
			globalId : $("#personnelNo").text(),
			EmpName : $("#name").text(),
			W4Overview : {
				TaxAuthority : W4Data.TaxAuthority,
				FilingStatus : $("#Status").val(),
				ValidFrom : W4Data.ValidFrom,
				ValidTo : W4Data.ValidTo,
				LastName_SSNcheck : LastName_SSNcheck,
				NonResi_Alien : NonResi_Alien,
				Num_Allowances : $("#numAllowances").val(),
				Add_Withheld : $("#Withheld").val(),
				Num_Exemptions : $("#numExemptions").val(),
				Num_Dep_Exemptions : $("#numDepExemptions").val(),
				Num_Pers_Exemptions : $("#numPersExemptions").val(),
				Alternate_Formula : $("#edit-table #alternateFormula").val() == null ? "" : $("#edit-table #alternateFormula").val(),
				Exemption_Amount : $("#exemptionAmount").val(),
				TotAdd_Exemption_Amnt : $("#totAddExemptionAmnt").val(),
				Add_Tax_Percentage : $("#addTaxPercentage").val(),
				Tax_Exemption_Ind : $("#taxExemptionInd").val(),
			}
		}
		//}

	},
	saveW4Data : function(W4Data, successHandler) {
		console.log("editapp.saveW4Data");
		function onBeforeSend() {
			lilly.tool.saving.show();
			console.log("editapp.saveW4Data.onBeforeSend");
			console.log(new Date().getTime());
		}

		function onComplete() {
			console.log("editapp.savePersonalData.onComplete");
			console.log(new Date().getTime());
			console.log('End saveDataUrl');
		}

		function handleErrorResponse(responseString) {
			console.log("editapp.saveW4.handleErrorResponse");
			console.log(responseString);
			var errorMessage = '';
			var error = $(responseString).find("Messages");
			if(error.length > 0) {
				$(error).each(function(index, error) {
					var messagetype = $(error).find("MsgType").text();
					if(messagetype.toUpperCase() == "E") {
						errorMessage += "<li>" + $(error).find("MsgText").text() + "</li>"
					}
				});
			} else {
				errorMessage = "Some Internal Error Occured"
			}
			lilly.tool.saving.hide();
			jAlert(errorMessage, 'Error');

		}

		function onSaveDataSuccessfull(responseString) {
			console.log("editapp.saveW4Data.onSaveDataSuccessfull");
			//console.log(responseString);
			//var $json = $.xml2json(responseString);
			var messagetype = $($($(responseString).find("Messages"))[0]).find("MsgType").text();
			var messagetext = $($($(responseString).find("Messages"))[0]).find("MsgText").text();
			if(messagetype.toUpperCase() == "E") {
				handleErrorResponse(responseString);
				return;
			}
			//jAlert(messagetext, 'Success');
			lilly.tool.saving.hide();
			successHandler();

		}


		console.log("overviewapp.W4Data.request");

		/*****Sarayood******/
		if(W4Data.W4Overview.Tax_Exemption_Ind == null) {
			W4Data.W4Overview.Tax_Exemption_Ind = "";
		}
		console.log(lilly.ws.concatW4DataSave(W4Data));
		lilly.tool.invokeSOAGWService({
			url : lilly.ws.url.W4_SAVE_OVERVIEW,
			soapAction : lilly.ws.soapAction.W4_SAVE_OVERVIEW,
			success : onSaveDataSuccessfull,
			error : handleErrorResponse,
			beforeSend : onBeforeSend,
			complete : onComplete,
			data : lilly.ws.concatW4DataSave(W4Data)
		});
	},
	PopUpBox : function(responseString) {
		console.log("editapp.PopUpBox");
		var W4Data = $("#edit-table").data("W4DATA");
		errorMessage = W4Data.URL_Labl + "  " + "<a href='" + W4Data.URL_Cont + "?opensafari' target='_blank'><u>" + W4Data.URL_Text + "</u></a>";
		jAlert(errorMessage, 'Information');
		lilly.tool.loading.hide();
	},
	generateTemplate : function(feedElement, userData, dropdownValues, fieldProp, TaxExemIndValues, alternateFormula) {
		console.log("editapp.generateTemplate");
		//console.log(W4FedData.TaxAuthority)
		$("#edit-page #edit-table .edit-page-content").empty();
		//console.log(userData, "---------------------")
		//console.log(TaxExemIndValues, "**********************")
		//console.log(fieldProp);
		$(".declairTxt").html(userData.Declare_Txt);
		//$(".declairHeading").html(userData.Declare_Txt)
		//$(".declairTxt").html(userData.Declare_Text01 + userData.Declare_Text02 + userData.Declare_Text03 + userData.Declare_Text04 + userData.Declare_Text05 + userData.Declare_Text06);
		//var clone = $("#templates").clone().removeAttr("id").removeClass("hidden");
		$(".filing-status select").empty();
		$("#edit-table .Alternate_Formula select").empty();
		$(".check3 input:checkbox").prop("checked", false);
		$(dropdownValues).each(function(ind, val) {
			$(".filing-status select").append("<option value=" + val.status + ">" + val.text + "</option>");
		});
		$(".filing-status select").val(userData.FilingStatus).attr("selected", "selected");
		// if(userData.TaxAuthority != "FED") {
		// console.log(userData);
		// $("#numAllowances").val(userData.Num_Allowances);
		// //var fieldClone=$("#templates").find("div[data-id="+val.name+"]").clone();
		// }
		$(fieldProp).each(function(ind, val) {
			if(userData.TaxAuthority == val.taxauthority) {
				var fieldClone = $("#templates").find("div[data-id=" + val.name + "]").clone();
				console.log(fieldClone);
				$("#edit-table #numAllowances").val(userData.Num_Allowances);
				$("#edit-table #Withheld").val(userData.Add_Withheld);
				$("#edit-table #numExemptions").val(userData.Num_Exemptions);
				$("#edit-table #numPersExemptions").val(userData.Num_Pers_Exemptions);
				$("#edit-table #numDepExemptions").val(userData.Num_Dep_Exemptions);
				$("#edit-table #alternateFormula").val(userData.Alternate_Formula);
				$("#edit-table #exemptionAmount").val(userData.Exemption_Amount);
				$("#edit-table #totAddExemptionAmnt").val(userData.TotAdd_Exemption_Amnt);
				$("#edit-table #addTaxPercentage").val(userData.Add_Tax_Percentage);
				$("#edit-table #taxExemptionInd").val(userData.Tax_Exemption_Ind);

				if(userData.LastName_SSNcheck.toLowerCase() == "x") {
					//fieldClone.find(".onoffswitch input:checkbox").prop("checked", false);
					$('#myonoffswitch1').prop('checked', false);
				} else {
					$('#myonoffswitch1').prop('checked', true);
				}
				if(userData.NonResi_Alien.toLowerCase() == "x") {
					//fieldClone.find(".onoffswitch input:checkbox").prop("checked", false);
					$('#myonoffswitch0').prop('checked', false);
				} else {
					$('#myonoffswitch0').prop('checked', true);
				}

				var textDataLabel = val.name + "_Text";
				var textData = userData[textDataLabel];

				//console.log(val.name, textData, val.property);
				fieldClone.find(".labelName").text(textData);

				if(val.property == "Do Not Display") {
					fieldClone = "";
				} else if(val.property == "Not Modifiable") {
					fieldClone.find(".edit-only").removeAttr("enable");
					fieldClone.find(".edit-only").attr("disabled", "true");
					//$("#templates").find("div[data-id="+val.name+"]").hide();
					//fieldClone.find(".edit-only").val(textData);
				} else if(val.property == "Mandatory Field") {
					fieldClone.find(".red-star").removeClass("hidden").addClass("show");
					fieldClone.find(".edit-only").addClass("mandatory");
					//$("#templates").find("div[data-id="+val.name+"]").hide();
					//fieldClone.find(".edit-only").val(textData);
				}

				$(fieldClone).find("input").bind("focus", editapp.onInputClick);
				$(fieldClone).find("input").mouseup(function(e) {
					e.preventDefault();
				});
				//$(fieldClone).find("input").bind("click",editapp.onInputClick);
			}
			/*$(fieldClone).find("input").mouseup(function(e){
			e.preventDefault();
			});*/
			//$(fieldClone).find("input").bind("tap",editapp.onInputClick);
			$("#edit-page #edit-table .edit-page-content").append(fieldClone);
			//clone.find(".test select").append("<option value=" + val.name + ">" + val.property + "</option>");
		});
		$(".Tax_Exemption_Ind select").empty();
		$(TaxExemIndValues).each(function(ind, val) {
			$(".Tax_Exemption_Ind select").append("<option value=" + val.key + ">" + val.text + "</option>");
		});
		$(".Tax_Exemption_Ind select").val(userData.Tax_Exemption_Ind).attr("selected", "selected");
		if(userData.Alternate_Formula == "" || userData.Alternate_Formula == null)
			$("#edit-table .Alternate_Formula select").append("<option value='' disabled='disabled'></option>");
		$(alternateFormula).each(function(ind, val) {
			$("#edit-table .Alternate_Formula select").append("<option value='" + val.status + "'>" + val.text + "</option>");
		});
		$("#edit-table .Alternate_Formula select").val(userData.Alternate_Formula).attr("selected", "selected");
		//console.log(userData);
		//console.log(fieldProp)
		//clone.find(".filing-status select").val(userData.FilingStatus).attr("selected", "selected");
		//clone.find(".test select").val(userData.Fields_Property).attr("selected", "selected");
		//clone.find(".Allowances input").val(userData.Num_Allowances);
		//clone.find(".AdditionalAmt input").val(userData.Add_Withheld);
		//clone.find(".declairTxt").html(userData.Declare_Txt);
		//if( typeof userData.NonResi_Alien !== "undefined") {
		//if(userData.NonResi_Alien.toLowerCase() == "x") {
		//	clone.find(".switch1 input:checkbox").prop("checked", false);
		//}
		// } else {
		// clone.find(".nonResidentAlien").addClass("hide");
		// }
		//
		// if(userData.LastName_SSNcheck.toLowerCase() == "x") {
		// clone.find(".switch2 input:checkbox").prop("checked", false);
		// }
		$("#btn-edit-submit").unbind("click").bind("click", editapp.onSubmitClick);
		$("#btn-edit-cancel").unbind("click").bind("click", editapp.onCancelClick);
		// $("#edit-page #edit-table").append(clone);
	},
	onInputClick : function(ev) {
		$(this).select();
		$(this).setSelectionRange(0, 9999);
	},
	validatingNumber : function(el) {
		console.log("editapp.validatingNumber");
		var x = $(el).val();
		if(isNaN(x)) {
			x = x.replace(/[^0-9]/g, '');
			console.log(x);
			$(el).val(x);
		} else {
			if(x.match(".") && !isNaN(x)) {
				x = x.replace(/[^0-9]/g, '');
				console.log(x);
				$(el).val(x);
			}
		}
		//x.focus();
	},
	validatingNumber : function(el) {
		//console.log("editapp.validatingNumber");
		var x = $(el).val();
		if(isNaN(x)) {
			x = x.replace(/[^0-9]/g, '');
			console.log(x);
			$(el).val(x);
		}
		if(x.match(/\./g)) {
			var i = $("#exemptionAmount").val().length;
			//alert(i)

			//$("#exemptionAmount").attr("maxlength", i+2);

		}
		//x.focus();
	}
}

$(w2.ready);
