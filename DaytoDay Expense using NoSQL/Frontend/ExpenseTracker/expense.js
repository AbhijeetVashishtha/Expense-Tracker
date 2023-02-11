const token = localStorage.getItem('token');
async function addExpense(event) {
    event.preventDefault();

    const expenseDetails = {
        expenseamount: event.target.expenseamount.value,
        description: event.target.description.value,
        category: event.target.category.value
    };
    const token  = localStorage.getItem('token')
   try{
    const res = await axios.post('http://localhost:4000/expense/addexpense', expenseDetails, {headers: {"Authorization": token}})
        if(res.status == 200)
        {
            showExpenseOnScreen(res.data.expense);
        }
   }
   catch(err){
        console.log(err);
        showError(err);
   }
   
}

function showPremiumUserMessage(){
    document.getElementById('rzp-button').style.visibility = 'hidden';
    document.getElementById('message').innerHTML = "You are a Premium user.";
}

window.addEventListener('DOMContentLoaded', async (event) => {
    const expenses = document.getElementById('ListOfExpenses');
    let Limit_Per_Page = localStorage.getItem('itemsperpage');
    if (!Limit_Per_Page) {
        Limit_Per_Page = 5;
    }
    let page = 1;

    let response = await axios.post(`http://localhost:4000/user/getexpense/${page}`,{Items_Per_Page: Limit_Per_Page}, {headers: {"Authorization": token}})
    checkIfPremium();
    console.log(response.data.info);
    if(response.status === 200)
    {
        expenses.innerHTML = '';
        for(let i=0;i<response.data.data.length;i++)
        {
            showExpenseOnScreen(response.data.data[i]);
        }
    }
    showPagination(response.data.info);
})

function checkIfPremium() {
    let usertype = localStorage.getItem('user');

    if(usertype === "true"){
        showPremiumUserMessage();
        showLeaderBoard();
    }
}

function download() {
    axios.get('http://localhost:4000/expense/download', {headers: {"Authorization": token}})
    .then((response) => {
        if(response.status === 200){
            var a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = "myexpense.csv";
            a.click();
        }
        else{
            throw new Error(response.data.message);
        }
    })
    .catch(err => {
        console.log(err);
        showError(err);
    })
}

document.getElementById('rzp-button').onclick = async function(e) {
    const response = await axios.get('http://localhost:4000/purchase/premiummembership', {headers: {"Authorization": token}});
    console.log(response);
    var options = {
        'key': response.data.key_id,
        "name": "Test Company",
        'order_id': response.data.order.id,
        "prefill": {
            "name": "Test User",
            "email": "test.user@example.com",
            "contact": "7003442036"
        },
        'handler': async function(response){
            const res = await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers: {"Authorization": token}})
            document.getElementById('rzp-button').style.visibility = 'hidden';
            localStorage.setItem('user', true);
            alert('you are a premium user now');
            document.getElementById('message').innerHTML = "You are a Premium user.";
            showLeaderBoard();
            localStorage.setItem('token', res.data.token);
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment failed', function(response){
        console.log(response);
        alert('Something went wrong');
    });
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;">${err}</div>`
}

function showLeaderBoard() {
    const inputElement = document.createElement('input');
    inputElement.type = "button";
    inputElement.value = "Show LeaderBoard";
    inputElement.onclick = async() => {
        const response = await axios.get('http://localhost:4000/premium/showLeaderBoard', {headers: {"Authorization": token} });
        console.log(response.data.data);
        var leaderBoardElem = document.getElementById('LeaderBoard');
        leaderBoardElem.innerHTML += `<h1>Leader Board</h1>`;
        response.data.data.forEach((userDetails) => {
            leaderBoardElem.innerHTML += `<li>Name- ${userDetails.name} Total Expense- ${userDetails.totalExpense}</li>`;
        });
    }
    document.getElementById('message').appendChild(inputElement);
}

function reportGenerate(event) {
    let usertype = localStorage.getItem('user');
    console.log(usertype == 'true');
    if(usertype == "true"){
        window.location.href = '../reports/reports.html';
    }
    else{
        document.body.innerHTML += `<div style="color:red;">"You are not a Premium User"</div>`
    }
}

function showExpenseOnScreen(expense) {
    const parentElement = document.getElementById('ListOfExpenses');
    const childHtml = `<li id=${expense._id}>${expense.expenseamount} - ${expense.description} - ${expense.category}
                        <button onclick=editExpense("${expense._id}","${expense.category}","${expense.expenseamount}","${expense.description}")>Edit Expense</button>
                        <button onclick=deleteExpense("${expense._id}")>Delete Expense</button>
                        </li>`
    parentElement.innerHTML += childHtml;
}

function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    const pagination= document.getElementById('pagination')
    let Items_Per_Page = localStorage.getItem('itemsperpage');

    pagination.innerHTML ='';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = "Previous";
        button1.addEventListener('click' , ()=>getPageExpenses(previousPage, Items_Per_Page))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getPageExpenses(currentPage, Items_Per_Page))
    pagination.appendChild(button2);

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = "Next";
        button3.addEventListener('click' , ()=>getPageExpenses(nextPage, Items_Per_Page))
        pagination.appendChild(button3)
    }
}


async function getPageExpenses(page, limitper){
    const expenses = document.getElementById('ListOfExpenses');
    // let Items_Per_Page = limitper;
    try{
        const response = await axios.post(`http://localhost:4000/user/getexpense/${page}`,{Items_Per_Page: limitper}, {headers : {"Authorization": token}});
        console.log(response.data.data);
        if(response.status === 200){
        expenses.innerHTML = '';
             for(let i = 0;i < response.data.data.length; i++){
                showExpenseOnScreen(response.data.data[i]);
            }
            showPagination(response.data.info);
        }
    }
    catch(err){
        console.log(err);
    }
}

function perPage(event){
    event.preventDefault();
    let Items_Per_Page = +document.getElementById('Items_Per_Page').value;
    let page = 1;
    localStorage.setItem('itemsperpage', Items_Per_Page);

    getPageExpenses(page, Items_Per_Page);
}

function editExpense(expenseId,category,expAmt,desc){
    document.getElementById('expenseamount').value = expAmt;
    document.getElementById('description').value = desc;
    document.getElementById('category').value = category;
    deleteExpense(expenseId);
}

async function deleteExpense(expenseId){
    try{
        const res = await axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseId}`, {headers: {"Authorization": token}})
        if(res.status === 200)
        {
            removeExpenseFromScreen(expenseId);
        }
    }
    catch(err){
        showError(err);
    }
};

function removeExpenseFromScreen(expenseId){
    const parentNode = document.getElementById('ListOfExpenses');
    const deleteChild = document.getElementById(expenseId);
    if(deleteChild){
        parentNode.removeChild(deleteChild);
    }
}

function LogOut() {
    window.location.replace('../login/login.html');
}