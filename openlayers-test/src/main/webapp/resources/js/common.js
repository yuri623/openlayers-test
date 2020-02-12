Number.prototype.format = function(){
    if(this==0) return 0;
 
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
 
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
 
    return n;
};


String.prototype.isBlank = function() {
	return (!this || /^\s*$/.test(this));
};

(function() {
	Common = {
		// jquery ajax 요청
		ajax : function(url, method, data, async, success, error) {
			url = _contextPath + url;
			
			if(!data) data = {};
			data[jQuery("meta[name=csrf_token]").attr("key")] = jQuery("meta[name=csrf_token]").attr("content");

			return jQuery.ajax({
				url : url,
				type : method,
				data : data,
				dataType : "json",
				timeout : 30000,
				async : async,
				error : function(jqXHR, exception) {
					if (error) {
						error.apply(this, arguments);
						return;
					} else {
						// alert(ERROR_MSG);
					}
				},
				success : function(data) {
					if (data) {
						if (data.RESULT == "SUCCESS"
								|| data.result == "SUCCESS") {
							if (data.MSG) {
								Common.getAlertMessage(data.MSG);
							}

							success.apply(this, arguments);
							return;
						} else if (data.RESULT == "UPLOAD_FAILURE") {
							var message = Common.getMessage(data.RESULT);

							message += "\n\n";
							message += data.MSG;

							alert(message);
						} else if (data.RESULT == "LOGIN_REQUIRED") {
							location.replace(_contextPath + "admin/login.do?status=loginRequired");
						} else if(data.RESULT == "ACCESS_DENIED") {
							Common.getAlertMessage("ACCESS_DENIED");
							location.replace(_contextPath + "admin/");
						} else {
							if (data.MSG) {
								if (data.MSG == "PARAM_MISSING") {
									alert(Common.getMessage(data.MSG) + "\n(" + data.PARAM + ")");
								} else {
									Common.getAlertMessage(data.MSG);
								}
							} else {
								alert(ERROR_MSG);
							}
						}
					} else {
						alert(ERROR_MSG);
					}
				}
			});
		},

		getMessage : function(msg) {
//			var message = MSG[msg];
			var message = msg;

			if (message)
				return message;
			else
				return msg;
		},

		getAlertMessage : function(msg) {
			var message = MSG[msg];
			if (message)
				alert(message);
		},

		check : function(data) {
			if (data && data.RESULT == "SUCCESS") {
				if (data.MSG) {
					this.getAlertMessage(data.MSG);
				}

				return true;
			} else if (data.RESULT == "UPLOAD_FAILURE") {
				var message = this.getMessage(data.RESULT);

				message += "\n\n";
				message += data.MSG;

				alert(message);

				return false;
			} else if (data.RESULT == "LOGIN_REQUIRED") {
				location.replace(_contextPath
						+ "admin/login.do?status=loginRequired");
			} else {
				if (data.MSG) {
					if (data.MSG == "PARAM_MISSING") {
						alert(this.getMessage(data.MSG) + "\n(" + data.PARAM + ")");
					} else {
						this.getAlertMessage(data.MSG);
					}
				} else {
					alert(ERROR_MSG);
				}

				return false;
			}
		},

		checkResult : function(data) {
			if (data && data.RESULT.indexOf("SUCCESS") > -1) {
				return true;
			} else {
				return false;
			}
		},

		checkFileExt : function(fileName) {
			var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
			fileExt = fileExt.toLowerCase();

			if (fileExt == "xls" || fileExt == "xlsx" || fileExt == "ppt"
					|| fileExt == "pptx" || fileExt == "doc"
					|| fileExt == "docx" || fileExt == "pdf") {
				return true;
			} else {
				return false;
			}
		},
		checkFileExcelExt : function(fileName) {
			var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
			fileExt = fileExt.toLowerCase();

			if (fileExt == "xls" || fileExt == "xlsx") {
				return true;
			} else {
				return false;
			}
		},
		checkFileKmlExt : function(fileName) {
			var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1);
			fileExt = fileExt.toLowerCase();

			if (fileExt == "kml") {
				return true;
			} else {
				return false;
			}
		},
		getPopupOption : function(w, h) {
			var innerH = h + 20;
			var left = (window.screen.width / 2) - (w / 2) + window.screenX;
			var top = (window.screen.height / 2) - (h / 2) + window.screenY;

			return "width="
					+ w
					+ ",height="
					+ h
					+ ", innerHeight="
					+ innerH
					+ ", scrollbars=no, toolbar=no, status=no, resizable=no, left="
					+ left + ", top=" + top;
		}
	};

})();
