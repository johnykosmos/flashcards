

export function postRequest(form, callback){
    const formData = new FormData(form);

    fetch(form.action, {
            method: "POST",
            body: formData
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            else{
                if(callback) callback(formData); 
            }
            return response.json();
        })
        .then(data => {
            //alert(data.message);
        })
        .catch(error => {
            alert(error.message);
            return false;
        });
    return true;
}

export function deleteRequest(form, callback){
    const formData = new FormData(form);

    fetch(form.action, {
            method: "DELETE",
            headers: {"Content-Type":"application/json"}
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            else{
                if(callback) callback(formData); 
            }
            return response.json();
        })
        .then(data => {
            //alert(data.message);
        })
        .catch(error => {
            alert(error.message);
            return false;
        });

    return true;
}
