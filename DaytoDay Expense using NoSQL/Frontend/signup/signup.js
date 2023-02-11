async function signup(event){
    try{
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const signUpDetails = {
            name,
            email,
            password
        }
        console.log(signUpDetails);
        const response = await axios.post("http://localhost:4000/user/signup", signUpDetails)
        console.log(response.data);
        if(response.status === 200){
            window.location.href = "../login/login.html";
        }
        else{

            throw new Error('Failed to Login');
        }
    }
    catch(err){
        console.log(err);
        document.body.innerHTML += `<div style = "color: red;">${err}</div>`
    }
}