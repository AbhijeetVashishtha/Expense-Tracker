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
                
    axios.post("http://localhost:4000/user/addExpense",obj)
    .then((response) => {
        showUserOnScreen(response.data.newExpenseDetails);
    }).catch((err) => {
        document.body.innerHTML = document.body.innerHTML + "<h4>Something Went Wrong</h4>";
        console.log(err);
    })
}
                
window.addEventListener("DOMContentLoaded",()=>
{
    axios.get("http://localhost:4000/user/getExpense")
    .then((response) =>{
        console.log(response);
        for(var i=0;i<response.data.allExpenses.length;i++)
        {
            showUserOnScreen(response.data.allExpenses[i]);
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
    const childHTML=`<li id=${user.id}> ${user.expense} - ${user.description} - ${user.category} 
        <button onclick="deleteExpense('${user.id}')" id="li-delBTN"> Delete Expense</button>
        <button onclick="editExpense('${user.expense}','${user.description}','${user.category}','${user.id}')" id="li-editBTN"> Edit Expense</button>
        </li>`
    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

function editExpense(expense, description, category, userId)
{
    axios.get(`http://localhost:4000/user/editExpense/${userId}`)
    .then(() => {
        document.getElementById('expense').value = expense;
        document.getElementById('description').value = description;
        document.getElementById('category').value = category;
                
        deleteExpense(userId);
    })
    .catch(err => {
        console.log(err);
    })
}

        
function deleteExpense(userId)
{
    axios.delete(`http://localhost:4000/user/deleteExpense/${userId}`)
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