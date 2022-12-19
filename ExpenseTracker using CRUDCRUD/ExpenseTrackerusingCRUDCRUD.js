function saveToCRUDCRUD(event)
{
    event.preventDefault();
    const expense = event.target.expense.value;
    const description = event.target.description.value;
    const category = event.target.category.value;

    const obj={
        expense,
        description,
        category
    }
                
    axios.post("https://crudcrud.com/api/829d255f0f6b4ac7937ea6baab8425a7/expensedata",obj)
    .then((response) => {
        showUserOnScreen(response.data)
    }).catch((err) => {
        document.body.innerHTML = document.body.innerHTML + "<h4>Something Went Wrong</h4>";
        console.log(err);
    })
    
}
                
window.addEventListener("DOMContentLoaded",()=>
{
    axios.get("https://crudcrud.com/api/829d255f0f6b4ac7937ea6baab8425a7/expensedata")
    .then((response) =>{
        for(var i=0;i<response.data.length;i++)
        {
            showUserOnScreen(response.data[i])
        }
    }).catch((err)=>{
        console.log(err);
    })   
})
            
function showUserOnScreen(user)
{
    document.getElementById('expense').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';

    const parentNode=document.getElementById('users')
    const childHTML=`<li id=${user._id}> ${user.expense} - ${user.description} - ${user.category} 
        <button onclick="deleteExpense('${user._id}')" id="li-delBTN"> Delete Expense</button>
        <button onclick="editExpense('${user.expense}','${user.description}','${user.category}','${user._id}')" id="li-editBTN"> Edit Expense</button>
        </li>`
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function editExpense(expense, description, category, userId)
{
    document.getElementById('expense').value = expense;
    document.getElementById('description').value = description;
    document.getElementById('category').value = category;
                
    deleteExpense(userId);
}

        
function deleteExpense(userId)
{
    axios.delete(`https://crudcrud.com/api/829d255f0f6b4ac7937ea6baab8425a7/expensedata/${userId}`)
    .then((response)=>{
        removeUserFromScreen(userId);
    }).catch((err)=>{
        console.log(err);
    })
}
            

function removeUserFromScreen(userId)
{
    const parentNode=document.getElementById('users')
    const childToBeDelete=document.getElementById(userId)
            
    parentNode.removeChild(childToBeDelete)
}