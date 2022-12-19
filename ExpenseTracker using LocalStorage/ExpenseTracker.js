var form = document.getElementById('addform');
var expense = document.getElementById('expense');
var description = document.getElementById('description');
var category = document.getElementById('category');
var itemlist = document.getElementById('users');
document.addEventListener("submit", additem);
localStorage.setItem('UserExpense','expense');
localStorage.setItem('UserDescription','description');
localStorage.setItem('UserCategory','category');

function additem(e){
    e.preventDefault();
    if(expense.value === '' || description.value === '' || category.value === '')
    {
        alert("Please Enter Fields");
    }
    else{
        let obj = {
            expense: expense.value,
            description: description.value,
            category: category.value
        }
        let obj_serialized = JSON.stringify(obj);
        localStorage.setItem(obj.description, obj_serialized);
        let obj_deserialized = JSON.parse(localStorage.getItem("obj"));

        var li = document.createElement('li');
        li.className = 'item';
        li.appendChild(document.createTextNode(localStorage.getItem(obj.description)));

        var delbtn = document.createElement('button');
        delbtn.className = 'delete-btn';
        delbtn.appendChild(document.createTextNode('Delete Expense'));
        li.appendChild(delbtn);

        var edibtn = document.createElement('button');
        edibtn.className = 'edit-btn';
        edibtn.appendChild(document.createTextNode('Edit Expense'));
        li.appendChild(edibtn);

        itemlist.appendChild(li);

        document.addEventListener('click', deleteitem);

        function deleteitem(e) {
            if(e.target == delbtn)
            {
                if(confirm('Are You Sure?'))
                {
                    var li = e.target.parentElement;
                    localStorage.removeItem(obj.description);
                    itemlist.removeChild(li);
                }
            }
        }

        document.addEventListener('click', edititem);

        function edititem(e){
            if(e.target == edibtn)
            {
                var li = e.target.parentElement;
                for(var i = 0;i<itemlist.getElementsByClassName('item').length;i++)
                {
                    if(itemlist.getElementsByClassName('item')[i] == li)
                    {
                        let myobj_deserialized1 = JSON.parse(itemlist.getElementsByClassName('item')[i].firstChild.textContent);
                        form.querySelector('#expense').value = myobj_deserialized1.expense;

                        form.querySelector('#description').value = myobj_deserialized1.description;
    
                        form.querySelector('#category').value = myobj_deserialized1.category;
    
                        localStorage.removeItem(obj.description);
                    }
                }
                itemlist.removeChild(li);
            }
        }
    }
}