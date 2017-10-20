$(document).ready(function(){
    $(document).click(function(){ $('#clickTips').hide(); });
    var addToTrTop = 10;
    var addToTrLeft = 100;
    var preEdit = null;
    var inputData = '<input id="tmpEditor" type="text" value="?">';
    var bindListening = function(){
//屏蔽浏览器右键
        if (window.Event) document.captureEvents(Event.MOUSEUP);
        function nocontextmenu(e){
            if(!e) var e=window.event;
            e.cancelBubble = true
            e.returnValue = false;
            return false;
        }
        function norightclick(e){
            if(!e) var e=window.event;
            if (window.Event){
                if (e.which == 2 || e.which == 3)
                    return false;
            }else if (e.keyCode == 2 || e.keyCode == 3){
                e.cancelBubble = true
                e.returnValue = false;
                return false;
            }
        }
        document.oncontextmenu = nocontextmenu; // for IE5+
        document.onmousedown = norightclick; // for all others
//End 屏蔽浏览器右键
//表格右键响应
        $("#tb tr td:first-child").mousedown(function(e){
            var code;
            if(!e) var e=window.event;
            if(e.keyCode) {
                code=e.keyCode;
            }else if(e.which){
                code = e.which;
            }
            var tdData = $("#tmpEditor").val();
            if(code == 3){
                var tipStyle = 'top:'+(parseInt($(this).position().top)+addToTrTop)+'px;left:'+addToTrLeft+'px;';
                /*alert(tipStyle)*/
                $("#clickTips").attr('style',tipStyle).show();
                return false;
            }
            if(code == 1){
                if( !$(this).parent().hasClass('editting')) {
                    preEdit&&preEdit.empty().html(tdData.trim(' '));
                    preEdit = null;
                    $("#tmpEditor").parent().empty().html($("#tmpEditor").val());
                    $(".editting").removeClass('editting');
                }else if( preEdit && (preEdit.parent().children().index($(preEdit)) != $(this).parent().children().index($(this))) ){
                    preEdit.empty().html(tdData.trim(' '));
                    preEdit = null;
                }else{
                    if(!$("#tmpEditor").val()) {
                        preEdit = $(this);
                        var tdData = $(this).html();
                        $(this).empty().append(inputData.replace('?',tdData));
                        $("#tmpEditor").focus();
                    }
                }
                return false;
            }
            bindListening();
        }); //End 表格右键响应
//向上增加一行
        $("#addUp").unbind().click(function(){
            doAddTrData($(this),'up');
            doEditTrData($(this),'edit');
            bindListening();
        });
//向下增加一行
        $("#addDown").unbind().click(function(){
            doAddTrData($(this),'down');
            bindListening();
        });
//删除当前行
        $("#delete").unbind().click(function(){
            doDeleteTrData($(this),'delete');
            bindListening();
        });
//编辑当前行
        $("#edit").unbind().click(function(){
            doEditTrData($(this),'edit');
            bindListening();
        });
        var addTrData = $("tr:first-child").clone(true).attr('class','newAdd');
        var getIndex = function(clickedTd,type){
            var fields = $("tr");
            var addIndex = -1;
            for(var i=1;i<fields.length;i++){
                var tipStyle = clickedTd.parent().attr('style');
                var topValue = 'top: '+(parseInt(fields.eq(i).position().top)+addToTrTop);
                var ie_topValue = 'top: '+(parseInt(fields.eq(i).position().top)+(addToTrTop-2));
                if((tipStyle.indexOf(topValue) != -1) || (tipStyle.indexOf(ie_topValue) != -1)) {
                    switch(type.toLowerCase()){
                        case 'up':
                            addIndex = i-1;
                            break;
                        case 'down':
                        case 'edit':
                        case 'delete':
                            addIndex = i;
                            break;
                    }
                }
            }
            return addIndex;
        }
        var doAddTrData = function(clickedTd,type){
            if(getIndex(clickedTd,type) == -1) return false;
            else {
                var index=getIndex(clickedTd,type);
            }
            $("#tb tr").eq(index).after(addTrData);
            setTimeout('$(".newAdd").attr("class",null)',1000);
            $("#clickTips").hide();
            return false;
        }
        var doDeleteTrData = function(clickedTd,type){
            if(getIndex(clickedTd,type) == -1) return false;
            else {
                var index=getIndex(clickedTd,type);
            }
            $("#tb tr").eq(index).remove();
            $("#clickTips").hide();
            return false;
        }
        var doEditTrData = function(clickedTd,type){
            if(getIndex(clickedTd,type) == -1) return false;
            else {
                var index=getIndex(clickedTd,type);
            }
            $("#tb tr").eq(index).addClass('editting');
            $("#clickTips").hide();
            return false;
        }
    }
    bindListening();
})