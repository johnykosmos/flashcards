

export function formPostRequest(form, callback){
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

export function formDeleteRequest(form, callback){
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

export async function getDataRequest(action){
    try{
        const response = await fetch(action);
        if(!response.ok)
            throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();
        return data;
    }catch(error){
        alert(error.message);
        return null;
    }
}

export function removeDataRequest(action, callback){
    fetch(action, {
            method: "DELETE",
            headers: {"Content-Type":"application/json"}
        })
        .then(response => {
            if(!response.ok)
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            else{
                if(callback) callback(); 
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
