function pushState(e, url, title){
	e.preventDefault();
	history.pushState('', title, url);
	document.title = title;
}

$(document).ready(function(){

	$("section#logMeIn > p").on("click",function(){
		$(this).toggle();
		console.log($(this).parent());
		$("section#logMeIn > form").css("display","flex");
	});
	$("a.pushState").on("click",function(e){
		//when the api will be ready, prepare this
		//pushState(e, $(this).attr("href"), $(this).attr("data-title"));
	});
	//load admin popup
	$(".admin").on("click",function(){
		var thisContext = $(this);
		if($(this).attr("id") == "newCat"){
			newCat();
		}
		else if($(this).attr("id") == "newSubCat"){
			newSubCat(thisContext);
		}
		else if($(this).attr("id") == "newItem"){
			newItem(thisContext);
		}
		else if($(this).attr("id") == "newCalendar"){
			newCalendar();
			}
		else if($(this).attr("id") == "editLead"){
			editLead(thisContext);
		}
		else if($(this).attr("id") == "editItem"){
			editItem(thisContext);
		}
		else if($(this).attr("id") == "CSS"){
			editCSS();
		}
		else if($(this).attr("id") == "JS"){
			editJS();
		}
		else if($(this).attr("id") == "header"){
			editHeader();
		}
		else if($(this).attr("id") == "footer"){
			editFooter();
		}
		else if($(this).attr("id") == "plugins"){
			pluginCenter(thisContext);
		}
		else if($(this).attr("id") == "editSummary"){
			summaryCenter(thisContext);
		}
		else if($(this).attr("id") == "editContact"){
			contactCenter();
		}
	});

	function showAdmin(){
		$("body").append('<div id="blackout"><div id="popup"><div id="innerPopup"></div><div id="closePopup">X</div></div></div>');
		$("#closePopup").on("click",function(){
			$("#blackout").remove();
		});
	}

	// All the new entities in the database

	function newCat(){
		showAdmin();
		//New category
		$("#innerPopup").append('<h1>'+translation.admin_newCat+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$.post( '/api/', {action: "languages"},"json")
		.done(function( data ){
			for(i = 0;i<data.length;i++){
				if(i>0){
					$("#innerPopup > form").append('<hr>');
				}
				$("#innerPopup > form").append('<input type="text" value="'+data[i]+'" name="lang[]" readonly>');
				$("#innerPopup > form").append('<input type="text" value="" name=name[] placeholder="'+translation.admin_newCatName+'">');
				$("#innerPopup > form").append('<textarea name="description[]" placeholder="'+translation.admin_newCatDescription+'"></textarea>');
			}
			$("#innerPopup > form").append('<input type="hidden" name="action" value="newCat">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_newCatSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});
	}

	function newSubCat(thisContext){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_newSubCat+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$.post( '/api/', {action: "languages"},"json")
		.done(function(data,cat){
			for(i = 0;i<data.length;i++){
				if(i>0){
					$("#innerPopup > form").append('<hr>');
				}
				$("#innerPopup > form").append('<input type="text" value="'+data[i]+'" name="lang[]" readonly>');
				$("#innerPopup > form").append('<input type="text" value="" name=name[] placeholder="'+translation.admin_newSubCatName+'">');
				$("#innerPopup > form").append('<textarea name="short[]" placeholder="'+translation.admin_newSubCatShort+'"></textarea>');
				$("#innerPopup > form").append('<textarea name="description[]" placeholder="'+translation.admin_newSubCatDescription+'"></textarea>');
			}
			$("#innerPopup > form").append('<input type="hidden" name="cat" value="'+thisContext.data("cat")+'">');
			$("#innerPopup > form").append('<input type="hidden" name="action" value="newSubCat">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_newSubCatSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});
	}

	function newItem(thisContext){
		showAdmin();
		if(typeof thisContext.attr("data-subcat") !== "undefined" && thisContext.attr("data-subcat") != ""){var thisSubCat = thisContext.attr("data-subcat");}
		else{var thisSubCat = null;}
		$("#innerPopup").append('<h1>'+translation.admin_newItem+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$.post( '/api/', {action: "tags",lang : thisContext.data("lang")},"json")
		.done(function(data,cat){
			for(i = 0;i<data.langs.length;i++){
				if(i>0){
					$("#innerPopup > form").append('<hr>');
				}
				$("#innerPopup > form").append('<input type="text" value="'+data.langs[i]+'" name="lang[]" readonly>');
				$("#innerPopup > form").append('<input type="text" value="" name=name[] placeholder="'+translation.admin_newItemName+'">');
				$("#innerPopup > form").append('<textarea name="short[]" placeholder="'+translation.admin_newItemShort+'"></textarea>');
				$("#innerPopup > form").append('<textarea name="content[]" placeholder="'+translation.admin_newItemContent+'"></textarea>');
			}
			$("#innerPopup > form").append('<hr>');
			$("#innerPopup > form").append('<input type="checkbox" name="featured" value="1" id="featured"><label for="featured">'+translation.admin_featured+'</label>');
			$("#innerPopup > form").append('<hr>');
			for(i = 0;i<data.tags.length;i++){
				if(data.ids[i] == thisSubCat){var checked = "checked";}
				else{var checked = "";}
				$("#innerPopup > form").append('<input type="checkbox" name="tags[]" value="'+data.ids[i]+'" id="tags'+data.ids[i]+'" '+checked+'><label for="tags'+data.ids[i]+'">'+data.tags[i]+'</label>');
			}
			$("#innerPopup > form").append('<input type="hidden" name="action" value="newItem">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_newItemSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}

	function newCalendar(){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_newCalendar+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd}
		if(mm<10){mm='0'+mm}
		var date = yyyy+'-'+mm+'-'+dd;

		$("#innerPopup > form").append('<input type="date" value="'+date+'" name="date">');
		$("#innerPopup > form").append('<input type="time" value="12:00" name="time">');

		$("#innerPopup > form").append('<hr>');
		$.post( '/api/', {action: "languages"},"json")
		.done(function(data){
			for(i = 0;i<data.length;i++){
				if(i>0){
					$("#innerPopup > form").append('<hr>');
				}
				$("#innerPopup > form").append('<input type="text" value="'+data[i]+'" name="lang[]" readonly>');
				$("#innerPopup > form").append('<input type="text" value="" name=title[] placeholder="'+translation.admin_newCalendarTitle+'">');
				$("#innerPopup > form").append('<input type="text" value="" name=location[] placeholder="'+translation.admin_newCalendarLocation+'">');
				$("#innerPopup > form").append('<textarea name="short[]" placeholder="'+translation.admin_newCalendarShort+'"></textarea>');
				$("#innerPopup > form").append('<textarea name="description[]" placeholder="'+translation.admin_newCalendarDescription+'"></textarea>');
			}
			$("#innerPopup > form").append('<input type="hidden" name="action" value="newCalendar">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_newCalendarSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});

	}

	// All the edit entities below

  function editLead(thisContext){
		showAdmin();
		if(thisContext.attr("data-type") == "index"){
			//edit settings of the site
			$("#innerPopup").append('<h1>'+translation.admin_editSettings+'</h1>');
			$("#innerPopup").append('<form action="/api/" method="post"></form>');
			$.post( '/api/', {action: "getSettings"},"json")
			.done(function(data){
				for(i = 0;i<data.length;i++){
					if(i>0){
						$("#innerPopup > form").append('<hr>');
					}
					$("#innerPopup > form").append('<input type="text" value="'+data[i].lang+'" name="lang[]" readonly>');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].name+'" name=name[] placeholder="'+translation.admin_settingsSiteName+'">');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].title+'" name=title[] placeholder="'+translation.admin_settingsSiteTitle+'">');
					$("#innerPopup > form").append('<textarea name="meta[]" placeholder="'+translation.admin_settingsSiteMeta+'">'+data[i].meta+'</textarea>');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].logo+'" name=logo[] placeholder="'+translation.admin_settingsLogoDescription+'">');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].favicon+'" name=favicon[] placeholder="'+translation.admin_settingsFaviconDescription+'">');
					$("#innerPopup > form").append('<textarea name="description[]" placeholder="'+translation.admin_settingsSiteDescription+'">'+data[i].description+'</textarea>');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].host+'" name=host[] placeholder="'+translation.admin_settingsHost+'">');
				}
				$("#innerPopup > form").append('<input type="hidden" name="action" value="editSettings">');
				$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editSettingsSubmit+'">');

			})
			.fail(function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});
		}
		else if(thisContext.attr("data-type") == "cat"){
			//edit cat
			$("#innerPopup").append('<h1>'+translation.admin_editCat+'</h1>');
			$("#innerPopup").append('<div class="dangerDelete"></div>');
			$("#innerPopup > div.dangerDelete").append('<form action="/api/" method="post"></form>');
			$("#innerPopup > div.dangerDelete > form").append('<input type="hidden" name="action" value="deleteCat"><input type="hidden" name="cat" value="'+thisContext.attr("data-cat")+'"><input type="text" name="confirm" value="" placeholder="'+translation.admin_dangerDeletePlaceholder+'"><input type="submit" value="'+translation.admin_dangerDeleteSubmit+'">');
			$("#innerPopup").append('<form action="/api/" method="post"></form>');
			$("#innerPopup > form").append('<input type="integer" value="'+thisContext.attr("data-priority")+'" name="priority" placeholder="'+translation.admin_CatPriority+'">');
			var cat = thisContext.attr("data-cat");
			$.post( '/api/', {action: "getCat", cat : cat},"json")
			.done(function(data){
				$("#innerPopup > form").append('<input type="text" value="'+data[0].template+'" name="template" placeholder="'+translation.admin_setTemplate+'">');
				$("#innerPopup > form").append('<hr>');
				for(i = 0;i<data.length;i++){
					if(i>0){
						$("#innerPopup > form").append('<hr>');
					}
					$("#innerPopup > form").append('<input type="text" value="'+data[i].lang+'" name="lang[]" readonly>');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].name+'" name=name[] placeholder="'+translation.admin_CatName+'">');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].image+'" name=image[] placeholder="'+translation.admin_urlToImg+'">');
					$("#innerPopup > form").append('<textarea name="description[]" placeholder="'+translation.admin_CatDescription+'">'+data[i].description+'</textarea>');
				}
				$("#innerPopup > form").append('<input type="hidden" name="cat" value="'+cat+'">');
				$("#innerPopup > form").append('<input type="hidden" name="action" value="editCat">');
				$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editCatSubmit+'">');

			})
			.fail(function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});
		}
		else if(thisContext.attr("data-type") == "subcat"){
			//edit subCat
			$("#innerPopup").append('<h1>'+translation.admin_editSubCat+'</h1>');
			$("#innerPopup").append('<div class="dangerDelete"></div>');
			$("#innerPopup > div.dangerDelete").append('<form action="/api/" method="post"></form>');
			$("#innerPopup > div.dangerDelete > form").append('<input type="hidden" name="action" value="deleteSubCat"><input type="hidden" name="subCat" value="'+thisContext.attr("data-cat")+'"><input type="text" name="confirm" value="" placeholder="'+translation.admin_dangerDeletePlaceholder+'"><input type="submit" value="'+translation.admin_dangerDeleteSubmit+'">');
			$("#innerPopup").append('<form action="/api/" method="post"></form>');
			var cat = thisContext.attr("data-cat");
			$.post( '/api/', {action: "getSubCat", cat : cat},"json")
			.done(function(data){
				$("#innerPopup > form").append('<input type="text" value="'+data[0].template+'" name=template placeholder="'+translation.admin_setTemplate+'">');
				$("#innerPopup > form").append('<input type="text" value="'+data[0].maxItem+'" name=maxItem placeholder="'+translation.admin_maxItem+'">');
				$("#innerPopup > form").append('<input type="text" value="'+data[0].priority+'" name=priority placeholder="'+translation.admin_priority+'">');
				$("#innerPopup > form").append('<hr>');
				for(i = 0;i<data.length;i++){
					if(i>0){
						$("#innerPopup > form").append('<hr>');
					}
					$("#innerPopup > form").append('<input type="text" value="'+data[i].lang+'" name="lang[]" readonly>');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].name+'" name=name[] placeholder="'+translation.admin_SubCatName+'">');
					$("#innerPopup > form").append('<input type="text" value="'+data[i].image+'" name=image[] placeholder="'+translation.admin_urlToImg+'">');
					$("#innerPopup > form").append('<input type="text" value=\''+data[i].caption+'\' name=caption[] placeholder="'+translation.admin_caption+'">');
					$("#innerPopup > form").append('<textarea name="description[]" placeholder="'+translation.admin_SubCatDescription+'">'+data[i].description+'</textarea>');
					$("#innerPopup > form").append('<textarea name="short[]" placeholder="'+translation.admin_SubCatShort+'">'+data[i].short+'</textarea>');
				}
				$("#innerPopup > form").append('<input type="hidden" name="cat" value="'+cat+'">');
				$("#innerPopup > form").append('<input type="hidden" name="action" value="editSubCat">');
				$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editSubCatSubmit+'">');

			})
			.fail(function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});
		}
	}

	function editItem(thisContext){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editItem+'</h1>');
		$("#innerPopup").append('<div class="dangerDelete"></div>');
		$("#innerPopup > div.dangerDelete").append('<form action="/api/" method="post"></form>');
		$("#innerPopup > div.dangerDelete > form").append('<input type="hidden" name="action" value="deleteItem"><input type="hidden" name="item" value="'+thisContext.attr("data-item")+'"><input type="text" name="confirm" value="" placeholder="'+translation.admin_dangerDeletePlaceholder+'"><input type="submit" value="'+translation.admin_dangerDeleteSubmit+'">');
		// Add the suppress item here : $("#innerPopup").append('')
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		var item = thisContext.attr("data-item");
		var lang = thisContext.attr("data-lang");
		$.post( '/api/', {action: "getItem", item : item, lang : lang},"json")
		.done(function(data){
			for(i = 0;i<data.items.length;i++){
				if(i>0){
					$("#innerPopup > form").append('<hr>');
				}
				$("#innerPopup > form").append('<input type="text" value="'+data.items[i].lang+'" name="lang[]" readonly>');
				$("#innerPopup > form").append('<input type="text" value="'+data.items[i].title+'" name=title[] placeholder="'+translation.admin_itemTitle+'">');
				$("#innerPopup > form").append('<input type="text" value="'+data.items[i].url+'" name=url[] placeholder="'+translation.admin_itemURL+'">');
				$("#innerPopup > form").append('<input type="text" value="'+data.items[i].urlTitle+'" name=urlTitle[] placeholder="'+translation.admin_itemUrlTitle+'">');
				$("#innerPopup > form").append('<input type="text" value="'+data.items[i].image+'" name=image[] placeholder="'+translation.admin_itemImage+'">');
				$("#innerPopup > form").append('<input type="text" value="'+data.items[i].caption+'" name=imageCaption[] placeholder="'+translation.admin_itemImageCaption+'">');
				$("#innerPopup > form").append('<textarea name="short[]" placeholder="'+translation.admin_itemShort+'">'+data.items[i].short+'</textarea>');
				$("#innerPopup > form").append('<textarea name="content[]" placeholder="'+translation.admin_itemContent+'">'+data.items[i].content+'</textarea>');
			}
			$("#innerPopup > form").append('<hr>');
			if(data.info.featured == 1){
				var selected = " checked";
			}
			else{
				var selected = "";
			}
			$("#innerPopup > form").append('<input type="checkbox" name="featured" value="1" id="featured"'+selected+'><label for="featured">'+translation.admin_featured+'</label>');
			var today = new Date(data.info.time*1000);
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var hh = today.getHours();
			var mi = today.getMinutes();
			var yyyy = today.getFullYear();
			if(dd<10){dd='0'+dd}
			if(mm<10){mm='0'+mm}
			if(hh<10){hh='0'+hh}
			if(mi<10){mi='0'+mi}
			var date = yyyy+'-'+mm+'-'+dd;

			$("#innerPopup > form").append('<input type="date" value="'+date+'" name="date">');
			$("#innerPopup > form").append('<input type="time" value="'+hh+':'+mi+'" name="time">');

			$("#innerPopup > form").append('<hr>');
			for(i = 0;i<data.tags.length;i++){
				$("#innerPopup > form").append('<input type="checkbox" name="tags[]" value="'+data.tags[i].id+'" id="tags'+data.tags[i].id+'" '+data.tags[i].checked+'><label for="tags'+data.tags[i].id+'">'+data.tags[i].name+'</label>');
			}

			$("#innerPopup > form").append('<input type="hidden" name="item" value="'+item+'">');
			$("#innerPopup > form").append('<input type="hidden" name="action" value="editItem">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editItemSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}

	function editCSS(){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editCSS+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$.post( '/api/', {action: "getCSS"},"json")
		.done(function(data){
			$("#innerPopup > form").append('<textarea name="CSS" placeholder="'+translation.admin_editCSS+'">'+data.CSS+'</textarea>');
			$("#innerPopup > form").append('<input type="hidden" name="action" value="editCSS">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editCSSSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}
	function editJS(){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editJS+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$.post( '/api/', {action: "getJS"},"json")
		.done(function(data){
			$("#innerPopup > form").append('<textarea name="JS" placeholder="'+translation.admin_editJS+'">'+data.JS+'</textarea>');
			$("#innerPopup > form").append('<input type="hidden" name="action" value="editJS">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editJSSubmit+'">');
		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}
	function editHeader(){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editHeader+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$.post( '/api/', {action: "getHeader"},"json")
		.done(function(data){
			$("#innerPopup > form").append('<textarea name="header" placeholder="'+translation.admin_editHeader+'">'+data.header+'</textarea>');
			$("#innerPopup > form").append('<input type="hidden" name="action" value="editHeader">');
			$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editHeaderSubmit+'">');

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}

		function editFooter(){
			showAdmin();
			$("#innerPopup").append('<h1>'+translation.admin_editFooter+'</h1>');
			$("#innerPopup").append('<form action="/api/" method="post"></form>');
			$.post( '/api/', {action: "getFooter"},"json")
			.done(function(data){
				$("#innerPopup > form").append('<textarea name="footer" placeholder="'+translation.admin_editFooter+'">'+data.footer+'</textarea>');
				$("#innerPopup > form").append('<input type="hidden" name="action" value="editFooter">');
				$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editFooterSubmit+'">');

			})
			.fail(function(d, textStatus, error) {
						console.error("getJSON failed, status: " + textStatus + ", error: "+error);
			});
		}

	function pluginCenter(thisContext){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editPlugins+'</h1>');
		$.post( '/api/', {action: "getPlugins"},"json")
		.done(function(data){
			for(i = 0;i<data.length;i++){
				$("#innerPopup").append('<div id="plugin'+data[i].id+'" class="pluginList"></div>');
				$("#innerPopup > #plugin"+data[i].id).append('<p>'+data[i].file+' ("'+data[i].public1+'","'+data[i].public2+'","'+data[i].public3+'")</p>');
				$("#innerPopup > #plugin"+data[i].id).append('<p class="editPlugin" data-id="'+data[i].id+'">'+translation.admin_editPlugin+'</p>');
				$("#innerPopup > #plugin"+data[i].id).append('<p class="deletePlugin" data-id="'+data[i].id+'">'+translation.admin_deletePlugin+'</p>');
			}
			$("#innerPopup").append('<p id="newPlugin">'+translation.admin_newPlugin+'</p>');


			$("#newPlugin").on("click",function(){
				//open the editPlugin with a new plugin
				$.post( '/api/', {action: "newPlugin"},"json")
				.done(function(data){
					editPlugin(data);
				})
				.fail(function(data){});
			});

			$(".editPlugin").on("click",function(){
				//open the editPlugin with a new plugin
				thisContext = $(this);
				$.post( '/api/', {action: "retrievePlugin", id : thisContext.attr("data-id")},"json")
				.done(function(data){
					editPlugin(data);
				})
				.fail(function(data){});
			});

			$(".deletePlugin").on("click",function(){
			thisContext = $(this);
				$("#plugin"+thisContext.attr("data-id")).remove();
					$.post( '/api/', {action: "deletePlugin", plugin : thisContext.attr("data-id")},"json").done(function(data){
				});
			});

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}

	function editPlugin(data){
		$("#innerPopup").html('<div id="closePopup">X</div>');
		$("#innerPopup").append('<h1>'+translation.admin_editPlugins+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$("#innerPopup > form").append('<select name="file" id="pluginList"></select>');
		for(i=0;i<data.pluginList.length;i++){
			if(data.pluginList[i] == data.plugin.file){
				var checked = " selected";
			}
			else{
				var checked = "";
			}
			$("#innerPopup > form > #pluginList").append('<option value="'+data.pluginList[i]+'"'+checked+'>'+data.pluginList[i]+'</option>');
		}
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.public1+'" name="public1">');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.public2+'" name="public2">');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.public3+'" name="public3">');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.int1+'" name="int1" readonly>');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.int2+'" name="int2" readonly>');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.int3+'" name="int3" readonly>');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.txt1+'" name="txt1" readonly>');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.txt2+'" name="txt2" readonly>');
		$("#innerPopup > form").append('<input type="text" value="'+data.plugin.txt3+'" name="txt3" readonly>');
		$("#innerPopup > form").append('<input type="hidden" name="id_plugin" value="'+data.plugin.id+'">');
		$("#innerPopup > form").append('<input type="hidden" name="action" value="editPlugin">');
		$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editPlugin+'">');

		$("#closePopup").on("click",function(){
			$("#blackout").remove();
		});
	}

	function contactCenter(){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editContact+'</h1>');
		$.post( '/api/', {action: "getContact"},"json")
		.done(function(data){
			for(i = 0;i<data.length;i++){
				$("#innerPopup").append('<div id="contact'+data[i].id+'" class="contactList"></div>');
				$("#innerPopup > #contact"+data[i].id).append('<p>'+data[i].type+' / '+data[i].value+'</p>');
				$("#innerPopup > #contact"+data[i].id).append('<p class="editContact" data-id="'+data[i].id+'">'+translation.admin_editPlugin+'</p>');
				$("#innerPopup > #contact"+data[i].id).append('<p class="deleteContact" data-id="'+data[i].id+'">'+translation.admin_deletePlugin+'</p>');
			}
			$("#innerPopup").append('<p id="newContact">'+translation.admin_newContact+'</p>');


			$("#newContact").on("click",function(){
				//open the editPlugin with a new plugin
				$.post( '/api/', {action: "newContact"},"json")
				.done(function(data){
					editContact(data);
				})
				.fail(function(data){});
			});

			$(".editContact").on("click",function(){
				//open the editPlugin with a new plugin
				thisContext = $(this);
				$.post( '/api/', {action: "retrieveContact", id : thisContext.attr("data-id")},"json")
				.done(function(data){
					editContact(data);
				})
				.fail(function(data){});
			});

			$(".deleteContact").on("click",function(){
				thisContext = $(this);
				$("#contact"+thisContext.attr("data-id")).remove();
					$.post( '/api/', {action: "deleteContact", contact : thisContext.attr("data-id")},"json").done(function(data){
				});
			});

		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}

	function editContact(data){
		$("#popup").html('<div id="innerPopup"></div><div id="closePopup">X</div>');
		$("#innerPopup").append('<h1>'+translation.admin_editContact+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$("#innerPopup > form").append('<select name="type" id="contactList"></select>');
		for(i=0;i<data.contactList.length;i++){
			if(data.contactList[i].id_type == data.contact.type){
				var checked = " selected";
			}
			else{
				var checked = "";
			}
			$("#innerPopup > form > #contactList").append('<option value="'+data.contactList[i].id_type+'"'+checked+'>'+data.contactList[i].name+'</option>');
		}
		$("#innerPopup > form").append('<input type="text" value="'+data.contact.value+'" name="value">');
		$("#innerPopup > form").append('<input type="text" value="'+data.contact.priority+'" name="priority">');
		$("#innerPopup > form").append('<input type="hidden" name="id_contact" value="'+data.contact.id+'">');
		$("#innerPopup > form").append('<input type="hidden" name="action" value="editContact">');
		$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editContact+'">');
		$("#closePopup").on("click",function(){
			$("#blackout").remove();
		});
	}
	function summaryCenter(thisContext){
		showAdmin();
		$("#innerPopup").append('<h1>'+translation.admin_editSummary+'</h1>');
		$.post( '/api/', {action: "getSummary", lang : thisContext.data('lang')},"json")
		.done(function(data){
			var group = 0;
			for(i = 0;i<data.length;i++){
				if(data[i].group != group){
					group = data[i].group;
					$("#innerPopup").append('<hr>');
				}
				$("#innerPopup").append('<div id="summary'+data[i].id_summary+'" class="SummaryList"></div>');
				$("#innerPopup > #summary"+data[i].id_summary).append('<p>'+data[i].name+'</p>');
				$("#innerPopup > #summary"+data[i].id_summary).append('<p>'+data[i].group+'</p>');
				$("#innerPopup > #summary"+data[i].id_summary).append('<p>'+data[i].priority+'</p>');
				$("#innerPopup > #summary"+data[i].id_summary).append('<p class="editSummary" data-id="'+data[i].id_summary+'" data-lang="'+thisContext.data('lang')+'">'+translation.admin_editThisSummary+'</p>');
				$("#innerPopup > #summary"+data[i].id_summary).append('<p class="deleteSummary" data-id="'+data[i].id_summary+'">'+translation.admin_deleteSummary+'</p>');
			}
			$("#innerPopup").append('<p id="newSummary" data-lang="'+thisContext.data('lang')+'">'+translation.admin_newSummary+'</p>');

			$(".deleteSummary").on("click",function(){
				var thisContext = $(this);
				$.post( '/api/', {action: "deleteSummary", id : thisContext.data('id')},"json")
				.done(function(data){
					thisContext.parent("div").remove();
				})
				.fail(function(d, textStatus, error) {
							console.error("getJSON failed, status: " + textStatus + ", error: "+error);
				});
			});

			$("#newSummary").on("click",function(){
				var thisContext = $(this);
				$.post( '/api/', {action: "newSummary", lang : thisContext.data('lang')},"json")
				.done(function(data){
					editSummary(data);
				})
				.fail(function(d, textStatus, error) {
							console.error("getJSON failed, status: " + textStatus + ", error: "+error);
				});
			});

			$(".editSummary").on("click",function(){
				var thisContext = $(this);
				$.post( '/api/', {action: "getThisSummary", id : thisContext.data('id'), lang : thisContext.data('lang')},"json")
				.done(function(data){
					editSummary(data);
				})
				.fail(function(d, textStatus, error) {
							console.error("getJSON failed, status: " + textStatus + ", error: "+error);
				});
			});


		})
		.fail(function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error);
		});
	}
	function editSummary(data){
		$("#popup").html('<div id="innerPopup"></div><div id="closePopup">X</div>');
		$("#innerPopup").append('<h1>'+translation.admin_editSummary+'</h1>');
		$("#innerPopup").append('<form action="/api/" method="post"></form>');
		$("#innerPopup > form").append('<select name="subcat" id="subcatList"></select>');
		for(i=0;i<data.subcatList.length;i++){
			if(data.subcatList[i].name == data.summary.name){
				var checked = " selected";
			}
			else{
				var checked = "";
			}
			$("#innerPopup > form > #subcatList").append('<option value="'+data.subcatList[i].id_subcat+'"'+checked+'>'+data.subcatList[i].name+'</option>');
		}
		$("#innerPopup > form").append('<input type="text" value="'+data.summary.group+'" name="group">');
		$("#innerPopup > form").append('<input type="text" value="'+data.summary.priority+'" name="priority">');
		$("#innerPopup > form").append('<input type="text" value="'+data.summary.rows+'" name="rows">');
		$("#innerPopup > form").append('<input type="hidden" name="id" value="'+data.summary.id_summary+'">');
		$("#innerPopup > form").append('<input type="hidden" name="action" value="editSummary">');
		$("#innerPopup > form").append('<input type="submit" value="'+translation.admin_editSummary+'">');
		$("#closePopup").on("click",function(){
			$("#blackout").remove();
		});
	}

	$("section#article > article").has(".downloadThat").each(function(){
		if($(this).children(".content").html() == ""){
     	window.location.assign($(this).children(".downloadThat").children(".downloadThis").attr("href"));
		}
	});

});
