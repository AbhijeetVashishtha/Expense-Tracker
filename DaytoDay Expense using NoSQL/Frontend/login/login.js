async function login(event){
    try{
        event.preventDefault();
        const loginDetails = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        // console.log(loginDetails);
        const response = await axios.post("http://localhost:4000/user/login", loginDetails);
        console.log(response.data);
        alert(response.data.message);
        console.log(response.data.token);
        localStorage.setItem('token', response.data.token);
       if(response.status === 200)
       {
        window.location.href = "../ExpenseTracker/expense.html"
       }
    }
    catch(err){
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    }
}