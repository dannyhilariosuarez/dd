//''''''''''''''''''''''''' 
//'                       '
//'<Danny Hilario Suarez/>'
//'                       '
//'''''''''''''''''''''''''

var container = document.getElementById('div_default');
var mousePosition;
var objPosition;
var liChanged;
var offset = [0, 0];
var isDown = false;
var obj;
var i; 
var olmenu = document.getElementById('ol_menu');
var liClone;

document.onmousemove = function (e) { draggingMouse(e); };
document.onselectstart = function () {
    return false;
}
//document.addEventListener('mouseup', function (e) { handleDrop(e); });

//Array.prototype.forEach.call(olmenuli, function (e) {
//    e.addEventListener('mouseover', function (e) { focusMenu(e); });
//    e.addEventListener('mouseleave', function (e) { handleDragLeave(); });
//});

function focusMenu(e) {
    var parent = e.currentTarget;

    if (document.getElementsByClassName('drag').length == 0) {
        var style = {
            color: 'rgba(244, 67, 54, 0.57)',
            cursor: 'move',
            position: 'absolute',
            fontsize: '30px!important'
        };

        i = document.createElement('i');
        i.title = "Drag to reorder";
        i.id = Math.floor((Math.random() * 10) + 1);
        i.className = 'drag material-icons';
        i.style.color = style.color;
        i.innerHTML = '&#xE5D2'; 
        i.style.cursor = style.cursor;
        i.style.position = style.position;
        i.style.fontSize = style.fontsize;
        //i.style.top = '136px';

        parent.style.border = '2px solid ' + style.color;
        parent.firstElementChild.appendChild(i);
        i.addEventListener('mousedown', function (e) { pressBottom(e); });
    }
}

function pressBottom(e) {
    obj = document.getElementById(e.target.id).parentNode.parentNode;

    if (obj != "") {
        obj.setAttribute('data-draggable', true);
        isDown = true;

        offset = [
        e.target.offsetLeft - e.clientX,
        e.target.offsetTop - e.clientY
        ];
        return false;
    }
}

function handleDragOver(e) {
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop. 

    this.classList.add('over');
    e.dataTransfer.dropEffect = '';  // See the section on the DataTransfer object.

    return false;
}

function draggingMouse(e) {

    if (isDown) {
        mousePosition = {
            x: event.clientX,
            y: event.clientY
        };

        objPosition = {
            x: mousePosition.x + offset[0] - 15,
            y: mousePosition.y + offset[1] - 15
        };

        document.body.style.cursor = 'move';

        obj.style.position = 'absolute';
        obj.style.visibility = 'visible';
        obj.style.zIndex = '1000';

        containerPosition = {
            x: (container.clientLeft + container.clientWidth) - obj.clientWidth,
            y: (container.clientTop + container.clientHeight) - obj.clientHeight
        };

        if ((objPosition.x < containerPosition.x) && objPosition.x > 0) {
            obj.style.left = objPosition.x + 'px';
        } else {
            document.body.style.cursor = 'no-drop';
        }

        if (objPosition.y > 0 && objPosition.y < containerPosition.y) {
            obj.style.top = objPosition.y + 'px';
        } else {
            document.body.style.cursor = 'no-drop';
        }

        if (liClone == null) {
            liClone = document.createElement('li');
            liClone.id = 'li_clone';
            liClone.style.visibility = 'hidden';

            for (var i = 0; i < olmenu.childNodes.length; i++) {
                if (olmenu.childNodes[i].nodeName != '#text') {
                    if (olmenu.childNodes[i].dataset.draggable == 'true') {
                        olmenu.insertBefore(liClone, olmenu.childNodes[i].nextSibling);
                        break;
                    }
                }

            }
        }

        for (var i = 0; i < olmenu.childNodes.length; i++) {

            var positionTop = olmenu.childNodes[i].offsetTop;
            var positionLeft = olmenu.childNodes[i].offsetLeft;
            var positionBottom = positionTop + olmenu.childNodes[i].clientHeight;
            var paddin = 10;

            var width = (positionLeft + olmenu.childNodes[i].offsetWidth);
            var hight = (positionTop + olmenu.childNodes[i].offsetHeight) - paddin;

            if ((obj.offsetLeft > positionLeft && obj.offsetLeft <= width) && (obj.offsetTop > positionTop && obj.offsetTop <= hight) &&
                olmenu.childNodes[i].id != 'li_clone') {

                olmenu.insertBefore(olmenu.childNodes[i], liClone);
                olmenu.insertBefore(liClone, olmenu.childNodes[i]);
                liChanged = olmenu.childNodes[i];
                break;
            }
        }
    }
}

function handleDragLeave(e) {
    var q = document.getElementsByClassName('drag');
    for (var a = 0; a < q.length; a++) {
        q[a].remove();
    }
    isAddBorder(false);
}

function isAddBorder(value) {
    var q = document.querySelectorAll('#ol_menu li');
    for (var a = 0; a < q.length; a++) {
        if (value) {
            q[a].style.border = '1px #e1e4e8 solid';
        } else {
            q[a].style.border = '';
        }
    }
}

function handleDrop(e) {

    if (isDown) {

        if (e.stopPropagation)
            e.stopPropagation(); // stops the browser from redirecting. 

        isDown = false;
        document.body.style.cursor = 'auto';
        obj.setAttribute('data-draggable', 'false');
        obj.style.position = 'relative';
        obj.style.top = '';
        obj.style.left = '';
        obj.style = '';
        handleDragLeave(e);
        if (isNaN(liClone)) {
            ol_menu.replaceChild(obj, liClone);
            liClone = null;
        }

        //proccess for save menu order

        //var arrayOrders = new Array();
        //var arrayMenuID = new Array();
        //var jsonOrder;

        //document.querySelectorAll('[data-order]').forEach(function (e) {
        //    arrayOrders.push(e.getAttribute('data-order')); 
        //});

        //jsonOrder = [{ OrderID: JSON.stringify(arrayOrders) }];
        //jsonOrder = JSON.stringify(jsonOrder); 

        //saveDrag(liChanged.getAttribute('data-order'), obj.getAttribute('data-order'), jsonOrder);
        return false;
    }
}

function saveDrag(newOrder, oldOrder, jsonOrder) {
    var data = {
        oldOrder: oldOrder,
        newOrder: newOrder,
        jsonOrder: jsonOrder,
        isDragandDrog: true
    }

    //For save menu order
    //$.ajax({
    //    url: 'Default.aspx',
    //    data: data,
    //    type: 'POST',
    //    dataType: 'JSON',
    //    success: successSaveDrag

    //});
}

function successSaveDrag(d) {

}