/** 
 * @file mzDropDownTree is a jQuery plugin used to create a dropdown tree structure with html5 detail and summary tags.
 * It is a lightweight powerful plugin which can be used to either create nested checkbox list from either static or remote data source.
 * @version 0.1
*  @author Mishraz Bhounr <connect@mishraz.com>
 * @copyright 2023
 * 
 */
if (typeof jQuery == 'function') {
    /**
     * main callback to render a tree div from options object
      * @function external:"jQuery.fn.mzDropDownTree"
     * 
     * @example  <caption>Initialize basic tree. see {@tutorial example_basic}</caption> 
     * <div id="your-tree-id"></div>
     * <script>
     * $("#your-tree-id").mzDropDownTree({options})
     * </script>
     * @example  <caption>Initialize basic tree with data attributes.</caption>
     * <div id="your-tree-id" data-label="Label" data-description="Description of the tree"></div>
     * <script>
     * $("#your-tree-id").mzDropDownTree({options})
     * </script>
     * 
     * @example <caption>declaring the static data property for the tree</caption>
        * 
        *   defaultOptions.data = {
        *       label:"Label of the option"
        *       value: "12345"
        *       children:{
        *       {
        *           label:"Label",
        *           value:"Value"
        *       },
        *       {
        *           label:"Label",
        *           value:"Value"
        *           children:[
        *               {
        *                   label:"Label",
        *                   value:"value"
        *               }
        *           ]
        * 
        *       } 
        *   }
        * }
        * @example <caption>Declaring remote data property.</caption> 
        * -NOTE: That the remote data property must return a numeric childcount
        * returned data from URL source must include child count
        * {
        *   label:"Label"
        *   value: "value"
        *   children: 10|0|1
        * }
        * tree node is fetched again when the tree node is expanded.
        * 
        * defaultOptions.data{
        *   url:"URL TO YOUR SOURCE"
        *   method: "[POST|GET]" default is GET
        *   data: data 
        * }
     */
    $.fn.mzDropDownTree = function(options) {
        /**
        * The default options for the tree. Default options can be overridden by initinaliing the tree with options object the div's data-attributes
        * @typedef  {Object} defaultOptions 
        * @property {string} key - Required key name of the tree, data is submitted against this key value
        * @property {Object} data -Required data property for the tree, the tree is constructed from nested nodes of data object
        * @property {string} data.label - Label of the checkbox
        * @property {string|number} data.value - Value of the checkbox to be submitted must be unique per tree instance
        * @property {object|array|number} data.children - Object|Array Child label and value  pair of objects to nest in the tree
        * @property {object} [data.icon] - icon rendered before the label Optional,
        * @property {string} data.icon.tag -[i|img] Tag to be rendered example:i or img
        * @property {object} data.icon.attributes - HTML 5 list of attributes to be rendered on the icon object
        * @property {string} data.url -Optionally is a URL is provided to data, the tree will attempt to fetch the data from remote source. It will still expect the above data object with label|value|children properties
        * @property {string} [data.method] -[GET|Post] Default is Get from URL source
        * @property {object} [data.data] - an Object of key|value pair to be sent via URL 
        * @property {string} label - Label of the tree filter, tree filter is focused when this label is clicked.
        * @property {string} description - The Description or help text for the tree
        * @property {string} [mode] - The mode of the tree, its either a tree or flat.
        * @property {Array|Object} default_value - The default values with 
        * @property {string}  [placeholder] -The placeholder text field for the tree 
        * @property {object}  [select_options] -selection configuration for the tree
        * @property {number}  select_options.max_nodes -[unlimited=-1] maximum nodes that can be selected in the tree
        * @property {number}  select_options.selected_node_maxwidth - maximum width of the selected node displayed in the tree
        * @property {boolean} select_options.toggle_select_parents - renders a checkbox for the parent node
        * @property {boolean} select_options.toggle_parent_selects_children - all children are selected when a parent is selected
        * @property {boolean} select_options.disable_children_on_parent_selection - all children are disabled when a parent is selected. This is useful if you want to determine children by using a wildcard * or id of the parent
        * @property {boolean} select_options.toggle_select_all_siblings - if the parent does not select children there might be a need for sibling selector- The sibling selector can select all siblings in the same node
        * @property {string}  select_options.toggle_select_all_siblings_label - specify the node text for the sibling selector                         
        * @property {number}  select_options.max_selection_displayed_nodes - Maximum number of nodes displayed in the tree selectopms
        * @property {string}  select_options.more_nodes_text  - More nodes text appended at the end of node selection
        * @property {object}  filter_options - Filter options for tree
        * @property {boolean} filter_options.text_filter - Enables a text filter
        * @property {number}  filter_options.min_text_characters - Minimum characters required for the text filter
        * @property {object}  tree_options -tree header options such as select all show selected etc.
        * @property {boolean} tree_options.select_all - creates a select all option checkbox
        * @property {string}  tree_options.select_all_text - text for select all checkbox. Defaults to "Select All"
        * @property {boolean} tree_options.expand_all - creates a expand all checkbox option
        * @property {string}  tree_options.expand_all_text -sets the expand all text for the checkbox label
        * @property {boolean} tree_options.show_selected - creates the show selected option checkbox
        * @property {string}  tree_options.show_selected_text - sets the show selected checkbox label
        * @property {object} onNodeSelect - callback is engaged when a node is selected. It exposes node, nodes and totalNodes. Example: options.onNodeSelect:function(node, nodes, totalNodes) 
        * @property {object} onTreeRender - callback is engaged when the tree has finished rendering process. Add remove or modify tree nodes in this callback. options.OnTreeRender:function(tree){}
        * @property {object} OnDetailOpen - callback is engaged on Remote Data property, when the detail arrow or sign has been clicked or the tree parent node is expanded, use this to modify the payload sent to the target URL. Example: options.onDetailOpen:function(data)
        * @property {object} onTextFilterChange - callback is engaged when the filter has changed
        * @property {object} onTextFilterFocus - callback is engaged when the the text filter receives focus. Use this to modify the open and close behavior of the tree    
        */
        var defaultOptions = {
            // These are the defaults. 
            key: "default_field_name",
            data: {
                url: "URL",
                method:"GET",
                data:null
            },
            label: "Tree label",
            description:"",
            mode:"tree", //[tree|flat]
            default_value: [null],
            placeholder: "Click to Expand List",
            select_options: {
                max_nodes: -1,
                selected_node_maxwidth: 152,
                toggle_select_parents: true, 
                toggle_parent_selects_children:true, 
                disable_children_on_parent_selection:false,
                toggle_select_all_siblings: false, 
                toggle_select_all_siblings_label: "Select all [NODE_LABEL]", 
                max_selection_displayed_nodes: 3, 
                more_nodes_text: " and [max] more"
            },
            filter_options: {
                text_filter: true,
                min_text_characters: 1
            },
            tree_options: {
                select_all: true,
                select_all_text: "Select All",
                expand_all: true,
                expand_all_text: "Expand All",
                show_selected: true,
                show_selected_text: "Show Selected"
            }
        };
        var treePlugInClass = "mz-tree-dropdown-plugin";
       /**
        * reference to the tree object
        * @property {object} _self   
        */
        var _self = this;
        var  $tree_wrapper;
        
        /**
         * @property {object} treesettings -reference to defaultOptions merged with options initialized and data attributes 
         * 
         */
        var treesettings = $.extend(true,{},defaultOptions, options, this.data());
       
        _self.selectedNodes = [];
        _self.treesettings = treesettings;
        _self.expandCollapseClass = "mz-tree-show";
        
        /**
         * initialize and builds the tree. This is the constructor for the tree object
         * @returns {void}
         */
        init=()=>{
            $(_self).html("");
            $(_self).addClass(treePlugInClass);
            _self.key =  _self.treesettings.key;
            _self.id =   $(_self).attr("id");      
            $(_self).addClass(treePlugInClass + "-"+  _self.id );
            if(_self.treesettings.mode == "flat"){
                $(_self).addClass("flat-list-tree");
            }
            filterid =  _self.id + "-mz-tree-dropdown-filter";
            $fieldLabel = $("<label />", { class: "mz-tree-dropdown-filter-label", for: filterid, html: _self.treesettings.label }).appendTo($(_self));

            $tree_head = $("<div />", { class: "tree-header" }).appendTo($(_self));
            $tree_filter = $("<div />", { class: "tree-filter-control" }).appendTo($($tree_head));
            $textfilter = $("<input />", { id: filterid, class: "mz-tree-dropdown-filter" }).appendTo($tree_filter);
            $selected_nodes = $("<div />", { class: "selected-nodes", id: "selected-nodes-" + _self.id }).prependTo($tree_head);
         
           
            $trigger_icon = $("<button />",{class:"btn-trigger-tree-control", type:"button"}).appendTo($tree_head);
            $trigger_icon.on('click', function(e){
                $(_self).find(".mz-tree-dropdown-filter").focus();
             });
          
            registerOnFilterEvents($textfilter);


            $tree_wrapper = $("<div />", { class: "tree-body mz-tree-collapse" }).appendTo($(_self));
            if(_self.treesettings.description != ""){
                $("<p/>",{html:_self.treesettings.description, class:"tree-description"}).insertAfter($tree_wrapper);
            }
           

            $nodes_wrapper = $("<div />", { class: "tree-nodes-wrapper" }).appendTo($tree_wrapper);
        
            if (_self.treesettings.data) {
    
                if (_self.treesettings.data.url) {
                    $tree = $nodes_wrapper;
                    loadJSON(_self.treesettings.data, $tree);
                } else {
                    $tree = $nodes_wrapper;
                    $.each(_self.treesettings.data, (item) => {
                        buildTree(_self.treesettings.data[item], $tree);
                    });
                }
            }

                if(_self.treesettings.tree_options!=null){
                    buildTreeOptions($tree_wrapper);
                }

             
              if (_self.treesettings.default_value != null) {
                if(typeof(_self.treesettings.default_value) == "object"|| typeof(_self.treesettings.default_value) == "array"){
                    $.each(_self.treesettings.default_value, function (k, v) {
                        chkbx = $(_self).find("#" + _self.id + "-" + v);
                        if (chkbx.val() != undefined) {
                            clabel = chkbx.next("label").text();
                            chkbx.prop("checked", true);
                            chkbx.trigger("change");
                            _self.updateSelectedNodeTags();
                        }
                    });
                }
                }
                if(_self.treesettings.onTreeRender)
                _self.treesettings.onTreeRender.call(_self,_self);

     }
/**
 * @param {object} -jQuery Filter object
 */
registerOnFilterEvents = ($obj) =>{
         $obj.on(
            'focus', function(e){
            
                $(".tree-body").each(function(){
                    $(this).removeClass(_self.expandCollapseClass);
                });
            
                $tree_wrapper.addClass(_self.expandCollapseClass);
                $tree_wrapper.attr("aria-expanded", true);
                $(_self).addClass("tree-active");
        
            });
        $obj.on(
            'focusout', function(e){
                $(_self).removeClass("tree-active");
            });
        if (!_self.treesettings.filter_options.text_filter) {
            $obj.attr("readonly", "readonly");
        } else {
            $obj.on("keyup", function () {
                filter = $(this).val();
                if (filter != "") {
                    if (!$(this).parent().find(".btn-clear-input").length) {
                        clearTextFilter = $("<button />", { type: "button", class: "btn-clear-input" }).appendTo($(this).parent());
                        clearTextFilter.on("click", function () {
                            $(this).prev(".mz-tree-dropdown-filter").val('');
                            $(this).prev(".mz-tree-dropdown-filter").focus();
                            $(this).remove();
                            $(_self).find(".tree-node-item").each(function(){
                                $(this).removeAttr("style");
                            });
                            $(_self).find(".total-nodes").html(_self.countAllNodes());
                        });
                    }
                    if (_self.treesettings.onTextFilterChange) {
                        _self.treesettings.onTextFilterChange.call(_self, onTextFilterChange);
                    }
                } else {
                    $(this).parent().find(".btn-clear-input").remove();
                }

                $(_self).find("details").attr("open", true);
                // list =$(treeFieldSelector + " .form-tree-list li ul li");
                list = $(_self).find(".tree-node-item");
                matchResults = 0;
                for (i = 0; i < list.length; i++) {
                    a = list[i].getElementsByTagName("label")[0];
                    txtValue = a.textContent || a.innerText;
                    if (txtValue != "") {
                        if (txtValue.toLowerCase().indexOf(filter) > -1) {
                            matchResults++;
                            $(list[i]).show();
                        } else {
                            $(list[i]).hide();
                        }
                    } else {
                        list[i].show();
                    }
                   
                }
               
                $(_self).find(".total-nodes").html(matchResults);

            });
        }
        }
        buildTreeOptions = function(wrapperObject){
            treeOptions = $("<div />", { class: "tree-options" }).prependTo(wrapperObject);
            buildToggleSelectAll(treeOptions);
            if( _self.treesettings.mode == "tree" ){
                buildToggleSelected(treeOptions);
                buildToggleExpandCollapse(wrapperObject);
            }
        }

            buildToggleSelectAll = (wrapperObject) => {
                if (_self.treesettings.tree_options && _self.treesettings.tree_options.select_all) {
                    treeSelectAll = $("<div />", { class: "tree-option select-all-nodes" }).appendTo(wrapperObject);
                    treeSelectAllchkBx = $("<input />", { type: "checkbox", id: "select-all-" + _self.id }).appendTo(treeSelectAll);
                    treeSelectAllLabel = $("<label />", { type: "checkbox", for: "select-all-" + _self.id, html: _self.treesettings.tree_options.select_all_text + "<span class=\"node-stat total-nodes\">"+_self.countAllNodes()+"</span>" }).appendTo(treeSelectAll);
                    treeSelectAllchkBx.on("change", function () {
                        select_all_checked = $(this).is(":checked");
                        $(this).css("cursor","loading");
                        $(this).attr("disabled","disabled");
                        if (_self.treesettings.select_options.toggle_select_children && !_self.treesettings.select_options.toggle_select_parents) {
                            $(_self).find(".select-all-siblings input[type=checkbox]").prop("checked", $(this).is(":checked"));
                        }
                        $(_self).find(".select-node").each(function () {
                            $(this).prop("checked", select_all_checked);
                            $(this).trigger("change");
                        });
                        $(this).removeAttr("disabled");    
                        $(this).removeAttr("style");     
                    });
                }
            }
     
            buildToggleSelected = (wrapperObject) =>{
                if (_self.treesettings.tree_options && _self.treesettings.tree_options.show_selected) {
                    treeShowSelected = $("<div />", { class: "tree-option select-selected-nodes" }).appendTo(treeOptions);
                    treeSelectedchkBx = $("<input />", { type: "checkbox", id: "show-selected-nodes-" + _self.id }).appendTo(treeShowSelected);
                    treeShowSelectedLabel = $("<label />", { type: "checkbox", for: "show-selected-nodes-"  + _self.id , html: _self.treesettings.tree_options.show_selected_text + "<span class=\"node-stat selected-count\">"+_self.countSelectedNodes()+"</span>" }).appendTo(treeShowSelected);
                    treeSelectedchkBx.on("change", function () {
                        if ($(this).is(":checked")) {
                            $(_self).find(".select-all-siblings").hide();
                            if (_self.countSelectedNodes()) {
                                $(_self).find("details").attr("open", true);
                                $(_self).find("input.select-node").each(function () {
                                    if ($(this).is(":checked")) {
                                        $(this).parent().show();
                                    } else {
                                        $(this).parent().hide();
                                    }
                                });
                            }
                        } else {
                            $(_self).find(".select-all-siblings").show();
                            $(_self).find("input.select-node").each(function () {
                                $(this).parent().show();
                            });
                        }
            
            
                    });
                }

            } 
            buildToggleExpandCollapse =(wrapperObject)=>{
                if (_self.treesettings.tree_options && _self.treesettings.tree_options.expand_all) {
                    expandCollapseToggle = $("<div />", { class: "tree-option expand-collapse-all-nodes" }).appendTo(treeOptions);
                    expandCollapseTogglechkBx = $("<input />", { type: "checkbox", class: "expand-collapse-toggle", id: "expand-all-nodes-" + _self.id }).appendTo(expandCollapseToggle);
                    expandCollapseToggleLabel = $("<label />", { type: "checkbox", for: "expand-all-nodes-" + _self.id, html: _self.treesettings.tree_options.expand_all_text }).appendTo(expandCollapseToggle);
                    expandCollapseTogglechkBx.on("change", function () {
                        if ($(this).is(":checked")) {
                            $(_self).find("details").attr("open", true);
                        } else {
                            $(_self).find("details").attr("open", false);
                        }
                    });
                }
            }

       /**
        * loads JSON data from a remote data object 
        * @see data.url property
        * @param {object} request.data object 
        * @param {jQuery} wrapper 
        */
       async function loadJSON(drequest, wrapper){
            var rmethod = (drequest.method) ? drequest.method : "GET";
            var rurl = drequest.url;
            if(rmethod == "GET" ){
               if(drequest.data!=null){
                    const params = new URLSearchParams(drequest.data);
                    rurl = drequest.url + "?" +  params.toString();
                }else{
                    rurl = drequest.url;
                }   
                var request_options = {
                     method: "GET",
                };
            }else{
                var request_options = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:drequest.data
                };
            }
            request_options.headers = {
                'Content-Type': 'application/json',
            };
            wrapper.html("");
            var loader = $("<div />", { class: "tree-loader", html: "" }).appendTo(wrapper);
            createSpinner().appendTo(loader);
                $(_self).addClass("data-loading");
                loader.appendTo($(_self));
                 $(_self).find("input").attr("disabled","disabled");
            
            await fetch( rurl, request_options )
            .then((response) => response.json())
            .then((data) => {
             
                c = 0;
                $.each(data, (item) => {
                    buildTree(data[item], wrapper);
                    c++;
                });
                
                $(".total-nodes").html(c);
                loader.remove();
                $(_self).removeClass("data-loading");
                $(_self).find("input").removeAttr("disabled","disabled");
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
        createSpinner = () =>{
            spinner = $("<div />",{class:"loading-ring",html:"<span></span>"});
            return spinner;

        }
       /* function loadJSON (request, wrapper) {
        var loader;
        $.ajax({
            method: (request.method) ? request.method : "GET",
            url: request.url,
            data: (request.data) ? request.data : null,
            beforeSend: function () {
                // setting a timeout
                wrapper.html("");
                loader = $("<div />", { class: "tree-loader", html: "loading..." }).appendTo(wrapper);
            },
            success: function (data) {
                $.each(data, (item) => {
                    buildTree(data[item], wrapper);
                });
                loader.remove();
            },
            error: function (xhr) { // if error occured
                alert("Error occured.please try again");
                $(placeholder).append(xhr.statusText + xhr.responseText);
                loader.remove();
            },
            complete: function () {
                loader.remove();
            }
        });
    }*/
   /**
    * builds the tree object
    * @param {object} obj  data object
    * @param {object} $target $jQuery target Wrapper object
    * @returns {void}
    */
    function buildTree(obj, $target) {
            var li = $('<div>', { class: "tree-node" }).appendTo($target);
            fieldType =  "checkbox";
            inputval = obj.value;
            inputlabel = obj.label;
            selectionWrapper = $("<div />", { class: "tree-node-item" });
            field_id = _self.id + "-" + inputval;
            field_name = _self.key;
                selectionCbox = $("<input />", { type: fieldType, name: field_name, id: field_id, value: inputval, class: "select-node" }).appendTo(selectionWrapper);
                selectionCbox.on("change", function (e) {
                    _self.triggerSelectNode($(this));

                    if($(this).is(":checked")){
                        $(this).parent().addClass("node-checked");
                    }else{
                        $(this).parent().removeClass("node-checked");
                    }

                    if (_self.treesettings.select_options.toggle_select_parents && _self.treesettings.select_options.toggle_parent_selects_children) {
                      
                           
                          
                                triggerSelectAllChildren($(this));
                           
                      
                    
                    }
                    if (_self.treesettings.select_options.disable_children_on_parent_selection == true) {
                         disableChildren($(this));
                    }


                });
           
                if (obj.icon) {
                    $icon = $("<div />", { class: "mz-tree-node-icon" }).appendTo(selectionWrapper)
                    $('<' + obj.icon.tag + '/>', obj.icon.attributes).appendTo($icon);
        
                }    
            label = $("<label />", { title: inputlabel, for: field_id, html: inputlabel }).appendTo(selectionWrapper);
            
                 if ((obj.children != undefined && obj.children.length > 0) || 
                    (Number(parseFloat(obj.children)) && obj.children > 0)
                ) {
                details = $("<details />").appendTo(li);


                details.attr("data-value", inputval);
                details.attr("data-label", inputlabel);
                if (Number(parseFloat(obj.children)) && obj.children > 0){
                details.attr("data-children", obj.children);
                }else{
                    details.attr("data-children", obj.children.length);
                }


                summary = $("<summary />").appendTo(details);
                var innerList = $('<div>', { class: "tree-nodes" }).appendTo(details);

               if (_self.treesettings.select_options.toggle_select_parents) {
                innerList.addClass("has-selectable-parent");
                selectionWrapper.appendTo(summary);
                } else {
                    $("<span />", { html: obj.label, class:"tree-node-item" }).appendTo(summary);
                }
                if (_self.treesettings.select_options.toggle_select_all_siblings && !_self.treesettings.select_options.toggle_select_parents) {
                    selectAllSibLings = $("<div />", { class: "select-all-siblings" }).appendTo(innerList);
                    siblingSelectorCbox = $("<input />", { type: fieldType, id: "sibling-selector-" + obj.value }).appendTo(selectAllSibLings);
    
                    siblingSelectorLabel = _self.treesettings.select_options.toggle_select_all_siblings_label;
                    //  siblingSelectorLabel.replace(/NODE_LABEL/, obj.label);
                    siblingSelectorLabel = $("<label />", { html: siblingSelectorLabel, for: "sibling-selector-" + obj.value }).appendTo(selectAllSibLings);
                    siblingSelectorLabel.html(siblingSelectorLabel.text().replace("[NODE_LABEL]", "<span class=\"strong\">" + obj.label + "</strong>"));
                    siblingSelectorCbox.on("change", function (e) {
                        triggerSelectAllSiblings($(this));
                    });
    
                }
                if(_self.treesettings.data.url!=null && Number(parseFloat(obj.children)) && obj.children > 0){
                    details.on("click", function (e) {
                        dopen = !$(this).is("[open]");
                        if (dopen && innerList.html() == "") {
                            _self.treesettings.data.data = { value: $(this).data("value"), label:  $(this).data("label") }
                            if (_self.treesettings.onDetailOpen) {
                                _self.treesettings.onDetailOpen.call(_self,  $(this), _self.treesettings.data);
                            }
                           
                            loadJSON(_self.treesettings.data, innerList);
                        }
                    });
                }else{
                    for (var i = 0; i < obj.children.length; i++) {
                        var child = obj.children[i];
                        buildTree(child, innerList);
                    };
                }
            } else {
                //li.html(obj.label);
                selectionWrapper.appendTo(li);
            }
        }
        triggerSelectAllSiblings = function (obj, event) {
            siblings = obj.parent().parent().find(".tree-node");

            if (obj.is(":checked")) {
                if (siblings.length) {
                    if (!$(this).hasClass("select-all-siblings")) {
                        chkboxes = siblings.find("input[type=checkbox]");
                        chkboxes.each(function () {
                            $(this).prop("checked", true);
                            $(this).trigger("change");
                        });
                    }
                }
            } else {
                if (siblings.length) {
                    if (!$(this).hasClass("select-all-siblings")) {
                        chkboxes = siblings.find("input[type=checkbox]");
                        chkboxes.each(function () {
                            $(this).prop("checked", false);
                            $(this).trigger("change");
                        });
                    }
                }
            }
    
        }    
        triggerSelectAllChildren = (obj, event) => {
            var  timeout = _self.data.url ? 500 : 0;

            setTimeout(function(){
            if (obj.is(":checked")) {
                detailTag = obj.parent().parent().parent();
                detailTag.attr("open", true);
                treeNodes = detailTag.find(".tree-node");
                if (treeNodes.length && detailTag.prop('nodeName') == "DETAILS") {
                    $(treeNodes.find("input[type=checkbox]")).each(function () {
                        $(this).prop("checked", true);
                        $(this).trigger("change");
                    });
                }
            } else {
                detailTag = obj.parent().parent().parent();
                // console.log(detailTag.prop('nodeName'));
                detailTag.attr("open", true);
                treeNodes = detailTag.find(".tree-node");
                if (treeNodes.length && detailTag.prop('nodeName') == "DETAILS") {
                    $(treeNodes.find("input[type=checkbox]")).each(function () {
                        $(this).prop("checked", false);
                        $(this).trigger("change");
                    });
                }
            }
        },timeout);




        }
        disableAllRemainingNodes = () => {
            $(_self).find(".select-node").each(function () {
                if (!$(this).is(":checked")) {
                    $(this).attr("disabled", "disabled");
                }
            });
        }
        enableAllRemainingNodes = () => {
            $(_self).find(".select-node").each(function () {
                $(this).removeAttr("disabled", "disabled");
            });
        }

    disableChildren = (obj) => {

        if (obj.is(":checked")) {
            detailTag = obj.parent().parent().parent();
            
            treeNodes = detailTag.find(".tree-node");
            if (treeNodes.length && detailTag.prop('nodeName') == "DETAILS") {
                $(treeNodes.find("input[type=checkbox]")).each(function () {
                    $(this).attr("disabled", "disabled");
                });
            }
        } else {
            detailTag = obj.parent().parent().parent();
            treeNodes = detailTag.find(".tree-node");
            if (treeNodes.length && detailTag.prop('nodeName') == "DETAILS") {
                $(treeNodes.find("input[type=checkbox]")).each(function () {
                    $(this).removeAttr("disabled");
                });
            }
        }
    }
        
        _self.countAllNodes = () =>{
            return   $(_self).find(".tree-node-item").length;
        }
        _self.getSelectedNodes = () =>{
            return $(_self).find("input.select-node:checked");
        }
        _self.countSelectedNodes = () =>{
            return _self.getSelectedNodes().length;
        }  
          
        _self.triggerSelectNode = function (obj) {
            // idx = selectedNodes.indexOf($(this).val());
            itemVal = obj.val();
            stext = obj.next().text();
            totalNodesSelected =  _self.countSelectedNodes();
            $(_self).find(".selected-count").html(totalNodesSelected);

           if ( _self.treesettings.select_options.max_nodes > 0) {
                if (totalNodesSelected >= self.treesettings.select_options.max_nodes) {
                    disableAllRemainingNodes();
                } else {
                    enableAllRemainingNodes();
                }
            }
            _self.updateSelectedNodeTags();        
            if (_self.treesettings.onNodeSelect) {
                _self.treesettings.onNodeSelect.call(_self,  obj,_self.selectedNodes, totalNodesSelected);
            }
           
        }

     _self.updateSelectedNodeTags = () => {
        _self.selectedNodes = [];
        $selectedNodesWrapper = $(_self).find(".selected-nodes");
        $selectedNodesWrapper.html("");
        $(_self).find(".select-node").each(function () {
            if ($(this).is(":checked")) {
                var sval = $(this).val();
                var slabel = $(this).parent().find("label").text();
                _self.selectedNodes.push({"value":sval, "label":slabel});
            }
        });   
       
        for (i = 0; i < _self.treesettings.select_options.max_selection_displayed_nodes; i++) {
                if(_self.selectedNodes[i] != undefined){
                    var item = _self.selectedNodes[i];
                    var val = item.value;
                    var label = item.label;
                    selectedNodeE = $("<div />", { class: "selected-node", id: "selected-node-" + _self.key +"-"+ val, "data-value": val }).appendTo($selectedNodesWrapper);
                    $("<span />", { title: label, html: label }).appendTo(selectedNodeE);
                    unselectNode = $("<button />", { type: "button", title: "Remove " + label, html: "x", class: "btn-remove-selected-node" }).appendTo(selectedNodeE);
                    unselectNode.on('click', function (e) {
                    nodeId = $(this).parent().data("value");
                    chkbx = $("#" + _self.id + "-" + nodeId);
                    if ($(chkbx).is(":checked")) {
                        $(chkbx).prop("checked", false);
                        _self.updateSelectedNodeTags();
                    }
                });
             }
        }
        if (_self.selectedNodes.length > _self.treesettings.select_options.max_selection_displayed_nodes) {
            maxText =  _self.treesettings.select_options.more_nodes_text;
            maxText = maxText.replace(/\[(.*?)\]/g, _self.countSelectedNodes() - _self.treesettings.select_options.max_selection_displayed_nodes);
            moreSelectedNodes = $("<button />", { type: "button", class: "selected-node btn-more-selected-nodes", id: "selected-last-node" }).appendTo($selectedNodesWrapper);
            moreSelectedText  = $("<span />", { html: maxText }).appendTo(moreSelectedNodes);
    
        }
    }
   
    closeTree = function(target){
            if (!$(target).parents().hasClass(treePlugInClass)
                && !$(target).parents().hasClass("btn-remove-node")
            ) {
            $(".mz-tree-dropdown-plugin .tree-body").each(function(){
                    $(this).removeClass(_self.expandCollapseClass);
            });
        }
    }
    $(document).on('click', '.tree-header', function (e) {
        $(e.target).find(".mz-tree-dropdown-filter").focus();
        
    });

    $(document).on('click', 'body', function (e) {
        closeTree(e.target);
        
    });
    return this.each(function(i){
           init(); 
	});
}


        
} else {
    console.log("JQUERY NOT INCLUDED IN PAGE");

}