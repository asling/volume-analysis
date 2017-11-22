(function(jQuery){
	var jq = jQuery.noConflict(true);
	jq.get("/stocks", function(data){
		if(data && data.length > 0){
			jq("#loading").remove();
			const htmlArr = [];
			htmlArr.push('<ul>');
			for(let stockItem of data){
				htmlArr.push(`<li><a href=/stock.html?stockNum=${stockItem['symbol']}&range=10>${stockItem['symbol']}</a></li>`);
			}
			htmlArr.push("</ul>");
			jq("#main").html(htmlArr.join(""));
		}
	});
})(jQuery);