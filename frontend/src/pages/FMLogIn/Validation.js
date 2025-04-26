const Validation = (formData) => {

    let errors = {}

    //UserName Validation
    if(!formData.UserName){

        errors.UserName = "UserName Required"

    }

    else if(formData.UserName.length < 5){

        errors.UserName = "UserName must contain minimum 5 characters."


    }

    //Password Validation
    if(!formData.Password){

        errors.Password = "Password Required"

    }

    else if(formData.Password.length > 15){

        errors.Password = "Password must not contain more than 15 characters."


    }

    return errors;

}

export default Validation;