function forgotpassword(event) {
        event.preventDefault();

        const userDetails = {
            email: event.target.email.value
        }
        const token = localStorage.getItem('token');

        console.log(userDetails);
        axios.post('http://localhost:4000/password/forgotpassword', userDetails, {headers: {'Authorization': token}})
        .then((response) => {
            if(response.status === 202){
                document.body.innerHTML += `<div style = "color:red;">Mail Successfully Sent</div>`;
            }
            else{
                throw new Error("SomeThing Went wrong!!!");
            }
        })
        .catch(err => {
            document.body.innerHTML += `<div style="color:red;">${err}</div>`
        })

}