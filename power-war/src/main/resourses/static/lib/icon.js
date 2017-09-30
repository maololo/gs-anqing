/**
 * Created by Administrator on 2017/8/4.
 */


$(function () {
    $('#addLayerBtn').on('show.bs.modal', function () {
        $('.modal-backdrop').remove();
    })
   /* var treeData = [{
        text: "书签列表",
        nodes: [{
            text: "Child 1",
            nodes: [{
                text: "Grandchild 1"
            }, {
                text: "Grandchild 2"
            }]
        }, {
            text: "Child 2",
            nodes: [{
                text: "Grandchild 1"
            }, {
                text: "Grandchild 2"
            }]
        }]
    }, {
        text: "Parent 2"
    }];
    //初始化树形结构列表
    $('#bookMakerTree').treeview({
        data: treeData,
        levels: 2
    });
    //节点选中时触发
    $('#bookMakerTree').on('nodeSelected', function(event, data) {
        clickNode(event, data)
    });
    //节点取消选中时触发
    $('#bookMakerTree').on('nodeUnselected', function(event, data) {
        clickNode(event, data)
    });
    var menu = new BootstrapMenu('.list-group-item', {
     /!*   fetchElementData:function($rowElem ){
        var  rowId  = $rowElem.data(' rowId ');
        return  tableRows [ rowId ] ;tableRows为节点数据
    },*!/

        actions: [{
            name: 'Action',
            menuPosition:'aboveRight',//表示右击弹出层的位置
            onClick: function(row) {
                toastr.info("'Action' clicked!");
            }
        }, {
            name: 'Another action',
            menuPosition:'aboveRight',
            onClick: function(row) {
                toastr.info("'Another action' clicked!");
            }
        }, {
            name: 'A third action',
            menuPosition:'aboveRight',
            onClick: function(row) {
                toastr.info("'A third action' clicked!");
            }
        }]
    });*/

    $('#bookMakerTree').jstree({
        // "plugins" : ["contextmenu","wholerow"],
        "plugins" : ["checkbox","contextmenu","wholerow","types"],
        "checkbox" : {
            "whole_node" : false,
            "keep_selected_style" : false,
            "tie_selection" : false
        },
        // "dnd" : {  //拖动插件
        //       "inside_pos" : "first"
        //  },
       /* "contextmenu":{
            "show_at_node":false,
            "items":{
                "导入图层":{
                    "label":"导入图层",
                    "action":function(data){
                        var ref = $('#bookMakerTree').jstree(true),
                            sel = ref.get_selected();
                        if(!sel.length) { return false; }
                        sel = sel[0];

                        var name = prompt("请输入节点名称:", "");
                        if(name.trim() !=""){
                            ref.create_node(sel,
                                {text:name,
                                    id:"111111111111111",
                                    icon:"glyphicon glyphicon-file",
                                    state:{checked:true}},
                                "first",
                                function() {
                                    // alert("added");
                                }
                            );
                        }
                    }
                },
                "删除图层":{
                    "label":"删除图层",
                    "action":function(data){
                        /!* var inst = jQuery.jstree.reference(data.reference),
                         obj = inst.get_node(data.reference);  *!/
                        if(confirm("确定要删除此图层？删除后不可恢复。")){

                            var ref = $('#bookMakerTree').jstree(true),
                                sel = ref.get_selected();
                            if(!sel.length) { return false; }
                            ref.delete_node(sel[0]);
                            /!* jQuery.get("/accountmanage/deleteMenu?id="+obj.id,function(dat){
                             if(dat == 1){
                             //                                       DeuGlobe_util.LogicalRootLayer.RemoveChildByID(layerid);
                             alert("图层删除成功！");
                             jQuery("#"+treeid).jstree("refresh");
                             }else{
                             alert("图层删除失败！");
                             }
                             });  *!/
                        }
                    }
                },
                "重命名":{
                    "label":"重命名",
                    "action":function(data){
                        var ref = $('#bookMakerTree').jstree(true);
                        sel = ref.get_selected();
                        if(!sel.length) { return false; }
                        sel = sel[0];
                        var name = prompt("请输入新节点名称:", "");
                        if(name.trim() !=""){
                            ref.rename_node(sel,name);
                        }
                    }

                }
            }
        },*/
        "core" : {
            /*'force_text' : true,
             "themes" : { "stripes" : true },
             "animation" : 0,*/
            "check_callback" : true,
            'data' : [
                {
                    "text" : "影像图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " },
                        { "text" : "Child node 2", "state" : { "selected" : false }, "icon" : "glyphicon " },
                        { "text" : "Child node 3", "state" : { "selected" : false }, "icon" : "glyphicon " }

                    ]
                },
                {
                    "text" : "地形图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " }
                        /*{ "text" : "Child node 2", "state" : { "disabled" : true } }*/
                    ]
                },
                {
                    "text" : "模型图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " }
                        /*{ "text" : "Child node 2", "state" : { "disabled" : true } }*/
                    ]
                }
            ]
        }
    });

    //选中节点事件
    $('#bookMakerTree').on("select_node.jstree", function (event, data) {
        var childrens = $('#bookMakerTree').jstree("get_children_dom",data.node);
        if(childrens.length==0){
            /*var obj=DeuGlobe_util.PMObjectFindObjectByID(data.node.id);
             var BoundProperty = obj.GetChildByTitle("BoundingSphere");
             var dLongitude = BoundProperty.GetChild(0).Value.Double_Val *180/Math.PI;
             var dLatitude = BoundProperty.GetChild(1).Value.Double_Val *180/Math.PI;
             var dHeight = BoundProperty.GetChild(2).Value.Double_Val;
             var dRadius = BoundProperty.GetChild(3).Value.Double_Val *180/Math.PI;
             DeuGlobe_util.goToPositionByJwd(dLongitude,dLatitude,dHeight+1000); */
// 			obj.SetState("highlight", true);
            //alert("节点被选中");
        }
    });

    //选中节点事件
    $('#bookMakerTree').on("deselect_node.jstree", function (event, data) {
        var childrens = $('#bookMakerTree').jstree("get_children_dom",data.node);
        if(childrens.length==0){
            alert("取消选中节点");
        }
    });
    $('#eidorTree').jstree({
        // "plugins" : ["contextmenu","wholerow"],
        "plugins" : ["checkbox","contextmenu","wholerow","types"],
        "checkbox" : {
            "whole_node" : false,
            "keep_selected_style" : false,
            "tie_selection" : false
        },
        // "dnd" : {  //拖动插件
        //       "inside_pos" : "first"
        //  },
       /* "contextmenu":{
            "show_at_node":false,
           /!* "items":{
                "导入图层":{
                    "label":"导入图层",
                    "action":function(data){
                        var ref = $('#eidorTree').jstree(true),
                            sel = ref.get_selected();
                        if(!sel.length) { return false; }
                        sel = sel[0];

                        var name = prompt("请输入节点名称:", "");
                        if(name.trim() !=""){
                            ref.create_node(sel,
                                {text:name,
                                    id:"111111111111111",
                                    icon:"glyphicon glyphicon-file",
                                    state:{checked:true}},
                                "first",
                                function() {
                                    // alert("added");
                                }
                            );
                        }
                    }
                },
                "删除图层":{
                    "label":"删除图层",
                    "action":function(data){
                        /!* var inst = jQuery.jstree.reference(data.reference),
                         obj = inst.get_node(data.reference);  *!/
                        if(confirm("确定要删除此图层？删除后不可恢复。")){

                            var ref = $('#eidorTree').jstree(true),
                                sel = ref.get_selected();
                            if(!sel.length) { return false; }
                            ref.delete_node(sel[0]);
                            /!* jQuery.get("/accountmanage/deleteMenu?id="+obj.id,function(dat){
                             if(dat == 1){
                             //                                       DeuGlobe_util.LogicalRootLayer.RemoveChildByID(layerid);
                             alert("图层删除成功！");
                             jQuery("#"+treeid).jstree("refresh");
                             }else{
                             alert("图层删除失败！");
                             }
                             });  *!/
                        }
                    }
                },
                "重命名":{
                    "label":"重命名",
                    "action":function(data){
                        var ref = $('#eidorTree').jstree(true);
                        sel = ref.get_selected();
                        if(!sel.length) { return false; }
                        sel = sel[0];
                        var name = prompt("请输入新节点名称:", "");
                        if(name.trim() !=""){
                            ref.rename_node(sel,name);
                        }
                    }

                }
            }*!/
        },*/
        "core" : {
            /*'force_text' : true,
             "themes" : { "stripes" : true },
             "animation" : 0,*/
            "check_callback" : true,
            'data' : [
                {
                    "text" : "编辑类型",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "电话线点", "state" : { "selected" : false }, "icon" : "glyphicon " },
                        { "text" : "电话线路", "state" : { "selected" : false }, "icon" : "glyphicon " },
                        { "text" : "Child node 3", "state" : { "selected" : false }, "icon" : "glyphicon " }

                    ]
                },
                {
                    "text" : "地形图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " }
                        /*{ "text" : "Child node 2", "state" : { "disabled" : true } }*/
                    ]
                },
                {
                    "text" : "模型图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " }
                        /*{ "text" : "Child node 2", "state" : { "disabled" : true } }*/
                    ]
                }
            ]
        }
    });

    //选中节点事件
    $('#eidorTree').on("select_node.jstree", function (event, data) {
        var childrens = $('#eidorTree').jstree("get_children_dom",data.node);
        if(childrens.length==0){
            /*var obj=DeuGlobe_util.PMObjectFindObjectByID(data.node.id);
             var BoundProperty = obj.GetChildByTitle("BoundingSphere");
             var dLongitude = BoundProperty.GetChild(0).Value.Double_Val *180/Math.PI;
             var dLatitude = BoundProperty.GetChild(1).Value.Double_Val *180/Math.PI;
             var dHeight = BoundProperty.GetChild(2).Value.Double_Val;
             var dRadius = BoundProperty.GetChild(3).Value.Double_Val *180/Math.PI;
             DeuGlobe_util.goToPositionByJwd(dLongitude,dLatitude,dHeight+1000); */
// 			obj.SetState("highlight", true);
            //alert("节点被选中");
        }
    });

    //选中节点事件
    $('#eidorTree').on("deselect_node.jstree", function (event, data) {
        var childrens = $('#eidorTree').jstree("get_children_dom",data.node);
        if(childrens.length==0){
            alert("取消选中节点");
        }
    });
    $('#powerLayerTree').jstree({
        // "plugins" : ["contextmenu","wholerow"],
        "plugins" : ["checkbox","contextmenu","wholerow","types"],
        "checkbox" : {
            "whole_node" : false,
            "keep_selected_style" : false,
            "tie_selection" : false
        },
        // "dnd" : {  //拖动插件
        //       "inside_pos" : "first"
        //  },
       /* "contextmenu":{
            "show_at_node":false,
            "items":{
                "导入图层":{
                    "label":"导入图层",
                    "action":function(data){
                        var ref = $('#powerLayerTree').jstree(true),
                            sel = ref.get_selected();
                        if(!sel.length) { return false; }
                        sel = sel[0];

                        var name = prompt("请输入节点名称:", "");
                        if(name.trim() !=""){
                            ref.create_node(sel,
                                {text:name,
                                    id:"111111111111111",
                                    icon:"glyphicon glyphicon-file",
                                    state:{checked:true}},
                                "first",
                                function() {
                                    // alert("added");
                                }
                            );
                        }
                    }
                },
                "删除图层":{
                    "label":"删除图层",
                    "action":function(data){
                        /!* var inst = jQuery.jstree.reference(data.reference),
                         obj = inst.get_node(data.reference);  *!/
                        if(confirm("确定要删除此图层？删除后不可恢复。")){

                            var ref = $('#powerLayerTree').jstree(true),
                                sel = ref.get_selected();
                            if(!sel.length) { return false; }
                            ref.delete_node(sel[0]);
                            /!* jQuery.get("/accountmanage/deleteMenu?id="+obj.id,function(dat){
                             if(dat == 1){
                             //                                       DeuGlobe_util.LogicalRootLayer.RemoveChildByID(layerid);
                             alert("图层删除成功！");
                             jQuery("#"+treeid).jstree("refresh");
                             }else{
                             alert("图层删除失败！");
                             }
                             });  *!/
                        }
                    }
                },
                "重命名":{
                    "label":"重命名",
                    "action":function(data){
                        var ref = $('#powerLayerTree').jstree(true);
                        sel = ref.get_selected();
                        if(!sel.length) { return false; }
                        sel = sel[0];
                        var name = prompt("请输入新节点名称:", "");
                        if(name.trim() !=""){
                            ref.rename_node(sel,name);
                        }
                    }

                }
            }
        },*/
        "core" : {
            /*'force_text' : true,
             "themes" : { "stripes" : true },
             "animation" : 0,*/
            "check_callback" : true,
            'data' : [
                {
                    "text" : "影像图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " },
                        { "text" : "Child node 2", "state" : { "selected" : false }, "icon" : "glyphicon " },
                        { "text" : "Child node 3", "state" : { "selected" : false }, "icon" : "glyphicon " }

                    ]
                },
                {
                    "text" : "地形图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " }
                        /*{ "text" : "Child node 2", "state" : { "disabled" : true } }*/
                    ]
                },
                {
                    "text" : "模型图层",
                    "state" : {"opened" : false },
                    "children" : [
                        { "text" : "Child node 1", "state" : { "selected" : false }, "icon" : "glyphicon " }
                        /*{ "text" : "Child node 2", "state" : { "disabled" : true } }*/
                    ]
                }
            ]
        }
    });

    //选中节点事件
    $('#powerLayerTree').on("select_node.jstree", function (event, data) {
        var childrens = $('#powerLayerTree').jstree("get_children_dom",data.node);
        if(childrens.length==0){
            /*var obj=DeuGlobe_util.PMObjectFindObjectByID(data.node.id);
             var BoundProperty = obj.GetChildByTitle("BoundingSphere");
             var dLongitude = BoundProperty.GetChild(0).Value.Double_Val *180/Math.PI;
             var dLatitude = BoundProperty.GetChild(1).Value.Double_Val *180/Math.PI;
             var dHeight = BoundProperty.GetChild(2).Value.Double_Val;
             var dRadius = BoundProperty.GetChild(3).Value.Double_Val *180/Math.PI;
             DeuGlobe_util.goToPositionByJwd(dLongitude,dLatitude,dHeight+1000); */
// 			obj.SetState("highlight", true);
            //alert("节点被选中");
        }
    });

    //选中节点事件
    $('#powerLayerTree').on("deselect_node.jstree", function (event, data) {
        var childrens = $('#powerLayerTree').jstree("get_children_dom",data.node);
        if(childrens.length==0){
            alert("取消选中节点");
        }
    });
    var index=0;
    $(".baseLayer").click(function () {
        index=$(".baseLayer").index(this);
        /*$(".baseLayer span").hide();*/
        $(".baseLayer span").eq(index).slideToggle();
        $(".baseLayer span").not($(".baseLayer span:eq("+index+")")).slideUp();
        alert('已选中第'+index+'张')
    });
    $("#foldBtn").click(function () {
        $("#btnGroup").hide();
        $("#expandBtn").show();
    });
    $("#expandBtn").click(function () {
        $("#btnGroup").show();
        $(this).hide();
    });

    $(".dropdown-menu").on("click", "[data-stopPropagation]", function(e) {
        e.stopPropagation();
    });
    $('#cesiumContainer').click(function(e) {
        e.stopPropagation();
    });
    /*阻止树菜单的冒泡*/
    $('#bookMakerTree').click(function(e) {
        e.stopPropagation();
    });
    $(".check").click(function () {
        $(this).hide();
        $(".uncheck").show()
    })
    $(".uncheck").click(function () {
        $(this).hide();
        $(".check").show()
    })

})

function changeIcon(name) {
    $("#icontext").text(name)
}
/*
//最后一次触发节点Id
var lastSelectedNodeId = null;
//最后一次触发时间
var lastSelectTime = null;

//自定义业务方法
function customBusiness(data){
    alert("双击获得节点名字： "+data.text);
}

function clickNode(event, data) {
    if (lastSelectedNodeId && lastSelectTime) {
        var time = new Date().getTime();
        var t = time - lastSelectTime;
        if (lastSelectedNodeId == data.nodeId && t < 300) {
            customBusiness(data);
        }
    }
    lastSelectedNodeId = data.nodeId;
    lastSelectTime = new Date().getTime();
}
*/
